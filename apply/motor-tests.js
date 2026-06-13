// motor-tests.js

// 1. Configuración de todos tus tests
const testData = {
    "test_a1": { type: "visual", instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a1_r", opciones: 8 },
    "test_a2": { type: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a2_r", opciones: 8 },
};

// Generador de 20 preguntas Big Five (4 por cada factor)
const bigFiveQuestions = [
    // Apertura a la experiencia
    { p: "¿Te gusta probar cosas nuevas y diferentes?" }, { p: "¿Tienes una imaginación activa?" }, { p: "¿Te interesan las ideas abstractas?" }, { p: "¿Disfrutas de las actividades creativas?" },
    // Responsabilidad
    { p: "¿Sueles terminar tus tareas a tiempo?" }, { p: "¿Eres organizado/a con tus cosas?" }, { p: "¿Planificas tus metas con detalle?" }, { p: "¿Eres muy disciplinado/a en tu trabajo?" },
    // Extraversión
    { p: "¿Te consideras una persona muy sociable?" }, { p: "¿Te sientes cómodo/a siendo el centro de atención?" }, { p: "¿Sueles hablar con desconocidos fácilmente?" }, { p: "¿Prefieres estar acompañado/a que solo/a?" },
    // Amabilidad
    { p: "¿Sueles confiar en los demás?" }, { p: "¿Te importa mucho el bienestar de otros?" }, { p: "¿Eres una persona empática?" }, { p: "¿Evitas los conflictos innecesarios?" },
    // Neuroticismo (Estabilidad Emocional)
    { p: "¿Sueles preocuparte por cosas triviales?" }, { p: "¿Te estresas fácilmente con los cambios?" }, { p: "¿Cambias de humor con frecuencia?" }, { p: "¿Te sientes nervioso/a ante situaciones nuevas?" }
];

// Automatizamos la carga de las 20 preguntas en el objeto testData
bigFiveQuestions.forEach((item, index) => {
    testData[`big_five_${index + 1}`] = {
        type: "pregunta",
        instrucciones: "Big Five: Indica qué tan de acuerdo estás (1: Muy en desacuerdo - 5: Muy de acuerdo).",
        pregunta: item.p,
        opciones: [1, 2, 3, 4, 5]
    };
});

// 2. Definimos el orden de todo el flujo
const secuenciaDeTests = ["test_a1", "test_a2", ...Object.keys(testData).filter(k => k.startsWith("big_five_"))];
let indiceActual = 0;

function cargarTest(idTest) {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    const instruccionDiv = document.getElementById('instrucciones-box');
    const data = testData[idTest];

    if (!data) {
        instruccionDiv.innerText = "¡Evaluación finalizada!";
        mainImg.style.display = "none";
        grid.innerHTML = "";
        return;
    }

    instruccionDiv.innerText = data.instrucciones;
    grid.innerHTML = '';

    if (data.type === "visual") {
        mainImg.style.display = "block";
        mainImg.src = data.imgPrincipal + "?t=" + new Date().getTime();
        for (let i = 1; i <= data.opciones; i++) {
            const div = document.createElement('div');
            div.className = 'option-box';
            const img = document.createElement('img');
            img.src = `${data.baseUrl}${data.prefijo}${i}.png?t=` + new Date().getTime();
            div.appendChild(img);
            div.onclick = () => avanzar(div);
            grid.appendChild(div);
        }
    } else {
        mainImg.style.display = "none";
        const p = document.createElement('p');
        p.innerText = data.pregunta;
        p.style.marginBottom = "20px";
        p.style.fontSize = "1.2rem";
        grid.appendChild(p);
        data.opciones.forEach(val => {
            const btn = document.createElement('button');
            btn.innerText = val;
            btn.style.margin = "5px";
            btn.style.padding = "10px 15px";
            btn.onclick = () => avanzar(btn);
            grid.appendChild(btn);
        });
    }
}

function avanzar(elemento) {
    elemento.style.opacity = "0.5";
    setTimeout(() => {
        indiceActual++;
        if (indiceActual < secuenciaDeTests.length) {
            cargarTest(secuenciaDeTests[indiceActual]);
        } else {
            alert("¡Proceso finalizado! Gracias por tu tiempo.");
        }
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => cargarTest(secuenciaDeTests[0]));
