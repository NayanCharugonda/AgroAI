const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/ai', async (req, res) => {
    try {
        const { message, lang } = req.body;

        const systemPrompt = "You are a smart agriculture assistant for Indian farmers. Give short, practical advice.";

        // Connect to Ollama endpoint
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "phi3",
                prompt: `Language preference: ${lang || 'en'}. Query: ${message}`,
                system: systemPrompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API returned status: ${response.status}`);
        }

        const data = await response.json();

        res.json({ reply: data.response });

    } catch (error) {
        console.error("Error communicating with Ollama:", error);
        res.status(500).json({ reply: "Sorry, I encountered an error connecting to the AI service." });
    }
});

app.listen(PORT, () => {
    console.log(`Node Server running on port ${PORT}`);
});
