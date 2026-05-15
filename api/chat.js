export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    // Vercel lee automáticamente las llaves que guardaste recién
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

    try {
        const { text } = req.body;
        const userPrompt = text === "INICIO_AUTOMATICO" 
            ? "Saludá a Walter brevemente y decile que estás lista." 
            : text;

        // Llamada a Gemini
        const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Sos Irina de Blue Lab. Sé breve. Máximo 15 palabras. Usuario dice: ${userPrompt}` }] }]
            })
        });

        const googleData = await googleRes.json();
        const aiText = googleData.candidates[0].content.parts[0].text;

        // Llamada a Deepgram (Voz de Antonia)
        const ttsRes = await fetch("https://api.deepgram.com/v1/speak?model=aura-2-antonia-es", {
            method: "POST",
            headers: {
                "Authorization": `Token ${DEEPGRAM_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: aiText })
        });

        const audioBuffer = await ttsRes.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return res.status(200).json({
            texto: aiText,
            audio: `data:audio/mp3;base64,${base64Audio}`
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
