import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { answerQuestionDirectly } from './src/services/aiKnowledgeEngine';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Você é um assistente de Inteligência Artificial inteligente, prestativo e direto.

DIRETRIZES FUNDAMENTAIS:
1. Responda DIRETAMENTE e com máxima precisão e clareza a tudo o que o usuário perguntar.
2. Para cálculos matemáticos (ex: "quanto é 34x34", porcentagens, raízes, equações), responda o resultado exato de imediato e demonstre o cálculo passo a passo.
3. Para dúvidas teóricas, explicações, redações, programação e ciências, responda de forma rica, direta e completa, com excelente formatação em Markdown.
4. REGRA ESTRITA DE PRIVACIDADE: Não responda sobre assuntos pessoais íntimos, boatos, fofocas ou dados privados/sigilosos de indivíduos reais.`;

function generateLocalSmartResponse(prompt: string, course = 'Geral'): string {
  return answerQuestionDirectly(prompt, course);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chat IA endpoint with ChatGPT-like responses & multi-model resilience
  app.post('/api/chat', async (req, res) => {
    const { prompt, userCourse = 'Geral', userGrade = '1º Ano', history = [] } = req.body;

    const cleanPrompt = (prompt || '').trim();
    if (!cleanPrompt) {
      return res.status(400).json({ error: 'Prompt não pode ser vazio.' });
    }

    // 1. Try Gemini API via @google/genai SDK
    const aiClient = getGeminiClient();
    if (aiClient) {
      // Models to try in sequence for resilience and speed
      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-2.5-pro',
      ];

      for (const model of candidateModels) {
        try {
          const response = await aiClient.models.generateContent({
            model,
            contents: cleanPrompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION + `\nContexto do Estudante: Curso: ${userCourse}, Série: ${userGrade}.`,
              temperature: 0.6,
            },
          });

          if (response && response.text) {
            return res.json({
              reply: response.text.trim(),
              provider: 'gemini',
              model,
            });
          }
        } catch (err: any) {
          console.warn(`Gemini model ${model} error/quota:`, err?.message || err);
          // Continue to next model if quota or transient error
        }
      }
    }

    // 2. Try OpenAI if configured in process.env
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith('sk-')) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION + `\nContexto do Estudante: Curso: ${userCourse}, Série: ${userGrade}.` },
              { role: 'user', content: cleanPrompt },
            ],
            temperature: 0.6,
          }),
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const reply = openAiData.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({
              reply: reply.trim(),
              provider: 'chatgpt',
              model: 'gpt-4o-mini',
            });
          }
        }
      } catch (err) {
        console.warn('OpenAI fallback error:', err);
      }
    }

    // 3. High-quality structured fallback generator (guarantees clear, ChatGPT-style answers)
    const fallbackReply = generateLocalSmartResponse(cleanPrompt, userCourse);
    return res.json({
      reply: fallbackReply,
      provider: 'local-smart-tutor',
    });
  });

  // Vite middleware for development or static serving for production
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
