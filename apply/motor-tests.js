const motorTests = {
    actual: 0,
    ejercicios: [
        { url: "https://www.bluelab.online/apply/test_a1.png" }
        // Aquí podés ir agregando más objetos { url: "..." }
    ],

    init: function() {
        console.log("Motor inicializado");
        this.renderizar();
    },

    renderizar: function() {
        const ej = this.ejercicios[this.actual];
        const img = document.getElementById('test-image');
        const overlay = document.getElementById('click-overlay');
        const numEscenario = document.getElementById('num-escenario');

        if (img) img.src = ej.url;
        if (numEscenario) numEscenario.innerText = this.actual + 1;

        if (overlay) {
            overlay.innerHTML = '';
            for (let i = 1; i <= 8; i++) {
                const div = document.createElement('div');
                div.className = 'clickable-area';
                div.onclick = () => this.seleccionar(i);
                overlay.appendChild(div);
            }
        }
    },

    seleccionar: function(opcion) {
        console.log("Opción seleccionada:", opcion);
        alert("Seleccionaste la opción " + opcion);
    },

    siguiente: function() {
        if (this.actual < this.ejercicios.length - 1) {
            this.actual++;
            this.renderizar();
        } else {
            alert("Has finalizado todos los ejercicios.");
        }
    }
};

window.onload = () => motorTests.init();
