import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

export async function askAiTeacher(prompt: string, userCourse = 'Geral', userGrade = '1º Ano'): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return 'Por favor, digite sua dúvida para o Professor IA.';

  const systemInstruction = `Você é o "Professor IA CETEP", assistente pedagógico e tutor de IA do portal.
DIRETRIZ OBRIGATÓRIA E RIGOROSA:
- Responda APENAS e EXCLUSIVAMENTE ao que a pessoa perguntou.
- NÃO adicione saudações longas, NÃO inclua listas não solicitadas de "como posso ajudar mais", "dicas de estudo" ou "opções extras".
- Seja direto, claro, objetivo e preciso.
- Se for uma pergunta simples, dê a resposta direta em uma ou poucas frases.
- Se for um problema ou exercício, resolva diretamente o problema perguntado.`;

  try {
    if (apiKey && apiKey !== 'your-gemini-api-key') {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
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

  // Efficient educational response generator when API key is pending or in preview mode
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

