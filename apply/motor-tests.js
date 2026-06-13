// motor-tests.js

// CONFIGURACIÓN CENTRALIZADA (Acá agregás todos tus tests)
const testData = {
    "test_a1": {
        instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a1_r",
        opciones: 8
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    
    // Contenedor de instrucciones (lo creamos dinámicamente)
    let instruccionDiv = document.getElementById('instrucciones-box');
    if (!instruccionDiv) {
        instruccionDiv = document.createElement('div');
        instruccionDiv.id = 'instrucciones-box';
        instruccionDiv.style.marginBottom = "15px";
        instruccionDiv.style.textAlign = "center";
        instruccionDiv.style.color = "#444";
        instruccionDiv.style.fontWeight = "600";
        grid.parentNode.insertBefore(instruccionDiv, mainImg);
    }

    // Inicializar el test
    const currentTest = testData["test_a1"];
    
    // Cargar texto y imagen
    instruccionDiv.innerText = currentTest.instrucciones;
    mainImg.src = currentTest.imgPrincipal;
    
    // Cargar opciones
    grid.innerHTML = '';
    for (let i = 1; i <= currentTest.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        const img = document.createElement('img');
        img.src = `${currentTest.baseUrl}${currentTest.prefijo}${i}.png`;
        div.appendChild(img);
        
        div.onclick = () => {
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            console.log("Respuesta seleccionada: " + i);
        };
        grid.appendChild(div);
    }
});
