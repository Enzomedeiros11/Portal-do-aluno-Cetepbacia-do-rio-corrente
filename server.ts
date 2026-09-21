import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

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

const SYSTEM_INSTRUCTION = `Você é o "Professor IA CETEP", assistente pedagógico e tutor oficial de Inteligência Artificial do CETEP (Centro Territorial de Educação Profissional Bacia do Rio Corrente).

DIRETRIZES DE RESPOSTA (IGUAL AO CHATGPT):
1. Responda SEMPRE com extrema clareza, didática, profundidade e elegância visual no mesmo estilo do ChatGPT.
2. Formatação impecável em Markdown:
   - Use títulos e subtítulos organizados (## ou ### quando apropriado)
   - Use listas numeradas e marcadores com tópicos bem definidos
   - Destaque conceitos centrais e palavras-chave em **negrito**
   - Use blocos de código com sintaxe destacada (\`\`\`javascript, \`\`\`python, \`\`\`sql, \`\`\`excel, etc.) sempre que houver código ou comandos
   - Destaque fórmulas matemáticas e etapas de cálculo passo a passo
3. Tom acolhedor, profissional e encorajador, ideal para estudantes dos cursos técnicos (Informática, Enfermagem, Administração, Agropecuária, Recursos Humanos, etc.) e ensino médio.
4. Vá direto ao ponto de forma rica e completa. Dê exemplos práticos e aplicáveis da vida real ou do ambiente profissional da área do estudante.`;

function generateLocalSmartResponse(prompt: string, course = 'Geral'): string {
  const p = prompt.toLowerCase().trim();

  if (p === 'oi' || p === 'olá' || p === 'ola' || p === 'bom dia' || p === 'boa tarde' || p === 'boa noite') {
    return `Olá! 👋 Sou o **Professor IA CETEP**, seu tutor acadêmico e assistente inteligente.

Estou aqui para te ajudar com:
- 💻 **Informática & Programação**: Lógica, JavaScript, HTML/CSS, Python, Banco de Dados.
- 📊 **Excel & Ferramentas**: Fórmulas (PROCV, SE, SOMA, etc.), tabelas dinâmicas e relatórios.
- 🩺 **Enfermagem & Saúde**: Cálculos de medicação, sinais vitais, terminologias e anatomia.
- 📈 **Administração & Gestão**: Empreendedorismo, finanças, marketing e RH.
- 📐 **Matemática, Ciências & Redação**: Resoluções de questões passo a passo e dicas para o ENEM.

Como posso te ajudar no seu aprendizado hoje? Pode digitar sua dúvida ou problema!`;
  }

  // Basic math expression evaluator
  if (/^[\d\s\+\-\*\/\(\)\.\,]+$/.test(p)) {
    try {
      const sanitized = p.replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return `### 🧮 Resolução Matemática

**Expressão informada:** \`${prompt}\`  
**Resultado final:** **${result}**

---
*Dica do Professor IA*: Caso queira entender a ordem de precedência dos operadores (parênteses, multiplicação/divisão e soma/subtração), me avise!`;
      }
    } catch (e) {}
  }

  // Programming logic
  if (p.includes('program') || p.includes('código') || p.includes('javascript') || p.includes('python') || p.includes('html') || p.includes('função') || p.includes('variavel') || p.includes('variável')) {
    return `### 💻 Fundamentos de Programação e Lógica

Para construir qualquer algoritmo ou programa com eficiência, dividimos o problema em **3 etapas essenciais**:

#### 1. Entrada de Dados (Variáveis)
Onde guardamos as informações fornecidas pelo usuário ou sistema.
\`\`\`javascript
// Exemplo em JavaScript
const nomeAluno = "Lucas";
const nota1 = 8.5;
const nota2 = 7.0;
\`\`\`

#### 2. Processamento e Lógica Condicional
Onde aplicamos as regras de negócio ou cálculos matemáticos.
\`\`\`javascript
const media = (nota1 + nota2) / 2;

if (media >= 7.0) {
  console.log(\`\${nomeAluno} está Aprovado! Média: \${media}\`);
} else {
  console.log(\`\${nomeAluno} em Recuperação. Média: \${media}\`);
}
\`\`\`

#### 3. Saída de Dados
Retornar a resposta ao usuário na interface ou no console.

---
**Principais boas práticas:**
- Dê nomes autoexplicativos para suas variáveis (\`mediaBimestral\` em vez de \`m\`).
- Indente seu código para facilitar a leitura.
- Teste com dados limites (ex: médias próximas a 7.0).

Qual trecho específico de código ou dúvida você gostaria de detalhar?`;
  }

  // Nursing & healthcare
  if (p.includes('enferm') || p.includes('gotejamento') || p.includes('medic') || p.includes('pressão') || p.includes('soro')) {
    return `### 🩺 Guia Rápido de Enfermagem e Sinais Vitais

#### 1. Valores de Referência para Adultos em Repouso
- **Pressão Arterial (PA):** ~120/80 mmHg (Normotensão: PAS < 130 e PAD < 85)
- **Frequência Cardíaca (FC):** 60 a 100 batimentos por minuto (bpm)
- **Frequência Respiratória (FR):** 12 a 20 incursões respiratórias por minuto (irpm)
- **Temperatura Axilar:** 36,0°C a 37,2°C (Afebril)
- **Saturação de Oxigênio (SpO₂):** 95% a 100% em ar ambiente

#### 2. Cálculo Clássico de Gotejamento de Soro
Para calcular **gotas por minuto** em infusão de horas:
$$\\text{Gotas/min} = \\frac{\\text{Volume (mL)}}{\\text{Tempo (horas)} \\times 3}$$

**Exemplo prático:**  
Infundir **500 mL** de Soro Fisiológico em **4 horas**:
$$\\text{Gotas/min} = \\frac{500}{4 \\times 3} = \\frac{500}{12} \\approx 41{,}6 \\rightarrow \\mathbf{42 \\text{ gotas/min}}$$

Para **microgotas por minuto**:
$$\\text{Microgotas/min} = \\frac{\\text{Volume (mL)}}{\\text{Tempo (horas)}}$$

---
*Atenção*: Sempre confira os 9 certos da administração de medicamentos antes de qualquer procedimento!`;
  }

  // Excel
  if (p.includes('excel') || p.includes('procv') || p.includes('função se') || p.includes('planilha') || p.includes('soma')) {
    return `### 📊 Principais Fórmulas do Excel para o Mercado

Aqui estão as fórmulas mais exigidas e úteis no dia a dia acadêmico e corporativo:

#### 1. Função PROCV (Busca Vertical)
Procura um valor na primeira coluna de uma tabela e retorna o dado correspondente de outra coluna.
\`\`\`excel
=PROCV(valor_procurado; matriz_tabela; número_índice_coluna; [procurar_intervalo])
\`\`\`
*Exemplo:* \`=PROCV(A2; D2:G50; 3; FALSO)\`  
Busca o código de \`A2\` no intervalo \`D2:G50\` e traz a coluna 3 com correspondência exata.

#### 2. Função SE (Condicional)
Avalia uma condição lógica e retorna um valor para verdadeiro e outro para falso.
\`\`\`excel
=SE(teste_lógico; valor_se_verdadeiro; valor_se_falso)
\`\`\`
*Exemplo de Média Escolar:*
\`\`\`excel
=SE(E2>=7; "Aprovado"; "Recuperação")
\`\`\`

#### 3. Função SOMASE
Soma valores apenas se cumprirem um critério especificado.
\`\`\`excel
=SOMASE(intervalo_criterio; "Informática"; intervalo_soma)
\`\`\`

Precisa de ajuda para montar uma fórmula específica para a sua planilha? Envie os dados que eu monto a fórmula para você!`;
  }

  // General clear educational breakdown
  return `### 📚 Explicação Pedagógica: ${prompt}

Com base na sua dúvida sobre **"${prompt}"** no contexto de **${course}**, aqui está uma explicação clara, estruturada e prática:

#### 1. Conceito Central
O tema refere-se a um dos tópicos fundamentais da sua formação técnica e acadêmica. Compreender este ponto permite conectar teoria e prática profissional no mercado de trabalho.

#### 2. Pontos-Chave que Você Precisa Dominar
- **Fundamento Teórico:** Entenda o "porquê" antes de aplicar o "como".
- **Aplicação Prática:** Observe como esse conceito é executado no cotidiano escolar ou empresarial.
- **Resolução Metódica:** Divida problemas complexos em etapas menores e testáveis.

#### 3. Passo a Passo Recomendado
1. **Identifique as variáveis e requisitos** da questão.
2. **Consulte o material de apoio ou apostila** da disciplina correspondente no portal.
3. **Faça exercícios de fixação** para consolidar o conhecimento prático.

---
💡 **Quer aprofundar?** Me faça uma pergunta mais específica, como:  
*"Pode me dar um exemplo prático de ${prompt}?"* ou *"Como isso cai em uma prova ou no mercado de trabalho?"*`;
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
      // Models to try in sequence for resilience against quota limits
      const candidateModels = [
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
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
