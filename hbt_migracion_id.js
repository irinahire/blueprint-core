/**
 * hbt_migracion_id.js 
 * Lógica corregida: Toma el applicantId de la URL (fuente inmutable)
 */

async function verificarYMigrarApplicantId(sesionForzada = null) {
    console.log("--- [HBT_MIGRACION] 1. Iniciando proceso de migración ---");

    let session = sesionForzada;
    if (!session) {
        const { data: { session: sessionActual } } = await window.sbClient.auth.getSession();
        session = sessionActual;
    }

    if (!session) {
        console.log("--- [HBT_MIGRACION] 1.1. No hay sesión detectada, abortando ---");
        return;
    }

    // --- CAMBIO CRÍTICO: Obtenemos el ID de la URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const applicantId = urlParams.get('applicantId'); 
    const idPermanente = session.user.id;

    console.log("--- [HBT_MIGRACION] 2. Auditoría de valores:");
    console.log("Este es el id obtenido de la URL:", applicantId);
    console.log("Este es el id Permanente (sesión):", idPermanente);

    if (!applicantId) {
        console.log("--- [HBT_MIGRACION] 2.1. No existe applicantId en la URL. Finalizando. ---");
        return;
    }

    // Paso de llamada: Enviamos applicantId y dejamos que la Edge Function busque en metadata
    console.log("--- [HBT_MIGRACION] 3. Llamando a función para vincular cuenta ---");

    try {
        const { data, error } = await window.sbClient.functions.invoke('hbt_vincular_usuario', {
            body: { 
                applicantId: applicantId, // Nombre de variable consistente con la Edge Function
                nuevoUid: idPermanente 
            }
        });

        if (error) {
            console.error("--- [HBT_MIGRACION] 4.1. Error al intentar vincular:", error);
            return;
        }

        console.log("--- [HBT_MIGRACION] 5. ÉXITO:", data.message);
        
        // Limpiamos solo si quieres, pero el proceso ya es seguro
        console.log("--- [HBT_MIGRACION] 6. Proceso finalizado.");

    } catch (err) {
        console.error("--- [HBT_MIGRACION] 4.4. Error crítico durante el llamado:", err);
    }
}
