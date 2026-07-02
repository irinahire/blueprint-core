/**
 * perfil.js
 * Lógica completa para renderizado de Ficha Técnica Profesional
 */

// Función principal de inicialización
async function initPerfil() {
    console.log("1. Iniciando perfil.js...");

    // Esperar a que el cliente de Supabase esté disponible
    let intentos = 0;
    while (!window.sbClient && intentos < 20) {
        console.log("Esperando inicialización de Supabase...");
        await new Promise(r => setTimeout(r, 500));
        intentos++;
    }

    if (!window.sbClient) {
        console.error("Error: Supabase cliente no inicializado.");
        return;
    }

    // 2. Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    console.log("2. Parámetros recibidos:", { ownerId, jobId });

    if (!ownerId || !jobId) {
        document.getElementById('m-nombre').innerText = "Error: Parámetros URL incompletos";
        return;
    }

    // 3. Consulta a Supabase
    console.log("3. Ejecutando consulta en Supabase...");
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        console.error("Error en la consulta:", error);
        document.getElementById('m-nombre').innerText = "No se encontró el perfil";
        return;
    }

    console.log("5. Datos recibidos exitosamente:", data);
    renderizarPerfilCompleto(data);
}

// Función de renderizado completo
function renderizarPerfilCompleto(row) {
    console.log("6. Renderizando perfil...");
    
    // Parseo de los datos del objeto
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    
    // Extracción de objetos según la jerarquía del JSON
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const tray = d["!trayectoria"] || {};
    const analisis = d["!analisis"] || {};
    const irina = d["!irina"] || {};

    // A. Datos Básicos
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");
    document.getElementById('m-foto').style.backgroundImage = `url('${base.foto_url || ""}')`;

    // B. LinkedIn
    if (contacto.linkedin) {
        const btnLnk = document.createElement('a');
        btnLnk.href = contacto.linkedin;
        btnLnk.target = "_blank";
        btnLnk.innerText = "Ver LinkedIn";
        btnLnk.className = "btn-action";
        btnLnk.style.background = "#0e76a8";
        btnLnk.style.color = "white";
        document.getElementById('m-acciones').appendChild(btnLnk);
    }

    // C. Botones Acción
    const btnWapp = document.getElementById('btn-wapp');
    btnWapp.href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '') || ''}`;
    btnWapp.target = "_blank";

    const btnMail = document.getElementById('btn-mail');
    btnMail.href = "#";
    btnMail.onclick = (e) => {
        e.preventDefault();
        // Integración modal Resend
        console.log("Abriendo modal de correo para:", contacto.email);
        alert("Integrar aquí modal de Resend para: " + contacto.email);
    };

    // D. Trayectoria
    const exp = tray.experiencia || [];
    const trayEl = document.getElementById('m-trayectoria');
    trayEl.innerHTML = exp.length > 0 
        ? exp.map(e => `<div style="margin-bottom:12px;"><strong>${e.puesto || 'Puesto'}</strong><br>${e.empresa || 'Empresa'}</div>`).join('') 
        : "Sin trayectoria registrada.";

    // E. Análisis, Habilidades y Evaluación (Contenedor adicional)
    const card = document.querySelector('.card');
    const divInfo = document.createElement('div');
    divInfo.innerHTML = `
        <hr style="margin: 30px 0;">
        <h3>Análisis Profesional</h3>
        <p>${analisis.analisis_general || "Sin análisis disponible."}</p>
        <h3>Habilidades</h3>
        <p>${(analisis.habilidades || []).join(', ') || "No especificadas"}</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h3>Evaluación Irina Hire</h3>
            <p style="font-size: 20px; font-weight: bold;">Score: ${irina.evaluacion?.score_general || 0}</p>
            <p>${irina.evaluacion?.conclusion || ""}</p>
        </div>
    `;
    card.appendChild(divInfo);

    console.log("Renderizado finalizado.");
}

// Inicialización
document.addEventListener('DOMContentLoaded', initPerfil);
