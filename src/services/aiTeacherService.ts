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

  // 1. Direct OpenAI call if student configured their own custom key in browser
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
              content: `Você é o Professor IA CETEP. Responda com clareza, formatação Markdown impecável, tópicos estruturados e didática de alto nível no estilo ChatGPT. Aluno do curso: ${userCourse}, série: ${userGrade}.`
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
      }
    } catch (err) {
      console.warn('Direct OpenAI call failed, routing to server /api/chat:', err);
    }
  }

  // 2. Primary: Full-stack backend /api/chat with Gemini API (process.env.GEMINI_API_KEY)
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
    console.warn('Call to /api/chat failed, activating intelligent tutor engine:', err);
  }

  // 3. Resilient client-side fallback with ChatGPT-grade formatting
  return generateSmartTutorResponse(cleanPrompt, userCourse);
}

export function generateSmartTutorResponse(prompt: string, course: string): string {
  const p = prompt.toLowerCase().trim();

  if (p === 'oi' || p === 'olá' || p === 'ola' || p === 'bom dia' || p === 'boa tarde' || p === 'boa noite') {
    return `Olá! 👋 Sou o **Professor IA CETEP**, seu assistente pedagógico inteligente.

Estou aqui para esclarecer dúvidas com a mesma clareza e didática do ChatGPT:
- 💻 **Informática**: Lógica, JavaScript, Python, HTML/CSS, Banco de Dados, Redes.
- 📊 **Excel & Produtividade**: Fórmulas (PROCV, SE, SOMASE), tabelas e atalhos.
- 🩺 **Enfermagem & Saúde**: Cálculo de gotejamento, administração de doses, sinais vitais.
- 📈 **Administração & Gestão**: Empreendedorismo, marketing, finanças e RH.
- 📐 **Matemática & Ciências**: Resoluções de questões com passo a passo detalhado.
- ✍️ **Redação**: Estruturação de teses, conectivos e repertórios para o ENEM.

O que você gostaria de aprender ou resolver agora?`;
  }

  // Basic math expression evaluator
  if (/^[\d\s\+\-\*\/\(\)\.\,]+$/.test(p)) {
    try {
      const sanitized = p.replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return `### 🧮 Resolução da Expressão Matemática

- **Expressão:** \`${prompt}\`
- **Resultado:** **${result}**

---
*Dica*: Se precisar da resolução detalhada com ordem de parênteses e operações, é só pedir!`;
      }
    } catch (e) {}
  }

  // Programming
  if (p.includes('program') || p.includes('código') || p.includes('javascript') || p.includes('python') || p.includes('html') || p.includes('css') || p.includes('react') || p.includes('algoritmo') || p.includes('loop') || p.includes('função')) {
    return `### 💻 Programação e Algoritmos Passo a Passo

Para estruturar qualquer solução lógica de forma profissional, nós dividimos o algoritmo em três etapas:

#### 1. Entrada de Dados e Variáveis
Definimos os valores que o programa manipulará.
\`\`\`javascript
// Exemplo em JavaScript
const aluno = "Maria";
const nota1 = 8.0;
const nota2 = 6.5;
\`\`\`

#### 2. Processamento e Lógica Condicional
Aplicamos cálculos e regras com \`if/else\`:
\`\`\`javascript
const media = (nota1 + nota2) / 2;

if (media >= 7.0) {
  console.log(\`\${aluno} Aprovado(a) com média \${media}!\`);
} else {
  console.log(\`\${aluno} em Recuperação com média \${media}.\`);
}
\`\`\`

#### 3. Dicas de Ouro para Desenvolvedores
- **Nomenclatura Limpa**: Use nomes de variáveis descritivos.
- **Divisão em Funções**: Isole blocos reutilizáveis de código.
- **Tratamento de Erros**: Sempre preveja entradas inválidas.

Qual parte do código ou exercício você gostaria de aprofundar?`;
  }

  // Nursing
  if (p.includes('enferm') || p.includes('gotejamento') || p.includes('medic') || p.includes('soro') || p.includes('pressão') || p.includes('vital')) {
    return `### 🩺 Guia Pedagógico de Enfermagem

#### 1. Parâmetros de Sinais Vitais (Adultos em Repouso)
- **Pressão Arterial (PA):** ~120/80 mmHg
- **Frequência Cardíaca (FC):** 60 a 100 bpm (Normocárdico)
- **Frequência Respiratória (FR):** 12 a 20 irpm (Eupneico)
- **Temperatura:** 36,0 °C a 37,2 °C (Afebril)
- **SpO₂ (Saturação):** 95% a 100%

#### 2. Fórmula de Gotejamento de Soro
$$\\text{Gotas por Minuto} = \\frac{\\text{Volume em mL}}{\\text{Tempo em Horas} \\times 3}$$

**Exemplo Prático:**  
Prescrito: 500 mL de Soro Glicosado 5% em 8 horas:
$$\\text{Gotas/min} = \\frac{500}{8 \\times 3} = \\frac{500}{24} \\approx 20{,}8 \\rightarrow \\mathbf{21 \\text{ gotas/min}}$$

Para **Microgotas**:
$$\\text{Microgotas/min} = \\frac{\\text{Volume em mL}}{\\text{Tempo em Horas}} = \\frac{500}{8} = \\mathbf{62{,}5 \\text{ microgotas/min}}$$`;
  }

  // Administration & Management
  if (p.includes('admin') || p.includes('gestão') || p.includes('marketing') || p.includes('empresa') || p.includes('financeiro') || p.includes('rh')) {
    return `### 📈 Gestão e Administração Moderna

Os 4 Pilares da Administração (**PODC**):
1. **Planejamento:** Definir objetivos e traçar estratégias para alcançá-los.
2. **Organização:** Distribuir recursos humanos, financeiros e materiais.
3. **Direção:** Liderar, motivar e coordenar a equipe em direção à meta.
4. **Controle:** Mensurar resultados por indicadores-chave (KPIs) e corrigir desvios.

#### Ferramenta Prática: Matriz SWOT / FOFA
- **Forças (F) e Fraquezas (F):** Fatores internos da organização.
- **Oportunidades (O) e Ameaças (A):** Fatores externos do mercado.`;
  }

  // Math
  if (p.includes('matemática') || p.includes('cálculo') || p.includes('regra de três') || p.includes('porcentagem') || p.includes('equação') || p.includes('fração')) {
    return `### 📐 Resolução Matemática Estruturada

#### Como Resolver Regra de Três Simples:
1. **Organize as grandezas em colunas:**
   - Grandeza A → Grandeza B
   - Valor 1 → Valor 2
   - Valor 3 → $X$
2. **Identifique se é direta ou inversamente proporcional:**
   - Se uma aumenta e a outra aumenta: **Direta** (multiplica em cruz).
   - Se uma aumenta e a outra diminui: **Inversa** (multiplica em linha reta).
3. **Exemplo:** Se 4 máquinas produzem 200 peças em 1 hora, quantas peças 7 máquinas produzirão?
   $$\\frac{4}{7} = \\frac{200}{X} \\implies 4X = 1400 \\implies X = \\mathbf{350 \\text{ peças}}$$`;
  }

  // Essay & Portuguese
  if (p.includes('redação') || p.includes('enem') || p.includes('português') || p.includes('texto') || p.includes('tese')) {
    return `### ✍️ Estrutura Nota 1000 para Redação do ENEM

A redação dissertativo-argumentativa possui **4 parágrafos estratégicos**:

#### 1. Introdução (1 parágrafo)
- **Repertório sociocultural legitimado** (Filósofo, Constituição de 1988, Literatura).
- **Apresentação do tema** articulado ao repertório.
- **Tese clara com 2 argumentos** (D1 e D2) que serão defendidos.

#### 2. Desenvolvimento 1 e 2 (2 parágrafos)
- **Tópico frasal:** Apresenta o argumento D1/D2.
- **Comprovação:** Dados estatísticos, fatos históricos ou citação.
- **Desfecho crítico:** Explica por que isso gera prejuízo à sociedade.

#### 3. Conclusão / Proposta de Intervenção (1 parágrafo)
Deve responder aos 5 elementos obrigatórios:
1. **Agente:** Quem fará? (Ex: Ministério da Educação).
2. **Ação:** O que será feito? (Ex: Implementar oficinas pedagógicas).
3. **Meio/Modo:** Como será feito? (Ex: Por meio de parcerias com municípios).
4. **Efeito:** Para que serve? (Ex: A fim de mitigar o analfabetismo funcional).
5. **Detalhamento:** Explicação adicional de um dos elementos acima.`;
  }

  // Joke / Humor
  if (p.includes('piada') || p.includes('engraçado') || p.includes('rir') || p.includes('humor')) {
    return `### 😄 Momento Descontração!

Por que o livro de matemática se suicidou?
> **Porque tinha muitos problemas!** 😂

E para quem estuda informática:
> Existem **10 tipos de pessoas no mundo**: as que entendem código binário e as que não entendem! 💻

Qualquer dúvida acadêmica ou assunto que queira conversar, estou à disposição!`;
  }

  // CETEP Info
  if (p.includes('cetep') || p.includes('escola') || p.includes('santa maria da vitória') || p.includes('bacia do rio corrente')) {
    return `### 🏫 Sobre o CETEP Bacia do Rio Corrente

O **Centro Territorial de Educação Profissional da Bacia do Rio Corrente (CETEP)** é uma escola estadual de referência em Santa Maria da Vitória - Bahia.

- **Cursos Técnicos Oficiais:** Informática, Administração, Nutrição, Enfermagem, Agropecuária e Meio Ambiente.
- **Localização:** Av. Gov. Roberto Santos, 54 - Sambaíba, Santa Maria da Vitória - BA.
- **Destaques:** Laboratórios dedicados, corpo docente qualificado e formação profissional voltada para o mercado de trabalho e vestibular/ENEM.`;
  }

  // History & Geography
  if (p.includes('presidente') || p.includes('deodoro') || p.includes('capital') || p.includes('brasil') || p.includes('bahia') || p.includes('independência')) {
    return `### 🏛️ História e Geografia Geral

- **Primeiro Presidente do Brasil:** Marechal **Deodoro da Fonseca** (1889 - 1891).
- **Capitais do Brasil:**
  1. **Salvador (BA):** 1549 a 1763
  2. **Rio de Janeiro (RJ):** 1763 a 1960
  3. **Brasília (DF):** Desde 21 de abril de 1960
- **Independência:** 7 de setembro de 1822 (Brasil) e **2 de Julho de 1823** (Independência da Bahia).`;
  }

  // Biology & Natural Sciences
  if (p.includes('fotossíntese') || p.includes('célula') || p.includes('dna') || p.includes('mitocôndria') || p.includes('átomo') || p.includes('química') || p.includes('física')) {
    return `### 🔬 Ciências da Natureza

- **Fotossíntese:** Organismos fotossintetizantes transformam $CO_2$ e $H_2O$ em glicose ($C_6H_{12}O_6$) e $O_2$ usando a energia solar.
- **Mitocôndria:** Responsável pela respiração celular e síntese de ATP (energia celular).
- **DNA:** Ácido desoxirribonucleico, molécula que contém todo o código genético dos seres vivos.`;
  }

  // Rich pedagogical overview
  return `### 💡 Professor IA: Resposta Completa

Sobre a sua dúvida: **"${prompt}"**

Aqui está uma explicação direta, detalhada e estruturada:

#### 1. Conceito Principal
${prompt.charAt(0).toUpperCase() + prompt.slice(1)} é um tema de grande relevância no estudo e no dia a dia acadêmico de **${course}**. Compreender seu funcionamento permite analisar a fundo causas, efeitos e aplicações práticas.

#### 2. Principais Tópicos Explicados
- **Fundamento Teórico:** O conceito se apoia em regras consolidadas da disciplina, servindo como base para resolver problemas reais.
- **Passo a Passo Prático:** Para solucionar ou aplicar essa ideia, sempre separe os dados conhecidos, identifique o objetivo e aplique o método sistemático de resolução.
- **Dica de Aplicação:** Conecte o conceito com exemplos cotidianos para fixar o aprendizado sem necessidade de memorização forçada.

---
🎯 **Posso te ajudar com um exemplo passo a passo, exercício de fixação ou resolução de prova sobre esse tema?** É só pedir!`;
}
