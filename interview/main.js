// /interview/main.js

let recognition;
let isRecording = false;

// 1. Inicialización del reconocimiento de voz
function initRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-AR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('status').innerText = "IRINA TE ESCUCHA...";
            document.getElementById('btn-mic').innerText = "DETENER";
        };

        recognition.onresult = (event) => {
            const textoEscuchado = event.results[0][0].transcript;
            console.log("Usuario dijo:", textoEscuchado);
            hablarConIrina(textoEscuchado);
        };

        recognition.onerror = (event) => {
            console.error("Error de audio:", event.error);
            document.getElementById('status').innerText = "ERROR DE MICRÓFONO";
            isRecording = false;
        };

        recognition.onend = () => {
            isRecording = false;
            document.getElementById('btn-mic').innerText = "HABLAR CON IRINA";
        };
    } else {
        console.error("Navegador no soporta WebSpeech API");
    }
}

// 2. Función que se dispara al hacer clic en el botón
async function toggleRecording() {
    // Si no se inicializó el reconocimiento, lo hacemos ahora
    if (!recognition) initRecognition();

    if (!recognition) {
        alert("Tu navegador no es compatible con el reconocimiento de voz. Usá Chrome o Edge.");
        return;
    }

    try {
        if (!isRecording) {
            // Solicitud explícita de permiso al usuario
            await navigator.mediaDevices.getUserMedia({ audio: true });
            recognition.start();
            isRecording = true;
        } else {
            recognition.stop();
            isRecording = false;
        }
    } catch (err) {
        console.error("Permiso de micrófono denegado:", err);
        alert("Debes permitir el acceso al micrófono para interactuar con Irina.");
    }
}

// 3. Envío de texto al servidor y reproducción de respuesta
async function hablarConIrina(textoUsuario) {
    const status = document.getElementById('status');
    const display = document.getElementById('irina-text');
    
    status.innerText = "IRINA PENSANDO...";
    
    try {
        // IMPORTANTE: Aseguramos que apunte a la ruta correcta de la API en Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textoUsuario })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fallo en la respuesta del servidor");
        }

        const data = await response.json();
        
        // Actualizamos el texto en la burbuja de Irina
        display.innerText = data.texto;
        
        // Si el servidor devolvió audio, lo reproducimos
        if (data.audio) {
            const audio = new Audio(data.audio);
            status.innerText = "IRINA HABLANDO";
            audio.play();
            audio.onended = () => {
                status.innerText = "SISTEMA LISTO";
            };
        }

    } catch (error) {
        console.error("Error detallado en la comunicación:", error);
        display.innerText = "Hubo un problema al conectar con el servidor.";
        status.innerText = "ERROR DE CONEXIÓN";
        
        // Reset automático para poder reintentar
        setTimeout(() => {
            status.innerText = "SISTEMA LISTO";
        }, 3000);
    }
}

// 4. Configuración inicial al cargar la página
window.onload = () => {
    document.getElementById('status').innerText = "SISTEMA LISTO";
    document.getElementById('irina-text').innerText = "Haz clic en el botón para comenzar la entrevista.";
    initRecognition();
};
