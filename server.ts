import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints logic: /api/health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/translate', async (req, res) => {
    try {
      const { text, target } = req.body;
      if (!text || !target) {
        return res.status(400).json({ error: 'Missing text or target' });
      }
      
      if (target === 'en') {
        return res.json({ translatedText: text });
      }

      const apiKey = process.env.VITE_GOOGLE_CLOUD_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing VITE_GOOGLE_CLOUD_API_KEY in environment' });
      }

      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: target,
          format: 'html'
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'Translation API Error');
      }

      const translations = data.data?.translations;
      let translatedText;
      if (Array.isArray(text)) {
        translatedText = translations.map((t: any) => t.translatedText);
      } else {
        translatedText = translations[0].translatedText;
      }

      res.json({ translatedText });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language } = req.body;
      const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Missing VITE_GEMINI_API_KEY in environment' });

      console.log('Using Gemini API key starting with:', apiKey.substring(0, 5));
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are a non-partisan, highly knowledgeable civic educator and voter assistant. Provide factual, unbiased answers about the election process, timelines, and voter rights. You must answer in ${language || 'English'} language.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post('/api/demystify', async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Missing VITE_GEMINI_API_KEY in environment' });

      console.log('Demystify: Using Gemini API key starting with:', apiKey.substring(0, 5));
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = "You are a non-partisan civic educator. Translate this legal text into a 5th-grade reading level summary. List 3 Pros and 3 Cons. Do not hallucinate. Do not express political bias. Output the response in Markdown format, with headers for the Summary, Pros, and Cons.";
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: text,
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('Demystify error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post('/api/glossary', async (req, res) => {
    try {
      const { term } = req.body;
      const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Missing VITE_GEMINI_API_KEY in environment' });

      console.log('Glossary: Using Gemini API key starting with:', apiKey.substring(0, 5));
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are a civic educator preparing helpful glossary definitions. Provide a simple, clear, 1-2 sentence definition for the term. Keep it neutral and non-partisan. Format as plain text.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `What does "${term}" mean in an election context?`,
        config: { systemInstruction }
      });

      res.json({ definition: response.text || 'Definition unavailable.' });
    } catch (error) {
      console.error('Glossary error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // app.use must use * in v4, but we need to check Express version.
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
