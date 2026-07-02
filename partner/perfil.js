/**
 * perfil.js
 * Lógica para renderizado de Ficha Técnica Completa
 */

// Función principal que se dispara al cargar el DOM
async function initPerfil() {
    console.log("1. Iniciando perfil.js...");

    // Esperar a que el cliente de Supabase esté listo (por si tarda en cargar)
    let intentos = 0;
    while (!window.sbClient && intentos < 10) {
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
        document.body.innerHTML = "<h1>Error: Faltan parámetros en la URL</h1>";
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
        document.body.innerHTML = "<h1>Error al cargar datos del candidato</h1>";
        return;
    }

    if (!data) {
        document.body.innerHTML = "<h1>Candidato no encontrado</h1>";
        return;
    }

    console.log("5. Datos recibidos exitosamente:", data);

    // 6. Renderizar los datos en pantalla
    renderizarPerfil(data);
}

function renderizarPerfil(row) {
    console.log("6. Renderizando perfil...");
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    
    // Aquí es donde inyectas el HTML que quieres que se vea
    // Puedes ampliar este bloque con el resto de la trayectoria, psico, etc.
    document.getElementById('perfil-content').innerHTML = `
        <h1>Ficha Técnica: ${base.nombre || "Candidato"}</h1>
        <img src="${base.foto_url}" style="width:150px;">
        <p><strong>Email:</strong> ${contacto.email}</p>
        <p><strong>Teléfono:</strong> ${contacto.telefono}</p>
    `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', initPerfil);
