/**
 * perfil.js
 * Lógica para renderizado de Ficha Técnica Completa
 */

// Función principal que se dispara al cargar el DOM
async function initPerfil() {
    console.log("1. Iniciando perfil.js...");

    // Esperar a que el cliente de Supabase esté listo (proporcionado por auth-module.js)
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
        document.getElementById('m-nombre').innerText = "Error: Faltan parámetros en la URL";
        return;
    }

    // 3. Realizar la búsqueda quirúrgica en Supabase
    console.log("3. Ejecutando consulta en Supabase...");
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } })
        .single();

    if (error) {
        console.error("4. Error en la consulta:", error);
        document.getElementById('m-nombre').innerText = "Error al cargar datos del candidato";
        return;
    }

    if (!data) {
        document.getElementById('m-nombre').innerText = "Candidato no encontrado";
        return;
    }

    console.log("5. Datos recibidos exitosamente:", data);

    // 6. Renderizar los datos usando los IDs de tu perfil.html
    renderizarPerfil(data);
}

function renderizarPerfil(row) {
    console.log("6. Renderizando perfil...");
    
    // Parseo de los datos
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const trayectoria = d["!trayectoria"] || {};

    // Mapeo a los IDs definidos en perfil.html
    const nombreEl = document.getElementById('m-nombre');
    const mailEl = document.getElementById('m-mail');
    const telEl = document.getElementById('m-tel');
    const fotoEl = document.getElementById('m-foto');
    const trayEl = document.getElementById('m-trayectoria');
    const btnWapp = document.getElementById('btn-wapp');
    const btnMail = document.getElementById('btn-mail');

    // Inyección de datos
    if (nombreEl) nombreEl.innerText = base.nombre || "Sin nombre";
    if (mailEl) mailEl.innerText = "Email: " + (contacto.email || "N/A");
    if (telEl) telEl.innerText = "Tel: " + (contacto.telefono || "N/A");
    
    if (fotoEl) {
        fotoEl.style.backgroundImage = `url('${base.foto_url || ""}')`;
    }

    if (trayEl) {
        const exp = trayectoria.experiencia || [];
        trayEl.innerHTML = exp.length > 0 
            ? exp.map(e => `<p>• ${e.puesto} en ${e.empresa}</p>`).join('') 
            : "Sin trayectoria registrada.";
    }

    // Botones de acción
    if (btnWapp) btnWapp.href = `https://wa.me/${contacto.telefono?.replace(/\D/g, '') || ''}`;
    if (btnMail) btnMail.href = `mailto:${contacto.email || ''}`;

    console.log("Renderizado completo.");
}

// Inicialización
document.addEventListener('DOMContentLoaded', initPerfil);
