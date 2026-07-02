/**
 * perfil.js - Renderizado Integral Robusto
 * Corregido: Verificación de elementos para evitar el error de "null"
 */

async function initPerfil() {
    console.log("1. Iniciando perfil.js...");
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

    if (error || !data) {
        console.error("Error en la consulta:", error);
        return;
    }

    renderizarPerfilCompleto(data.data);
}

function renderizarPerfilCompleto(d) {
    // 1. DATOS BÁSICOS
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];

    if(document.getElementById('m-nombre')) document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    if(document.getElementById('m-mail')) document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    if(document.getElementById('m-tel')) document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");
    
    const foto = document.getElementById('m-foto');
    if (foto) {
        foto.style.backgroundImage = `url('${base.foto_url}')`;
        foto.style.backgroundSize = "cover";
        foto.style.backgroundPosition = "center";
    }

    // 2. BOTONES (Con seguridad para evitar el error null)
    const btnWapp = document.getElementById('btn-wapp');
    if (btnWapp) {
        btnWapp.href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '')}`;
        btnWapp.target = "_blank";
    }

    const btnEmail = document.getElementById('btn-email');
    if (btnEmail) {
        btnEmail.onclick = () => window.location.href = `mailto:${contacto.email}`;
    }

    // 3. TRAYECTORIA
    const trayEl = document.getElementById('m-trayectoria');
    if (trayEl) {
        trayEl.innerHTML = `
            <h3>Educación</h3>
            ${d["!trayectoria"].educacion.map(e => `<p><strong>${e.descripcion}</strong></p>`).join('')}
            <h3>Experiencia Laboral</h3>
            ${d["!trayectoria"].experiencia.map(e => `<p>${e.descripcion}</p>`).join('')}
            <br>
            <a href="${d["!documento"].url}" target="_blank" class="btn-download">Descargar ${d["!documento"].nombre_archivo}</a>
        `;
    }

    // 4. ANÁLISIS COMPLETO (Renderizado en .card)
    const card = document.querySelector('.card');
    if (card) {
        const divInfo = document.createElement('div');
        divInfo.innerHTML = `
            <hr><h3>Evaluación Irina Hire</h3>
            <p><strong>Score:</strong> ${d["!irina"].evaluacion.score_general}%</p>
            <p>${d["!irina"].evaluacion.resumen}</p>
            
            <h3>Puntos Clave</h3>
            <ul>${d["!analisis"].puntos.map(p => `<li>${p}</li>`).join('')}</ul>

            <h3>Psicometría Detallada</h3>
            <p>${d["!psicometrico"]["!analisis_final"]}</p>
            <img src="${d["!psicometrico"].url_big_five_radar}" style="width:100%; max-width:500px;">
            <p><strong>Lógica:</strong> ${d["!psicometrico"].LOG_ABS.analisis}</p>
            <p><strong>Situacional:</strong> ${d["!psicometrico"].SIT_EST.analisis}</p>
            <p><strong>Big Five:</strong> ${d["!psicometrico"].BIG_FIVE.analisis}</p>

            <h3>Entrevista</h3>
            <p><strong>Decisión:</strong> ${d["!entrevista"].evaluacion.decision}</p>
            <p><strong>Evidencias:</strong> ${d["!entrevista"].evaluacion.evidencias.map(e => e.enunciado).join(', ')}</p>

            <h3>Habilidades</h3>
            <p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p>
            <p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>
        `;
        card.appendChild(divInfo);
    }
}

document.addEventListener('DOMContentLoaded', initPerfil);
