import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `Você é o "Professor IA CETEP", assistente de Inteligência Artificial completo, inteligente e prestativo (no mesmo nível e estilo do ChatGPT original).

DIRETRIZES DE ATUAÇÃO E RESPOSTA:
1. RESPONDA A TUDO o que o usuário perguntar: tire dúvidas escolares, resolva questões de matemática, física, química, biologia, programação, história, redação, literatura, geografia, filosofia, inglês, tire dúvidas cotidianas, ensine tutoriais, escreva textos, dê explicações lógicas e responda a qualquer curiosidade ou assunto com total domínio e precisão.
2. Formatação impecável em Markdown:
   - Use títulos e subtítulos estruturados (## e ###)
   - Use listas e tópicos claros
   - Destaque conceitos centrais e palavras-chave em **negrito**
   - Use blocos de código com sintaxe destacada (\`\`\`javascript, \`\`\`python, \`\`\`sql, \`\`\`excel, etc.) sempre que pertinente
   - Detalhe cálculos passo a passo
3. Tom acolhedor, altamente didático, inteligente e encorajador.`;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { prompt, userCourse = 'Geral', userGrade = '1º Ano' } = req.body || {};
    const cleanPrompt = (prompt || '').trim();

    if (!cleanPrompt) {
      return res.status(400).json({ error: 'Prompt não pode ser vazio.' });
    }

    // 1. Try Gemini via GEMINI_API_KEY or VITE_GEMINI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      const aiClient = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.1-pro-preview',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
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
            return res.status(200).json({
              reply: response.text.trim(),
              provider: 'gemini',
              model,
            });
          }
        } catch (err: any) {
          console.warn(`Vercel function model ${model} error:`, err?.message || err);
        }
      }
    }

    // 2. Try OpenAI if configured
    const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
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
              {
                role: 'system',
                content: `${SYSTEM_INSTRUCTION}\nContexto: Aluno de ${userCourse}, ${userGrade}.`,
              },
              { role: 'user', content: cleanPrompt },
            ],
            temperature: 0.6,
            max_tokens: 1500,
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return res.status(200).json({
              reply: reply.trim(),
              provider: 'chatgpt',
              model: 'gpt-4o-mini',
            });
          }
        }
      } catch (err) {
        console.warn('Vercel OpenAI error:', err);
      }
    }

    // 3. Fallback if no API key is set on Vercel
    const missingKeyNotice = !geminiKey && !openAiKey
      ? `\n\n> ⚙️ **Dica de Implantação Vercel:** Para ativar as respostas completas em tempo real com o Gemini da Google na Vercel, acesse as configurações do seu projeto na Vercel (**Settings ➔ Environment Variables**) e adicione a variável **\`GEMINI_API_KEY\`** com sua chave da Google AI Studio. Você também pode inserir sua chave diretamente no campo de chave do Chat!`
      : '';

    return res.status(200).json({
      reply: `### 💡 Professor IA CETEP\n\nSobre a sua pergunta: **"${cleanPrompt}"**\n\n${cleanPrompt.length > 5 ? 'Aqui está a explicação e orientação sobre o assunto solicitado:\n\n' : ''}- Para responder a qualquer pergunta com total profundidade e inteligência artificial generativa em tempo real, certifique-se de que a chave de API da IA esteja cadastrada.${missingKeyNotice}`,
      provider: 'fallback',
    });
  } catch (error: any) {
    console.error('Vercel serverless error:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a resposta da IA.' });
  }
}
