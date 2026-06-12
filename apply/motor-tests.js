const motorTests = {
    actual: 0,
    ejercicios: [
        { url: "https://www.bluelab.online/apply/test_a1.png" },
        // Agrega aquí los próximos: { url: "url_ejercicio_2.png" }, etc.
    ],

    init: function() {
        console.log("Motor inicializado");
        this.renderizar();
    },

    renderizar: function() {
        const ej = this.ejercicios[this.actual];
        document.getElementById('num-escenario').innerText = this.actual + 1;
        document.getElementById('test-image').src = ej.url;
        
        const overlay = document.getElementById('click-overlay');
        overlay.innerHTML = '';
        
        for (let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'clickable-area';
            div.onclick = () => this.seleccionar(i);
            overlay.appendChild(div);
        }
    },

    seleccionar: function(opcion) {
        console.log("Usuario seleccionó opción:", opcion);
        alert("Opción " + opcion + " registrada en el sistema.");
    },

    siguiente: function() {
        if (this.actual < this.ejercicios.length - 1) {
            this.actual++;
            this.renderizar();
        } else {
            alert("Has finalizado todos los ejercicios del test.");
        }
    }
};

window.onload = () => motorTests.init();
