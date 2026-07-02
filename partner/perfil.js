/**
 * perfil.js
 * Lógica completa para renderizado de Ficha Técnica
 */

async function initPerfil() {
    console.log("1. Iniciando perfil.js...");

    // Esperar cliente Supabase (inicializado en auth-module.js)
    let intentos = 0;
    while (!window.sbClient && intentos < 20) {
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

    if (!ownerId || !jobId) {
        document.body.innerHTML = "<h1>Error: Faltan parámetros en la URL</h1>";
        return;
    }

    // 3. Consulta de búsqueda precisa
    console.log("3. Ejecutando consulta en Supabase...");
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        console.error("4. Error en la consulta:", error);
        document.getElementById('m-nombre').innerText = "Candidato no encontrado";
        return;
    }

    console.log("5. Datos recibidos:", data);
    renderizarPerfilCompleto(data);
}

function renderizarPerfilCompleto(row) {
    console.log("6. Iniciando renderizado completo...");
    
    // Parseo seguro de los datos
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    
    // Extracción de objetos según la jerarquía del registro
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const trayectoria = d["!trayectoria"] || {};
    const analisis = d["!analisis"] || {};
    const irina = d["!irina"] || {};

    // A. Datos Básicos y Contacto (IDs existentes en tu HTML)
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");
    document.getElementById('m-foto').style.backgroundImage = `url('${base.foto_url || ""}')`;

    // B. LinkedIn (tomado de perfil-contacto como pediste)
    if (contacto.linkedin) {
        const linkLnk = document.createElement('a');
        linkLnk.href = contacto.linkedin;
        linkLnk.innerText = "Ver LinkedIn";
        linkLnk.className = "btn-action";
        linkLnk.style.background = "#0e76a8";
        linkLnk.style.color = "white";
        document.getElementById('m-acciones').appendChild(linkLnk);
    }

    // C. Botones Acción
    document.getElementById('btn-wapp').href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '') || ''}`;
    document.getElementById('btn-mail').href = `mailto:${contacto.email || ''}`;

    // D. Trayectoria
    const exp = trayectoria.experiencia || [];
    document.getElementById('m-trayectoria').innerHTML = exp.length > 0 
        ? exp.map(e => `<div style="margin-bottom:10px;"><strong>${e.puesto || 'Puesto'}</strong><br>${e.empresa || 'Empresa'}</div>`).join('') 
        : "Sin información.";

    // E. Creación de secciones adicionales (Psicometría y Evaluación)
    const card = document.querySelector('.card');
    const divInfo = document.createElement('div');
    divInfo.innerHTML = `
        <hr style="margin: 30px 0;">
        <h3>Análisis Profesional</h3>
        <p>${analisis.resumen || "Sin análisis disponible."}</p>
        <h3>Habilidades</h3>
        <p>${(analisis.skills || []).join(', ') || "No especificadas"}</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h3>Evaluación Irina Hire</h3>
            <p style="font-size: 20px; font-weight: bold;">Score: ${irina.evaluacion?.score_general || 0}%</p>
            <p>${irina.evaluacion?.conclusion || ""}</p>
        </div>
    `;
    card.appendChild(divInfo);

    console.log("Renderizado finalizado con éxito.");
}

document.addEventListener('DOMContentLoaded', initPerfil);
