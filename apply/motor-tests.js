const motorTests = {
    actual: 0,
    
    // Función para inicializar el overlay de clics sobre la imagen
    init: function() {
        console.log("Motor inicializado");
        const overlay = document.getElementById('click-overlay');
        
        // Limpiamos el contenido anterior por si acaso
        overlay.innerHTML = '';
        
        // Creamos los 8 botones invisibles (grid de 4x2)
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'clickable-area';
            
            // Asignamos la acción al hacer clic
            div.onclick = function() {
                motorTests.registrar(i);
            };
            
            overlay.appendChild(div);
        }
    },

    // Función para manejar la selección sin popups molestos
    registrar: function(opcion) {
        const box = document.getElementById('feedback-box');
        const text = document.getElementById('msg-text');
        
        // Mostramos el feedback en el área inferior
        box.style.display = 'block';
        text.innerText = "Has seleccionado la opción " + opcion + ".";
        
        console.log("Respuesta capturada:", opcion);
    },

    // Función para avanzar al siguiente ejercicio
    siguiente: function() {
        console.log("Avanzando al siguiente ejercicio...");
        // Aquí irá la lógica para cambiar la imagen
    }
};

// Aseguramos que el motor inicie cuando cargue todo el documento
window.onload = function() {
    motorTests.init();
};
