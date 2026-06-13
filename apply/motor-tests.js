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

    const data = testData[idTest];
    if (!data) return;

    instruccionDiv.innerText = data.instrucciones;
    
    // Asignar imagen principal y verificar si carga
    mainImg.onerror = () => console.error("Error cargando imagen principal: " + data.imgPrincipal);
    mainImg.src = data.imgPrincipal;

    grid.innerHTML = '';
    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        
        const urlImagen = `${data.baseUrl}${data.prefijo}${i}.png`;
        img.src = urlImagen;
        img.onerror = () => console.error("Error cargando opción: " + urlImagen);
        
        div.appendChild(img);
        div.onclick = () => {
            testActual++;
            setTimeout(() => cargarTest('test_a' + testActual), 300);
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest('test_a1'));
