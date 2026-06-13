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

// Variable para controlar el flujo
let testActual = 1;

function cargarTest(idTest) {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    let instruccionDiv = document.getElementById('instrucciones-box');

    const data = testData[idTest];
    if (!data) {
        alert("¡Test finalizado! Gracias por participar.");
        return;
    }

    // Actualizar texto y la imagen principal
    instruccionDiv.innerText = data.instrucciones;
    mainImg.src = data.imgPrincipal;
    
    // Limpiar grid y cargar nuevas opciones
    grid.innerHTML = '';
    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        img.src = `${data.baseUrl}${data.prefijo}${i}.png`;
        div.appendChild(img);
        
        div.onclick = () => {
            // Feedback visual
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            
            console.log(`Respuesta guardada: ${idTest} - Opción ${i}`);
            
            // Lógica de transición automática
            testActual++;
            setTimeout(() => {
                cargarTest('test_a' + testActual);
            }, 500); // Pequeña pausa para que se vea la selección antes de cambiar
        };
        grid.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Crear el contenedor de instrucciones si no existe
    const grid = document.getElementById('options-grid');
    const instruccionDiv = document.createElement('div');
    instruccionDiv.id = 'instrucciones-box';
    instruccionDiv.style.marginBottom = "15px";
    instruccionDiv.style.textAlign = "center";
    instruccionDiv.style.color = "#444";
    instruccionDiv.style.fontWeight = "600";
    grid.parentNode.insertBefore(instruccionDiv, document.getElementById('main-test-image'));

    // Iniciar con el primer test
    cargarTest('test_a1');
});
