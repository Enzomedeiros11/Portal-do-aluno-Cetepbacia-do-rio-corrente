import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

export async function askAiTeacher(prompt: string, userCourse = 'Geral', userGrade = '1º Ano'): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return 'Por favor, digite sua dúvida para o Professor IA.';

  const systemInstruction = `Você é o "Professor IA CETEP", assistente pedagógico e tutor acadêmico direto e eficiente.
DIRETRIZ OBRIGATÓRIA: Responda EXATAMENTE e DIRETAMENTE ao que o usuário perguntou.
- Vá direto ao ponto, sem saudações longas, preâmbulos desnecessários ou introduções clichês.
- Se o usuário fez uma pergunta direta de conteúdo, matemática, código, enfermagem, biologia, história ou redação, forneça a resposta de forma clara, precisa, organizada e direta.
- Se for uma dúvida simples (ex: "quanto é 2+2?", "o que é HTML?"), responda em poucas frases objetivas.
- Se for um cálculo ou exercício, mostre a resolução passo a passo de forma simples.
- Mantenha tom amigável, educacional e altamente eficiente.
Curso do Aluno: ${userCourse} | Ano/Série: ${userGrade}.`;

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
  const p = prompt.toLowerCase();

  if (p.includes('programação') || p.includes('código') || p.includes('javascript') || p.includes('python') || p.includes('html') || p.includes('react') || p.includes('algoritmo')) {
    return `💻 **Programação & Lógica**

Para resolver problemas de programação:
1. **Entrada e Variáveis**: Armazene os dados de entrada.
2. **Processamento/Lógica**: Aplique as estruturas condicionais (\`if/else\`) ou laços (\`for/while\`).
3. **Saída**: Retorne o resultado esperado.

**Exemplo Prático (JavaScript):**
\`\`\`javascript
// Exemplo de estrutura condicional
const nota = 7.5;
if (nota >= 6) {
  console.log("Aprovado!");
} else {
  console.log("Recuperação");
}
\`\`\``;
  }

  if (p.includes('enfermagem') || p.includes('saúde') || p.includes('medicação') || p.includes('pressão') || p.includes('sinais vitais')) {
    return `🩺 **Sinais Vitais e Enfermagem**

- **Pressão Arterial (PA):** Valor normal médio ~ 120/80 mmHg (Normotenso).
- **Frequência Cardíaca (FC):** 60 a 100 bpm (Normocardia).
- **Frequência Respiratória (FR):** 12 a 20 mrpm (Eupneia).
- **Temperatura (T):** 36,1°C a 37,2°C (Afebril).

*Atenção à regra dos 9 Certos na Administração de Medicamentos (Paciente certo, dose certa, via certa, hora certa, medicação certa, etc).*`;
  }

  if (p.includes('matemática') || p.includes('cálculo') || p.includes('equação') || p.includes('porcentagem') || p.includes('regra de três')) {
    return `📐 **Resolução Matemática**

**Regra de Três Direta (Exemplo):**
Para calcular $X$ quando valores crescem na mesma proporção:
- Monte a tabela alinhando as grandezas.
- Multiplique cruzado: $A \\times X = B \\times C$.
- Isole $X = \\frac{B \\times C}{A}$.

*Se quiser a resolução de um cálculo específico, digite os números e a questão exata!*`;
  }

  if (p.includes('redação') || p.includes('enem') || p.includes('português') || p.includes('resumo')) {
    return `📝 **Estrutura de Redação**

1. **Introdução:** Contextualize o tema + Apresente a tese.
2. **Desenvolvimento 1:** Argumento principal + Repertório legítimo.
3. **Desenvolvimento 2:** Desdobramento das causas/consequências.
4. **Conclusão:** Proposta de Intervenção (Agente + Ação + Modo/Meio + Efeito + Detalhamento).`;
  }

  return `📘 **Resposta ao tópico solicitado (${prompt}):**

Em **${course}**, este assunto relaciona-se aos conceitos fundamentais da matéria. 

Para estudar este tema com eficiência:
- Foque nas definições principais e palavras-chave.
- Aplique o conceito em um exemplo prático do seu dia a dia profissional.
- Refaça os exercícios apresentados em sala de aula.

*Tem um exercício ou questão específica sobre isso? Pode digitar que eu resolvo com você!*`;
}

