const motorTests = {
    actual: 0,
    ejercicios: [
        {
            titulo: "Escenario 1: Razonamiento Abstracto",
            url: "https://www.bluelab.online/apply/test_a1.png",
            pregunta: "¿Qué figura completa lógicamente el lugar del signo de interrogación?"
        }
        // Para agregar los siguientes 7, solo añadí otro objeto igual aquí abajo
    ],

    renderizar: function() {
        const ej = this.ejercicios[this.actual];
        document.getElementById('titulo-escenario').innerText = ej.titulo;
        document.getElementById('pregunta-texto').innerText = ej.pregunta;
        
        const contenedor = document.getElementById('matriz-container');
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

window.onload = () => motorTests.renderizar();
