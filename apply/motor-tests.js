// motor-tests.js

// Definición fija de los datos, sin lógica compleja
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

    const data = testData[idTest];
    
    // Si no encuentra el test, corta el flujo aquí
    if (!data) return;

    // Lógica básica que ya te funcionaba
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
            // Esto es lo que hacía avanzar el test
            testActual++;
            const siguiente = 'test_a' + testActual;
            
            if (testData[siguiente]) {
                cargarTest(siguiente);
            } else {
                alert("Fin de los tests visuales");
            }
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest('test_a1'));
