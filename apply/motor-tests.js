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
    },
    // Agregamos la primera pregunta del Big Five
    "big_five_1": {
        instrucciones: "Big Five: Indica del 1 al 5 qué tan de acuerdo estás.",
        pregunta: "¿Te gusta probar cosas nuevas y diferentes?",
        opciones: [1, 2, 3, 4, 5]
    }
};

let testActual = 1;
// Lista de flujo: primero los visuales, luego los de preguntas
const secuencia = ["test_a1", "test_a2", "big_five_1"];
let indiceSecuencia = 0;

function cargarTest(idTest) {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    let instruccionDiv = document.getElementById('instrucciones-box');
    
    if (!instruccionDiv) {
        instruccionDiv = document.createElement('div');
        instruccionDiv.id = 'instrucciones-box';
        grid.parentNode.insertBefore(instruccionDiv, mainImg);
    }

    const data = testData[idTest];
    if (!data) return;

    instruccionDiv.innerText = data.instrucciones;
    
    // Si es un test visual, cargamos imágenes
    if (data.imgPrincipal) {
        mainImg.style.display = "block";
        mainImg.src = data.imgPrincipal + "?t=" + new Date().getTime();
        grid.innerHTML = '';
        for (let i = 1; i <= data.opciones; i++) {
            const div = document.createElement('div');
            div.className = 'option-box';
            const img = document.createElement('img');
            img.src = `${data.baseUrl}${data.prefijo}${i}.png?t=` + new Date().getTime();
            div.appendChild(img);
            div.onclick = () => avanzar();
            grid.appendChild(div);
        }
    } else {
        // Si es una pregunta (Big Five), ocultamos la imagen principal y ponemos botones
        mainImg.style.display = "none";
        grid.innerHTML = `<p style="margin-bottom:20px; font-weight:bold;">${data.pregunta}</p>`;
        data.opciones.forEach(op => {
            const btn = document.createElement('button');
            btn.innerText = op;
            btn.style.margin = "5px";
            btn.onclick = () => avanzar();
            grid.appendChild(btn);
        });
    }
}

function avanzar() {
    indiceSecuencia++;
    if (indiceSecuencia < secuencia.length) {
        cargarTest(secuencia[indiceSecuencia]);
    } else {
        alert("Evaluación completada.");
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest(secuencia[0]));
