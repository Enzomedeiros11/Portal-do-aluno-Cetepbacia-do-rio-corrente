import { ExcelLesson } from './excelTypes';

export const lessons5to8: ExcelLesson[] = [
  {
    "id": 5,
    "lessonNumber": 5,
    "title": "Aula 05: Funções de Texto e Manipulação de Caracteres",
    "module": "Módulo 3: Manipulação de Textos e Datas",
    "duration": "25 min",
    "summary": "Aprenda a padronizar, limpar, juntar e extrair dados textuais com as funções MAIÚSCULA, MINÚSCULA, PRI.MAIÚSCULA, CONCATENAR / &, ESQUERDA, DIREITA, EXT.TEXTO e ARRUMAR.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/BBOfpehpLbQ",
    "videoTitle": "Aula 06 - Funções de Texto - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Padronização de maiúsculas e minúsculas (MAIÚSCULA, MINÚSCULA, PRI.MAIÚSCULA)",
      "União de textos e valores com o operador & e a função CONCAT",
      "Extração de pedaços de textos com ESQUERDA, DIREITA e EXT.TEXTO",
      "Limpeza de espaços indesejados com a função ARRUMAR"
    ],
    "theoryContent": {
      "introduction": "Bases de dados reais importadas de sistemas escolares, ERPs ou cadastros na web frequentemente vêm desorganizadas: nomes em letras minúsculas misturadas, códigos de matrícula grudados ou espaços extras em branco. As funções de texto do Excel permitem tratar, higienizar e transformar essas cadeias de caracteres em segundos.",
      "keyConcepts": [
        {
          "title": "Padronização de Caixas de Texto",
          "description": "=MAIÚSCULA(texto) converte tudo para maiúsculas. =MINÚSCULA(texto) converte tudo para minúsculas. =PRI.MAIÚSCULA(texto) coloca apenas a primeira letra de cada palavra em maiúscula (ideal para nomes próprios de alunos e cidades).",
          "formulaOrExample": "=PRI.MAIÚSCULA(\"joão da silva\") resulta em \"João Da Silva\""
        },
        {
          "title": "Concatenação (União de Textos)",
          "description": "Você pode juntar duas ou mais células usando o operador comercial & ou a função =CONCAT(texto1; texto2). Para incluir espaços entre as palavras, concatene \" \".",
          "formulaOrExample": "=A2 & \" \" & B2 junta Nome e Sobrenome com um espaço"
        },
        {
          "title": "Extração de Caracteres",
          "description": "=ESQUERDA(texto; num) pega os primeiros caracteres da esquerda. =DIREITA(texto; num) pega os últimos caracteres do final. =EXT.TEXTO(texto; posição_inicial; num) extrai do meio do texto.",
          "formulaOrExample": "=ESQUERDA(\"CETEP2026\"; 5) resulta em \"CETEP\""
        },
        {
          "title": "Limpeza com ARRUMAR",
          "description": "A função =ARRUMAR(texto) remove todos os espaços duplicados entre palavras e todos os espaços invisíveis no início e no final do texto.",
          "formulaOrExample": "=ARRUMAR(\"  Excel   Avançado  \") resulta em \"Excel Avançado\""
        }
      ],
      "stepByStep": [
        "Selecione uma coluna vazia ao lado do nome despadronizado do aluno.",
        "Digite =PRI.MAIÚSCULA(A2) e tecle Enter.",
        "Ao lado, crie um código de identificação juntando as 3 primeiras letras do curso com o ano: =ESQUERDA(B2; 3) & \"-2026\".",
        "Dê um duplo clique na alça de preenchimento para aplicar a todas as linhas.",
        "Copie a coluna gerada e use \"Colar Especial -> Valores\" caso queira descartar as fórmulas e fixar os textos definitivos."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + C e depois Alt + C + V",
          "action": "Atalho clássico para Colar Especial como Valores"
        },
        {
          "keys": "Ctrl + E",
          "action": "Preenchimento Relâmpago (Flash Fill) para deduzir padrões de texto automaticamente"
        }
      ],
      "proTip": "Se ao tentar concatenar duas células os textos ficarem grudados (ex: \"CarlosSilva\"), lembre-se de concatenar explicitamente o espaço entre aspas duplas: =A2 & \" \" & B2.",
      "commonErrors": "Esquecer que a função EXT.TEXTO precisa saber a partir de qual posição de caractere ela deve iniciar a extração no segundo argumento."
    },
    "quiz": [
      {
        "id": 501,
        "question": "Qual função do Excel transforma um texto todo digitado em minúsculas para que a primeira letra de cada palavra fique em maiúscula?",
        "options": [
          "=MAIÚSCULA()",
          "=CAPITALIZAR()",
          "=PRI.MAIÚSCULA()",
          "=AJUSTAR()"
        ],
        "correctIndex": 2,
        "explanation": "A função =PRI.MAIÚSCULA() deixa apenas a primeira letra de cada palavra em maiúsculo."
      },
      {
        "id": 502,
        "question": "Qual operador de texto é usado no Excel para concatenar (juntar) conteúdos de células?",
        "options": [
          "& (e comercial)",
          "#",
          "@",
          "$"
        ],
        "correctIndex": 0,
        "explanation": "O operador & (e comercial) é o símbolo nativo de concatenação no Excel."
      },
      {
        "id": 503,
        "question": "Se a célula A1 contém o texto \"CETEP-BA\", qual é o resultado da fórmula =ESQUERDA(A1; 5)?",
        "options": [
          "\"-BA\"",
          "\"CETEP-\"",
          "\"BA\"",
          "\"CETEP\""
        ],
        "correctIndex": 3,
        "explanation": "Os primeiros 5 caracteres da esquerda para a direita de \"CETEP-BA\" são C-E-T-E-P."
      },
      {
        "id": 504,
        "question": "Qual é a utilidade prática da função =ARRUMAR(texto)?",
        "options": [
          "Colocar os números em ordem crescente",
          "Remover espaços em branco adicionais no início, fim e espaços duplos no meio do texto",
          "Apagar células vazias",
          "Mudar a cor da fonte"
        ],
        "correctIndex": 1,
        "explanation": "ARRUMAR elimina espaços excessivos causados por erros de digitação ou importações de sistemas externos."
      },
      {
        "id": 505,
        "question": "Qual fórmula junta o Primeiro Nome (A2) e o Sobrenome (B2) garantindo um espaço em branco entre eles?",
        "options": [
          "=A2 + B2",
          "=A2 & B2",
          "=A2 & Espaço & B2",
          "=A2 & \" \" & B2"
        ],
        "correctIndex": 3,
        "explanation": "O espaço deve ser delimitado entre aspas duplas: =A2 & \" \" & B2."
      },
      {
        "id": 506,
        "question": "Qual função retorna a quantidade total de caracteres (incluindo letras, números e espaços) de um texto?",
        "options": [
          "=TAMANHO()",
          "=CONTAR.LETRAS()",
          "=NÚM.CARACT()",
          "=COMPRIMENTO()"
        ],
        "correctIndex": 2,
        "explanation": "A função =NÚM.CARACT(texto) conta o número exato de caracteres presentes no texto."
      },
      {
        "id": 507,
        "question": "Para extrair os últimos 4 dígitos de um código alfanumérico contido em C3, qual função deve ser empregada?",
        "options": [
          "=DIREITA(C3; 4)",
          "=FINAL(C3; 4)",
          "=ÚLTIMO(C3; 4)",
          "=SUBTEXTO(C3; 4)"
        ],
        "correctIndex": 0,
        "explanation": "A função =DIREITA(texto; núm_caracteres) extrai caracteres a partir da extremidade direita."
      },
      {
        "id": 508,
        "question": "Qual é o resultado da fórmula =MINÚSCULA(\"EXCEL 2026\")?",
        "options": [
          "\"Excel 2026\"",
          "\"excel 2026\"",
          "\"EXCEL\"",
          "Erro #VALOR!"
        ],
        "correctIndex": 1,
        "explanation": "MINÚSCULA converte todas as letras alfabéticas em caracteres minúsculos, mantendo números inalterados."
      },
      {
        "id": 509,
        "question": "Se a célula A1 tem o texto \"CÓD-9874\", qual fórmula extrai os 4 números do meio/fim usando EXT.TEXTO?",
        "options": [
          "=EXT.TEXTO(A1; 1; 4)",
          "=EXT.TEXTO(A1; 4; 5)",
          "=EXT.TEXTO(A1; 5; 4)",
          "=MEIO(A1; 4)"
        ],
        "correctIndex": 2,
        "explanation": "A posição inicial é o 5º caractere (onde começa o 9), extraindo os 4 caracteres seguintes."
      },
      {
        "id": 510,
        "question": "Qual recurso de inteligência do Excel permite preencher automaticamente padrões de texto pelo atalho Ctrl + E?",
        "options": [
          "AutoSoma",
          "Macro Automática",
          "Filtro Avançado",
          "Preenchimento Relâmpago (Flash Fill)"
        ],
        "correctIndex": 3,
        "explanation": "O Preenchimento Relâmpago reconhece o padrão digitado pelo usuário e replica instantaneamente em toda a coluna."
      }
    ]
  },
  {
    "id": 6,
    "lessonNumber": 6,
    "title": "Aula 06: Funções de Data e Cálculos de Prazos",
    "module": "Módulo 3: Manipulação de Textos e Datas",
    "duration": "26 min",
    "summary": "Compreenda como o Excel interpreta datas como números seriais, utilize as funções HOJE, AGORA, DIA, MÊS, ANO, DATA, calcule diferenças e prazos úteis com DIATRABALHOTOTAL.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/_1-Euxg1ncc",
    "videoTitle": "Aula 07 - Funções de Data - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Como o Excel armazena datas (sistema serial de números a partir de 1900)",
      "Funções voláteis temporais: HOJE() e AGORA()",
      "Desmembramento de datas em DIA(), MÊS() e ANO()",
      "Cálculo de dias corridos e dias úteis com DIATRABALHOTOTAL"
    ],
    "theoryContent": {
      "introduction": "O Excel trata datas internamente como números inteiros sequenciais (números seriais), onde o número 1 representa o dia 01/01/1900. Cada dia subsequente adiciona +1 ao número. As horas são frações decimais do dia (ex: 0,5 equivale a 12:00 do meio-dia). Por causa dessa lógica brilhante, você pode somar ou subtrair dias de uma data com simples operações matemáticas.",
      "keyConcepts": [
        {
          "title": "Funções HOJE() e AGORA()",
          "description": "A função =HOJE() retorna a data atual do sistema (atualizada dinamicamente a cada abertura ou cálculo da planilha). A função =AGORA() retorna a data atual acompanhada do horário exato.",
          "formulaOrExample": "=HOJE() retorna a data de hoje | =AGORA() retorna data e hora"
        },
        {
          "title": "Extração: DIA, MÊS e ANO",
          "description": "=DIA(data) extrai o dia do mês (1 a 31). =MÊS(data) extrai o número do mês (1 a 12). =ANO(data) extrai os 4 dígitos do ano.",
          "formulaOrExample": "=MÊS(\"15/08/2026\") resulta em 8"
        },
        {
          "title": "Construção com a Função DATA",
          "description": "A função =DATA(ano; mês; dia) monta uma data válida garantindo que não haja ambiguidades de formatação regional.",
          "formulaOrExample": "=DATA(2026; 12; 25) resulta em 25/12/2026"
        },
        {
          "title": "Cálculo de Dias Úteis: DIATRABALHOTOTAL",
          "description": "Calcula o número de dias úteis entre duas datas, excluindo automaticamente fins de semana (sábados e domingos) e opcionalmente uma lista de feriados.",
          "formulaOrExample": "=DIATRABALHOTOTAL(data_inicial; data_final; [feriados])"
        }
      ],
      "stepByStep": [
        "Na célula A1, digite =HOJE() para obter a data atual.",
        "Na célula B1, digite o prazo de entrega: =A1 + 30 para adicionar 30 dias corridos.",
        "Para calcular a idade de um aluno a partir da data de nascimento em C2, use: =INT((HOJE() - C2) / 365,25).",
        "Para calcular quantos dias úteis restam para a entrega de um projeto, digite =DIATRABALHOTOTAL(HOJE(); B1).",
        "Pressione Enter e formate a célula como Número Geral."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + ;",
          "action": "Insere a data atual fixa (estática) na célula selecionada"
        },
        {
          "keys": "Ctrl + Shift + ;",
          "action": "Insere a hora atual fixa (estática) na célula selecionada"
        },
        {
          "keys": "Ctrl + Shift + 3",
          "action": "Aplica a formatação rápida de Data (dd-mmm-aa)"
        }
      ],
      "proTip": "Se você precisa que a data atual nunca se altere no futuro (por exemplo, a data em que um aluno realizou a matrícula), use o atalho Ctrl + ; em vez da função =HOJE(), pois a função se atualiza todos os dias.",
      "commonErrors": "Digitar datas com barras invertidas ou traços fora do padrão do Windows, fazendo o Excel interpretar a data como texto comum e impossibilitando subtrações de prazos."
    },
    "quiz": [
      {
        "id": 601,
        "question": "Como o Excel armazena internamente qualquer data?",
        "options": [
          "Como uma imagem bitmap",
          "Como um número serial contínuo onde cada dia equivale a uma unidade inteira (+1)",
          "Como um código binário criptografado",
          "Como um texto puro que não aceita contas"
        ],
        "correctIndex": 1,
        "explanation": "Para o Excel, uma data é um número serial: o dia 1 corresponde a 01/01/1900."
      },
      {
        "id": 602,
        "question": "Qual função do Excel retorna sempre a data do dia atual sem incluir a hora?",
        "options": [
          "=DATAATUAL()",
          "=AGORA()",
          "=DIA.ATUAL()",
          "=HOJE()"
        ],
        "correctIndex": 3,
        "explanation": "A função =HOJE() retorna exclusivamente a data atual."
      },
      {
        "id": 603,
        "question": "Qual é a diferença entre a função =HOJE() e a função =AGORA()?",
        "options": [
          "=AGORA() retorna tanto a data quanto a hora e minuto atuais, enquanto =HOJE() retorna apenas a data",
          "Não há diferença",
          "=HOJE() só funciona aos finais de semana",
          "=AGORA() é paga"
        ],
        "correctIndex": 0,
        "explanation": "=AGORA() inclui a data e a hora atual na célula."
      },
      {
        "id": 604,
        "question": "Qual atalho de teclado insere a data atual de forma estática (fixa) na célula sem fórmula?",
        "options": [
          "Ctrl + D",
          "Alt + D",
          "Ctrl + ;",
          "F12"
        ],
        "correctIndex": 2,
        "explanation": "O atalho Ctrl + ; insere a data de hoje fixa, que não muda nos dias seguintes."
      },
      {
        "id": 605,
        "question": "Para somar 15 dias corridos a uma data que está na célula A1, qual fórmula simples pode ser usada?",
        "options": [
          "=SOMA_DIAS(A1; 15)",
          "=A1 + 15",
          "=A1 * 15",
          "=A1 & 15"
        ],
        "correctIndex": 1,
        "explanation": "Como cada dia vale 1, basta somar 15 diretamente à data: =A1 + 15."
      },
      {
        "id": 606,
        "question": "Qual função é ideal para calcular a quantidade de dias úteis entre duas datas excluindo sábados e domingos?",
        "options": [
          "=DIATRABALHOTOTAL()",
          "=DIASÚTEIS()",
          "=CALC.DIAS()",
          "=SEMANA.TOTAL()"
        ],
        "correctIndex": 0,
        "explanation": "=DIATRABALHOTOTAL(data_inicial; data_final; [feriados]) calcula exatamente os dias úteis."
      },
      {
        "id": 607,
        "question": "Qual é a ordem correta dos argumentos da função =DATA() no Excel?",
        "options": [
          "=DATA(dia; mês; ano)",
          "=DATA(mês; dia; ano)",
          "=DATA(ano; dia; mês)",
          "=DATA(ano; mês; dia)"
        ],
        "correctIndex": 3,
        "explanation": "A função DATA exige os argumentos na ordem: =DATA(ano; mês; dia)."
      },
      {
        "id": 608,
        "question": "Se uma data está na célula B2 (\"10/10/2026\"), qual fórmula extrai apenas o número do mês?",
        "options": [
          "=EXT.MÊS(B2)",
          "=NUMERO.MES(B2)",
          "=MES(B2) ou =MÊS(B2)",
          "=DATA.MES(B2)"
        ],
        "correctIndex": 2,
        "explanation": "A função =MÊS(B2) extrai o valor numérico do mês (neste caso, 10)."
      },
      {
        "id": 609,
        "question": "Se você subtrair uma data anterior de uma data posterior (=B2 - A2), qual informação o Excel exibirá?",
        "options": [
          "A quantidade de dias corridos transcorridos entre as duas datas",
          "O nome do dia da semana",
          "Uma mensagem de erro",
          "O ano de nascimento"
        ],
        "correctIndex": 0,
        "explanation": "A subtração simples entre duas datas resulta na quantidade exata de dias decorridos."
      },
      {
        "id": 610,
        "question": "O que a função =DIA.DA.SEMANA(data) retorna?",
        "options": [
          "Apenas a palavra \"Sábado\"",
          "Um número de 1 a 7 representando o dia da semana (por padrão 1 = Domingo)",
          "Quantos dias faltam para o ano novo",
          "A previsão do tempo"
        ],
        "correctIndex": 1,
        "explanation": "Retorna um número de 1 a 7 indicando o dia da semana correspondente."
      }
    ]
  },
  {
    "id": 7,
    "lessonNumber": 7,
    "title": "Aula 07: Funções Estatísticas e Agregações Condicionais",
    "module": "Módulo 4: Análise Estatística e Formatação Avançada",
    "duration": "27 min",
    "summary": "Aprenda a analisar conjuntos de dados com MÁXIMO, MÍNIMO, MÉDIA, CONT.NÚM, CONT.VALORES, CONTAR.VAZIO e as poderosas funções condicionais CONT.SE e SOMASE.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/KD1Re8pEnlo",
    "videoTitle": "Aula 08 - Funções Estastísticas - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Identificação de extremos com MÁXIMO() e MÍNIMO()",
      "Diferença crucial entre CONT.NÚM() e CONT.VALORES()",
      "Contagens com critérios específicos usando CONT.SE()",
      "Somas acumuladas sob condição com a função SOMASE()"
    ],
    "theoryContent": {
      "introduction": "Planilhas profissionais exigem sumarização rápida de indicadores: saber a maior nota, o menor custo, a média de faturamento ou quantos alunos atendem a determinados requisitos. O Excel disponibiliza funções estatísticas descritivas e funções agregadoras condicionais (SE) que economizam horas de filtragem manual.",
      "keyConcepts": [
        {
          "title": "MÁXIMO e MÍNIMO",
          "description": "=MÁXIMO(intervalo) localiza o maior valor numérico de uma série. =MÍNIMO(intervalo) localiza o menor valor numérico.",
          "formulaOrExample": "=MÁXIMO(C2:C100) encontra a maior nota da turma"
        },
        {
          "title": "CONT.NÚM vs. CONT.VALORES",
          "description": "A função =CONT.NÚM conta apenas células que contêm valores numéricos. Já a função =CONT.VALORES conta qualquer célula que não esteja vazia (incluindo textos, códigos, letras e números).",
          "formulaOrExample": "=CONT.VALORES(A2:A100) conta o total de inscritos cadastrados"
        },
        {
          "title": "CONT.SE (Contagem Condicional)",
          "description": "Conta quantas células em um intervalo atendem a um critério especificado entre aspas.",
          "formulaOrExample": "=CONT.SE(D2:D100; \"Aprovado\") ou =CONT.SE(C2:C100; \">=7\")"
        },
        {
          "title": "SOMASE (Soma Condicional)",
          "description": "Soma os valores de um intervalo somente se as células correspondentes cumprirem a condição.",
          "formulaOrExample": "=SOMASE(B2:B100; \"Informática\"; C2:C100) soma as mensalidades apenas do curso de Informática"
        }
      ],
      "stepByStep": [
        "Calcule a média geral das notas da turma: =MÉDIA(C2:C50).",
        "Identifique a nota mais alta com =MÁXIMO(C2:C50) e a mais baixa com =MÍNIMO(C2:C50).",
        "Conte quantos alunos fizeram a prova (células numéricas preenchidas): =CONT.NÚM(C2:C50).",
        "Conte quantos alunos tiraram nota igual ou superior a 7: =CONT.SE(C2:C50; \">=7\").",
        "Some o valor total das vendas efetuadas pela vendedora \"Mariana\": =SOMASE(A2:A50; \"Mariana\"; D2:D50)."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + Shift + Seta Abaixo",
          "action": "Seleciona todos os dados da coluna até o final da lista"
        },
        {
          "keys": "Alt + M + U",
          "action": "Abre a lista rápida de funções estatísticas e médias na Faixa de Opções"
        }
      ],
      "proTip": "Na função SOMASE, se o intervalo de critério for o mesmo intervalo que você deseja somar, o terceiro argumento ([intervalo_soma]) é opcional! Por exemplo: =SOMASE(C2:C50; \">1000\") somará diretamente todos os valores maiores que 1000 naquele mesmo intervalo.",
      "commonErrors": "Esquecer de colocar os operadores de comparação entre aspas duplas no critério do CONT.SE, por exemplo escrever =CONT.SE(A1:A10; >=7) em vez do correto =CONT.SE(A1:A10; \">=7\")."
    },
    "quiz": [
      {
        "id": 701,
        "question": "Qual função retorna o maior valor numérico encontrado dentro de um intervalo de células?",
        "options": [
          "=MAIOR_VALOR()",
          "=SUPERIOR()",
          "=TOPO()",
          "=MÁXIMO()"
        ],
        "correctIndex": 3,
        "explanation": "A função =MÁXIMO(intervalo) localiza o número mais alto da seleção."
      },
      {
        "id": 702,
        "question": "Qual é a diferença fundamental entre as funções =CONT.NÚM() e =CONT.VALORES()?",
        "options": [
          "CONT.VALORES só conta dinheiro",
          "CONT.NÚM conta apenas números; CONT.VALORES conta qualquer célula não vazia (números e textos)",
          "CONT.NÚM é mais rápida",
          "Não há qualquer diferença entre elas"
        ],
        "correctIndex": 1,
        "explanation": "CONT.NÚM ignora textos e conta estritamente números. CONT.VALORES conta tudo o que não está vazio."
      },
      {
        "id": 703,
        "question": "Qual função conta quantas células em um intervalo estão totalmente em branco (vazias)?",
        "options": [
          "=SEM_DADO()",
          "=VAZIO.TOTAL()",
          "=CONT.VAZIO() ou =CONTAR.VAZIO()",
          "=NULO()"
        ],
        "correctIndex": 2,
        "explanation": "A função =CONTAR.VAZIO(intervalo) calcula exatamente as células desprovidas de qualquer conteúdo."
      },
      {
        "id": 704,
        "question": "Qual fórmula conta quantas vezes a palavra \"Aprovado\" aparece na coluna D (de D2 até D50)?",
        "options": [
          "=CONT.SE(D2:D50; \"Aprovado\")",
          "=SOMASE(D2:D50; \"Aprovado\")",
          "=SOMA(D2:D50; \"Aprovado\")",
          "=CONTAR(D2:D50 = \"Aprovado\")"
        ],
        "correctIndex": 0,
        "explanation": "A função =CONT.SE(intervalo; critério) realiza a contagem sob critérios textuais ou numéricos."
      },
      {
        "id": 705,
        "question": "Como deve ser escrito o critério para contar números maiores que 50 na função CONT.SE?",
        "options": [
          ">50",
          "MaiorQue(50)",
          "\">50\"",
          "50>"
        ],
        "correctIndex": 2,
        "explanation": "Operadores condicionais em funções como CONT.SE devem ser envolvidos por aspas duplas: \" >50\"."
      },
      {
        "id": 706,
        "question": "Qual é a estrutura correta dos argumentos da função =SOMASE?",
        "options": [
          "=SOMASE([intervalo_soma]; critérios; intervalo)",
          "=SOMASE(critérios; intervalo)",
          "=SOMASE(soma; teste; resultado)",
          "=SOMASE(intervalo; critérios; [intervalo_soma])"
        ],
        "correctIndex": 3,
        "explanation": "A sintaxe é: =SOMASE(intervalo_do_teste; critério_desejado; [intervalo_com_valores_a_somar])."
      },
      {
        "id": 707,
        "question": "Qual função calcula o valor da média aritmética de um intervalo desconsiderando células vazias?",
        "options": [
          "=MEDIANA()",
          "=MÉDIA()",
          "=MÉDIA.POND()",
          "=DIVISÃO()"
        ],
        "correctIndex": 1,
        "explanation": "A função =MÉDIA(intervalo) calcula a média aritmética dos valores numéricos informados."
      },
      {
        "id": 708,
        "question": "Qual função calcula a média aritmética somente dos itens que cumprem determinada condição?",
        "options": [
          "=MÉDIASE()",
          "=MÉDIA.COND()",
          "=SE.MÉDIA()",
          "=MÉDIA.SELETIVA()"
        ],
        "correctIndex": 0,
        "explanation": "A função =MÉDIASE(intervalo; critério; [intervalo_média]) calcula médias sob filtros condicionais."
      },
      {
        "id": 709,
        "question": "Se a célula C1 tem o valor 10, C2 tem \"CETEP\" e C3 está em branco, qual o resultado de =CONT.NÚM(C1:C3)?",
        "options": [
          "3",
          "2",
          "0",
          "1"
        ],
        "correctIndex": 3,
        "explanation": "Apenas a célula C1 contém um número; C2 é texto e C3 está vazia, logo o resultado é 1."
      },
      {
        "id": 710,
        "question": "Qual função do Excel retorna o menor valor numérico de uma série de dados?",
        "options": [
          "=MENOR_NUMERO()",
          "=BAIXO()",
          "=MÍNIMO()",
          "=REDUZIDO()"
        ],
        "correctIndex": 2,
        "explanation": "A função =MÍNIMO(intervalo) extrai o menor valor da lista analisada."
      }
    ]
  },
  {
    "id": 8,
    "lessonNumber": 8,
    "title": "Aula 08: Formatação Condicional e Destaques Visuais",
    "module": "Módulo 4: Análise Estatística e Formatação Avançada",
    "duration": "28 min",
    "summary": "Aprenda a destacar dados visualmente com Formatação Condicional: regras de maior/menor que, texto que contém, barras de dados dinâmicas, escalas de cor e conjuntos de ícones.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/BmzcDLSvOWg",
    "videoTitle": "Aula 09 - Formatação Condicional - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Regras de Realce de Células (Maior que, Menor que, Está Entre, Valores Duplicados)",
      "Regras de Primeiros e Últimos (10 Primeiros Itens, Acima da Média)",
      "Barras de Dados, Escalas de Cor e Conjuntos de Ícones (Semáforos)",
      "Gerenciador de Regras de Formatação Condicional e limpeza de regras"
    ],
    "theoryContent": {
      "introduction": "A Formatação Condicional é uma das ferramentas mais impactantes do Excel para tomada rápida de decisões. Em vez de ler linha por linha de uma tabela com centenas de registros, a formatação condicional aplica cores de preenchimento, fontes em negrito ou ícones automaticamente com base no valor de cada célula.",
      "keyConcepts": [
        {
          "title": "Regras de Realce de Células",
          "description": "Permite pintar células que satisfazem condições diretas: É Maior Do Que, É Menor Do Que, Está Entre, É Igual A, Texto que Contém (ex: destacar todas as células com a palavra \"Reprovado\" em vermelho suave) e Valores Duplicados."
        },
        {
          "title": "Barras de Dados",
          "description": "Desenha uma barra horizontal colorida dentro da própria célula, cujo comprimento é proporcional ao número contido nela, simulando um minigráfico de barras direto na tabela."
        },
        {
          "title": "Escalas de Cor",
          "description": "Aplica um gradiente de cores térmicas (ex: verde para valores altos, amarelo para intermediários e vermelho para valores baixos), proporcionando uma visão de mapa de calor (heatmap)."
        },
        {
          "title": "Conjuntos de Ícones (Semáforos)",
          "description": "Insere símbolos visuais como círculos verdes, amarelos e vermelhos, bandeiras ou setas indicativas de crescimento e queda com base em percentis ou valores fixos."
        }
      ],
      "stepByStep": [
        "Selecione a coluna de notas dos alunos (ex: C2:C40).",
        "Na guia Página Inicial, clique em \"Formatação Condicional\" -> \"Regras de Realce das Células\" -> \"É Menor do que...\".",
        "Digite 7 e escolha o preenchimento \"Preenchimento Vermelho Claro com Texto Vermelho Escuro\". Clique em OK.",
        "Selecione novamente o intervalo e adicione outra regra: \"É Maior do que...\" 6,9 com \"Preenchimento Verde Claro com Texto Verde Escuro\".",
        "Abra \"Gerenciar Regras\" para visualizar todas as regras ativas na seleção e ajustar suas prioridades."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + C + L + R",
          "action": "Abre a lista de regras de Formatação Condicional pelo teclado"
        },
        {
          "keys": "Alt + C + L + C",
          "action": "Abre o menu para Limpar Regras da planilha inteira"
        }
      ],
      "proTip": "Para identificar rapidamente se existem CPFs, códigos de matrícula ou e-mails cadastrados em duplicidade na sua base, selecione a coluna inteira, vá em Formatação Condicional -> Regras de Realce de Células -> Valores Duplicados. O Excel pintará instantaneamente todos os cadastros repetidos!",
      "commonErrors": "Criar múltiplas regras sobrepostas sem gerenciar as ordens de precedência ou esquecer de limpar regras antigas, deixando a planilha lenta e visualmente confusa."
    },
    "quiz": [
      {
        "id": 801,
        "question": "O que faz a ferramenta de \"Formatação Condicional\" no Excel?",
        "options": [
          "Muda a formatação visual (cores, bordas, ícones) automaticamente conforme o valor contido na célula",
          "Altera o valor matemático das células sem avisar",
          "Exclui células com notas baixas",
          "Cria uma nova aba na pasta de trabalho"
        ],
        "correctIndex": 0,
        "explanation": "A Formatação Condicional altera a estética da célula dinamicamente baseada em critérios lógicos."
      },
      {
        "id": 802,
        "question": "Onde se localiza o botão \"Formatação Condicional\" na interface padrão do Excel?",
        "options": [
          "Na Guia Arquivo",
          "Na Guia Revisão",
          "Na Guia Página Inicial, no grupo Estilo",
          "Na Barra de Status"
        ],
        "correctIndex": 2,
        "explanation": "Está situado no grupo Estilo da guia Página Inicial."
      },
      {
        "id": 803,
        "question": "Qual regra de realce é mais indicada para encontrar cadastros ou e-mails repetidos por engano em uma coluna?",
        "options": [
          "Texto que Contém",
          "Valores Duplicados",
          "Está Entre",
          "Menor do que"
        ],
        "correctIndex": 1,
        "explanation": "A opção \"Valores Duplicados\" identifica e colore automaticamente dados que se repetem."
      },
      {
        "id": 804,
        "question": "O que o recurso de \"Barras de Dados\" exibe dentro da célula?",
        "options": [
          "Um código de barras para leitura ótica",
          "Um link para um site externo",
          "Uma mensagem de erro",
          "Uma barra colorida proporcional ao valor numérico da célula"
        ],
        "correctIndex": 3,
        "explanation": "As Barras de Dados preenchem a célula com uma barra cujo tamanho reflete a magnitude do número."
      },
      {
        "id": 805,
        "question": "Qual recurso de formatação condicional simula um mapa de calor com gradientes bicolores ou tricolores?",
        "options": [
          "Escalas de Cor",
          "Pincel de Cor",
          "Tinta Dinâmica",
          "Filtro Térmico"
        ],
        "correctIndex": 0,
        "explanation": "As Escalas de Cor utilizam transições suaves de cores para indicar valores altos, médios e baixos."
      },
      {
        "id": 806,
        "question": "Para sinalizar metas atingidas, atenção ou risco através de círculos verde, amarelo e vermelho, qual categoria deve ser escolhida?",
        "options": [
          "Regras de Primeiros",
          "Conjuntos de Ícones",
          "Superfície",
          "Linhas de Grade"
        ],
        "correctIndex": 1,
        "explanation": "Conjuntos de Ícones oferecem semáforos, setas e formas indicativas de status."
      },
      {
        "id": 807,
        "question": "O que acontece com a formatação condicional se o valor de uma célula for alterado pelo usuário?",
        "options": [
          "Nada muda, a cor fica congelada para sempre",
          "A planilha é bloqueada com senha",
          "A formatação visual se adapta instantaneamente ao novo valor da célula",
          "A fórmula é apagada"
        ],
        "correctIndex": 2,
        "explanation": "A formatação é 100% dinâmica e recalcula a apresentação visual em tempo real."
      },
      {
        "id": 808,
        "question": "Onde podemos visualizar, editar a ordem de prioridade ou excluir regras de formatação condicional existentes?",
        "options": [
          "No Bloco de Notas",
          "No Windows Explorer",
          "Na Lixeira",
          "No Gerenciador de Regras de Formatação Condicional"
        ],
        "correctIndex": 3,
        "explanation": "O Gerenciador de Regras lista todas as regras ativas na seleção ou na planilha inteira para controle total."
      },
      {
        "id": 809,
        "question": "Qual regra destaca rapidamente os 10 maiores faturamentos de uma lista com 500 vendedores?",
        "options": [
          "Valores Únicos",
          "10 Primeiros Itens",
          "Acima da Média",
          "Texto Específico"
        ],
        "correctIndex": 1,
        "explanation": "Regras de Primeiros/Últimos -> 10 Primeiros Itens destaca os líderes do ranking."
      },
      {
        "id": 810,
        "question": "Qual é o caminho mais seguro para remover todas as formatações condicionais de uma seleção sem apagar os dados?",
        "options": [
          "Formatação Condicional -> Limpar Regras -> Limpar Regras das Células Selecionadas",
          "Deletar as células",
          "Fechar o Excel sem salvar",
          "Digitar zero em tudo"
        ],
        "correctIndex": 0,
        "explanation": "Limpar Regras remove o efeito visual condicional preservando todos os dados intactos."
      }
    ]
  }
];
