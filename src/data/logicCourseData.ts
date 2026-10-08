export interface LogicQuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface LogicKeyConcept {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface LogicTheoryContent {
  introduction: string;
  keyConcepts: LogicKeyConcept[];
  stepByStep: string[];
  interactiveExercisePrompt: string;
  defaultCode: string;
  expectedOutputHint: string;
  proTip: string;
  commonErrors: string;
}

export interface LogicLesson {
  id: number;
  lessonNumber: number;
  title: string;
  module: string;
  duration: string;
  summary: string;
  videoUrl: string;
  videoTitle: string;
  videoHighlights: string[];
  theoryContent: LogicTheoryContent;
  quiz: LogicQuizQuestion[];
}

export const allLogicLessons: LogicLesson[] = [
  {
    id: 1,
    lessonNumber: 1,
    title: 'Fundamentos de Algoritmos e Raciocínio Lógico',
    module: 'Módulo 1: Introdução ao Pensamento Computacional',
    duration: '2h30',
    summary: 'Compreenda o conceito de algoritmo, sequência de instruções, fluxo de entrada, processamento e saída.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/8mei6uVttho',
    videoTitle: 'Curso em Vídeo - O que é um Algoritmo e Lógica de Programação',
    videoHighlights: [
      'Conceito fundamental de algoritmo na vida cotidiana e na computação',
      'Etapas universais: Entrada (Input), Processamento e Saída (Output)',
      'Diferença entre linguagem humana, pseudocódigo (Portugol) e linguagem de máquina',
      'Construção do primeiro algoritmo passo a passo'
    ],
    theoryContent: {
      introduction: 'Um algoritmo é simplesmente uma sequência finita de passos bem definidos e organizados para resolver um problema específico ou realizar uma tarefa. Na programação, todo software moderno — desde o Instagram até sistemas de foguetes — é composto por algoritmos que recebem dados, os processam e geram uma saída.',
      keyConcepts: [
        {
          title: 'As Três Etapas Universais',
          description: '1. Entrada (dados fornecidos pelo usuário ou sensores); 2. Processamento (cálculos, comparações e regras de negócio); 3. Saída (resultado exibido na tela ou gravado no banco de dados).',
          codeSnippet: `// 1. Entrada
let nome = "Lucas";
// 2. Processamento
let saudacao = "Olá, " + nome + "! Bem-vindo ao CETEP.";
// 3. Saída
console.log(saudacao);`
        },
        {
          title: 'Determinismo e Finitude',
          description: 'Todo algoritmo correto precisa produzir o mesmo resultado para as mesmas entradas e deve ter um ponto final garantido, sem cair em execução infinita não planejada.'
        }
      ],
      stepByStep: [
        'Compreenda o problema com clareza antes de escrever qualquer código.',
        'Escreva os passos em linguagem natural ou pseudocódigo no papel.',
        'Identifique quais variáveis e dados são necessários na entrada.',
        'Defina quais operações aritméticas ou lógicas devem ser executadas.',
        'Exiba a saída esperada e teste com diferentes cenários.'
      ],
      interactiveExercisePrompt: 'Crie uma mensagem que receba o nome de um aluno e o curso que ele estuda no CETEP, exibindo a frase de boas-vindas completa.',
      defaultCode: `let aluno = "Mariana";
let curso = "Técnico em Informática";

console.log("Estudante: " + aluno);
console.log("Curso no CETEP: " + curso);
console.log("Status: Matrícula Ativa no Sistema");`,
      expectedOutputHint: 'Deverá imprimir o nome, o curso e a confirmação de matrícula.',
      proTip: 'Nunca tente resolver o problema e programar a sintaxe ao mesmo tempo. Primeiro resolva a lógica mentalmente, depois traduza para o código.',
      commonErrors: 'Esquecer de finalizar as instruções ou confundir o valor de uma variável com seu nome em texto.'
    },
    quiz: [
      {
        id: 101,
        question: 'O que define formalmente um algoritmo na ciência da computação?',
        options: [
          'Uma sequência finita de instruções lógicas e ordenadas para resolver um problema',
          'Um hardware físico responsável por processar sinais de vídeo',
          'Uma linguagem de formatação gráfica como CSS',
          'Qualquer código que contenha erros de compilação'
        ],
        correctIndex: 0,
        explanation: 'Um algoritmo é a sequência ordenada e finita de passos que visa resolver um problema.'
      },
      {
        id: 102,
        question: 'Quais são as três etapas fundamentais de qualquer fluxo de algoritmo?',
        options: [
          'Entrada, Processamento e Saída',
          'Design, Hospedagem e Divulgação',
          'Download, Instalação e Desinstalação',
          'Compilação, Formatação e Impressão'
        ],
        correctIndex: 0,
        explanation: 'Todo algoritmo recebe dados na Entrada, opera sobre eles no Processamento e exibe o resultado na Saída.'
      },
      {
        id: 103,
        question: 'Em um programa de cálculo de média escolar, o que representa a etapa de "Entrada"?',
        options: [
          'As notas individuais informadas pelo professor ou aluno',
          'A média final impressa no boletim',
          'O cálculo matemático (nota1 + nota2) / 2',
          'A cor do botão na interface web'
        ],
        correctIndex: 0,
        explanation: 'As notas fornecidas são os dados de Entrada necessários para o cálculo.'
      },
      {
        id: 104,
        question: 'O que é Pseudocódigo (ou Portugol)?',
        options: [
          'Uma forma de escrever algoritmos em linguagem próxima do português sem se preocupar com sintaxe de uma linguagem específica',
          'Um vírus de computador que altera o teclado para português',
          'Um compilador proprietário da Microsoft para Windows',
          'Uma linguagem exclusiva para criação de jogos em 3D'
        ],
        correctIndex: 0,
        explanation: 'Pseudocódigo permite focar na lógica do problema sem as restrições rígidas de sintaxe de uma linguagem específica.'
      },
      {
        id: 105,
        question: 'Qual é o resultado da execução do comando console.log("CETEP" + " " + "2026")?',
        options: [
          'CETEP 2026',
          'CETEP2026',
          'Erro de tipagem',
          'NaN (Not a Number)'
        ],
        correctIndex: 0,
        explanation: 'O operador + entre strings realiza a concatenação dos textos, incluindo o espaço intermediário.'
      },
      {
        id: 106,
        question: 'Por que a finitude é uma propriedade essencial de um algoritmo?',
        options: [
          'Porque o algoritmo deve obrigatoriamente terminar sua execução após um número determinado de passos',
          'Porque o computador desliga caso o código tenha mais de 100 linhas',
          'Porque todo programa só pode ser executado uma única vez na vida',
          'Porque a memória RAM é reiniciada a cada 5 segundos'
        ],
        correctIndex: 0,
        explanation: 'Um algoritmo que nunca termina entra em loop infinito e trava a aplicação.'
      },
      {
        id: 107,
        question: 'Qual destes NÃO é um exemplo prático de algoritmo na vida cotidiana?',
        options: [
          'O clima e a temperatura do dia',
          'Uma receita de bolo detalhada passo a passo',
          'O manual de instruções para montar uma cadeira',
          'O passo a passo para sacar dinheiro em um caixa eletrônico'
        ],
        correctIndex: 0,
        explanation: 'A temperatura é um dado/estado climático, enquanto receitas e manuais são instruções sequenciais (algoritmos).'
      },
      {
        id: 108,
        question: 'O que significa a palavra "depuração" (debugging) na programação?',
        options: [
          'O processo de identificar, isolar e corrigir erros lógicos ou de sintaxe no código',
          'A compra de novas peças de computador',
          'A compactação de um arquivo para formato ZIP',
          'A exclusão de todos os comentários do código-fonte'
        ],
        correctIndex: 0,
        explanation: 'Debugging consiste em localizar onde a lógica falhou e consertar o código.'
      },
      {
        id: 109,
        question: 'Em lógica de programação, o que é um "teste de mesa"?',
        options: [
          'Acompanhar manualmente o valor de cada variável linha por linha no papel para checar o funcionamento',
          'Verificar se a mesa do computador suporta o peso do monitor',
          'Um teste ergonômico para estagiários',
          'Um benchmark de velocidade do processador'
        ],
        correctIndex: 0,
        explanation: 'O teste de mesa simula mentalmente ou no papel a execução de cada instrução com valores reais.'
      },
      {
        id: 110,
        question: 'Qual a principal vantagem de aprender lógica de programação antes de uma linguagem específica?',
        options: [
          'A lógica é universal e se aplica a JavaScript, Python, C++, Java e qualquer linguagem',
          'Elimina a necessidade de usar computadores para programar',
          'Permite criar programas sem escrever código algum',
          'Garante que você nunca precisará estudar banco de dados'
        ],
        correctIndex: 0,
        explanation: 'Dominando o raciocínio lógico, aprender a sintaxe de qualquer linguagem futura torna-se natural e rápido.'
      }
    ]
  },
  {
    id: 2,
    lessonNumber: 2,
    title: 'Variáveis, Constantes e Tipos de Dados Primitivos',
    module: 'Módulo 2: Armazenamento e Manipulação de Dados',
    duration: '2h45',
    summary: 'Aprenda a declarar e manipular variáveis, constantes, tipos numéricos, textos e booleanos na memória.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/V9P_s2Xj01k',
    videoTitle: 'Curso em Vídeo - Variáveis e Tipos Primitivos de Dados',
    videoHighlights: [
      'O que é uma variável e como a memória RAM armazena dados',
      'Tipos fundamentais: Inteiro, Real (Float), Texto (String) e Lógico (Boolean)',
      'Diferença entre let, const e declaração de escopo',
      'Boas práticas de nomenclatura (camelCase, nomes expressivos)'
    ],
    theoryContent: {
      introduction: 'Uma variável é um espaço identificado na memória do computador usado para armazenar um valor temporário que pode mudar durante a execução do programa. Já uma constante guarda um valor imutável que deve permanecer fixo.',
      keyConcepts: [
        {
          title: 'Tipos Primitivos Fundamentais',
          description: 'Number (números inteiros ou com ponto flutuante), String (sequência de caracteres entre aspas), Boolean (verdadeiro/true ou falso/false) e Null/Undefined (ausência de valor).',
          codeSnippet: `let idade = 17;              // Number (Inteiro)
let peso = 68.5;             // Number (Real / Float)
let nome = "Carlos Eduardo"; // String (Texto)
let matriculado = true;      // Boolean (Verdadeiro ou Falso)
const PI = 3.14159;          // Constante (Valor imutável)`
        },
        {
          title: 'Convenção camelCase',
          description: 'Nomes de variáveis devem começar com letra minúscula e cada palavra subsequente com maiúscula: dataNascimento, notaFinal, emailResponsavel.'
        }
      ],
      stepByStep: [
        'Escolha nomes que descrevam com exatidão o conteúdo armazenado.',
        'Use const sempre que o valor não precisar ser alterado durante a execução.',
        'Use let quando o valor for acumulador, contador ou for sofrer reatribuição.',
        'Nunca use caracteres especiais, acentos ou espaços no nome de variáveis.',
        'Sempre inicialize variáveis com valores válidos antes de utilizá-las em contas.'
      ],
      interactiveExercisePrompt: 'Calcule a média aritmética simples entre três notas de um aluno do CETEP e armazene o resultado em uma variável.',
      defaultCode: `const nota1 = 8.5;
const nota2 = 7.0;
const nota3 = 9.5;

const soma = nota1 + nota2 + nota3;
const media = soma / 3;

console.log("Nota 1: " + nota1);
console.log("Nota 2: " + nota2);
console.log("Nota 3: " + nota3);
console.log("Média Final: " + media.toFixed(1));`,
      expectedOutputHint: 'Deverá exibir as 3 notas e a média calculada (8.3).',
      proTip: 'Dê preferência a "const" por padrão. Se perceber que a variável precisará mudar ao longo do tempo, altere para "let". Evite o antigo "var".',
      commonErrors: 'Tentar atribuir um novo valor a uma variável declarada com const resulta em TypeError.'
    },
    quiz: [
      {
        id: 201,
        question: 'Qual é a diferença fundamental entre "let" e "const" na declaração de variáveis?',
        options: [
          'Variáveis com "let" podem ter seus valores reatribuídos; variáveis com "const" têm valor fixo e imutável',
          '"let" só aceita números e "const" só aceita texto',
          '"const" só funciona dentro de navegadores e "let" no servidor',
          'Não há diferença alguma, são apenas sinônimos'
        ],
        correctIndex: 0,
        explanation: 'const declara uma constante imutável; let permite que a variável receba novos valores durante a execução.'
      },
      {
        id: 202,
        question: 'Qual tipo de dado é adequado para armazenar se um aluno obteve ou não aprovação no semestre?',
        options: [
          'Booleano (Boolean: true ou false)',
          'String de 500 caracteres',
          'Número decimal infinito',
          'Vetor multidimensional'
        ],
        correctIndex: 0,
        explanation: 'Um booleano armazena estados binários como verdadeiro (aprovado) ou falso (reprovado).'
      },
      {
        id: 203,
        question: 'Qual dos seguintes nomes de variável segue a convenção camelCase recomendada?',
        options: [
          'notaFinalDoBimestre',
          'NOTA_FINAL_DO_BIMESTRE',
          'nota-final-do-bimestre',
          '1notaFinal'
        ],
        correctIndex: 0,
        explanation: 'camelCase começa com minúscula e capitaliza a primeira letra de cada palavra seguinte.'
      },
      {
        id: 204,
        question: 'Qual o valor e o tipo da variável resultado na linha: let resultado = 10 + "5"?',
        options: [
          '"105" (String)',
          '15 (Number)',
          '50 (Number)',
          'Erro de compilação'
        ],
        correctIndex: 0,
        explanation: 'Em JavaScript, somar um número com uma string converte o número para string e concatena, resultando em "105".'
      },
      {
        id: 205,
        question: 'Qual dos seguintes NÃO é um tipo primitivo em JavaScript?',
        options: [
          'Database',
          'Number',
          'String',
          'Boolean'
        ],
        correctIndex: 0,
        explanation: 'Database é um conceito de armazenamento externo, não um tipo primitivo da linguagem.'
      },
      {
        id: 206,
        question: 'O que acontece ao tentar reatribuir o valor de uma constante: const taxa = 0.1; taxa = 0.2;?',
        options: [
          'Ocorre um erro de execução (TypeError: Assignment to constant variable)',
          'A taxa muda silenciosamente para 0.2',
          'O valor da taxa vira 0.3',
          'O programa apaga a memória RAM'
        ],
        correctIndex: 0,
        explanation: 'Constantes não aceitam nova atribuição; o interpretador lança um erro imediato.'
      },
      {
        id: 207,
        question: 'Para guardar o preço de uma passagem de ônibus escolar (ex: R$ 4,50), qual tipo numérico usamos?',
        options: [
          'Ponto flutuante / Decimal (Float/Number)',
          'Inteiro puro sem vírgula',
          'Booleano',
          'Caractere único'
        ],
        correctIndex: 0,
        explanation: 'Valores monetários contêm casas decimais e são representados por tipos numéricos de ponto flutuante.'
      },
      {
        id: 208,
        question: 'O que a palavra-chave typeof faz em JavaScript?',
        options: [
          'Retorna uma string indicando o tipo de dado do valor fornecido',
          'Converte uma variável para maiúsculas',
          'Apaga o conteúdo da variável',
          'Exibe o número da linha de código'
        ],
        correctIndex: 0,
        explanation: 'typeof valor informa se a variável é "string", "number", "boolean", "object", etc.'
      },
      {
        id: 209,
        question: 'Por que o nome de uma variável NÃO pode começar com um número (ex: 1aluno)?',
        options: [
          'Porque os interpretadores e compiladores confundem com literais numéricos na análise léxica',
          'Porque os teclados antigos não possuíam números na primeira linha',
          'Porque números ocupam mais bytes na memória RAM',
          'Porque a legislação brasileira proíbe'
        ],
        correctIndex: 0,
        explanation: 'Identificadores não podem iniciar com dígitos para evitar ambiguidade com números.'
      },
      {
        id: 210,
        question: 'O que significa o valor null em programação?',
        options: [
          'A ausência intencional de qualquer valor de objeto',
          'O número zero (0)',
          'Uma string vazia ("")',
          'Um erro grave de hardware'
        ],
        correctIndex: 0,
        explanation: 'null é um valor atribuído explicitamente para representar "nenhum valor ou objeto associado".'
      }
    ]
  },
  {
    id: 3,
    lessonNumber: 3,
    title: 'Operadores Aritméticos, Relacionais e Lógicos',
    module: 'Módulo 3: Expressões e Avaliação Lógica',
    duration: '3h00',
    summary: 'Domine operações matemáticas, comparações de igualdade e desigualdade e operadores lógicos E, OU e NÃO.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/BPyd_hyv2wI',
    videoTitle: 'Curso em Vídeo - Operadores e Expressões em Programação',
    videoHighlights: [
      'Operadores aritméticos (+, -, *, /, %, **)',
      'Operadores relacionais (==, ===, !=, !==, >, <, >=, <=)',
      'Operadores lógicos (&& / E, || / OU, ! / NÃO)',
      'Precedência de operadores e construção de tabelas-verdade'
    ],
    theoryContent: {
      introduction: 'Operadores são símbolos que realizam ações sobre valores e variáveis para produzir novos resultados. O domínio dos operadores lógicos e relacionais é o coração de toda tomada de decisão dentro de um programa.',
      keyConcepts: [
        {
          title: 'Operador de Resto da Divisão (%)',
          description: 'Retorna o resto inteiro de uma divisão. Muito usado para saber se um número é par ou ímpar (num % 2 === 0).',
          codeSnippet: `let numero = 14;
let ehPar = (numero % 2 === 0); // true`
        },
        {
          title: 'Operadores Lógicos && (E) e || (OU)',
          description: '&& exige que TODAS as condições sejam verdadeiras. || exige que PELO MENOS UMA condição seja verdadeira. ! inverte o valor booleano.',
          codeSnippet: `let media = 8.5;
let frequencia = 80; // em %

// Precisa ter média >= 7 E frequência >= 75%
let aprovado = (media >= 7.0) && (frequencia >= 75);
console.log("Aprovado: " + aprovado); // true`
        }
      ],
      stepByStep: [
        'Respeite a ordem de precedência: parênteses primeiro, depois aritmética (* e / antes de + e -), depois relacionais, e por fim lógicos.',
        'Use sempre === e !== (igualdade estrita) para evitar coerção silenciosa de tipos.',
        'Ao compor condições com E (&&) e OU (||), use parênteses para deixar clara a intenção.',
        'Teste os casos extremos (exatamente o valor limite, ex: 7.0).'
      ],
      interactiveExercisePrompt: 'Verifique se um estudante tem direito à bolsa de estudos: precisa ter média maior ou igual a 8.5 e renda familiar menor que 2000.',
      defaultCode: `const mediaAluno = 8.8;
const rendaFamiliar = 1850;

const temDireitoBolsa = (mediaAluno >= 8.5) && (rendaFamiliar < 2000);

console.log("Média: " + mediaAluno);
console.log("Renda: R$ " + rendaFamiliar);
console.log("Qualificado para Bolsa? " + (temDireitoBolsa ? "SIM" : "NÃO"));`,
      expectedOutputHint: 'Deverá imprimir "SIM" pois ambas as condições são atendidas.',
      proTip: 'A tabela-verdade do OU (||) só é falsa quando todos os lados são falsos. A do E (&&) só é verdadeira quando todos os lados são verdadeiros.',
      commonErrors: 'Usar = (atribuição) no lugar de === (comparação) dentro de expressões condicionais.'
    },
    quiz: [
      {
        id: 301,
        question: 'Qual é o resultado da expressão: 10 % 3?',
        options: [
          '1 (resto da divisão de 10 por 3)',
          '3.33',
          '30',
          '0'
        ],
        correctIndex: 0,
        explanation: '10 dividido por 3 é 3 com resto 1. O operador % retorna o resto inteiro da divisão.'
      },
      {
        id: 302,
        question: 'Qual é o resultado da expressão lógica: (true && false)?',
        options: [
          'false',
          'true',
          'null',
          'undefined'
        ],
        correctIndex: 0,
        explanation: 'O operador E (&&) exige que ambos os operandos sejam verdadeiros. Como um é falso, o resultado é false.'
      },
      {
        id: 303,
        question: 'Qual é o resultado da expressão: (true || false)?',
        options: [
          'true',
          'false',
          '0',
          'NaN'
        ],
        correctIndex: 0,
        explanation: 'O operador OU (||) retorna true se ao menos um dos lados for verdadeiro.'
      },
      {
        id: 304,
        question: 'Qual a diferença entre == e === em JavaScript?',
        options: [
          '=== compara o valor e o tipo estrito sem coerção; == tenta converter os tipos antes de comparar',
          '== é para números e === é para strings',
          '=== atribui um valor e == compara',
          'Não há diferença de comportamento'
        ],
        correctIndex: 0,
        explanation: '=== é o operador de igualdade estrita: 5 === "5" é false, enquanto 5 == "5" é true.'
      },
      {
        id: 305,
        question: 'O que o operador de negação ! faz com o valor booleano: !true?',
        options: [
          'Retorna false',
          'Retorna true',
          'Lança um erro de sintaxe',
          'Converte para número 1'
        ],
        correctIndex: 0,
        explanation: '! inverte o valor lógico: !true se torna false, e !false se torna true.'
      },
      {
        id: 306,
        question: 'Qual o valor da expressão matemática: 2 + 3 * 4?',
        options: [
          '14 (multiplicação tem precedência sobre a adição)',
          '20',
          '24',
          '9'
        ],
        correctIndex: 0,
        explanation: 'A multiplicação (3 * 4 = 12) é executada antes da adição (12 + 2 = 14).'
      },
      {
        id: 307,
        question: 'Como verificar se uma variável "idade" está entre 18 e 65 anos inclusive?',
        options: [
          'idade >= 18 && idade <= 65',
          'idade >= 18 || idade <= 65',
          '18 <= idade <= 65',
          'idade == 18 && 65'
        ],
        correctIndex: 0,
        explanation: 'Em programação, limites de faixa são expressos unindo duas comparações com &&.'
      },
      {
        id: 308,
        question: 'O operador += faz o quê na instrução: pontos += 10?',
        options: [
          'Soma 10 ao valor atual de pontos e armazena de volta na mesma variável',
          'Compara se pontos é igual a 10',
          'Multiplica pontos por 10',
          'Cria uma nova variável chamada dez'
        ],
        correctIndex: 0,
        explanation: 'pontos += 10 é uma forma abreviada e padrão para pontos = pontos + 10.'
      },
      {
        id: 309,
        question: 'Qual o resultado de: !(5 > 2)?',
        options: [
          'false (pois 5 > 2 é true, e a negação inverte para false)',
          'true',
          '5',
          'Erro'
        ],
        correctIndex: 0,
        explanation: '5 > 2 é verdadeiro; a negação ! torna o resultado final falso.'
      },
      {
        id: 310,
        question: 'Para testar se um número "x" é diferente de zero, qual operador relacional usamos?',
        options: [
          'x !== 0',
          'x ==! 0',
          'x <> 0',
          'x =/= 0'
        ],
        correctIndex: 0,
        explanation: '!== é o operador padrão de desigualdade estrita em linguagens modernas como JavaScript.'
      }
    ]
  },
  {
    id: 4,
    lessonNumber: 4,
    title: 'Estruturas Condicionais (SE / ENTÃO / SENÃO)',
    module: 'Módulo 4: Desvios de Fluxo e Tomada de Decisão',
    duration: '3h15',
    summary: 'Construa programas que tomam decisões dinâmicas usando if, else if, else e operadores ternários.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/cOCmwWq_q3M',
    videoTitle: 'Curso em Vídeo - Condições em Programação (Parte 1: If e Else)',
    videoHighlights: [
      'Desvio condicional simples (if)',
      'Desvio condicional composto (if / else)',
      'Condições encadeadas e aninhadas (else if)',
      'Operador ternário para simplificação de código'
    ],
    theoryContent: {
      introduction: 'Por padrão, um computador executa instruções de cima para baixo em linha reta. As estruturas condicionais quebram esse fluxo linear, permitindo que blocos de código só sejam executados se determinadas condições lógicas forem verdadeiras.',
      keyConcepts: [
        {
          title: 'Estrutura if / else if / else',
          description: 'Testa condições em ordem sequencial. Assim que a primeira é satisfeita, seu bloco executa e os demais são ignorados.',
          codeSnippet: `let media = 7.8;

if (media >= 7.0) {
  console.log("Situação: Aprovado direto!");
} else if (media >= 5.0) {
  console.log("Situação: Recuperação final.");
} else {
  console.log("Situação: Reprovado.");
}`
        },
        {
          title: 'Operador Ternário',
          description: 'Uma forma concisa de escrever um if/else simples em uma única linha: condicao ? valorSeTrue : valorSeFalse.',
          codeSnippet: `let status = (media >= 7.0) ? "Aprovado" : "Reprovado";`
        }
      ],
      stepByStep: [
        'Organize as condições da mais específica para a mais genérica.',
        'Sempre delimite os blocos com chaves {} mesmo para instruções de uma linha.',
        'Use else no final como tratamento padrão ou fallback de segurança.',
        'Evite aninhar mais de 3 níveis de if para manter a leitura limpa.'
      ],
      interactiveExercisePrompt: 'Verifique a categoria de uma carteira de motorista ou idade para entrada em curso técnico: menor de 15 anos não pode, 15 a 17 como jovem aprendiz, 18+ como técnico pleno.',
      defaultCode: `const idadeCandidato = 16;

if (idadeCandidato < 15) {
  console.log("Não atinge a idade mínima para inscrição.");
} else if (idadeCandidato <= 17) {
  console.log("Inscrição aceita: Modalidade Jovem Aprendiz Técnico.");
} else {
  console.log("Inscrição aceita: Modalidade Técnico Regular / Adulto.");
}`,
      expectedOutputHint: 'Deverá indicar "Inscrição aceita: Modalidade Jovem Aprendiz Técnico".',
      proTip: 'Se você tiver muitas ramificações baseadas em um único valor fixo (ex: 1, 2, 3), considere usar a estrutura switch-case da próxima aula.',
      commonErrors: 'Colocar ponto e vírgula logo após o if (ex: if (x > 10); { ... }) anula o efeito da condição e executa o bloco indevidamente.'
    },
    quiz: [
      {
        id: 401,
        question: 'O que acontece quando a condição dentro de um "if" é avaliada como false?',
        options: [
          'O bloco dentro do if é ignorado e o fluxo vai para o else (se existir) ou para a linha seguinte',
          'O computador encerra o programa imediatamente com erro',
          'A variável é apagada da memória',
          'O computador repete a instrução até virar true'
        ],
        correctIndex: 0,
        explanation: 'Quando false, o bloco do if é pulado e o programa segue para o else ou instrução subsequente.'
      },
      {
        id: 402,
        question: 'Quantos blocos "else if" podemos encadear após um if inicial?',
        options: [
          'Quantos forem necessários para cobrir as regras de negócio',
          'Exatamente um',
          'No máximo dois',
          'Nenhum, else if não existe'
        ],
        correctIndex: 0,
        explanation: 'Podemos usar quantos else if forem necessários para testar múltiplos cenários alternativos.'
      },
      {
        id: 403,
        question: 'O bloco "else" é obrigatório após todo "if"?',
        options: [
          'Não, ele é opcional e só deve ser usado quando houver uma ação alternativa a executar',
          'Sim, sem else o código não compila',
          'Sim, mas só para números negativos',
          'É obrigatório apenas no horário noturno'
        ],
        correctIndex: 0,
        explanation: 'O else é opcional. Se nada precisar ser feito quando a condição for falsa, o if simples basta.'
      },
      {
        id: 404,
        question: 'Qual a saída do código: let x = 5; if (x > 10) { console.log("A"); } else { console.log("B"); }?',
        options: [
          '"B"',
          '"A"',
          '"AB"',
          'Nenhuma saída'
        ],
        correctIndex: 0,
        explanation: 'Como 5 não é maior que 10, a condição é falsa e o bloco else executa, imprimindo "B".'
      },
      {
        id: 405,
        question: 'O que o operador ternário faz: let status = (idade >= 18) ? "Maior" : "Menor";?',
        options: [
          'Atribui "Maior" se idade >= 18 for verdadeiro; caso contrário, atribui "Menor"',
          'Gera um número aleatório entre 18 e 100',
          'Calcula a raiz quadrada da idade',
          'Multiplica a idade por 3'
        ],
        correctIndex: 0,
        explanation: 'O ternário avalia a condição antes da interrogação e escolhe o primeiro valor (se true) ou o segundo (se false).'
      },
      {
        id: 406,
        question: 'O que significa indentação no código-fonte?',
        options: [
          'O recuo visual de linhas de código para indicar hierarquia e blocos de comandos',
          'O salvamento automático na nuvem',
          'A troca de fonte para itálico',
          'A conversão de texto em número'
        ],
        correctIndex: 0,
        explanation: 'Indentar melhora a legibilidade e indica claramente quais comandos pertencem a qual estrutura de controle.'
      },
      {
        id: 407,
        question: 'Em um sistema escolar, se a média for 7.0 e a regra for if (media > 7.0), o que acontece?',
        options: [
          'A condição será FALSA, pois 7.0 não é estritamente maior que 7.0 (deveria ser >=)',
          'A condição será verdadeira automaticamente',
          'O sistema arredonda para 8.0',
          'Ocorre erro de sintaxe'
        ],
        correctIndex: 0,
        explanation: 'O operador > exige valor estritamente superior. Para incluir o 7.0 exato, usa-se >=.'
      },
      {
        id: 408,
        question: 'Qual o risco de colocar ponto e vírgula logo após o parêntese do if: if (pontos > 50); { salvar(); }?',
        options: [
          'A instrução condicional termina no ponto e vírgula e o bloco salvar() executará SEMPRE',
          'O computador desliga o monitor',
          'O código roda 10 vezes mais rápido',
          'Não há qualquer efeito'
        ],
        correctIndex: 0,
        explanation: 'O ponto e vírgula encerra a instrução do if precocemente, desvinculando o bloco de chaves subsequente.'
      },
      {
        id: 409,
        question: 'Em uma estrutura com múltiplos "else if", se o primeiro for verdadeiro, os demais são testados?',
        options: [
          'Não, assim que um bloco é executado, toda a estrutura condicional é encerrada',
          'Sim, todos são testados obrigatoriamente',
          'Apenas o último é testado',
          'Depende do sistema operacional'
        ],
        correctIndex: 0,
        explanation: 'A cadeia if-else if é mutuamente exclusiva: o primeiro que for verdadeiro executa e encerra o fluxo.'
      },
      {
        id: 410,
        question: 'Para validar se um usuário preencheu e-mail e senha antes de logar, qual estrutura usamos?',
        options: [
          'if (email.trim() !== "" && senha.trim() !== "")',
          'if (email.trim() == senha.trim())',
          'if (email || senha)',
          'else (email && senha)'
        ],
        correctIndex: 0,
        explanation: 'Garante que AMBOS os campos foram devidamente fornecidos pelo usuário.'
      }
    ]
  },
  {
    id: 5,
    lessonNumber: 5,
    title: 'Laços de Repetição: Enquanto (While) e Para (For)',
    module: 'Módulo 5: Iteração e Automação de Tarefas Repetitivas',
    duration: '3h30',
    summary: 'Aprenda a automatizar repetições, contar elementos e iterar sequências sem reescrever código.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/5rZqYPKItkY',
    videoTitle: 'Curso em Vídeo - Estruturas de Repetição (While e For)',
    videoHighlights: [
      'Conceito de iteração e repetição de blocos',
      'Estrutura while (repete enquanto a condição for verdadeira)',
      'Estrutura for (inicialização, condição e incremento controlados)',
      'Como evitar o temido loop infinito com variáveis de controle'
    ],
    theoryContent: {
      introduction: 'Computadores são excepcionais em repetir tarefas milhões de vezes sem cansar ou errar. Os laços de repetição (loops) permitem executar o mesmo bloco de comandos repetidamente até que uma condição de parada seja satisfeita.',
      keyConcepts: [
        {
          title: 'Estrutura While (Enquanto)',
          description: 'Usada quando não sabemos previamente quantas vezes a repetição irá ocorrer. Testa a condição antes de entrar no bloco.',
          codeSnippet: `let contador = 1;

while (contador <= 5) {
  console.log("Aula número: " + contador);
  contador++; // Incremento essencial para evitar loop infinito
}`
        },
        {
          title: 'Estrutura For (Para)',
          description: 'Ideal quando sabemos exatamente o limite inicial e final de repetições. Reúne inicialização, teste e incremento no cabeçalho.',
          codeSnippet: `for (let i = 1; i <= 5; i++) {
  console.log("Passo: " + i);
}`
        }
      ],
      stepByStep: [
        'Identifique qual é a condição de parada do laço.',
        'Certifique-se de que a variável de controle é modificada a cada volta.',
        'Use for quando souber o número exato de repetições.',
        'Use while quando a parada depender de um evento dinâmico ou validação de entrada.',
        'Fique atento aos comandos break (interrompe o laço) e continue (pula para a próxima volta).'
      ],
      interactiveExercisePrompt: 'Gere a tabuada completa de multiplicação de um número escolhido (ex: 7) de 1 a 10 usando um laço for.',
      defaultCode: `const tabuadaDo = 7;

console.log("--- TABUADA DO " + tabuadaDo + " ---");
for (let i = 1; i <= 10; i++) {
  let resultado = tabuadaDo * i;
  console.log(tabuadaDo + " x " + i + " = " + resultado);
}`,
      expectedOutputHint: 'Deverá imprimir a tabuada do 7 do 1 ao 10 com os resultados corretos.',
      proTip: 'A expressão i++ é o mesmo que i = i + 1. Quase todos os laços for na computação utilizam o índice i como convenção consagrada.',
      commonErrors: 'Esquecer de incrementar a variável de controle em um laço while gera um loop infinito e congela o navegador.'
    },
    quiz: [
      {
        id: 501,
        question: 'O que caracteriza um loop infinito em um programa?',
        options: [
          'Um laço cuja condição de parada nunca se torna falsa, travando a execução do programa',
          'Um laço que roda durante exatamente 1 hora',
          'Uma animação gráfica de carregamento',
          'Um laço que roda apenas uma única vez'
        ],
        correctIndex: 0,
        explanation: 'Loop infinito ocorre quando a condição nunca atinge o critério de parada, consumindo 100% da CPU.'
      },
      {
        id: 502,
        question: 'Quais são as três partes presentes no cabeçalho de um laço "for"?',
        options: [
          'Inicialização da variável, condição de repetição e incremento/decremento',
          'Nome do arquivo, senha e servidor',
          'Entrada, processamento e saída',
          'Título, subtítulo e rodapé'
        ],
        correctIndex: 0,
        explanation: 'O laço for organiza: for (inicialização; condição; incremento).'
      },
      {
        id: 503,
        question: 'Quantas vezes o laço a seguir executa: for (let i = 0; i < 5; i++) { ... }?',
        options: [
          'Exatamente 5 vezes (com i valendo 0, 1, 2, 3 e 4)',
          '4 vezes',
          '6 vezes',
          'Infinitas vezes'
        ],
        correctIndex: 0,
        explanation: 'Começa em 0 e vai enquanto for menor que 5 (0, 1, 2, 3, 4), totalizando 5 iterações.'
      },
      {
        id: 504,
        question: 'Qual a instrução usada para interromper imediatamente a execução de um laço antes do término natural?',
        options: [
          'break',
          'stop',
          'exit',
          'pause'
        ],
        correctIndex: 0,
        explanation: 'break encerra imediatamente o laço mais interno e salta para a linha seguinte fora dele.'
      },
      {
        id: 505,
        question: 'O que o comando "continue" faz dentro de um laço de repetição?',
        options: [
          'Pula o restante da iteração atual e avança imediatamente para a próxima volta do laço',
          'Reinicia o computador',
          'Encerra o programa por completo',
          'Apaga a variável contadora'
        ],
        correctIndex: 0,
        explanation: 'continue não encerra o laço todo, apenas ignora as linhas restantes daquela volta específica.'
      },
      {
        id: 506,
        question: 'Para fazer uma contagem regressiva de 10 até 1, como configuramos o for?',
        options: [
          'for (let i = 10; i >= 1; i--)',
          'for (let i = 1; i <= 10; i++)',
          'for (let i = 10; i == 1; i++)',
          'for (let i = 1; i < 10; i--)'
        ],
        correctIndex: 0,
        explanation: 'Inicia em 10, continua enquanto for maior ou igual a 1, e decrementa 1 a cada volta com i--.'
      },
      {
        id: 507,
        question: 'Qual a principal diferença entre o laço "while" e o laço "do-while"?',
        options: [
          'O "do-while" executa o bloco pelo menos uma vez antes de testar a condição no final',
          'O "while" só aceita números pares',
          'O "do-while" roda de trás para frente',
          'Não há diferença de execução'
        ],
        correctIndex: 0,
        explanation: 'do-while testa a condição apenas no final do bloco, garantindo no mínimo uma execução.'
      },
      {
        id: 508,
        question: 'Qual operador decrementa o valor de uma variável em 1 unidade?',
        options: [
          'i--',
          'i++',
          'i -= 0',
          'i ** 1'
        ],
        correctIndex: 0,
        explanation: 'i-- é o operador de pós-decremento, subtraindo 1 do valor atual.'
      },
      {
        id: 509,
        question: 'Se a condição de um laço while for falsa já na primeira verificação, o que acontece?',
        options: [
          'O bloco interno nunca será executado nenhuma vez',
          'Ele executa 1 vez obrigatoriamente',
          'O computador gera um erro de compilação',
          'O valor se transforma em null'
        ],
        correctIndex: 0,
        explanation: 'No while tradicional, o teste ocorre antes; sendo falso, o bloco é completamente ignorado.'
      },
      {
        id: 510,
        question: 'Qual o valor final de "soma" após: let soma = 0; for (let i = 1; i <= 3; i++) { soma += i; }?',
        options: [
          '6 (1 + 2 + 3 = 6)',
          '3',
          '9',
          '0'
        ],
        correctIndex: 0,
        explanation: 'A variável soma acumula: 0 + 1 = 1; 1 + 2 = 3; 3 + 3 = 6.'
      }
    ]
  },
  {
    id: 6,
    lessonNumber: 6,
    title: 'Vetores e Estruturas de Dados (Arrays)',
    module: 'Módulo 6: Agrupamento e Manipulação de Coleções',
    duration: '3h45',
    summary: 'Aprenda a armazenar listas de valores em arrays, acessar elementos por índice e percorrer vetores.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/XdkW63EkRfQ',
    videoTitle: 'Curso em Vídeo - Variáveis Compostas e Vetores (Arrays)',
    videoHighlights: [
      'Conceito de vetor / array (variável com múltiplos compartimentos)',
      'Acesso por índice iniciando em zero (índice 0)',
      'Propriedade length e métodos básicos (push, pop, indexOf)',
      'Percorrendo vetores com laços for e for...of'
    ],
    theoryContent: {
      introduction: 'Até agora, cada variável guardava apenas um valor por vez. Mas e se tivermos uma turma com 40 alunos ou uma lista com centenas de notas? Criar 40 variáveis separadas seria inviável. Um vetor (array) é uma coleção ordenada que guarda múltiplos valores sob um único nome.',
      keyConcepts: [
        {
          title: 'Índices Baseados em Zero (Zero-Indexed)',
          description: 'O primeiro elemento de qualquer array sempre ocupa o índice 0. O segundo é o índice 1, e assim por diante.',
          codeSnippet: `let turmas = ["1º Ano TI", "2º Ano TI", "3º Ano TI"];

console.log(turmas[0]); // "1º Ano TI" (Primeiro)
console.log(turmas.length); // 3 (Quantidade total de itens)`
        },
        {
          title: 'Adicionando e Percorrendo Elementos',
          description: 'O método push adiciona ao final. O laço for percorre todos os itens usando o índice i de 0 até length - 1.',
          codeSnippet: `turmas.push("Administração"); // Adiciona novo item ao final

for (let i = 0; i < turmas.length; i++) {
  console.log("Turma " + (i + 1) + ": " + turmas[i]);
}`
        }
      ],
      stepByStep: [
        'Declare arrays com colchetes: let lista = [item1, item2];',
        'Lembre-se sempre de que o último elemento está no índice lista.length - 1.',
        'Use nomes no plural para arrays: alunos, notas, cursos, produtos.',
        'Prefira for...of ou métodos funcionais como map e forEach quando não precisar do índice numérico.'
      ],
      interactiveExercisePrompt: 'Crie uma lista com 4 disciplinas técnicas do CETEP e exiba cada uma delas acompanhada de sua posição na grade curricular.',
      defaultCode: `const materias = [
  "Banco de Dados & SQL",
  "Lógica de Programação",
  "Redes de Computadores",
  "Desenvolvimento Web"
];

console.log("Grade Curricular CETEP (" + materias.length + " disciplinas):");
for (let i = 0; i < materias.length; i++) {
  console.log((i + 1) + "ª Disciplina: " + materias[i]);
}`,
      expectedOutputHint: 'Deverá listar as 4 disciplinas numeradas de 1 a 4 com seus nomes corretos.',
      proTip: 'Tentar acessar um índice que não existe em JavaScript não quebra o código: ele simplesmente retorna undefined.',
      commonErrors: 'Acessar lista[lista.length] acreditando ser o último elemento — na verdade o último está em lista.length - 1.'
    },
    quiz: [
      {
        id: 601,
        question: 'Qual é o índice do primeiro elemento em um array?',
        options: [
          '0 (zero)',
          '1',
          '-1',
          'Qualquer número aleatório'
        ],
        correctIndex: 0,
        explanation: 'Arrays na maioria das linguagens de programação modernas são baseados em índice 0 (zero-indexed).'
      },
      {
        id: 602,
        question: 'Se um array possui 5 elementos, qual é o índice do seu último elemento?',
        options: [
          '4 (pois vai de 0 a 4)',
          '5',
          '6',
          '3'
        ],
        correctIndex: 0,
        explanation: 'Os 5 elementos ocupam as posições 0, 1, 2, 3 e 4. O último índice é sempre length - 1.'
      },
      {
        id: 603,
        question: 'Qual propriedade retorna a quantidade total de elementos presentes em um array?',
        options: [
          'length',
          'size',
          'count',
          'total'
        ],
        correctIndex: 0,
        explanation: 'A propriedade .length informa a quantidade de itens armazenados no array.'
      },
      {
        id: 604,
        question: 'Qual método adiciona um novo item ao final de um array?',
        options: [
          'push()',
          'append()',
          'add()',
          'insert()'
        ],
        correctIndex: 0,
        explanation: 'Em JavaScript, o método push() insere um ou mais elementos no final do vetor.'
      },
      {
        id: 605,
        question: 'Qual método remove o último elemento de um array?',
        options: [
          'pop()',
          'shift()',
          'remove()',
          'deleteLast()'
        ],
        correctIndex: 0,
        explanation: 'O método pop() remove o último elemento do vetor e o retorna.'
      },
      {
        id: 606,
        question: 'O que o código a seguir exibirá: let a = [10, 20, 30]; console.log(a[1]);?',
        options: [
          '20 (o elemento no índice 1 é o segundo)',
          '10',
          '30',
          'undefined'
        ],
        correctIndex: 0,
        explanation: 'a[0] vale 10, a[1] vale 20 e a[2] vale 30.'
      },
      {
        id: 607,
        question: 'O que acontece ao tentar acessar um índice inexistente como a[100] em um array de tamanho 3?',
        options: [
          'Retorna undefined sem quebrar a execução',
          'O computador reinicia',
          'Retorna o número zero',
          'Lança um erro fatal de compilação'
        ],
        correctIndex: 0,
        explanation: 'Em JavaScript, posições não inicializadas ou fora do vetor retornam o valor primitivo undefined.'
      },
      {
        id: 608,
        question: 'Qual estrutura é a mais comum para percorrer todos os itens de um array sequencialmente?',
        options: [
          'for (let i = 0; i < lista.length; i++)',
          'if (lista.length > 0)',
          'switch (lista)',
          'while (false)'
        ],
        correctIndex: 0,
        explanation: 'O laço for iterando de i = 0 até i < lista.length é a forma canônica de percorrer vetores.'
      },
      {
        id: 609,
        question: 'Como podemos declarar um array vazio pronto para receber dados?',
        options: [
          'let lista = [];',
          'let lista = {};',
          'let lista = ();',
          'let lista = "";'
        ],
        correctIndex: 0,
        explanation: 'Colchetes vazios [] declaram um novo array literal sem elementos.'
      },
      {
        id: 610,
        question: 'O que é uma Matriz na computação?',
        options: [
          'Um array bidimensional (vetor de vetores), organizado em linhas e colunas',
          'Um filme de ficção científica apenas',
          'Um monitor de alta resolução',
          'Um tipo de cabo de rede'
        ],
        correctIndex: 0,
        explanation: 'Uma matriz é uma estrutura bidimensional onde cada elemento é acessado por linha e coluna matriz[linha][coluna].'
      }
    ]
  }
];

export const TOTAL_LOGIC_LESSONS = 6;
export const TOTAL_QUESTIONS_PER_LOGIC_LESSON = 10;

// LocalStorage persistence for Logic Course
const COMPLETED_LOGIC_THEORIES_KEY = 'cetep_logic_completed_theories_v1';
const LOGIC_QUIZ_SCORES_KEY = 'cetep_logic_quiz_scores_v1';
const COMPLETED_LOGIC_LESSONS_KEY = 'cetep_logic_completed_lessons_v1';

export function getCompletedLogicTheoryIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_LOGIC_THEORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLogicTheoryAsCompleted(lessonId: number): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCompletedLogicTheoryIds();
    if (!current.includes(lessonId)) {
      const updated = [...current, lessonId];
      localStorage.setItem(COMPLETED_LOGIC_THEORIES_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (err) {
    console.warn('Error marking logic theory completed:', err);
    return [];
  }
}

export interface LogicQuizScoreRecord {
  lessonId: number;
  score: number;
  total: number;
  passed: boolean;
  date: string;
}

export function getAllLogicQuizScores(): Record<number, LogicQuizScoreRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOGIC_QUIZ_SCORES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLogicQuizScore(lessonId: number, score: number, total = 10): LogicQuizScoreRecord {
  const record: LogicQuizScoreRecord = {
    lessonId,
    score,
    total,
    passed: score >= 7,
    date: new Date().toLocaleDateString('pt-BR')
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getAllLogicQuizScores();
      current[lessonId] = record;
      localStorage.setItem(LOGIC_QUIZ_SCORES_KEY, JSON.stringify(current));
    } catch (err) {
      console.warn('Error saving logic quiz score:', err);
    }
  }
  return record;
}

export function getCompletedLogicLessonIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_LOGIC_LESSONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function evaluateAndSyncLogicLessonCompletion(lessonId: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const scores = getAllLogicQuizScores();
    const quizRecord = scores[lessonId];
    const isQuizPassed = quizRecord && quizRecord.passed;

    const completedTheories = getCompletedLogicTheoryIds();
    const isTheoryDone = completedTheories.includes(lessonId);

    const isFullyComplete = Boolean(isQuizPassed && isTheoryDone);
    const currentCompleted = getCompletedLogicLessonIds();

    if (isFullyComplete && !currentCompleted.includes(lessonId)) {
      const updated = [...currentCompleted, lessonId];
      localStorage.setItem(COMPLETED_LOGIC_LESSONS_KEY, JSON.stringify(updated));
      return true;
    } else if (!isFullyComplete && currentCompleted.includes(lessonId)) {
      const filtered = currentCompleted.filter(id => id !== lessonId);
      localStorage.setItem(COMPLETED_LOGIC_LESSONS_KEY, JSON.stringify(filtered));
      return false;
    }

    return isFullyComplete;
  } catch (err) {
    console.warn('Error evaluating logic lesson completion:', err);
    return false;
  }
}

export function isLogicLessonUnlocked(lessonId: number): boolean {
  if (lessonId === 1) return true;
  const completedIds = getCompletedLogicLessonIds();
  return completedIds.includes(lessonId - 1);
}
