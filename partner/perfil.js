/**
 * perfil.js
 * Lógica estricta de renderizado.
 * Contrato de datos: Esperamos un objeto con claves !perfil, !trayectoria, !analisis, !irina.
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

    // Consulta específica: pedimos la fila completa.
    // El motor de Supabase nos entrega el JSON parseado si la columna es de tipo JSONB.
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('data') // Pedimos explícitamente el objeto data
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        console.error("Error crítico: No se recibieron datos del candidato.");
        return;
    }

    // A partir de aquí, data.data ES nuestro objeto de trabajo.
    // No especulamos con que sea un string, tratamos a data.data como el objeto raíz.
    const d = data.data; 
    
    console.log("Datos recibidos y validados:", d);
    renderizarPerfilCompleto(d);
}

function renderizarPerfilCompleto(d) {
    // Desmenuzamos llave por llave con validación estricta
    const perfil = d["!perfil"] || {};
    const tray = d["!trayectoria"] || {};
    const analisis = d["!analisis"] || {};
    const irina = d["!irina"] || {};

    // 1. Datos Básicos (Mapeo estricto)
    document.getElementById('m-nombre').innerText = perfil["perfil-base"]?.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = "Email: " + (perfil["perfil-contacto"]?.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (perfil["perfil-contacto"]?.telefono || "N/A");
    document.getElementById('m-foto').style.backgroundImage = `url('${perfil["perfil-base"]?.foto_url || ""}')`;

    // 2. Botones y LinkedIn (Acceso directo a la llave de contacto)
    const contacto = perfil["perfil-contacto"] || {};
    if (contacto.linkedin) {
        const btnLnk = document.createElement('a');
        btnLnk.href = contacto.linkedin.startsWith('http') ? contacto.linkedin : 'https://' + contacto.linkedin;
        btnLnk.target = "_blank";
        btnLnk.innerText = "Ver LinkedIn";
        btnLnk.className = "btn-action";
        btnLnk.style.background = "#0e76a8";
        btnLnk.style.color = "white";
        
        const acciones = document.getElementById('m-acciones');
        if (!document.querySelector('.btn-action[href*="linkedin"]')) {
            acciones.appendChild(btnLnk);
        }
    }

    document.getElementById('btn-wapp').href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '') || ''}`;
    document.getElementById('btn-wapp').target = "_blank";
    
    document.getElementById('btn-mail').onclick = (e) => {
        e.preventDefault();
        console.log("Acción: Abrir modal Resend para:", contacto.email);
    };

    // 3. Trayectoria (Acceso directo a !trayectoria.experiencia)
    const exp = tray.experiencia || [];
    const trayEl = document.getElementById('m-trayectoria');
    trayEl.innerHTML = exp.map(e => `
        <div style="margin-bottom:12px;">
            <strong>${e.puesto}</strong><br>
            <span>${e.empresa}</span>
        </div>
    `).join('');

    // 4. Análisis y Evaluación (Acceso directo a las llaves)
    const card = document.querySelector('.card');
    const divInfo = document.createElement('div');
    divInfo.innerHTML = `
        <hr>
        <h3>Análisis Profesional</h3>
        <p>${analisis.analisis_general || "Sin datos."}</p>
        <h3>Habilidades</h3>
        <p>${(analisis.habilidades || []).join(', ')}</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h3>Evaluación Irina Hire</h3>
            <p style="font-size: 20px; font-weight: bold;">Score: ${irina.evaluacion?.score_general || 0}%</p>
            <p>${irina.evaluacion?.conclusion || ""}</p>
        </div>
    `;
    card.appendChild(divInfo);
}

document.addEventListener('DOMContentLoaded', initPerfil);
