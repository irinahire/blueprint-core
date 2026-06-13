// motor-tests.js

const testData = {
    "test_a1": {
        instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a1_r",
        opciones: 8
    },
    "test_a2": {
        instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a2_r",
        opciones: 8
    }
};

let testActual = 1;

function cargarTest(idTest) {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    const instruccionDiv = document.getElementById('instrucciones-box');

    // PROTECCIÓN EXTRA: Si no encuentra el elemento en el HTML, no hace nada y avisa
    if (!instruccionDiv || !mainImg || !grid) {
        console.error("Error: No se encuentran los elementos necesarios en el HTML (instrucciones-box, main-test-image o options-grid).");
        return;
    }

    const data = testData[idTest];
    if (!data) return;

    instruccionDiv.innerText = data.instrucciones;
    mainImg.src = data.imgPrincipal + "?t=" + new Date().getTime();

    grid.innerHTML = '';
    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        
        img.src = `${data.baseUrl}${data.prefijo}${i}.png?t=` + new Date().getTime();
        div.appendChild(img);
        
        div.onclick = () => {
            testActual++;
            const siguiente = 'test_a' + testActual;
            if (testData[siguiente]) {
                cargarTest(siguiente);
            } else {
                instruccionDiv.innerText = "Fin de los tests visuales.";
            }
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Le damos un pequeño retraso por si el DOM tarda en cargar
    setTimeout(() => cargarTest('test_a1'), 100);
});
