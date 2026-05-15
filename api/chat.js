// /api/chat.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async (req, res) => {
    // 1. Headers de CORS para que el navegador no bloquee nada
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Manejo de pre-vuelo de CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo aceptamos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido. Usa POST." });
    }

    const { text } = req.body;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

    try {
        if (!text) throw new Error("No hay texto para procesar");

        // 2. Gemini - Respuesta de IA
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Eres Irina, reclutadora de Blue Lab. Sé muy breve: ${text}` }] }]
            })
        });

        const geminiData = await geminiRes.json();
        if (!geminiData.candidates) throw new Error("Error en Gemini: " + JSON.stringify(geminiData));
        
        const aiText = geminiData.candidates[0].content.parts[0].text;

        // 3. Deepgram - Voz de Antonia
        const ttsRes = await fetch("https://api.deepgram.com/v1/speak?model=aura-2-antonia-es", {
            method: "POST",
            headers: { 
                "Authorization": `Token ${DEEPGRAM_API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ text: aiText })
        });

        if (!ttsRes.ok) throw new Error("Fallo en Deepgram");

        const audioBuffer = await ttsRes.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        // 4. Respuesta Final
        return res.status(200).json({
            texto: aiText,
            audio: `data:audio/mp3;base64,${base64Audio}`
        });

    } catch (e) {
        console.error("Error servidor:", e.message);
        return res.status(500).json({ error: e.message });
    }
};
