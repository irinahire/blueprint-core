const motorTests = {
    actual: 0,
    ejercicios: [
        {
            titulo: "Escenario 1: Razonamiento Abstracto",
            url: "https://www.bluelab.online/apply/test_a1.png",
            pregunta: "¿Qué figura completa lógicamente el lugar del signo de interrogación?"
        }
    ],

    renderizar: function() {
        console.log("Intentando renderizar...");
        const ej = this.ejercicios[this.actual];
        const contenedor = document.getElementById('matriz-container');
        const titulo = document.getElementById('titulo-escenario');
        const pregunta = document.getElementById('pregunta-texto');

        if (!contenedor) {
            console.error("No se encontró el contenedor 'matriz-container'");
            return;
        }

        titulo.innerText = ej.titulo;
        pregunta.innerText = ej.pregunta;
        contenedor.innerHTML = `<img src="${ej.url}" style="max-width: 400px; border: 2px solid #333; border-radius: 8px;">`;
    },

    siguiente: function() {
        if (this.actual < this.ejercicios.length - 1) {
            this.actual++;
            this.renderizar();
        } else {
            alert("¡Test finalizado!");
        }
    }
};

// Forzamos la ejecución
motorTests.renderizar();
