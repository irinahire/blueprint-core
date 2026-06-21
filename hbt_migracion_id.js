/**
 * hbt_migracion_id.js 
 * Este script se encarga de:
 * 1. Extraer el applicantId de la URL (el puente).
 * 2. Obtener el ID de la cuenta de Google desde la sesión activa (el destino).
 * 3. Enviar ambos a la función Edge para actualizar el owner_id en la base de datos.
 */

async function verificarYMigrarApplicantId(sesionForzada = null) {
    console.log("--- [HBT_MIGRACION] Inicio del proceso ---");

    // Paso 1: Identificar la sesión del usuario (quién se logueó)
    let session = sesionForzada;
    if (!session) {
        const { data: { session: sessionActual } } = await window.sbClient.auth.getSession();
        session = sessionActual;
    }

    // Si no hay sesión, no hay nada que migrar
    if (!session) {
        console.log("--- [HBT_MIGRACION] Error: No hay sesión de usuario activa ---");
        return;
    }

    // Paso 2: Extraer el applicantId de la URL
    // La variable en la URL debe llamarse exactamente 'applicantId'
    const urlParams = new URLSearchParams(window.location.search);
    const applicantId = urlParams.get('applicantId'); 
    
    // Paso 3: Identificar el ID de Google (el nuevo owner_id)
    const idPermanente = session.user.id;

    // Auditoría de valores para saber qué estamos enviando
    console.log("--- [HBT_MIGRACION] Auditoría de datos:");
    console.log("Variable extraída de la URL (applicantId):", applicantId);
    console.log("ID de sesión de Google obtenido (nuevoUid):", idPermanente);

    // Validación: Si no hay ID en la URL, no podemos buscar la fila en la base de datos
    if (!applicantId) {
        console.log("--- [HBT_MIGRACION] Error: No se encontró 'applicantId' en la URL ---");
        return;
    }

    // Paso 4: Llamar a la Edge Function 'hbt_vincular_usuario'
    // Enviamos el applicantId (para la búsqueda en metadata) y el nuevoUid (para el nuevo owner_id)
    console.log("--- [HBT_MIGRACION] Llamando a la función hbt_vincular_usuario ---");

    try {
        const { data, error } = await window.sbClient.functions.invoke('hbt_vincular_usuario', {
            body: { 
                applicantId: applicantId, // Este es el valor que se buscará en metadata->!usuario_id
                nuevoUid: idPermanente    // Este es el valor que se escribirá en owner_id
            }
        });

        // Manejo de errores de la función
        if (error) {
            console.error("--- [HBT_MIGRACION] Error devuelto por la función:", error);
            return;
        }

        // Éxito: La función terminó su trabajo
        console.log("--- [HBT_MIGRACION] Proceso completado con éxito:", data);

    } catch (err) {
        // Manejo de errores de conexión o ejecución
        console.error("--- [HBT_MIGRACION] Error crítico en la ejecución del script:", err);
    }
}
