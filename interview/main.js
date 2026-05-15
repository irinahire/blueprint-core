let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                // Enviamos el audio o texto procesado a nuestra API
                hablarConIrina(base64Audio);
            };
            audioChunks = [];
        };

        mediaRecorder.start();
        document.getElementById('status').innerText = "Escuchando...";
    } catch (err) {
        console.error("Error acceso micro:", err);
    }
}

async function hablarConIrina(entrada) {
    try {
        document.getElementById('status').innerText = "Irina pensando...";
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: entrada })
        });

        const data = await response.json();
        if (data.audio) {
            const audio = new Audio(data.audio);
            audio.play();
            document.getElementById('irina-text').innerText = data.texto;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar al cargar
window.onload = () => {
    hablarConIrina("INICIO_AUTOMATICO");
};
