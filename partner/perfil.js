/**
 * perfil.js - Renderizado Integral Completo
 */

async function initPerfil() {
    console.log("1. Iniciando perfil.js...");
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    const { data, error } = await window.sbClient
        .from('habitat')
        .select('data, metadata')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        console.error("Error en la consulta:", error);
        return;
    }

    renderizarFichaTecnica(data.data, data.metadata);
}

function renderizarFichaTecnica(d, meta) {
    // 1. DATOS BÁSICOS
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];

    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-puesto').innerText = "Postulación a: " + (meta?.["!vinculos"]?.nombre_oferta || "Oferta");
    document.getElementById('m-score-blic').innerText = `Score: ${d["!irina"]?.evaluacion?.score_general || 0}%`;
    
    document.getElementById('m-resumen').innerText = d["!irina"]?.evaluacion?.resumen || "Sin resumen.";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");

    // 2. FOTOS Y RADAR
    const foto = document.getElementById('m-foto');
    if (foto) foto.style.backgroundImage = `url('${base.foto_url}')`;

    const radar = document.getElementById('m-radar');
    if (radar) radar.style.backgroundImage = `url('${d["!psicometrico"]?.url_big_five_radar || ''}')`;

    // 3. BOTONES DE CONTACTO
    const btnWapp = document.getElementById('btn-wapp');
    if (btnWapp) btnWapp.href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '')}`;

    const btnEmail = document.getElementById('btn-email');
    if (btnEmail) btnEmail.onclick = () => window.location.href = `mailto:${contacto.email}`;

    const btnLinkedIn = document.getElementById('btn-linkedin');
    if (btnLinkedIn) btnLinkedIn.href = contacto.linkedin?.startsWith('http') ? contacto.linkedin : 'https://www.linkedin.com/in/' + contacto.linkedin;

    // 4. BOTONES DE DESCARGA
    const btnCv = document.getElementById('btn-cv');
    if (btnCv) btnCv.href = d["!documento"]?.url || "#";

    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) btnAudio.href = d["!entrevista"]?.url_audio || "#";

    const btnPdf = document.getElementById('btn-pdf');
    if (btnPdf) btnPdf.onclick = () => window.print();

    // 5. SECCIONES DE DETALLE (Inyección completa)
    const trayEl = document.getElementById('m-trayectoria');
    if (trayEl) {
        trayEl.innerHTML = `
            <p><strong>Educación:</strong> ${d["!trayectoria"].educacion.map(e => e.descripcion).join(', ')}</p>
            <p><strong>Experiencia:</strong> ${d["!trayectoria"].experiencia.map(e => e.descripcion).join('<br>')}</p>
        `;
    }

    const analEl = document.getElementById('m-analisis');
    if (analEl) {
        analEl.innerHTML = `<ul>${d["!analisis"].puntos.map(p => `<li>${p}</li>`).join('')}</ul>`;
    }

    const psicEl = document.getElementById('m-psicometria');
    if (psicEl) {
        psicEl.innerHTML = `
            <p>${d["!psicometrico"]?.["!analisis_final"] || ""}</p>
            <p><strong>Lógica:</strong> ${d["!psicometrico"]?.LOG_ABS?.analisis || ""}</p>
            <p><strong>Situacional:</strong> ${d["!psicometrico"]?.SIT_EST?.analisis || ""}</p>
        `;
    }

    const entrEl = document.getElementById('m-entrevista');
    if (entrEl) {
        entrEl.innerHTML = `
            <p><strong>Decisión:</strong> ${d["!entrevista"]?.evaluacion?.decision || "N/A"}</p>
            <p><strong>Evidencias:</strong> ${d["!entrevista"]?.evaluacion?.evidencias?.map(e => e.enunciado).join(', ') || ""}</p>
        `;
    }

    const habEl = document.getElementById('m-habilidades');
    if (habEl) {
        habEl.innerHTML = `
            <p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p>
            <p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initPerfil);
