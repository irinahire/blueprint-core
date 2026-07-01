/**
 * perfil.js
 * Lógica para renderizado de Ficha Técnica Completa
 */

async function initPerfil() {
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id');
    const jobId = params.get('job_id');

    if (!ownerId || !jobId) {
        document.body.innerHTML = "<h1>Error: Parámetros incompletos</h1>";
        return;
    }

    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error || !data) {
        document.body.innerHTML = "<h1>Perfil no encontrado</h1>";
        return;
    }

    renderizarPerfil(data);
}

function renderizarPerfil(row) {
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const trayectoria = d["!trayectoria"] || {};
    const psico = d["!psicometrico"] || {};
    const irina = d["!irina"] || {};

    document.body.innerHTML = `
        <div class="perfil-container" style="max-width:900px; margin:auto; padding:20px; font-family:sans-serif;">
            <h1>Ficha Técnica: ${base.nombre || "Candidato"}</h1>
            <div style="display:flex; gap:20px; align-items:center;">
                <img src="${base.foto_url}" style="width:150px; border-radius:10px;">
                <div>
                    <p><strong>Email:</strong> ${contacto.email}</p>
                    <p><strong>Teléfono:</strong> ${contacto.telefono}</p>
                    <div style="margin-top:10px;">
                        <button onclick="window.location.href='mailto:${contacto.email}'">Enviar Email</button>
                        <button onclick="window.open('https://wa.me/${contacto.telefono.replace(/\s/g, '')}')">WhatsApp</button>
                        <button onclick="window.print()">Descargar PDF</button>
                    </div>
                </div>
            </div>
            
            <h2>Perfil Profesional</h2>
            <p>${perfil.resumen || "Sin resumen"}</p>
            
            <h2>Trayectoria y Experiencia</h2>
            <div>${trayectoria.experiencia?.map(e => `<p>• ${e.descripcion}</p>`).join('') || "No disponible"}</div>
            
            <h2>Análisis Psicométrico</h2>
            <p><strong>Lógica:</strong> ${psico.LOG_ABS?.analisis || "N/A"}</p>
            <p><strong>Big Five:</strong> ${psico.BIG_FIVE?.analisis || "N/A"}</p>
            ${psico.url_big_five_radar ? `<img src="${psico.url_big_five_radar}" style="width:300px;">` : ""}

            <div style="margin-top:30px; padding:20px; background:#f4f4f4;">
                <h3>Estado de Postulación</h3>
                <p><strong>Score General:</strong> ${irina.evaluacion?.score_general || 0}</p>
                <p><strong>Oferta ID:</strong> ${jobId}</p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initPerfil);
