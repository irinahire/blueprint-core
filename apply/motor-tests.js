const motorTests = {
    actual: 0,
    ejercicios: [
        {
            url: "https://www.bluelab.online/apply/test_a1.png"
        }
    ],

    renderizar: function() {
        const contenedor = document.getElementById('matriz-container');
        if (!contenedor) return; // Si no encuentra el div, no hace nada

        const ej = this.ejercicios[this.actual];
        contenedor.innerHTML = `<img src="${ej.url}" style="width: 100%; grid-column: span 3;">`;
        console.log("Renderizado correctamente");
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

window.onload = () => motorTests.renderizar();
