/**
 * hbt_migracion_id.js 
 * Lógica para vincular el ID temporal con el ID permanente vía Edge Function.
 */

async function verificarYMigrarApplicantId() {
    console.log("--- [HBT_MIGRACION] 1. Iniciando proceso ---");

    // 1. Obtener sesión
    const { data: { session } } = await window.sbClient.auth.getSession();
    if (!session) {
        console.log("--- [HBT_MIGRACION] 1.1. No hay sesión, abortando ---");
        return;
    }

    const idTemporal = localStorage.getItem('applicantId');
    const idPermanente = session.user.id;

    // --- LÍNEA SOLICITADA PARA AUDITORÍA ---
    console.log("--- [HBT_MIGRACION] 1.2. Valor exacto en localStorage (applicantId):", idTemporal);

    console.log("--- [HBT_MIGRACION] 2. IDs Comparativa -> Temporal:", idTemporal, "| Permanente:", idPermanente);

    if (!idTemporal) {
        console.log("--- [HBT_MIGRACION] 2.1. No hay ID temporal en localStorage. Nada que hacer. ---");
        return;
    }
    
    if (idTemporal === idPermanente) {
        console.log("--- [HBT_MIGRACION] 2.2. El ID en localStorage ya es igual al ID de sesión. ---");
        return;
    }

    console.log("--- [HBT_MIGRACION] 3. Llamando a Edge Function 'hbt_vincular_usuario' ---");

    try {
        // 4. Invocación a la Edge Function
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
        
        // 5. Actualizar localStorage solo si la función respondió éxito
        localStorage.setItem('applicantId', idPermanente);
        console.log("--- [HBT_MIGRACION] 6. LocalStorage actualizado correctamente a:", idPermanente);

    } catch (err) {
        console.error("--- [HBT_MIGRACION] 4.2. Error crítico durante el llamado:", err);
    }
}
