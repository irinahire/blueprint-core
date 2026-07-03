/**
 * perfil.js - Renderizado Integral Completo
 */

async function initPerfil() {
    console.log("1. Iniciando carga completa de perfil...");
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    // Consulta 1: Traer la postulación exacta
    const { data: postulacionData, error: errorPost } = await window.sbClient
        .from('habitat')
        .select('id, data, metadata')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } });

    if (errorPost || !postulacionData || postulacionData.length === 0) {
        console.error("Error crítico: No se localizó la postulación única.", errorPost);
        return;
    }

    // Consulta 2: Traer la oferta laboral por ID
    const { data: ofertaData, error: errorOferta } = await window.sbClient
        .from('habitat')
        .select('id, data, metadata')
        .eq('id', jobId)
        .single();

    if (errorOferta) {
        console.error("Error al traer la oferta:", errorOferta);
    }

    console.log("Datos recuperados quirúrgicamente.");
    renderizarFichaTecnica(postulacionData[0].data, ofertaData?.data);
}

function renderizarFichaTecnica(d, ofertaData) {
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];

    // 1. HEADER (Limpio y con tamaños unificados)
    // El tamaño y estilo se controlarán desde el HTML para mantener consistencia
    document.getElementById('m-blic').innerText = d.blic_id || "BLIC#ERROR";
    document.getElementById('m-score-blic').innerText = `SCORE: ${d["!irina"]?.evaluacion?.score_general || 0}%`;
    
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-puesto').innerText = ofertaData?.titulo || "Oferta laboral";
    
    // 2. RESUMEN Y CONTACTO
    document.getElementById('m-resumen').innerText = d["!irina"]?.evaluacion?.resumen || "Sin resumen disponible.";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");

    // 3. FOTO Y RADAR
    const foto = document.getElementById('m-foto');
    if (foto) foto.style.backgroundImage = `url('${base.foto_url}')`;

    const radar = document.getElementById('m-radar');
    if (radar) radar.style.backgroundImage = `url('${d["!psicometrico"]?.url_big_five_radar || ''}')`;

    // 4. TABLA DE OFERTA
    if (ofertaData) {
        const tabla = document.getElementById('m-oferta');
        tabla.innerHTML = `
            <tr><td>Título</td><td>${ofertaData.titulo}</td></tr>
            <tr><td>Descripción</td><td>${ofertaData.detalles.desc}</td></tr>
            <tr><td>Requisitos</td><td>${ofertaData.detalles.req}</td></tr>
            <tr><td>Detalles</td><td>${ofertaData.detalles.m1} | ${ofertaData.detalles.m2}</td></tr>
        `;
    }

    // 5. BOTONES DE ACCIÓN
    document.getElementById('btn-wapp').href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '')}`;
    document.getElementById('btn-email').onclick = () => window.location.href = `mailto:${contacto.email}`;
    document.getElementById('btn-linkedin').href = contacto.linkedin?.startsWith('http') ? contacto.linkedin : 'https://www.linkedin.com/in/' + contacto.linkedin;
    
    // 6. DESCARGAS
    document.getElementById('btn-cv').href = d["!documento"]?.url || "#";
    document.getElementById('btn-audio').href = d["!entrevista"]?.url_audio || "#";
    document.getElementById('btn-pdf').onclick = () => window.print();

    // 7. SECCIONES DE CONTENIDO
    document.getElementById('m-trayectoria').innerHTML = `<p><strong>Educación:</strong> ${d["!trayectoria"].educacion.map(e => e.descripcion).join(', ')}</p><p><strong>Experiencia:</strong> ${d["!trayectoria"].experiencia.map(e => e.descripcion).join('<br>')}</p>`;
    document.getElementById('m-analisis').innerHTML = `<ul>${d["!analisis"].puntos.map(p => `<li>${p}</li>`).join('')}</ul>`;
    document.getElementById('m-psicometria').innerHTML = `<p>${d["!psicometrico"]?.["!analisis_final"] || ""}</p><p><strong>Lógica:</strong> ${d["!psicometrico"]?.LOG_ABS?.analisis || ""}</p><p><strong>Situacional:</strong> ${d["!psicometrico"]?.SIT_EST?.analisis || ""}</p>`;
    document.getElementById('m-entrevista').innerHTML = `<p><strong>Decisión:</strong> ${d["!entrevista"]?.evaluacion?.decision || "N/A"}</p>`;
    document.getElementById('m-habilidades').innerHTML = `<p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p><p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>`;
}

document.addEventListener('DOMContentLoaded', initPerfil);
