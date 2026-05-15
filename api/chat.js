export default async function handler(req, res) {
    // 1. Configuración de CORS para evitar bloqueos
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

    try {
        const { text } = req.body;
        if (!text) throw new Error("No se recibió texto");

        // 2. Gemini - Generar respuesta
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Eres Irina, reclutadora de Blue Lab. Responde breve: ${text}` }] }]
            })
        });
        
        const geminiData = await geminiRes.json();
        const aiText = geminiData.candidates[0].content.parts[0].text;

        // 3. Deepgram - Convertir a voz
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

        return res.status(200).json({
            texto: aiText,
            audio: `data:audio/mp3;base64,${base64Audio}`
        });

    } catch (e) {
        console.error("Error detallado:", e.message);
        return res.status(500).json({ error: e.message });
    }
}
