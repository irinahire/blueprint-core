/**
 * hbt_migracion_id.js 
 * Lógica para vincular el ID temporal con el ID permanente vía Edge Function.
 */

async function verificarYMigrarApplicantId(sesionForzada = null) {
    console.log("--- [HBT_MIGRACION] 1. Iniciando proceso ---");

    // 1. Obtener sesión (priorizando la pasada por parámetro si existe)
    let session = sesionForzada;
    if (!session) {
        const { data: { session: sessionActual } } = await window.sbClient.auth.getSession();
        session = sessionActual;
    }

    if (!session) {
        console.log("--- [HBT_MIGRACION] 1.1. No hay sesión detectada, abortando ---");
        return;
    }

    const idTemporal = localStorage.getItem('applicantId');
    const idPermanente = session.user.id;
    const idYaMigrado = localStorage.getItem('permanentUid');

    // --- AUDITORÍA DE ESTADO ---
    console.log("--- [HBT_MIGRACION] 1.2. Valores actuales:");
    console.log("    -> Temporal (applicantId):", idTemporal);
    console.log("    -> Permanente (Sesión):", idPermanente);
    console.log("    -> Ya Migrado (permanentUid):", idYaMigrado);

    // 2. Comprobaciones de seguridad
    if (idYaMigrado === idPermanente) {
        console.log("--- [HBT_MIGRACION] 2.0. El usuario ya fue migrado anteriormente. ---");
        return;
    }

    if (!idTemporal) {
        console.log("--- [HBT_MIGRACION] 2.1. No hay ID temporal en localStorage. ---");
        // Si no hay temporal pero hay permanente, guardamos el permanente como estado actual
        localStorage.setItem('permanentUid', idPermanente);
        return;
    }
    
    if (idTemporal === idPermanente) {
        console.log("--- [HBT_MIGRACION] 2.2. El ID temporal coincide con el permanente. Actualizando estado.");
        localStorage.setItem('permanentUid', idPermanente);
        localStorage.removeItem('applicantId');
        return;
    }

    // 3. Ejecución de migración real
    console.log("--- [HBT_MIGRACION] 3. Llamando a Edge Function 'hbt_vincular_usuario' ---");

    try {
        const { data, error } = await window.sbClient.functions.invoke('hbt_vincular_usuario', {
            body: { 
                tempId: idTemporal, 
                nuevoUid: idPermanente 
            }
        });

        if (error) {
            console.error("--- [HBT_MIGRACION] 4.1. Error recibido de Edge Function:", error);
            return;
        }

        console.log("--- [HBT_MIGRACION] 5. ÉXITO:", data.message);
        
        // 4. Actualizar estado tras éxito
        localStorage.setItem('permanentUid', idPermanente);
        localStorage.removeItem('applicantId'); // Limpiamos el temporal
        console.log("--- [HBT_MIGRACION] 6. Migración finalizada. LocalStorage actualizado.");

    } catch (err) {
        console.error("--- [HBT_MIGRACION] 4.2. Error crítico durante el llamado:", err);
    }
}
