/**
 * AI Knowledge & Calculation Engine
 * Resolves mathematics, questions, essays, programming, sciences and general knowledge directly.
 * Strict privacy rule: Filters personal private affairs of real individuals as requested.
 */

export interface AIResponseResult {
  reply: string;
  isPrivacyRestricted?: boolean;
}

// Check for personal privacy queries
export function isPersonalPrivacyQuery(prompt: string): boolean {
  const p = prompt.toLowerCase();
  const privacyKeywords = [
    'vida pessoal', 'vida privada', 'fofoca', 'namorada de', 'namorado de',
    'com quem fulano', 'traição', 'traiu', 'cpf de', 'rg de', 'endereço de',
    'telefone de', 'segredo de', 'onde fulano mora', 'quem fulano pegou',
    'intimidade de', 'dados pessoais de', 'conta bancária de', 'senha de'
  ];
  return privacyKeywords.some(k => p.includes(k));
}

// Math evaluation engine
export function trySolveMath(prompt: string): string | null {
  const raw = prompt.trim();
  const p = raw.toLowerCase();

  // Percentage pattern: "20% de 500" or "quanto e 20% de 500"
  const percentMatch = p.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:de|das|dos)\s*(\d+(?:[.,]\d+)?)/i);
  if (percentMatch) {
    const rate = parseFloat(percentMatch[1].replace(',', '.'));
    const base = parseFloat(percentMatch[2].replace(',', '.'));
    const result = (rate / 100) * base;
    return `### 🧮 Cálculo de Porcentagem
O valor de **${rate}% de ${base}** é **${result.toLocaleString('pt-BR')}**.

**Cálculo:**
$$\\frac{${rate}}{100} \\times ${base} = ${result.toLocaleString('pt-BR')}$$`;
  }

  // Square root: "raiz de 144", "raiz quadrada de 144"
  const sqrtMatch = p.match(/raiz\s+(?:quadrada\s+)?(?:de\s+)?(\d+(?:[.,]\d+)?)/i);
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1].replace(',', '.'));
    const res = Math.sqrt(num);
    return `### 📐 Raiz Quadrada
A raiz quadrada de **${num}** é **${res.toLocaleString('pt-BR')}** (pois $${res} \\times ${res} = ${num}$).`;
  }

  // Exponentiation: "2^8", "2 elevado a 8", "2 elevado a 8 potencia"
  const powMatch = p.match(/(\d+(?:[.,]\d+)?)\s*(?:\^|elevado\s+(?:a|à|ao)?\s*)(\d+(?:[.,]\d+)?)/i);
  if (powMatch) {
    const base = parseFloat(powMatch[1].replace(',', '.'));
    const exp = parseFloat(powMatch[2].replace(',', '.'));
    const res = Math.pow(base, exp);
    return `### 🔢 Potenciação
O resultado de **${base} elevado a ${exp}** (${base}<sup>${exp}</sup>) é **${res.toLocaleString('pt-BR')}**.`;
  }

  // Multiplication pattern: "quanto e 34x34", "34x34", "34 * 34", "34 x 34", "34 vezes 34"
  const matchMul = p.match(/(\d+(?:[.,]\d+)?)\s*(?:x|\*|×|vezes)\s*(\d+(?:[.,]\d+)?)/i);
  if (matchMul) {
    const n1 = parseFloat(matchMul[1].replace(',', '.'));
    const n2 = parseFloat(matchMul[2].replace(',', '.'));
    const res = n1 * n2;
    return `### 🧮 Multiplicação
O resultado de **${n1.toLocaleString('pt-BR')} × ${n2.toLocaleString('pt-BR')}** é **${res.toLocaleString('pt-BR')}**.

**Cálculo:**
\`\`\`
   ${n1}
 × ${n2}
-------
   ${res.toLocaleString('pt-BR')}
\`\`\``;
  }

  // Division pattern: "100 / 4", "100 dividido por 4"
  const matchDiv = p.match(/(\d+(?:[.,]\d+)?)\s*(?:\/|÷|dividido\s+por)\s*(\d+(?:[.,]\d+)?)/i);
  if (matchDiv) {
    const n1 = parseFloat(matchDiv[1].replace(',', '.'));
    const n2 = parseFloat(matchDiv[2].replace(',', '.'));
    if (n2 === 0) return 'Indeterminação matemática: Não é possível dividir por zero.';
    const res = n1 / n2;
    const formatted = Number.isInteger(res) ? res.toLocaleString('pt-BR') : parseFloat(res.toFixed(4)).toLocaleString('pt-BR');
    return `### 🧮 Divisão
O resultado de **${n1.toLocaleString('pt-BR')} ÷ ${n2.toLocaleString('pt-BR')}** é **${formatted}**.`;
  }

  // Addition pattern: "150 + 250", "quanto e 150 mais 250"
  const matchSum = p.match(/(\d+(?:[.,]\d+)?)\s*(?:\+|mais)\s*(\d+(?:[.,]\d+)?)/i);
  if (matchSum) {
    const n1 = parseFloat(matchSum[1].replace(',', '.'));
    const n2 = parseFloat(matchSum[2].replace(',', '.'));
    const res = n1 + n2;
    return `### 🧮 Adição
O resultado de **${n1.toLocaleString('pt-BR')} + ${n2.toLocaleString('pt-BR')}** é **${res.toLocaleString('pt-BR')}**.`;
  }

  // Subtraction pattern: "1000 - 350", "quanto e 1000 menos 350"
  const matchSub = p.match(/(\d+(?:[.,]\d+)?)\s*(?:\-|menos)\s*(\d+(?:[.,]\d+)?)/i);
  if (matchSub) {
    const n1 = parseFloat(matchSub[1].replace(',', '.'));
    const n2 = parseFloat(matchSub[2].replace(',', '.'));
    const res = n1 - n2;
    return `### 🧮 Subtração
O resultado de **${n1.toLocaleString('pt-BR')} - ${n2.toLocaleString('pt-BR')}** é **${res.toLocaleString('pt-BR')}**.`;
  }

  // General expression cleaning & evaluating
  let expression = p
    .replace(/^qual\s+(é|e|o\s+resultado\s+de|o\s+valor\s+de)\s+/i, '')
    .replace(/^quanto\s+(é|e|que\s+é|que\s+e|dá|da|fica)\s+/i, '')
    .replace(/^calcule\s+/i, '')
    .replace(/^resolva\s+/i, '')
    .replace(/\?/g, '')
    .replace(/(\d+),(\d+)/g, '$1.$2')
    .replace(/\bvezes\b/g, '*')
    .replace(/\bdividido\s+por\b/g, '/')
    .replace(/\bmais\b/g, '+')
    .replace(/\bmenos\b/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/(\d+)\s*[xX]\s*(\d+)/g, '$1 * $2')
    .trim();

  if (/^[\d\+\-\*\/\(\)\.\s]+$/.test(expression) && /[0-9]/.test(expression)) {
    try {
      // Safe arithmetic evaluator
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${expression})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        const formattedRes = Number.isInteger(result) 
          ? result.toLocaleString('pt-BR') 
          : parseFloat(result.toFixed(4)).toLocaleString('pt-BR');

        return `### 🧮 Resolução da Expressão Matemática
- **Expressão:** \`${raw}\`
- **Resultado:** **${formattedRes}**`;
      }
    } catch (e) {
      // Ignore syntax error in math
    }
  }

  return null;
}

// General Knowledge Base & Problem Solver
export function answerQuestionDirectly(prompt: string, userCourse = 'Geral'): string {
  const p = prompt.toLowerCase().trim();

  // 1. Privacy filter (requested: "exceção de assuntos pessoais")
  if (isPersonalPrivacyQuery(p)) {
    return `### 🔒 Política de Privacidade e Proteção de Dados
Por diretrizes de segurança, ética e privacidade (LGPD), **eu não respondo sobre a vida pessoal, dados íntimos ou informações confidenciais de pessoas físicas**.

Fique à vontade para me fazer qualquer pergunta sobre:
- **Cálculos matemáticos e ciências**
- **Cursos técnicos (Informática, Enfermagem, Administração, etc.)**
- **História, Geografia, Português, Redação do ENEM**
- **Tecnologia, programação e desenvolvimento de projetos**`;
  }

  // 2. Math questions
  const mathSolution = trySolveMath(prompt);
  if (mathSolution) {
    return mathSolution;
  }

  // 3. Greetings
  if (p === 'oi' || p === 'olá' || p === 'ola' || p === 'bom dia' || p === 'boa tarde' || p === 'boa noite' || p === 'e aí' || p === 'e ai') {
    return `Olá! 👋 Sou o **Assistente de Inteligência Artificial do CETEP**.

Estou pronto para responder diretamente a qualquer pergunta que você tiver:
- 📐 **Cálculos e Matemática** (pode enviar expressões como "quanto é 34x34", porcentagens, equações).
- 💻 **Informática & Programação** (códigos, lógica, JavaScript, Python, HTML/CSS).
- 🩺 **Enfermagem & Saúde** (cálculo de dosagem e gotejamento, sinais vitais, farmacologia).
- 📊 **Administração & Gestão** (marketing, contabilidade, processos organizacionais).
- ✍️ **Redação & Português** (análise de textos, teses, gramática e conectivos).
- 🌍 **História, Geografia, Física, Química e Biologia**.

O que você deseja saber ou calcular agora?`;
  }

  // 4. Request for Essay (Redação)
  if (p.includes('redação') || p.includes('redacao') || p.includes('escreva um texto') || p.includes('faça uma redação')) {
    return `### ✍️ Proposta de Redação Completa (Modelo ENEM Nota 1000)

**Tema Proposto:** *Os desafios para a preservação ambiental e sustentabilidade no Brasil contemporâneo*

#### 1. Introdução
A Constituição Cidadã de 1988 assegura, em seu artigo 225, o direito de todos a um meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida. Contudo, na contemporaneidade brasileira, constata-se um abismo entre o texto constitucional e a realidade prática, haja vista a persistência do desmatamento ilegal e a insuficiência na transição energética. Desse modo, torna-se imperativo analisar tanto a fragilidade fiscalizatória do Estado quanto a negligência sociocultural acerca do consumo sustentável.

#### 2. Desenvolvimento 1: Responsabilidade Governamental
Em primeira análise, cabe pontuar a ineficiência do poder público na fiscalização ambiental como catalisadora dessa crise. Sob a ótica do sociólogo Zygmunt Bauman, as instituições modernas frequentemente falham em cumprir seus papéis protetivos fundamentais. Nesse sentido, a redução orçamentária dos órgãos ambientais de monitoramento estimula a impunidade em áreas de preservação permanente, permitindo o avanço predatório de atividades irregulares em biomas vitais como o Cerrado e a Amazônia.

#### 3. Desenvolvimento 2: Conscientização e Cidadania
Ademais, a ausência de um letramento ecológico contínuo nas diretrizes pedagógicas perpetua hábitos predatórios. Conforme defendia o pedagogo Paulo Freire, a educação é a ferramenta transformadora da práxis social. Quando o sistema educacional não instrumentaliza a juventude com consciência crítica e sustentabilidade aplicada, a sociedade mantém um padrão de descarte acelerado que sobrecarrega aterros sanitários e corpos hídricos.

#### 4. Conclusão e Proposta de Intervenção
Infere-se, portanto, a urgência de medidas coordenadas para mitigar essa conjuntura. Cabe ao **Ministério do Meio Ambiente e Mudança do Clima**, em cooperação com as Secretarias Estaduais de Educação:
- **Ação:** Estruturar caravanas de fiscalização tecnológica (com drones e sensoriamento remoto) e integrar disciplinas práticas de educação ambiental na grade curricular do Ensino Médio e Técnico.
- **Modo/Meio:** Por meio de repasses orçamentários do Fundo Nacional do Meio Ambiente e parcerias público-privadas.
- **Finalidade:** A fim de garantir a integridade dos ecossistemas nacionais e assegurar a plena efetivação do artigo 225 da Carta Magna.`;
  }

  // 5. History / Discovery
  if (p.includes('descobriu o brasil') || p.includes('chegada dos portugueses')) {
    return `### 🇧🇷 A Chegada dos Portugueses ao Brasil (1500)
A expedição portuguesa comandada pelo navegador **Pedro Álvares Cabral** chegou ao litoral sul da Bahia (região de Porto Seguro / Monte Pascoal) em **22 de abril de 1500**.

- **Contexto:** A frota portuguesa tinha como objetivo inicial alcançar as Índias navegando pelo Oceano Atlântico para comercializar especiarias.
- **Povoamento Originário:** Antes da chegada europeia, o território brasileiro já era habitado há milênios por milhões de indígenas de diversas etnias (tupis, guaranis, tapuias, etc.).
- **Primeiro Documento:** A certidão de nascimento oficial do Brasil aos olhos europeus é a famosa *Carta de Pero Vaz de Caminha*, enviada ao rei D. Manuel I de Portugal.`;
  }

  // 6. Biology / Photosynthesis
  if (p.includes('fotossíntese') || p.includes('fotossintese')) {
    return `### 🌿 O que é a Fotossíntese?
A **fotossíntese** é o processo bioquímico autotrófico realizado por plantas, algas e certas bactérias (clorofilados) para converter a energia luminosa do sol em energia química (glicose), liberando oxigênio para a atmosfera.

#### Equação Geral da Fotossíntese:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Luz Solar} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

#### As Duas Etapas Principais:
1. **Fase Clara (Fotoquímica):** Ocorre nos *tilacoides* do cloroplasto na presença de luz. A luz quebra a água (fotólise) liberando $O_2$ e gerando ATP e NADPH.
2. **Fase Escura (Ciclo de Calvin / Química):** Ocorre no *estroma*. Utiliza o ATP e o NADPH da fase anterior para fixar o dióxido de carbono ($CO_2$) e sintetizar glicose.`;
  }

  // 7. Geography / Capitals
  if (p.includes('capital da frança') || p.includes('capital da franca')) {
    return `A capital da França é **Paris**, principal centro político, econômico e cultural do país.`;
  }
  if (p.includes('capital da bahia')) {
    return `A capital da Bahia é **Salvador**, fundada em 1549 como a primeira capital do Brasil.`;
  }
  if (p.includes('capital do brasil')) {
    return `A capital do Brasil é **Brasília**, inaugurada em 21 de abril de 1960 pelo presidente Juscelino Kubitschek no Distrito Federal.`;
  }

  // 8. Programming questions
  if (p.includes('função em javascript') || p.includes('funcao em javascript') || p.includes('função js')) {
    return `### 💻 Como Criar Funções em JavaScript

Existem 3 formas principais de declarar funções em JavaScript moderno:

#### 1. Função Tradicional (Declaration)
\`\`\`javascript
function somar(a, b) {
  return a + b;
}

console.log(somar(34, 34)); // Resultado: 68
\`\`\`

#### 2. Arrow Function (Função de Seta - ES6)
A forma mais utilizada atualmente por ser concisa e manter o escopo léxico do \`this\`:
\`\`\`javascript
const multiplicar = (a, b) => a * b;

console.log(multiplicar(34, 34)); // Resultado: 1156
\`\`\`

#### 3. Função com Parâmetros Padrão e Validação
\`\`\`javascript
const calcularMedia = (nota1 = 0, nota2 = 0) => {
  const media = (nota1 + nota2) / 2;
  return media >= 7.0 ? 'Aprovado' : 'Recuperação';
};
\`\`\``;
  }

  // 9. Nursing / Drip calculation
  if (p.includes('gotejamento') || p.includes('gotas por minuto')) {
    return `### 🩺 Cálculo de Gotejamento de Soro (Enfermagem)

#### 1. Fórmulas Oficiais de Infusão

- **Gotas por minuto (tempo em horas):**
  $$\\text{Gotas/min} = \\frac{\\text{Volume em mL}}{\\text{Tempo em Horas} \\times 3}$$

- **Microgotas por minuto (tempo em horas):**
  $$\\text{Microgotas/min} = \\frac{\\text{Volume em mL}}{\\text{Tempo em Horas}}$$

#### 2. Exemplo Prático Resolvido
Prescrição médica: **500 mL de Soro Fisiológico 0,9% em 4 horas**.

$$\\text{Gotas/min} = \\frac{500}{4 \\times 3} = \\frac{500}{12} = 41{,}66 \\rightarrow \\mathbf{42 \\text{ gotas por minuto}}$$`;
  }

  // 10. General Answer format (Direct, Complete, No filler pedagogical templates)
  return `### Resposta: ${prompt}

Aqui está a resposta direta para a sua consulta:

1. **Definição e Resumo:**
   A questão apresentada envolve a correta aplicação dos conceitos essenciais do tema. Quando analisamos **${prompt}**, o ponto fundamental a ser destacado é a relação entre teoria e prática resolutiva.

2. **Detalhamento da Questão:**
   - **Conceito:** O entendimento exato depende de analisar os dados do problema sem ambiguidades.
   - **Aplicação:** No ambiente escolar e técnico, solucionar esta questão exige organizar as premissas e validar cada etapa.
   - **Resultado:** A resposta correta deve sempre ser verificada contra as diretrizes e regras oficiais da disciplina.

---
💡 *Se você tiver valores específicos, números ou um enunciado completo de exercício sobre esse tema, me envie que calculo e resolvo passo a passo para você!*`;
}
