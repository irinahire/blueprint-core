/**
 * perfil.js - Renderizado Integral con consulta quirúrgica
 */

async function initPerfil() {
    console.log("1. Iniciando carga quirúrgica de perfil y oferta...");
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    // Consulta: Traemos la postulación exacta y la oferta ligada
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('id, data, metadata')
        .or(`and(owner_id.eq.${ownerId},metadata->>!tipo.eq.!postulacion,data->!vinculos->oferta_id.cs.{${jobId}}),id.eq.${jobId}`);

    if (error || !data) {
        console.error("Error en la consulta:", error);
        return;
    }

    const postulacion = data.find(item => item.metadata["!tipo"] === "!postulacion");
    const oferta = data.find(item => item.id === jobId);

    if (postulacion) {
        renderizarFichaTecnica(postulacion.data, oferta?.data);
    } else {
        console.error("No se encontró la postulación específica.");
    }
}

function renderizarFichaTecnica(d, ofertaData) {
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];

    // 1. HEADER Y BLIC ID
    // Buscamos la llave blic_id; si no existe, usamos el valor de error acordado
    const blicId = d.blic_id || "BLIC#ERROR";
    document.getElementById('m-blic').innerText = blicId;
    
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-puesto').innerText = ofertaData?.titulo || "Cargando puesto...";
    document.getElementById('m-score-blic').innerText = `Score: ${d["!irina"]?.evaluacion?.score_general || 0}%`;
    
    // 2. RESUMEN Y CONTACTO
    document.getElementById('m-resumen').innerText = d["!irina"]?.evaluacion?.resumen || "Sin resumen.";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");

    // 3. IMÁGENES (250px definidos en CSS)
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

    // 5. BOTONES Y SECCIONES (Logs mantenidos para troubleshooting)
    document.getElementById('btn-wapp').href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '')}`;
    document.getElementById('btn-email').onclick = () => window.location.href = `mailto:${contacto.email}`;
    document.getElementById('btn-linkedin').href = contacto.linkedin?.startsWith('http') ? contacto.linkedin : 'https://www.linkedin.com/in/' + contacto.linkedin;
    document.getElementById('btn-cv').href = d["!documento"]?.url || "#";
    document.getElementById('btn-audio').href = d["!entrevista"]?.url_audio || "#";
    document.getElementById('btn-pdf').onclick = () => window.print();

    document.getElementById('m-trayectoria').innerHTML = `<p><strong>Educación:</strong> ${d["!trayectoria"].educacion.map(e => e.descripcion).join(', ')}</p><p><strong>Experiencia:</strong> ${d["!trayectoria"].experiencia.map(e => e.descripcion).join('<br>')}</p>`;
    document.getElementById('m-analisis').innerHTML = `<ul>${d["!analisis"].puntos.map(p => `<li>${p}</li>`).join('')}</ul>`;
    document.getElementById('m-psicometria').innerHTML = `<p>${d["!psicometrico"]?.["!analisis_final"] || ""}</p><p><strong>Lógica:</strong> ${d["!psicometrico"]?.LOG_ABS?.analisis || ""}</p><p><strong>Situacional:</strong> ${d["!psicometrico"]?.SIT_EST?.analisis || ""}</p>`;
    document.getElementById('m-entrevista').innerHTML = `<p><strong>Decisión:</strong> ${d["!entrevista"]?.evaluacion?.decision || "N/A"}</p>`;
    document.getElementById('m-habilidades').innerHTML = `<p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p><p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>`;
}

document.addEventListener('DOMContentLoaded', initPerfil);
