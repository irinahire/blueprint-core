/**
 * hbt_migracion_id.js
 * Migración de ID temporal a ID permanente en tabla 'habitat'
 */

async function verificarYMigrarApplicantId() {
    console.log("--- [HBT_MIGRACION] Iniciando proceso de verificación ---");

    // 1. Obtener sesión de Supabase
    const { data: { session } } = await window.sbClient.auth.getSession();
    if (!session) {
        console.log("--- [HBT_MIGRACION] No hay sesión activa. Saltando proceso. ---");
        return;
    }

    const idTemporal = localStorage.getItem('applicantId');
    if (!idTemporal) {
        console.log("--- [HBT_MIGRACION] No se encontró ID temporal en localStorage. ---");
        return;
    }

    const idPermanente = session.user.id;
    console.log("--- [HBT_MIGRACION] ID Temporal detectado:", idTemporal);
    console.log("--- [HBT_MIGRACION] ID Permanente (Google/Supabase):", idPermanente);

    // 2. Buscar en la tabla 'habitat' por owner_id
    console.log("--- [HBT_MIGRACION] Consultando tabla 'habitat' por owner_id coincidente ---");
    const { data: registro, error } = await window.sbClient
        .from('habitat')
        .select('id, owner_id, metadata')
        .eq('owner_id', idTemporal)
        .eq('metadata->>!tipo', '!postulacion')
        .single();

    if (error) {
        console.error("--- [HBT_MIGRACION] Error en la consulta:", error.message);
        return;
    }

    if (!registro) {
        console.log("--- [HBT_MIGRACION] No se encontró fila con ese ID temporal (puede que ya esté migrado). ---");
        return;
    }

    console.log("--- [HBT_MIGRACION] Fila encontrada con ID interno:", registro.id);

    // 3. Preparar nueva metadata
    const nuevaMetadata = {
        ...registro.metadata,
        "!usuario_id": idPermanente
    };

    console.log("--- [HBT_MIGRACION] Ejecutando actualización en tabla 'habitat' ---");
    
    // 4. Actualizar owner_id y metadata
    const { error: updateError } = await window.sbClient
        .from('habitat')
        .update({
            owner_id: idPermanente,
            metadata: nuevaMetadata
        })
        .eq('id', registro.id);

    if (updateError) {
        console.error("--- [HBT_MIGRACION] Error crítico durante el update:", updateError.message);
    } else {
        console.log("--- [HBT_MIGRACION] Actualización exitosa. Reemplazando localStorage. ---");
        localStorage.setItem('applicantId', idPermanente);
        console.log("--- [HBT_MIGRACION] Proceso finalizado correctamente. ---");
    }
}

// Ejecutar al cargar la página
window.addEventListener('load', verificarYMigrarApplicantId);
