/**
 * perfil.js - Renderizado con mapeo de llaves exacto
 */

async function initPerfil() {
    console.log("1. Iniciando perfil.js...");
    
    let intentos = 0;
    while (!window.sbClient && intentos < 20) {
        await new Promise(r => setTimeout(r, 500));
        intentos++;
    }
    if (!window.sbClient) return;

    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    const { data, error } = await window.sbClient
        .from('habitat')
        .select('data')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) return;

    // Usamos el objeto directo, ya está parseado por Supabase
    renderizarPerfilCompleto(data.data);
}

function renderizarPerfilCompleto(d) {
    console.log("Renderizando con llaves validadas:", d);

    // 1. Datos Básicos
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];
    
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");
    document.getElementById('m-foto').style.backgroundImage = `url('${base.foto_url || ""}')`;

    // 2. LinkedIn (Con protocolo)
    if (contacto.linkedin) {
        const btnLnk = document.createElement('a');
        btnLnk.href = contacto.linkedin.startsWith('http') ? contacto.linkedin : 'https://' + contacto.linkedin;
        btnLnk.target = "_blank";
        btnLnk.innerText = "Ver LinkedIn";
        btnLnk.className = "btn-action";
        btnLnk.style.background = "#0e76a8";
        btnLnk.style.color = "white";
        document.getElementById('m-acciones').appendChild(btnLnk);
    }

    // 3. Trayectoria - Usando la llave exacta 'experiencia'
    const exp = d["!trayectoria"].experiencia || [];
    document.getElementById('m-trayectoria').innerHTML = exp.map(e => `
        <div style="margin-bottom:12px;">
            <strong>${e.puesto || 'Puesto'}</strong><br>
            <span>${e.empresa || 'Empresa'}</span>
        </div>
    `).join('');

    // 4. Análisis Profesional, Habilidades y Evaluación
    const card = document.querySelector('.card');
    const divInfo = document.createElement('div');
    
    divInfo.innerHTML = `
        <hr style="margin: 30px 0;">
        <h3>Análisis Profesional</h3>
        <p>${d["!psicometrico"]["!analisis_final"] || "Sin análisis disponible."}</p>
        
        <h3>Habilidades</h3>
        <p><strong>Blandas:</strong> ${(d["!habilidades"].blandas || []).join(', ')}</p>
        <p><strong>Técnicas:</strong> ${(d["!habilidades"].tecnicas || []).join(', ')}</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h3>Evaluación Irina Hire</h3>
            <p style="font-size: 20px; font-weight: bold;">Score: ${d["!irina"].evaluacion?.score_general || 0}%</p>
            <p>${d["!irina"].evaluacion?.conclusion || ""}</p>
        </div>
    `;
    card.appendChild(divInfo);
}

document.addEventListener('DOMContentLoaded', initPerfil);
