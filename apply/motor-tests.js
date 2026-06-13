const motorTests = {
    actual: 0,

    init: function() {
        console.log("Motor inicializado");
        const overlay = document.getElementById('click-overlay');
        if (!overlay) return;
        overlay.innerHTML = '';
        
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'clickable-area';
            div.onclick = function() {
                motorTests.registrar(i);
            };
            overlay.appendChild(div);
        }
    },

    registrar: function(opcion) {
        const box = document.getElementById('feedback-box');
        const text = document.getElementById('msg-text');
        if (box && text) {
            box.style.display = 'block';
            text.innerText = "Has seleccionado la opción " + opcion + ".";
            console.log("Respuesta capturada:", opcion);
        }
    },

    siguiente: function() {
        console.log("Avanzando al siguiente escenario...");
        // Tu lógica de cambio de nivel aquí
    }
};

window.onload = function() {
    motorTests.init();
};
