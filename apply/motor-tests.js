const motorTests = {
    // Definimos cómo se ve cada forma básica
    formas: {
        'barra-azul': '<rect x="10" y="30" width="80" height="40" fill="#017a9e"/>',
        'caja-borde': '<rect x="5" y="5" width="90" height="90" fill="none" stroke="#017a9e" stroke-width="4"/>'
    },

    // Aquí irán los datos que te voy a pasar por cada ejercicio
    ejercicios: [],

    renderizar: function(id) {
        const contenedor = document.getElementById('matriz-container');
        contenedor.innerHTML = '';
        
        // Creamos las 9 celdas
        for (let i = 0; i < 9; i++) {
            const celda = document.createElement('div');
            celda.className = 'celda';
            // Aquí inyectamos el SVG del ejercicio correspondiente
            celda.innerHTML = `<svg viewBox="0 0 100 100">${this.formas['caja-borde']}${this.formas['barra-azul']}</svg>`;
            contenedor.appendChild(celda);
        }
    }
};
// Lanzamos
document.addEventListener('DOMContentLoaded', () => motorTests.renderizar());
