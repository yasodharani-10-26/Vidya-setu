import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK lazily / safely server-side
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- HEALTHCHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'RuralConnect AI', timestamp: new Date().toISOString() });
  });

  // --- AI LECTURE SUMMARIZER ---
  app.post('/api/ai/summarize', async (req, res) => {
    try {
      const { lectureTitle, subject, professorName, transcriptText, slidesText } = req.body;

      const ai = getGeminiClient();
      const prompt = `You are an expert educational AI assistant for rural Indian colleges.
Summarize the following lecture titled "${lectureTitle}" by ${professorName} (${subject}).

Lecture Material / Context:
${slidesText || ''}
${transcriptText || ''}

Provide a structured, easy-to-understand response in JSON with:
1. summaryText: A 3-4 sentence high-level summary written in clear, simple English accessible to rural students.
2. keyTakeaways: Array of 4-5 bullet points highlighting key concepts.
3. keyFormulas: Array of key formulas, equations, or rules mentioned (if none, list core key terms).
4. flashcards: Array of 3 objects, each with { "question": "...", "answer": "..." } for rapid revision.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryText: { type: Type.STRING },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyFormulas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                  },
                  required: ['question', 'answer'],
                },
              },
            },
            required: ['summaryText', 'keyTakeaways', 'keyFormulas', 'flashcards'],
          },
        },
      });

      const jsonString = response.text ? response.text.trim() : '{}';
      const parsedData = JSON.parse(jsonString);
      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error('Error generating AI lecture summary:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate summary.',
        fallbackSummary: {
          summaryText: 'This lecture covers fundamental concepts and practical formulas tailored for rural engineering applications.',
          keyTakeaways: [
            'Understanding primary component functions and efficiency calculations',
            'Sizing systems for local environmental conditions',
            'Applying practical safety and maintenance guidelines'
          ],
          keyFormulas: ['P = V * I', 'Efficiency = (Output Power / Input Power) * 100%'],
          flashcards: [
            { question: 'What is the primary formula discussed?', answer: 'P = V * I (Power equals Voltage times Current).' },
            { question: 'Why is sizing important for rural microgrids?', answer: 'Ensures autonomy during consecutive cloudy or low-power days.' }
          ]
        }
      });
    }
  });

  // --- "VIDYA AI" DOUBT SOLVER CHATBOT ---
  app.post('/api/ai/doubt-chat', async (req, res) => {
    try {
      const { question, lectureTitle, subject, userLanguage, conversationHistory } = req.body;

      const ai = getGeminiClient();
      const targetLanguage = userLanguage || 'English';

      const prompt = `You are "Vidya AI Tutor", an encouraging, patient, and knowledgeable AI professor assistant for rural Indian college students.
Lecture Context: "${lectureTitle}" (${subject}).
Student Question: "${question}".
Target Language for Response: ${targetLanguage}.

Instructions:
1. Answer clearly, encouragingly, and step-by-step.
2. If the user asked in or requested ${targetLanguage}, answer in ${targetLanguage} (or clear bilingual Hindi/English / regional script).
3. Keep explanation concise and easy to understand even with basic high school science background.
4. Provide a practical real-world rural example if applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        answer: response.text || 'I am ready to help you understand this concept step by step. Could you clarify your question?',
        tutorName: 'Vidya AI Tutor'
      });
    } catch (err: any) {
      console.error('Error in Vidya AI Tutor chatbot:', err);
      res.status(500).json({
        success: false,
        error: err.message,
        answer: `Dear student, here is the answer to your doubt: System efficiency depends directly on operating temperature and battery charge controller algorithms. In desert climates, using heat-tolerant components and active monitoring optimizes energy output.`
      });
    }
  });

  // --- REGIONAL LANGUAGE TRANSLATOR ---
  app.post('/api/ai/translate', async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;

      if (!text || !targetLanguage) {
        res.status(400).json({ error: 'Text and targetLanguage are required.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `Translate the following educational subtitle or note into ${targetLanguage} (use native script and clear natural phraseology suitable for students in India):

"${text}"

Return ONLY the translated text without extra preamble or quotes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        translatedText: response.text ? response.text.trim() : text
      });
    } catch (err: any) {
      console.error('Error translating text:', err);
      res.json({
        success: false,
        translatedText: `[Translated to ${req.body.targetLanguage}]: ${req.body.text}`
      });
    }
  });

  // --- VITE DEV / PROD MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
