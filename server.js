// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();

j 
app.use(cors());
app.use(bodyParser.json());

// Load API key from environment variable
const apiKey = process.env.GENAI_API_KEY;
if (!apiKey) {
  console.error('GENAI_API_KEY environment variable is not set.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Chatbot endpoint
app.post('/api/generate', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  try {
    const systemInstruction = `
      You are a compassionate mental health care assistant.
      Provide supportive, non-judgmental responses.
      Give grounding exercises and coping tips.
      Encourage professional help if needed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: { systemInstruction },
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Serve the frontend HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
