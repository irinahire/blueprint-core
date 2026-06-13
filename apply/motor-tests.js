// motor-tests.js

const testData = {
    "test_a1": {
        type: "visual",
        instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a1_r",
        opciones: 8
    },
    "test_a2": {
        type: "visual",
        instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a2_r",
        opciones: 8
    },
    // Preguntas Big Five (declaradas una por una para que no falle el bucle)
    "big_five_1": { type: "pregunta", instrucciones: "Big Five: Indica qué tan de acuerdo estás (1 al 5).", pregunta: "¿Te gusta probar cosas nuevas?", opciones: [1, 2, 3, 4, 5] },
    "big_five_2": { type: "pregunta", instrucciones: "Big Five: Indica qué tan de acuerdo estás (1 al 5).", pregunta: "¿Tienes una imaginación activa?", opciones: [1, 2, 3, 4, 5] }
    // ... podés seguir agregando "big_five_3", etc. aquí abajo siguiendo el mismo formato
};

// La lista de todos los pasos que debe seguir el usuario
const secuenciaDeTests = ["test_a1", "test_a2", "big_five_1", "big_five_2"];
let indiceActual = 0;

function cargarTest(idTest) {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    const instruccionDiv = document.getElementById('instrucciones-box');
    const data = testData[idTest];

    if (!data) return;

    // Actualizar instrucciones (se mantienen igual para ambos tipos)
    instruccionDiv.innerText = data.instrucciones;
    grid.innerHTML = '';

    if (data.type === "visual") {
        // --- LOGICA QUE YA FUNCIONABA BIEN ---
        mainImg.style.display = "block";
        mainImg.src = data.imgPrincipal + "?t=" + new Date().getTime();

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
        // --- LOGICA PARA PREGUNTAS ---
        mainImg.style.display = "none";
        const p = document.createElement('p');
        p.innerText = data.pregunta;
        p.style.marginBottom = "20px";
        grid.appendChild(p);

        data.opciones.forEach(val => {
            const btn = document.createElement('button');
            btn.innerText = val;
            btn.style.margin = "10px";
            btn.style.padding = "10px 20px";
            btn.onclick = () => avanzar();
            grid.appendChild(btn);
        });
    }
}

function avanzar() {
    indiceActual++;
    if (indiceActual < secuenciaDeTests.length) {
        cargarTest(secuenciaDeTests[indiceActual]);
    } else {
        alert("¡Test finalizado!");
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest(secuenciaDeTests[0]));
