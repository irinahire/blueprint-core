const motorTests = {
    actual: 0,
    seleccion: null,

    init: function() {
        const overlay = document.getElementById('click-overlay');
        overlay.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'clickable-area';
            div.onclick = () => this.registrar(i);
            overlay.appendChild(div);
        }
    },

    registrar: function(opcion) {
        this.seleccion = opcion;
        const box = document.getElementById('feedback-box');
        const text = document.getElementById('msg-text');
        
        box.style.display = 'block';
        text.innerText = "Has seleccionado la opción " + opcion + ".";
        console.log("Respuesta capturada sin popup:", opcion);
    },

    siguiente: function() {
        alert("Avanzando al siguiente nivel...");
        // Aquí podrías cargar la siguiente imagen o redirigir
    }
};

window.onload = () => motorTests.init();
