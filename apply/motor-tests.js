const motorTests = {
    init: function() {
        console.log("Motor inicializado");
        const grid = document.getElementById('options-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'option-box';
            div.innerText = "Opción " + i; // O aquí pondrías el <img> de cada botón
            
            div.onclick = function() {
                motorTests.enviarRespuesta(i);
            };
            
            grid.appendChild(div);
        }
    },

    enviarRespuesta: function(opcion) {
        // Conexión lógica con Supabase (simulada)
        console.log("Guardando en Supabase, respuesta:", opcion);
        
        const box = document.getElementById('feedback-box');
        const text = document.getElementById('msg-text');
        
        if (box && text) {
            box.style.display = 'block';
            text.innerText = "Has seleccionado la opción " + opcion + ".";
        }
    },

    siguiente: function() {
        console.log("Avanzando al siguiente nivel...");
        // Aquí llamarías a tu función para cambiar el src de la imagen principal
    }
};

document.addEventListener('DOMContentLoaded', () => {
    motorTests.init();
});
