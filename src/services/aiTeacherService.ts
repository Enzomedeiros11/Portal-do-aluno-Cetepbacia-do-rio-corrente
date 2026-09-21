import { answerQuestionDirectly } from './aiKnowledgeEngine';

export function getOpenAiApiKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('cetep_openai_api_key');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_OPENAI_API_KEY || (typeof process !== 'undefined' ? (process.env.OPENAI_API_KEY || '') : '');
}

export function saveOpenAiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('cetep_openai_api_key', key.trim());
    } else {
      localStorage.removeItem('cetep_openai_api_key');
    }
  }
}

export function getPreferredAiProvider(): 'chatgpt' | 'gemini' | 'auto' {
  if (typeof window !== 'undefined') {
    const pref = localStorage.getItem('cetep_ai_provider');
    if (pref === 'chatgpt' || pref === 'gemini' || pref === 'auto') return pref;
  }
  return getOpenAiApiKey() ? 'chatgpt' : 'auto';
}

export function savePreferredAiProvider(provider: 'chatgpt' | 'gemini' | 'auto'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cetep_ai_provider', provider);
  }
}

export async function askAiTeacher(prompt: string, userCourse = 'Geral', userGrade = '1º Ano'): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return 'Por favor, digite sua dúvida para o Professor IA.';

  const openAiKey = getOpenAiApiKey();

  // 1. Direct OpenAI call if user configured their key
  if (openAiKey && openAiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente de Inteligência Artificial útil, inteligente e direto. Responda diretamente e com máxima precisão a tudo o que o usuário perguntar. Para cálculos matemáticos, forneça a resposta exata e a conta passo a passo. Para redações ou dúvidas, responda de forma completa e original. Exceção estrita de segurança e privacidade: Não responda a perguntas sobre assuntos pessoais íntimos, dados privados ou sigilosos de pessoas físicas.'
            },
            { role: 'user', content: cleanPrompt }
          ],
          temperature: 0.6,
          max_tokens: 1500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) {
          return content.trim();
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('OpenAI Direct API returned status:', response.status, errData);
      }
    } catch (err) {
      console.warn('Direct OpenAI call failed, routing to server /api/chat:', err);
    }
  }

  // 2. Primary: Full-stack backend /api/chat
  try {
    const apiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: cleanPrompt,
        userCourse,
        userGrade
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.reply && data.reply.trim()) {
        return data.reply.trim();
      }
    } else {
      console.warn('Server /api/chat returned status:', apiRes.status);
    }
  } catch (err) {
    console.warn('Call to /api/chat failed, activating intelligent response engine:', err);
  }

  // 3. Resilient client-side fallback with direct problem & calculation solver
  return generateSmartTutorResponse(cleanPrompt, userCourse);
}

export function generateSmartTutorResponse(prompt: string, course = 'Geral'): string {
  return answerQuestionDirectly(prompt, course);
}

