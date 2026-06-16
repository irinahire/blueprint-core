// motor-tests.js - Versión Final Robusta (Texto Completo y Redirección Integrada)

const testData = {
    // --- ETAPA 1: LÓGICA VISUAL ---
    "test_a1": { tipo: "visual", instrucciones: "Observa la secuencia lógica y selecciona la opción que completa el patrón correctamente.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a1_r", opciones: 8 },
    "test_a2": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a2_r", opciones: 8 },
    "test_a3": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a3.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a3_r", opciones: 8 },
    "test_a4": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a4.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a4_r", opciones: 8 },
    "test_a5": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a5.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a5_r", opciones: 8 },
    "test_a6": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a6.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a6_r", opciones: 8 },
    "test_a7": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a7.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a7_r", opciones: 8 },
    "test_a8": { tipo: "visual", instrucciones: "Analiza el siguiente patrón y selecciona la pieza faltante.", imgPrincipal: "https://www.bluelab.online/apply/img/test_a8.png", baseUrl: "https://www.bluelab.online/apply/img/", prefijo: "test_a8_r", opciones: 8 },
    
    // --- ETAPA 2: PERSONALIDAD ---
    "intro_bigfive": { tipo: "texto", instrucciones: "Evaluación de Perfil y Estilo de Trabajo", cuerpo: "Has completado la primera etapa de razonamiento lógico. Ahora, queremos conocer más sobre tu enfoque profesional y cómo te desenvuelves en distintos entornos.<br><br><b>Ten en cuenta:</b><br>• No hay respuestas correctas. Tu respuesta más honesta es siempre la más útil.<br>• Sé espontáneo/a: no dediques demasiado tiempo a cada pregunta.<br>• Describe cómo actúas generalmente en un entorno profesional.", textoBoton: "INICIAR SEGUNDO TEST" },
    "bloque_1": { tipo: "big_five", titulo: "Bloque I: Enfoque y Entorno de Trabajo", preguntas: ["Ante un cambio de prioridades repentino, prefiero terminar lo que empecé antes de ajustar el plan.", "Cuando surge un problema inesperado, mi primera reacción es analizar el origen antes de actuar.", "Suelo desconectar completamente del trabajo al terminar la jornada, sin pensar en temas pendientes.", "En momentos de alta presión, me resulta más fácil tomar decisiones solo que consultar a todo el equipo.", "Prefiero entornos de trabajo predecibles donde sé exactamente qué esperar de cada día."] },
    "bloque_2": { tipo: "big_five", titulo: "Bloque II: Extraversión", preguntas: ["Prefiero resolver problemas complejos trabajando solo que debatiéndolo en reuniones.", "En una presentación, me siento más cómodo exponiendo datos duros que tratando de persuadir con historias.", "Disfruto más del trabajo cuando puedo colaborar activamente con otros que cuando tengo metas independientes.", "Suelo tomar la iniciativa para romper el hielo en grupos de trabajo nuevos.", "Siento que mi energía aumenta después de una jornada intensa de reuniones y trabajo en equipo."] },
    "bloque_3": { tipo: "big_five", titulo: "Bloque III: Apertura", preguntas: ["Prefiero utilizar herramientas o procesos probados antes que experimentar con software nuevo.", "Me resulta más estimulante abordar proyectos que requieren aprender algo nuevo que proyectos donde ya soy experto.", "Suelo cuestionar el 'por qué' de las reglas establecidas en el trabajo si creo que dificultan la eficiencia.", "Me siento cómodo trabajando en proyectos donde no hay un manual de instrucciones claro.", "Busco integrar nuevas tendencias o tecnologías en mi flujo de trabajo habitual."] },
    "bloque_4": { tipo: "big_five", titulo: "Bloque IV: Amabilidad", preguntas: ["Para lograr un objetivo importante, creo que es aceptable ser directo y firme, incluso si alguien se siente un poco molesto.", "Prefiero ceder en una idea propia si veo que el equipo está muy convencido de otra, para mantener el consenso.", "Suelo notar si un colega está desmotivado antes de que él mismo lo exprese.", "Valoro más la honestidad absoluta en el feedback que mantener la cortesía.", "Considero que el éxito personal es irrelevante si no contribuye al éxito del equipo completo."] },
    "bloque_5": { tipo: "big_five", titulo: "Bloque V: Responsabilidad", preguntas: ["Prefiero tener un plan de trabajo detallado semana a semana que tener libertad total para decidir mis tareas diarias.", "Si encuentro un atajo que ahorra tiempo pero ignora un paso del proceso oficial, suelo tomarlo.", "Suelo revisar mi trabajo varias veces antes de entregarlo, aunque eso signifique ir al límite del tiempo.", "Me resulta difícil dejar un proyecto a medias, incluso si sé que es poco rentable a largo plazo.", "Me siento más cómodo entregando resultados rápidos aunque tengan detalles pendientes, que esperando a la perfección."] },
    
    // --- ETAPA 3: SITUACIONAL (TEXTOS COMPLETOS) ---
    "intro_situacional": { tipo: "texto", instrucciones: "Etapa Final: Evaluación Situacional", cuerpo: "Has llegado a la etapa final. Analizaremos cómo resuelves desafíos concretos en entornos profesionales. Debes seleccionar la opción que mejor represente tu criterio profesional.", textoBoton: "INICIAR EVALUACIÓN" },
    "sit_1": { tipo: "situacional", titulo: "Situación 1: El límite del cliente", pregunta: "Un cliente te pide algo fuera de las normas, pero es muy fiel.", opciones: [{id:"A", texto:"Accedes a regañadientes para no perder la lealtad."}, {id:"B", texto:"Explicas las normas con mucha firmeza, priorizando la equidad."}, {id:"C", texto:"Buscas una solución creativa que cumpla la norma pero satisfaga su necesidad."}, {id:"D", texto:"Escalás el problema a tu jefe para no tomar la decisión tú."}] },
    "sit_2": { tipo: "situacional", titulo: "Situación 2: El error del equipo", pregunta: "Tu equipo entregó un proyecto con errores y tu jefe te pide cuentas.", opciones: [{id:"A", texto:"Asumes la responsabilidad total como líder."}, {id:"B", texto:"Señalas específicamente quién cometió el error."}, {id:"C", texto:"Dices que hubo un malentendido general."}, {id:"D", texto:"Te enfocas en cómo solucionar el error antes de explicar qué pasó."}] },
    "sit_3": { tipo: "situacional", titulo: "Situación 3: La idea ignorada", pregunta: "Tienes una idea brillante en una reunión, pero nadie te escucha.", opciones: [{id:"A", texto:"Insistes hasta que te presten atención."}, {id:"B", texto:"Te callas y esperas a que termine la reunión para hablar con alguien en privado."}, {id:"C", texto:"Dejas pasar la idea, quizás no era tan buena."}, {id:"D", texto:"Observas quién tiene más poder y tratas de convencerlo primero."}] },
    "sit_4": { tipo: "situacional", titulo: "Situación 4: El exceso de trabajo", pregunta: "Te asignan una tarea para la que no tienes tiempo.", opciones: [{id:"A", texto:"La aceptas y trabajas horas extra sin decir nada."}, {id:"B", texto:"Negocias plazos o recursos antes de aceptar."}, {id:"C", texto:"Haces lo que puedes y entregas el resto después."}, {id:"D", texto:"Dices claramente que no puedes hacerlo y sugieres a otro."}] },
    "sit_5": { tipo: "situacional", titulo: "Situación 5: El compañero tóxico", pregunta: "Un compañero critica constantemente a la empresa.", opciones: [{id:"A", texto:"Te unes a la charla para generar confianza."}, {id:"B", texto:"Ignoras sus comentarios y sigues trabajando."}, {id:"C", texto:"Lo confrontas y le pides que deje de quejarse."}, {id:"D", texto:"Intentas entender por qué está tan desmotivado."}] },
    "sit_6": { tipo: "situacional", titulo: "Situación 6: El cambio repentino", pregunta: "El proyecto cambió de rumbo radicalmente a mitad de camino.", opciones: [{id:"A", texto:"Te frustras porque se perdió trabajo previo."}, {id:"B", texto:"Te entusiasma el nuevo desafío."}, {id:"C", texto:"Analizas fríamente qué partes del trabajo anterior se pueden salvar."}, {id:"D", texto:"Esperas a que otros definan qué hacer."}] },
    "sit_7": { tipo: "situacional", titulo: "Situación 7: La presión del tiempo", pregunta: "Tienes que elegir entre entregar rápido y mediocre o lento y excelente.", opciones: [{id:"A", texto:"Rápido y mediocre; mejor hecho que perfecto."}, {id:"B", texto:"Lento y excelente; la calidad es innegociable."}, {id:"C", texto:"Intentas hacer un esfuerzo inhumano para que sea rápido y excelente."}, {id:"D", texto:"Preguntas al cliente qué prefiere."}] },
    "sit_8": { tipo: "situacional", titulo: "Situación 8: El feedback negativo", pregunta: "Tu jefe te da una crítica dura.", opciones: [{id:"A", texto:"Te justificas explicando tu versión."}, {id:"B", texto:"Escuchas, agradeces y anotas."}, {id:"C", texto:"Te desmotivas durante el resto del día."}, {id:"D", texto:"Consideras que tu jefe no tiene razón y no haces caso."}] },
    "sit_9": { tipo: "situacional", titulo: "Situación 9: La competencia interna", pregunta: "Buscas un ascenso pero compites contra un amigo.", opciones: [{id:"A", texto:"Trabajas el doble para ganar limpiamente."}, {id:"B", texto:"Te retiras si ves que él tiene más chances."}, {id:"C", texto:"Hablas con él para definir cómo repartir el trabajo."}, {id:"D", texto:"Te enfocas en destacar tus logros sin mirar al otro."}] },
    "sit_10": { tipo: "situacional", titulo: "Situación 10: La decisión ética", pregunta: "Te piden ocultar una pequeña falla para no alarmar al cliente.", opciones: [{id:"A", texto:"Lo ocultas para proteger la imagen de la empresa."}, {id:"B", texto:"Dices la verdad a medias."}, {id:"C", texto:"Informas del error y propones la solución."}, {id:"D", texto:"Te niegas rotundamente y pides que lo diga otro."}] }
};

const secuencia = ["test_a1", "test_a2", "test_a3", "test_a4", "test_a5", "test_a6", "test_a7", "test_a8", "intro_bigfive", "bloque_1", "bloque_2", "bloque_3", "bloque_4", "bloque_5", "intro_situacional", "sit_1", "sit_2", "sit_3", "sit_4", "sit_5", "sit_6", "sit_7", "sit_8", "sit_9", "sit_10"];
let indiceSecuencia = 0;
let respuestas = {};

function actualizarBarraProgreso(idTest) {
    let contenedor = document.getElementById('contenedor-progreso');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedor-progreso';
        contenedor.style = "width: 100%; display: flex; gap: 4px; margin-bottom: 25px; padding: 0 10px;";
        document.getElementById('options-grid').prepend(contenedor);
    }
    
    let total = 0, actual = 0;
    if (idTest.startsWith('bloque_')) { total = 5; actual = parseInt(idTest.split('_')[1]); }
    else if (idTest.startsWith('sit_')) { total = 10; actual = parseInt(idTest.split('_')[1]); }
    else return;

    contenedor.innerHTML = '';
    for (let i = 1; i <= total; i++) {
        const item = document.createElement('div');
        item.style = `flex: 1; height: 8px; border-radius: 4px; background-color: ${i < actual ? '#8EE4D5' : (i === actual ? '#B588C0' : '#e0e0e0')};`;
        contenedor.appendChild(item);
    }
}

function cargarTest(idTest) {
    const data = testData[idTest];
    const grid = document.getElementById('options-grid');
    const mainImg = document.getElementById('main-test-image');
    grid.style.display = 'block';
    grid.innerHTML = '';
    
    if (idTest.startsWith('bloque_') || idTest.startsWith('sit_')) actualizarBarraProgreso(idTest);
    
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
        grid.innerHTML = `<div style="max-width:600px; margin:40px auto; padding:40px; background:#fff; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.05); text-align:center;">
            <h2 style="color:#4A4A4A; margin-bottom:20px;">${data.instrucciones}</h2>
            <p style="text-align:left; color:#666; line-height:1.6; font-size:1.1rem;">${data.cuerpo}</p>
            <button onclick="avanzar()" style="margin-top:30px; padding:15px 40px; cursor:pointer; background:linear-gradient(90deg, #8EE4D5, #B588C0); color:white; border:none; border-radius:30px; font-weight:700;">${data.textoBoton}</button>
        </div>`;
    } else if (data.tipo === "big_five") {
        mainImg.style.display = "none";
        grid.innerHTML += `<h2 style="margin-bottom:20px; color:#B588C0;">${data.titulo}</h2>`;
        data.preguntas.forEach((p, i) => {
            const d = document.createElement('div');
            d.style = "margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;";
            d.innerHTML = `<p style="font-weight:600;">${i+1}. ${p}</p>`;
            for(let j=1; j<=5; j++) d.innerHTML += `<label style="margin-right:20px; cursor:pointer;"><input type="radio" name="p${i}" value="${j}"> ${j}</label>`;
            grid.appendChild(d);
        });
        grid.innerHTML += `<button id="btn-avanzar" style="margin-top:20px; padding:10px 30px; background:#B588C0; color:white; border:none; border-radius:20px; cursor:pointer;">AVANZAR</button>`;
        document.getElementById('btn-avanzar').onclick = () => {
            let ok = true;
            for(let i=0; i<5; i++) if(!document.querySelector(`input[name="p${i}"]:checked`)) ok = false;
            if(ok) avanzar(); else alert("Completa todas las opciones.");
        };
    } else if (data.tipo === "situacional") {
        mainImg.style.display = "none";
        grid.innerHTML = `<div style="max-width:700px; margin:20px auto; text-align:center;">
            <h3 style="color:#B588C0; margin-bottom:10px;">${data.titulo}</h3>
            <p style="font-size:1.3rem; font-weight:600; margin-bottom:30px;">${data.pregunta}</p>
            <div id="opts"></div>
        </div>`;
        data.opciones.forEach(o => {
            const b = document.createElement('button');
            b.style = "display:block; width:100%; padding:20px; margin-bottom:15px; border:2px solid #eee; border-radius:12px; cursor:pointer; background:white; text-align:left; font-size:1.1rem; transition:0.3s;";
            b.innerHTML = `<b>${o.id}</b> - ${o.texto}`;
            b.onmouseover = () => b.style.borderColor = "#8EE4D5";
            b.onmouseout = () => b.style.borderColor = "#eee";
            b.onclick = () => { respuestas[idTest] = o.id; avanzar(); };
            document.getElementById('opts').appendChild(b);
        });
    }
}

function avanzar() {
    indiceSecuencia++;
    if (indiceSecuencia < secuencia.length) cargarTest(secuencia[indiceSecuencia]);
    else {
        const urlParams = new URLSearchParams(window.location.search);
        const applicantId = urlParams.get('applicantId') || 'unknown';
        document.getElementById('options-grid').innerHTML = `<div style="text-align:center; padding:50px;">
            <h2 style="color:#B588C0;">Evaluación Finalizada</h2>
            <p>Has completado todas las etapas. Serás redirigido a tu entrevista con Irina.</p>
        </div>`;
        setTimeout(() => window.location.href = `https://www.bluelab.online/interview?applicantId=${applicantId}`, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest(secuencia[0]));
