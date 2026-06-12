const motorTests = {
    actual: 0,
    ejercicios: [{
        titulo: "Escenario 1: Razonamiento Abstracto",
        url: "https://www.bluelab.online/apply/test_a1.png",
        pregunta: "¿Qué figura completa lógicamente el lugar del signo de interrogación?"
    }],

    renderizar: function() {
        console.log("Renderizando...");
        const ej = this.ejercicios[this.actual];
        document.getElementById('titulo-escenario').innerText = ej.titulo;
        document.getElementById('pregunta-texto').innerText = ej.pregunta;
        document.getElementById('matriz-img').src = ej.url;
        
        const mapa = document.getElementById('mapa-opciones');
        mapa.innerHTML = '';
        // Creamos 8 áreas clicables sobre la imagen
        for(let i = 1; i <= 8; i++) {
            const div = document.createElement('div');
            div.className = 'opcion-area';
            div.onclick = () => {
                console.log("Opción elegida:", i);
                alert("Seleccionaste la opción " + i);
            };
            mapa.appendChild(div);
        }
    },

    siguiente: function() {
        console.log("Avanzando...");
        this.actual++;
        if(this.actual < this.ejercicios.length) this.renderizar();
        else alert("Fin del test");
    }
};

window.onload = () => motorTests.renderizar();
