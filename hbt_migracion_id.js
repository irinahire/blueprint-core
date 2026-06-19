/**
 * hbt_migracion_id.js - Versión corregida
 */

async function verificarYMigrarApplicantId() {
    console.log("--- [HBT_MIGRACION] Iniciando proceso de verificación ---");

    const { data: { session } } = await window.sbClient.auth.getSession();
    if (!session) return;

    const idTemporal = localStorage.getItem('applicantId');
    const idPermanente = session.user.id;

    if (!idTemporal) return;
    
    // Si ya son iguales, no hacemos nada
    if (idTemporal === idPermanente) {
        console.log("--- [HBT_MIGRACION] El ID ya es permanente, omitiendo. ---");
        return;
    }

    console.log("--- [HBT_MIGRACION] Buscando fila con owner_id:", idTemporal);

    // 1. Quitamos .single() y ajustamos la sintaxis del filtro
    const { data: registros, error } = await window.sbClient
        .from('habitat')
        .select('id, owner_id, metadata')
        .eq('owner_id', idTemporal); // Buscamos por owner_id que es lo más directo

    if (error) {
        console.error("--- [HBT_MIGRACION] Error en consulta:", error.message);
        return;
    }

    // 2. Filtramos manualmente en JS para evitar problemas de sintaxis JSONB en el filtro de la API
    const registro = registros ? registros.find(r => r.metadata?.['!tipo'] === '!postulacion') : null;

    if (!registro) {
        console.log("--- [HBT_MIGRACION] No se encontró postulación activa con ese ID. ---");
        return;
    }

    console.log("--- [HBT_MIGRACION] Registro encontrado. ID interno:", registro.id);

    // 3. Preparar actualización
    const nuevaMetadata = {
        ...registro.metadata,
        "!usuario_id": idPermanente
    };

    console.log("--- [HBT_MIGRACION] Actualizando a:", idPermanente);

    const { error: updateError } = await window.sbClient
        .from('habitat')
        .update({
            owner_id: idPermanente,
            metadata: nuevaMetadata
        })
        .eq('id', registro.id);

    if (updateError) {
        console.error("--- [HBT_MIGRACION] Error crítico durante update:", updateError.message);
    } else {
        console.log("--- [HBT_MIGRACION] ÉXITO. Actualizando localStorage.");
        localStorage.setItem('applicantId', idPermanente);
    }
}

window.addEventListener('load', verificarYMigrarApplicantId);
