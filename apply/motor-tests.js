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
    let instruccionDiv = document.getElementById('instrucciones-box');
    
    // Crear contenedor si no existe (robusto)
    if (!instruccionDiv) {
        instruccionDiv = document.createElement('div');
        instruccionDiv.id = 'instrucciones-box';
        grid.parentNode.insertBefore(instruccionDiv, mainImg);
    }

    const data = testData[idTest];
    if (!data) return;

    instruccionDiv.innerText = data.instrucciones;
    
    // AQUÍ EL TRUCO: Agregamos ?t=Date.now() para romper la caché
    mainImg.src = data.imgPrincipal + "?t=" + new Date().getTime();

    grid.innerHTML = '';
    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        
        // AQUÍ EL MISMO TRUCO para las opciones
        img.src = `${data.baseUrl}${data.prefijo}${i}.png?t=` + new Date().getTime();
        
        div.appendChild(img);
        div.onclick = () => {
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            
            testActual++;
            setTimeout(() => cargarTest('test_a' + testActual), 500);
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest('test_a1'));
