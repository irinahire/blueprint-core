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
        const ej = this.ejercicios[this.actual];
        const titulo = document.getElementById('titulo-escenario');
        const contenedor = document.getElementById('matriz-container');
        const pregunta = document.getElementById('pregunta-texto');

        if(titulo) titulo.innerText = ej.titulo;
        if(pregunta) pregunta.innerText = ej.pregunta;
        
        if(contenedor) {
            contenedor.innerHTML = `<img src="${ej.url}" style="max-width: 400px; border: 2px solid #333; border-radius: 8px;">`;
        }
    },

    siguiente: function() {
        console.log("Avanzando al siguiente ejercicio...");
        if (this.actual < this.ejercicios.length - 1) {
            this.actual++;
            this.renderizar();
        } else {
            alert("¡Test finalizado!");
        }
    }
};

// Esto asegura que el motor esté disponible apenas cargue la página
window.motorTests = motorTests; 
window.onload = () => motorTests.renderizar();
