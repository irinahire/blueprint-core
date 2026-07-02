/**
 * perfil.js - Renderizado Integral (Versión Completa)
 * Este script mapea el 100% de la estructura del objeto 'data' recibido de Supabase.
 */

async function initPerfil() {
    console.log("1. Iniciando perfil.js...");
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    // Consulta robusta: traemos la data del candidato según los parámetros
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('data')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        console.error("Error crítico en la consulta:", error);
        return;
    }

    console.log("Datos recibidos para renderizado total:", data.data);
    renderizarPerfilCompleto(data.data);
}

function renderizarPerfilCompleto(d) {
    // --- 1. SECCIÓN: DATOS BÁSICOS, FOTO Y CONTACTO ---
    const base = d["!perfil"]["perfil-base"];
    const contacto = d["!perfil"]["perfil-contacto"];

    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = "Email: " + (contacto.email || "N/A");
    document.getElementById('m-tel').innerText = "Tel: " + (contacto.telefono || "N/A");
    
    // Asignación de foto con estilo
    const foto = document.getElementById('m-foto');
    if (foto) {
        foto.style.backgroundImage = `url('${base.foto_url}')`;
        foto.style.backgroundSize = "cover";
        foto.style.backgroundPosition = "center";
    }

    // --- 2. SECCIÓN: BOTONES DE ACCIÓN (WhatsApp, Email, LinkedIn) ---
    const btnWapp = document.getElementById('btn-wapp');
    btnWapp.href = `https://wa.me/${contacto.telefono.replace(/\D/g, '')}`;
    btnWapp.target = "_blank";

    const btnEmail = document.getElementById('btn-email');
    btnEmail.onclick = () => window.location.href = `mailto:${contacto.email}`;

    // Re-creación del botón LinkedIn para asegurar que exista
    let btnLnk = document.getElementById('btn-linkedin');
    if (!btnLnk) {
        btnLnk = document.createElement('a');
        btnLnk.id = 'btn-linkedin';
        btnLnk.className = "btn-action";
        document.getElementById('m-acciones').appendChild(btnLnk);
    }
    btnLnk.href = contacto.linkedin.startsWith('http') ? contacto.linkedin : 'https://www.linkedin.com/in/' + contacto.linkedin;
    btnLnk.target = "_blank";
    btnLnk.innerText = "Ver LinkedIn";

    // --- 3. SECCIÓN: TRAYECTORIA Y CV (Llaves !trayectoria y !documento) ---
    const trayEl = document.getElementById('m-trayectoria');
    trayEl.innerHTML = `
        <h3>Educación</h3>
        ${d["!trayectoria"].educacion.map(e => `<p><strong>${e.descripcion}</strong></p>`).join('')}
        <h3>Experiencia Laboral</h3>
        ${d["!trayectoria"].experiencia.map(e => `<p>${e.descripcion}</p>`).join('')}
        <br>
        <a href="${d["!documento"].url}" target="_blank" class="btn-download">Descargar ${d["!documento"].nombre_archivo}</a>
    `;

    // --- 4. SECCIÓN: ANÁLISIS INTEGRAL (Irina, Psicométrico, Entrevista) ---
    const card = document.querySelector('.card');
    const divInfo = document.createElement('div');
    divInfo.id = "seccion-analisis-completo";
    
    divInfo.innerHTML = `
        <hr style="margin: 30px 0;">
        
        <h3>Evaluación Irina Hire</h3>
        <p><strong>Score General:</strong> ${d["!irina"].evaluacion.score_general}%</p>
        <p>${d["!irina"].evaluacion.resumen}</p>
        
        <h3>Análisis Profesional (Puntos Clave)</h3>
        <ul>${d["!analisis"].puntos.map(p => `<li>${p}</li>`).join('')}</ul>

        <h3>Psicometría Detallada</h3>
        <p>${d["!psicometrico"]["!analisis_final"]}</p>
        <img src="${d["!psicometrico"].url_big_five_radar}" style="width:100%; max-width:500px; border:1px solid #ccc;">
        <p><strong>Lógica y Abstracción:</strong> ${d["!psicometrico"].LOG_ABS.analisis}</p>
        <p><strong>Situacional:</strong> ${d["!psicometrico"].SIT_EST.analisis}</p>
        <p><strong>Big Five (Personalidad):</strong> ${d["!psicometrico"].BIG_FIVE.analisis}</p>

        <h3>Análisis de Entrevista (Vapi)</h3>
        <p><strong>Decisión:</strong> ${d["!entrevista"].evaluacion.decision}</p>
        <p><strong>Evidencias:</strong> ${d["!entrevista"].evaluacion.evidencias.map(e => e.enunciado).join(', ')}</p>

        <h3>Habilidades</h3>
        <p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p>
        <p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>
    `;
    
    // Evitar duplicados si se llama a la función varias veces
    const oldDiv = document.getElementById("seccion-analisis-completo");
    if(oldDiv) oldDiv.remove();
    card.appendChild(divInfo);
    
    console.log("Renderizado finalizado: Todos los campos cargados.");
}

document.addEventListener('DOMContentLoaded', initPerfil);
