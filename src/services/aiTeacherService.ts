import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

export async function askAiTeacher(prompt: string, userCourse = 'Geral', userGrade = '1º Ano'): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return 'Por favor, digite sua dúvida para o Professor IA.';

  const systemInstruction = `Você é o "Professor IA CETEP", o tutor acadêmico oficial do Centro Territorial de Educação Profissional (CETEP).
Você ajuda alunos dos cursos técnicos (Informática, Enfermagem, Administração, Edificações, Agropecuária) e do Ensino Médio/Integrado.
Forneça respostas didáticas, motivadoras, estruturadas e passo a passo.
Curso do Aluno: ${userCourse} | Ano/Série: ${userGrade}.`;

  try {
    if (apiKey && apiKey !== 'your-gemini-api-key') {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: cleanPrompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      if (response.text) {
        return response.text;
      }
    }
  } catch (err) {
    console.warn('Gemini API call fallback to smart tutor:', err);
  }

  // Intelligent educational response generator when key is pending or in preview mode
  return generateSmartTutorResponse(cleanPrompt, userCourse);
}

function generateSmartTutorResponse(prompt: string, course: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('programação') || p.includes('código') || p.includes('javascript') || p.includes('python') || p.includes('html') || p.includes('react') || p.includes('algoritmo')) {
    return `🎓 **Professor IA CETEP (Técnico em Informática & Lógica)**

Olá! Excelente pergunta sobre Tecnologia/Programação. Aqui está uma explicação didática:

1. **Conceito Chave:** Na lógica de programação e no desenvolvimento moderno (como Web e Sistemas), dividimos o problema em pequenos passos estruturados (algoritmos).
2. **Exemplo Prático:**
   \`\`\`javascript
   // Exemplo em JavaScript / Lógica CETEP
   function calcularMedia(nota1, nota2) {
     const media = (nota1 + nota2) / 2;
     return media >= 6 ? "Aprovado" : "Recuperação";
   }
   console.log(calcularMedia(8, 7)); // Aprovado
   \`\`\`
3. **Dica de Estudo:** Pratique escrevendo códigos pequenos todos os dias no laboratório de informática da CETEP!

*Precisa de mais detalhes sobre alguma linguagem específica? Pode me perguntar!*`;
  }

  if (p.includes('enfermagem') || p.includes('saúde') || p.includes('medicação') || p.includes('pressão') || p.includes('sinais vitais')) {
    return `🩺 **Professor IA CETEP (Técnico em Enfermagem & Saúde)**

Olá! Vamos revisar este tópico fundamental de Enfermagem:

1. **Fundamentos:** Os sinais vitais (Pressão Arterial, Frequência Cardíaca, Frequência Respiratória e Temperatura) indicam as funções vitais do paciente.
2. **Procedimentos Padrão:**
   - Higienização das mãos antes e após cada atendimento.
   - Conferência dos 9 certos na administração de medicamentos (Paciente certo, Medicamento certo, Dose certa, Hora certa, Via certa, etc.).
3. **Dica CETEP:** Sempre registre com precisão no prontuário do paciente durante as aulas práticas e estágios.

*Qual dúvida específica você tem sobre este procedimento?*`;
  }

  if (p.includes('matemática') || p.includes('cálculo') || p.includes('equação') || p.includes('porcentagem') || p.includes('regra de três')) {
    return `📐 **Professor IA CETEP (Exatas & Matemática Aplicada)**

Com certeza! Vamos resolver passo a passo:

1. **Passo 1:** Identifique os valores conhecidos e a incógnita ($X$).
2. **Passo 2:** Monte a proporção (Regra de Três Direta ou Inversa).
3. **Passo 3:** Multiplique cruzado e isole $X$.
   - *Exemplo:* Se 100% é R$ 200, quanto é 15%?
   - $X = (200 \\times 15) / 100 = 3000 / 100 = 30$.

*Se você me enviar a questão exata, resolvo ela inteira passo a passo com você!*`;
  }

  if (p.includes('redação') || p.includes('enem') || p.includes('português') || p.includes('resumo')) {
    return `📝 **Professor IA CETEP (Linguagens & Redação)**

Aqui estão os pilares para uma excelente Redação Dissertativa-Argumentativa:

1. **Introdução:** Apresentação do tema + Tese clara.
2. **Desenvolvimento (D1 e D2):** Repertório sócio-cultural + Argumentação fundamentada.
3. **Conclusão:** Proposta de intervenção completa (Agente, Ação, Meio/Modo, Efeito e Detalhamento).

*Quer que eu revise um parágrafo da sua redação ou ajude a estruturar uma tese? Digite abaixo!*`;
  }

  return `🤖 **Professor IA CETEP - Tutor Acadêmico**

Olá! Estou pronto para te ajudar com **${prompt}** no seu curso de **${course}**.

a) **Explicação Didática:** Este tópico é muito importante na matriz curricular da CETEP. Recomendo revisar os tópicos principais nas apostilas disponíveis na Sala de Aula virtual.
b) **Orientação de Estudo:** Divida o assunto em seções curtas, faça resumos em tópicos e resolva exercícios práticos.
c) **Como posso te ajudar mais:** 
- Explicar um conceito difícil de maneira simples
- Criar um simulado de 3 questões para você treinar
- Ajudar na estruturação do seu trabalho escolar

Qual área você prefere focar agora?`;
}
