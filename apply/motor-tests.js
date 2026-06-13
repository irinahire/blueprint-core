const motorTests = {
    actual: 0,
    ejercicios: [
        { url: "https://www.bluelab.online/apply/test_a1.png" }
    ],

    init: function() {
        console.log("Motor inicializado");
        this.renderizar();
    },

    renderizar: function() {
        const overlay = document.getElementById('click-overlay');
        if (!overlay) return;
        
        overlay.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'clickable-area';
            div.onclick = () => this.seleccionar(i);
            overlay.appendChild(div);
        }
    },

    seleccionar: function(opcion) {
        console.log("Respuesta capturada:", opcion);
        alert("Opción seleccionada: " + opcion);
    },

    siguiente: function() {
        alert("Avanzando al próximo ejercicio...");
    }
};

window.onload = () => motorTests.init();
