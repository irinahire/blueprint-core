// motor-tests.js - Versión Final Completa y Unificada

const testData = {
    "test_a1": {
        tipo: "visual",
        instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a1_r",
        opciones: 8
    },
    "test_a2": {
        tipo: "visual",
        instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.",
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a2_r",
        opciones: 8
    },
    "intro_bigfive": {
        tipo: "texto",
        instrucciones: "Evaluación de Perfil y Estilo de Trabajo",
        cuerpo: "Has completado la primera etapa de razonamiento lógico. Ahora, queremos conocer más sobre tu enfoque profesional y cómo te desenvuelves en distintos entornos. No hay respuestas correctas. Tu respuesta más honesta es siempre la más útil."
    },
    "bloque_1": { tipo: "big_five", titulo: "Bloque I: Enfoque y Entorno de Trabajo", preguntas: ["Ante un cambio de prioridades repentino, prefiero terminar lo que empecé antes de ajustar el plan.", "Cuando surge un problema inesperado, mi primera reacción es analizar el origen antes de actuar.", "Suelo desconectar completamente del trabajo al terminar la jornada, sin pensar en temas pendientes.", "En momentos de alta presión, me resulta más fácil tomar decisiones solo que consultar a todo el equipo.", "Prefiero entornos de trabajo predecibles donde sé exactamente qué esperar de cada día."] },
    "bloque_2": { tipo: "big_five", titulo: "Bloque II: Extraversión", preguntas: ["Prefiero resolver problemas complejos trabajando solo que debatiéndolo en reuniones.", "En una presentación, me siento más cómodo exponiendo datos duros que tratando de persuadir con historias.", "Disfruto más del trabajo cuando puedo colaborar activamente con otros que cuando tengo metas independientes.", "Suelo tomar la iniciativa para romper el hielo en grupos de trabajo nuevos.", "Siento que mi energía aumenta después de una jornada intensa de reuniones y trabajo en equipo."] },
    "bloque_3": { tipo: "big_five", titulo: "Bloque III: Apertura", preguntas: ["Prefiero utilizar herramientas o procesos probados antes que experimentar con software nuevo.", "Me resulta más estimulante abordar proyectos que requieren aprender algo nuevo que proyectos donde ya soy experto.", "Suelo cuestionar el 'por qué' de las reglas establecidas en el trabajo si creo que dificultan la eficiencia.", "Me siento cómodo trabajando en proyectos donde no hay un manual de instrucciones claro.", "Busco integrar nuevas tendencias o tecnologías en mi flujo de trabajo habitual."] },
    "bloque_4": { tipo: "big_five", titulo: "Bloque IV: Amabilidad", preguntas: ["Para lograr un objetivo importante, creo que es aceptable ser directo y firme, incluso si alguien se siente un poco molesto.", "Prefiero ceder en una idea propia si veo que el equipo está muy convencido de otra, para mantener el consenso.", "Suelo notar si un colega está desmotivado antes de que él mismo lo exprese.", "Valoro más la honestidad absoluta en el feedback que mantener la cortesía.", "Considero que el éxito personal es irrelevante si no contribuye al éxito del equipo completo."] },
    "bloque_5": { tipo: "big_five", titulo: "Bloque V: Responsabilidad", preguntas: ["Prefiero tener un plan de trabajo detallado semana a semana que tener libertad total para decidir mis tareas diarias.", "Si encuentro un atajo que ahorra tiempo pero ignora un paso del proceso oficial, suelo tomarlo.", "Suelo revisar mi trabajo varias veces antes de entregarlo, aunque eso signifique ir al límite del tiempo.", "Me resulta difícil dejar un proyecto a medias, incluso si sé que es poco rentable a largo plazo.", "Me siento más cómodo entregando resultados rápidos aunque tengan detalles pendientes, que esperando a la perfección."] },
    "intro_situacional": {
        tipo: "texto",
        instrucciones: "Etapa Final: Evaluación Situacional",
        cuerpo: "Has llegado a la etapa final. Aquí analizaremos cómo resuelves desafíos concretos en entornos profesionales. Estás muy cerca de completar tu evaluación."
    }
};

const secuencia = ["test_a1", "test_a2", "intro_bigfive", "bloque_1", "bloque_2", "bloque_3", "bloque_4", "bloque_5", "intro_situacional"];
let indiceSecuencia = 0;
let respuestas = {};

function actualizarBarraProgreso(idTest) {
    let barraContainer = document.getElementById('barra-progreso');
    if (!barraContainer) {
        barraContainer = document.createElement('div');
        barraContainer.id = 'barra-progreso';
        barraContainer.style = "display: flex; gap: 5px; margin: 10px 0; width: 100%; height: 5px;";
        document.querySelector('.header-wrapper').appendChild(barraContainer);
    }
    const match = idTest.match(/bloque_(\d)/);
    const numBloque = match ? parseInt(match[1]) : 0;
    barraContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const bar = document.createElement('div');
        bar.style = "flex: 1; height: 100%; border-radius: 2px;";
        if (i < numBloque) bar.style.backgroundColor = "#8EE4D5";
        else if (i === numBloque) bar.style.backgroundColor = "#B588C0";
        else bar.style.backgroundColor = "#e0e0e0";
        barraContainer.appendChild(bar);
    }
}

function cargarTest(idTest) {
    const data = testData[idTest];
    const grid = document.getElementById('options-grid');
    const mainImg = document.getElementById('main-test-image');
    const scrollContainer = document.querySelector('.scroll-area');

    if (idTest.includes('bloque_')) actualizarBarraProgreso(idTest);
    else { const b = document.getElementById('barra-progreso'); if(b) b.remove(); }

    grid.style.display = 'block';
    grid.innerHTML = '';

    if (data.tipo === "visual") {
        mainImg.style.display = "block";
        mainImg.src = data.imgPrincipal;
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        for (let i = 1; i <= data.opciones; i++) {
            const div = document.createElement('div');
            div.className = 'option-box';
            div.innerHTML = `<img src="${data.baseUrl}${data.prefijo}${i}.png">`;
            div.onclick = () => avanzar();
            grid.appendChild(div);
        }
    } else if (data.tipo === "texto") {
        mainImg.style.display = "none";
        grid.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <h2 style="margin-bottom:20px;">${data.instrucciones}</h2>
                <p style="margin:20px 0; font-size: 1.1rem;">${data.cuerpo}</p>
                <button onclick="avanzar()" style="padding:10px 30px; cursor:pointer; background:#B588C0; color:white; border:none; border-radius:4px;">INICIAR</button>
            </div>`;
    } else if (data.tipo === "big_five") {
        mainImg.style.display = "none";
        grid.innerHTML = `<h2 style="margin-bottom:25px; color:#B588C0;">${data.titulo}</h2>`;
        data.preguntas.forEach((pregunta, idx) => {
            const pDiv = document.createElement('div');
            pDiv.style.marginBottom = "25px";
            pDiv.style.borderBottom = "1px solid #eee";
            pDiv.style.paddingBottom = "15px";
            pDiv.innerHTML = `<p style="margin-bottom:10px; font-weight:600;">${idx + 1}. ${pregunta}</p>`;
            const optDiv = document.createElement('div');
            for(let i=1; i<=5; i++) {
                optDiv.innerHTML += `<label style="margin-right:20px; cursor:pointer;"><input type="radio" name="p${idx}" value="${i}"> ${i}</label>`;
            }
            pDiv.appendChild(optDiv);
            grid.appendChild(pDiv);
        });
        grid.innerHTML += `
            <div style="margin-top:20px;">
                <button id="btn-avanzar" style="padding:10px 25px; cursor:pointer; background:#B588C0; color:white; border:none; border-radius:4px;">${idTest === 'bloque_5' ? 'FINALIZAR' : 'AVANZAR'}</button>
                <p id="err" style="color:red; display:none; margin-top:10px;">Por favor, completa todas las preguntas del bloque.</p>
            </div>`;
        document.getElementById('btn-avanzar').onclick = () => {
            let todas = true;
            for(let i=0; i<5; i++) { if(!document.querySelector(`input[name="p${i}"]:checked`)) todas = false; }
            if(todas) {
                for(let i=0; i<5; i++) respuestas[`${idTest}_${i}`] = document.querySelector(`input[name="p${i}"]:checked`).value;
                avanzar();
            } else { document.getElementById('err').style.display = "block"; }
        };
    }
    setTimeout(() => { if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
}

function avanzar() {
    indiceSecuencia++;
    if (indiceSecuencia < secuencia.length) cargarTest(secuencia[indiceSecuencia]);
}

document.addEventListener('DOMContentLoaded', () => cargarTest(secuencia[0]));
