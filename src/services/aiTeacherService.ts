import { GoogleGenAI } from '@google/genai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

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

  const systemInstruction = `Você é o "Professor IA CETEP", assistente pedagógico e tutor de IA do portal acadêmico do CETEP (Centro Territorial de Educação Profissional).
DIRETRIZ OBRIGATÓRIA E RIGOROSA:
- Responda com clareza, precisão pedagógica e de forma direta ao que foi solicitado.
- Seja objetivo, educado e didático.
- Se for uma dúvida de informática, Excel, enfermagem, administração, matemática ou qualquer disciplina escolar/técnica, dê exemplos práticos passo a passo.
- Quando pertinente, forneça a fórmula, comando ou síntese conceitual.`;

  const provider = getPreferredAiProvider();
  const openAiKey = getOpenAiApiKey();

  // 1. If ChatGPT is preferred or configured
  if ((provider === 'chatgpt' || provider === 'auto') && openAiKey && openAiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: cleanPrompt }
          ],
          temperature: 0.6,
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return content.trim();
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('OpenAI API error response:', errData);
      }
    } catch (err) {
      console.warn('ChatGPT API call fallback to secondary engine:', err);
    }
  }

  // 2. Try Gemini API
  try {
    if (geminiApiKey && geminiApiKey !== 'your-gemini-api-key') {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: cleanPrompt,
        config: {
          systemInstruction,
          temperature: 0.5
        }
      });
      if (response.text) {
        return response.text.trim();
      }
    }
  } catch (err) {
    console.warn('Gemini API call fallback to smart tutor:', err);
  }

  // 3. Fallback to built-in smart pedagogical tutor engine
  return generateSmartTutorResponse(cleanPrompt, userCourse);
}

function generateSmartTutorResponse(prompt: string, course: string): string {
  const p = prompt.toLowerCase().trim();

  if (p === 'oi' || p === 'olá' || p === 'ola' || p === 'bom dia' || p === 'boa tarde' || p === 'boa noite') {
    return 'Olá! Como posso ajudar você hoje com suas dúvidas?';
  }

  // Simple math evaluation if user asks basic math
  if (/^[\d\s\+\-\*\/\(\)\.\,]+$/.test(p)) {
    try {
      const sanitized = p.replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return `O resultado de ${prompt} é ${result}.`;
      }
    } catch (e) {}
  }

  if (p.includes('programação') || p.includes('código') || p.includes('javascript') || p.includes('python') || p.includes('html') || p.includes('react') || p.includes('algoritmo')) {
    return `Para responder sobre programação e lógica:
1. **Entrada e Variáveis**: Armazene os dados.
2. **Processamento**: Aplique as regras com condicionais (\`if/else\`) e laços (\`for/while\`).
3. **Saída**: Retorne o resultado esperado.`;
  }

  if (p.includes('enfermagem') || p.includes('saúde') || p.includes('medicação') || p.includes('pressão') || p.includes('sinais vitais')) {
    return `**Valores de Referência dos Sinais Vitais:**
- **Pressão Arterial:** ~ 120/80 mmHg
- **Frequência Cardíaca:** 60 a 100 bpm
- **Frequência Respiratória:** 12 a 20 mrpm
- **Temperatura:** 36,1°C a 37,2°C`;
  }

  if (p.includes('matemática') || p.includes('cálculo') || p.includes('equação') || p.includes('porcentagem') || p.includes('regra de três')) {
    return `Para calcular proporções e Regra de Três:
1. Monte a relação entre as grandezas.
2. Multiplique cruzado: $A \\times X = B \\times C$.
3. Isole $X = \\frac{B \\times C}{A}$.`;
  }

  if (p.includes('redação') || p.includes('enem') || p.includes('português') || p.includes('resumo')) {
    return `**Estrutura de Redação Dissertativa-Argumentativa:**
1. **Introdução:** Contextualização do tema e tese.
2. **Desenvolvimento:** Argumentação e repertório legítimo.
3. **Conclusão:** Proposta de intervenção com agente, ação, meio/modo e detalhamento.`;
  }

  return `Com base na sua pergunta "${prompt}", a explicação direta sobre este conceito em ${course} envolve entender seus fundamentos principais, aplicar o conhecimento na prática e seguir as diretrizes da disciplina.`;
}

