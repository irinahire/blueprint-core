/**
 * hbt_migracion_id.js 
 * Lógica directa: Toma el ID temporal del navegador y el nuevo ID de Google,
 * y los envía a la Edge Function para realizar la migración en la base de datos.
 */

async function verificarYMigrarApplicantId(sesionForzada = null) {
    console.log("--- [HBT_MIGRACION] 1. Iniciando proceso de migración ---");

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

    // 2. Extraer los IDs sin realizar comparaciones que bloqueen el flujo
    const idTemporal = localStorage.getItem('applicantId');
    const idPermanente = session.user.id;

    // --- AUDITORÍA DE DATOS ---
    console.log("--- [HBT_MIGRACION] 1.2. Datos para migración:");
    console.log("    -> ID Temporal (a reemplazar):", idTemporal);
    console.log("    -> ID Permanente (nuevo):", idPermanente);

    if (!idTemporal) {
        console.log("--- [HBT_MIGRACION] 2.1. No existe ID temporal. Finalizando. ---");
        // Marcamos como permanente para evitar futuros intentos innecesarios
        localStorage.setItem('permanentUid', idPermanente);
        return;
    }

    // 3. Ejecución directa: Invocación a la Edge Function
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
        
        // 4. Actualizar localStorage para reflejar el éxito
        localStorage.setItem('permanentUid', idPermanente);
        localStorage.removeItem('applicantId'); // Eliminamos el temporal para dejarlo limpio
        
        console.log("--- [HBT_MIGRACION] 6. Proceso finalizado. LocalStorage actualizado correctamente.");

    } catch (err) {
        console.error("--- [HBT_MIGRACION] 4.2. Error crítico durante el llamado:", err);
    }
}
