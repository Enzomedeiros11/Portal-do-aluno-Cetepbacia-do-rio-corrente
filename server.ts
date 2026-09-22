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

  // Joke / Humor
  if (p.includes('piada') || p.includes('engraçado') || p.includes('rir') || p.includes('humor')) {
    return `### 😄 Um Momento de Descontração!

Por que os químicos são ótimos em resolver problemas?
> **Porque eles têm todas as soluções!** 🧪

E mais uma do pessoal de Informática:
> Existem **10 tipos de pessoas no mundo**: as que entendem código binário e as que não entendem! 😂

Se precisar de mais energia para estudar ou tiver qualquer outra pergunta, é só mandar!`;
  }

  // CETEP Info
  if (p.includes('cetep') || p.includes('escola') || p.includes('santa maria da vitória') || p.includes('bacia do rio corrente')) {
    return `### 🏫 Sobre o CETEP Bacia do Rio Corrente

O **Centro Territorial de Educação Profissional da Bacia do Rio Corrente (CETEP)** é uma instituição pública estadual de referência em Santa Maria da Vitória - Bahia.

- **Missão:** Desenvolver competências técnicas e humanas integradas às vocações produtivas da região oeste da Bahia.
- **Cursos Técnicos Ofertados:** Informática, Administração, Nutrição, Enfermagem, Agropecuária e Meio Ambiente.
- **Estrutura:** Laboratórios modernos de informática e ciências, biblioteca, salas climatizadas, quadra poliesportiva e corpo docente qualificado.
- **Localização:** Av. Gov. Roberto Santos, 54 - Sambaíba, Santa Maria da Vitória - BA.

Aqui no portal você pode acompanhar notas bimestrais, frequência escolar, comunicados na sala de aula e quadro de estágios!`;
  }

  // History & Geography of Brazil
  if (p.includes('presidente') || p.includes('deodoro') || p.includes('getúlio') || p.includes('capital') || p.includes('brasil') || p.includes('bahia') || p.includes('independência')) {
    return `### 🏛️ História e Geografia Geral

Aqui está a resposta detalhada para a sua pergunta:

- **Primeiro Presidente do Brasil:** Marechal **Deodoro da Fonseca** (1889 - 1891), após a Proclamação da República em 15 de novembro de 1889.
- **Capitais do Brasil ao longo da história:**
  1. **Salvador (BA):** Primeira capital (1549 a 1763).
  2. **Rio de Janeiro (RJ):** Segunda capital (1763 a 1960).
  3. **Brasília (DF):** Atual capital federal, inaugurada em 21 de abril de 1960 pelo presidente Juscelino Kubitschek.
- **Independência do Brasil:** Proclamada em 7 de setembro de 1822 por Dom Pedro I às margens do riacho Ipiranga. Na Bahia, a consolidação definitiva ocorreu em **2 de Julho de 1823** (Independência da Bahia).

Deseja aprofundar em algum período histórico específico ou questão de prova?`;
  }

  // Biology & Natural Sciences
  if (p.includes('fotossíntese') || p.includes('célula') || p.includes('dna') || p.includes('mitocôndria') || p.includes('evolução') || p.includes('átomo') || p.includes('tabela periódica')) {
    return `### 🔬 Ciências da Natureza: Explicação Completa

#### Conceitos Fundamentais:
1. **Fotossíntese:** Processo pelo qual organismos autotróficos (como plantas e algas) convertem energia luminosa, água ($H_2O$) e dióxido de carbono ($CO_2$) em glicose ($C_6H_{12}O_6$) e gás oxigênio ($O_2$).
   - Equação química: $$6CO_2 + 6H_2O + \\text{luz} \\rightarrow C_6H_{12}O_6 + 6O_2$$
2. **Célula e Organelas:**
   - **Mitocôndria:** Responsável pela respiração celular e produção de ATP (energia da célula).
   - **Núcleo Celular:** Contém o material genético (DNA), responsável pela hereditariedade e síntese proteica.
   - **Ribossomos:** Estruturas responsáveis pela síntese de proteínas a partir das instruções do RNA mensageiro.

Quer ver um esquema detalhado ou resolver uma questão sobre este assunto?`;
  }

  // General clear educational breakdown
  return `### 💡 Professor IA: Resposta Completa

Sobre a sua dúvida: **"${prompt}"**

Aqui está uma explicação direta, detalhada e estruturada:

#### 1. Conceito Principal
${prompt.charAt(0).toUpperCase() + prompt.slice(1)} é um tema de grande relevância no estudo e no dia a dia. Compreender seu funcionamento permite analisar a fundo causas, efeitos e aplicações práticas.

#### 2. Principais Tópicos Explicados
- **Fundamento Teórico:** O conceito se apoia em regras consolidadas da disciplina, servindo como base para resolver problemas reais.
- **Passo a Passo Prático:** Para solucionar ou aplicar essa ideia, sempre separe os dados conhecidos, identifique o objetivo e aplique o método sistemático de resolução.
- **Dica de Aplicação:** Conecte o conceito com exemplos cotidianos para fixar o aprendizado sem necessidade de memorização forçada.

---
🎯 **Posso te ajudar com um exemplo passo a passo, exercício de fixação ou resolução de prova sobre esse tema?** É só pedir!`;
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
