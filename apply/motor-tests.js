const motorTests = {
    actual: 0,
    
    init: function() {
        console.log("Inicializando motor...");
        const grid = document.getElementById('options-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Crear las 8 celdas de respuesta de forma dinámica
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'option-item';
            div.innerHTML = `<span style="display:none">${i}</span>`; // Valor oculto
            
            div.onclick = function() {
                motorTests.registrar(i);
            };
            
            grid.appendChild(div);
        }
    },

    registrar: function(opcion) {
        console.log("Opción seleccionada:", opcion);
        const box = document.getElementById('feedback-box');
        const text = document.getElementById('msg-text');
        
        if (box && text) {
            box.style.display = 'block';
            text.innerText = "Has seleccionado la opción " + opcion + ".";
        }
    },

    siguiente: function() {
        console.log("Avanzando...");
        // Aquí agregarías la lógica de redirección o carga de nueva imagen
    }
};

document.addEventListener('DOMContentLoaded', () => {
    motorTests.init();
});
