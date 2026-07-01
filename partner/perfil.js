async function initPerfil() {
    const params = new URLSearchParams(window.location.search);
    const ownerId = params.get('owner_id'); // Viene de la URL
    const jobId = params.get('job_id');     // Viene de la URL

    if (!ownerId || !jobId) return;

    // Consulta exacta usando el owner_id de la columna y los filtros de metadata
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('owner_id', ownerId) // Columna raíz
        .eq('metadata->>!tipo', '!postulacion') // Filtro JSON: tipo
        .contains('metadata', { "!vinculos": { "oferta_id": [jobId] } }) // Filtro JSON: oferta en array
        .single();

    if (error || !data) {
        console.error("Error al buscar perfil exacto:", error);
        return;
    }

    // Ahora data contiene exactamente la fila que buscamos
    renderizarPerfil(data);
}
