/**
 * perfil.js - Renderizado Total y Detallado
 * Objetivo: Desplegar cada llave del objeto data sin omitir información.
 */

async function initPerfil() {
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
    
    // El objeto d es la fuente única de verdad
    renderizarTodo(data.data);
}

function renderizarTodo(d) {
    const contenedor = document.getElementById('app-perfil');
    contenedor.innerHTML = ""; // Limpiar antes de renderizar

    // 1. PERFIL BASE
    const p = d["!perfil"];
    contenedor.innerHTML += `
        <section id="perfil-info">
            <img src="${p["perfil-base"].foto_url}" style="width:150px; border-radius:50%;">
            <h1>${p["perfil-base"].nombre}</h1>
            <p>Email: ${p["perfil-contacto"].email}</p>
            <p>Tel: ${p["perfil-contacto"].telefono}</p>
            <a href="https://linkedin.com/in/${p["perfil-contacto"].linkedin}" target="_blank">LinkedIn</a>
        </section>
    `;

    // 2. TRAYECTORIA
    const t = d["!trayectoria"];
    contenedor.innerHTML += `
        <section id="trayectoria">
            <h2>Trayectoria</h2>
            <h3>Educación</h3>
            ${t.educacion.map(e => `<p>${e.descripcion}</p>`).join('')}
            <h3>Experiencia</h3>
            ${t.experiencia.map(e => `<p>${e.descripcion}</p>`).join('')}
        </section>
    `;

    // 3. HABILIDADES
    const h = d["!habilidades"];
    contenedor.innerHTML += `
        <section id="habilidades">
            <h2>Habilidades</h2>
            <p><strong>Blandas:</strong> ${h.blandas.join(', ')}</p>
            <p><strong>Técnicas:</strong> ${h.tecnicas.join(', ')}</p>
        </section>
    `;

    // 4. ANÁLISIS PSICOMÉTRICO (Las 3 llaves)
    const psi = d["!psicometrico"];
    contenedor.innerHTML += `
        <section id="psicometrico">
            <h2>Análisis Psicométrico</h2>
            <p>${psi["!analisis_final"]}</p>
            <img src="${psi.url_big_five_radar}" alt="Gráfico Radar">
            <div>
                <p><strong>Lógica:</strong> ${psi.LOG_ABS.analisis}</p>
                <p><strong>Situacional:</strong> ${psi.SIT_EST.analisis}</p>
                <p><strong>Big Five:</strong> ${psi.BIG_FIVE.analisis}</p>
            </div>
        </section>
    `;

    // 5. EVALUACIÓN IRINA
    const irina = d["!irina"];
    contenedor.innerHTML += `
        <section id="evaluacion-irina">
            <h2>Evaluación Irina Hire</h2>
            <p>Score General: ${irina.evaluacion.score_general}%</p>
            <p>${irina.evaluacion.resumen}</p>
        </section>
    `;

    // 6. ENTREVISTA VAPI
    const ent = d["!entrevista"];
    contenedor.innerHTML += `
        <section id="entrevista">
            <h2>Detalle de Entrevista</h2>
            <p>Decision: ${ent.evaluacion.decision}</p>
            <ul>
                ${ent.evaluacion.evidencias.map(ev => `<li><strong>${ev.tipo}</strong>: ${ev.detalle} - ${ev.impacto}</li>`).join('')}
            </ul>
        </section>
    `;
}

document.addEventListener('DOMContentLoaded', initPerfil);
