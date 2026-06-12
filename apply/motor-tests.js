const motorTests = {
    actual: 0,
    ejercicios: [
        {
            titulo: "Escenario 1: Razonamiento Abstracto",
            url: "https://www.bluelab.online/apply/test_a1.png",
            pregunta: "¿Qué figura completa lógicamente el lugar del signo de interrogación?",
            opciones: [
                "url_opcion_1.png", "url_opcion_2.png", "url_opcion_3.png", "url_opcion_4.png",
                "url_opcion_5.png", "url_opcion_6.png", "url_opcion_7.png", "url_opcion_8.png"
            ]
        }
    ],

    renderizar: function() {
        console.log("Renderizando ejercicio:", this.actual + 1);
        const ej = this.ejercicios[this.actual];
        document.getElementById('titulo-escenario').innerText = ej.titulo;
        document.getElementById('pregunta-texto').innerText = ej.pregunta;
        
        const contenedor = document.getElementById('matriz-container');
        contenedor.innerHTML = `<img src="${ej.url}" style="max-width: 400px;">`;
        
        const opcContainer = document.getElementById('opciones-container');
        opcContainer.innerHTML = ej.opciones.map((url, index) => 
            `<div class="opcion-btn" onclick="motorTests.seleccionar(${index})">
                <img src="${url}" width="80px">
            </div>`
        ).join('');
    },

    seleccionar: function(index) {
        console.log("Opción seleccionada:", index);
        alert("Seleccionaste la opción: " + (index + 1));
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
