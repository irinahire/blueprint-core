const motorTests = {
    ejercicioActual: 0,
    // Definición visual de los elementos de tus imágenes
    diccionarioFormas: {
        'linea-diag': '<line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="4"/>',
        'linea-diag-inv': '<line x1="90" y1="10" x2="10" y2="90" stroke="black" stroke-width="4"/>',
        'punto-c': '<circle cx="50" cy="50" r="10" fill="black"/>',
        'cuadrado-der': '<rect x="50" y="20" width="30" height="60" fill="#0182a9"/>'
    },

    ejercicios: [
        {
            // Matriz 3x3: Los nombres coinciden con el diccionario de arriba
            patron: ['linea-diag', 'punto-c', 'linea-diag-inv', 'punto-c', 'punto-c', 'linea-diag', 'linea-diag', 'cuadrado-der', '?'],
            opciones: ['A', 'C', 'D', 'E', 'F']
        }
    ],

    dibujarCelda: function(tipo) {
        if (tipo === '?') return '<div class="signo-interrogacion">?</div>';
        const formas = this.diccionarioFormas[tipo] || '';
        return `<svg viewBox="0 0 100 100" class="svg-forma">${formas}</svg>`;
    },

    renderizar: function() {
        const contenedor = document.getElementById('matriz-container');
        contenedor.innerHTML = '';
        this.ejercicios[this.ejercicioActual].patron.forEach(tipo => {
            const div = document.createElement('div');
            div.className = 'celda';
            div.innerHTML = this.dibujarCelda(tipo);
            contenedor.appendChild(div);
        });
    }
};
