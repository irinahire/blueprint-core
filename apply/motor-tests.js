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
    
    // Intentar buscar las instrucciones, si no existe, lo creamos solo en memoria para que no tire error
    let instruccionDiv = document.getElementById('instrucciones-box');
    if (!instruccionDiv) {
        instruccionDiv = document.createElement('div');
        instruccionDiv.id = 'instrucciones-box';
        grid.parentNode.insertBefore(instruccionDiv, mainImg);
    }

    const data = testData[idTest];
    
    // Si no hay más datos, detenemos el proceso
    if (!data) return;

    // Actualizar el DOM de forma segura
    instruccionDiv.innerText = data.instrucciones;
    mainImg.src = data.imgPrincipal;

    grid.innerHTML = '';
    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        
        // Cargamos la imagen
        img.src = `${data.baseUrl}${data.prefijo}${i}.png`;
        div.appendChild(img);
        
        div.onclick = () => {
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            
            testActual++;
            // Esperamos un poco antes de cargar el siguiente para que se vea el feedback
            setTimeout(() => cargarTest('test_a' + testActual), 500);
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest('test_a1'));
