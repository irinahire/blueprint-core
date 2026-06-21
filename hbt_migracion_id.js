/**
 * hbt_migracion_id.js 
 * Lógica paso a paso para auditoría en consola.
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

    // Extracción de valores
    const idTemporal = localStorage.getItem('applicantId');
    const idPermanente = session.user.id;

    // Auditoría paso a paso
    console.log("--- [HBT_MIGRACION] 2. Auditoría de valores:");
    console.log("Este es el id Temporal:", idTemporal);
    console.log("Este es el id Permanente:", idPermanente);

    if (!idTemporal) {
        console.log("--- [HBT_MIGRACION] 2.1. No existe ID temporal. Finalizando. ---");
        localStorage.setItem('permanentUid', idPermanente);
        return;
    }

    // Paso de llamada
    console.log("--- [HBT_MIGRACION] 3. Se llama a la función para que cambie este valor temporal por este otro permanente en el Owner ID ---");
    console.log(`--- [HBT_MIGRACION] Instrucción: Busca en la fila un 'owner_id' que coincida con el valor temporal: ${idTemporal} ---`);

    try {
        const { data, error } = await window.sbClient.functions.invoke('hbt_vincular_usuario', {
            body: { 
                tempId: idTemporal, 
                nuevoUid: idPermanente 
            }
        });

        if (error) {
            console.error("--- [HBT_MIGRACION] 4.1. Error al intentar vincular:", error);
            return;
        }

        console.log("--- [HBT_MIGRACION] 4.2. Se encontró el valor temporal en la columna 'owner_id' ---");
        console.log(`--- [HBT_MIGRACION] 4.3. Se procede a reemplazar el valor de 'owner_id' por este valor permanente: ${idPermanente} ---`);
        
        console.log("--- [HBT_MIGRACION] 5. ÉXITO:", data.message);
        
        // Actualizar estado
        localStorage.setItem('permanentUid', idPermanente);
        localStorage.removeItem('applicantId');
        
        console.log("--- [HBT_MIGRACION] 6. Proceso finalizado. LocalStorage actualizado.");

    } catch (err) {
        console.error("--- [HBT_MIGRACION] 4.4. Error crítico durante el llamado:", err);
    }
}
