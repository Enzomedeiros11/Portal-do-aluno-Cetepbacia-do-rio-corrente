import { ExcelLesson } from './excelTypes';

export const lessons5to8: ExcelLesson[] = [
  {
    id: 5,
    lessonNumber: 5,
    title: 'Funções de Texto Essenciais e Limpeza de Dados',
    module: 'Módulo 2: Manipulação de Dados, Textos e Datas',
    duration: '28 min',
    summary: 'Tratamento de strings, união de textos (& e CONCAT), padronização de maiúsculas/minúsculas e extração de caracteres.',
    videoUrl: 'https://www.youtube.com/embed/5T5uQk67f1k',
    videoTitle: 'Aula 05: Funções de Texto e Tratamento de Dados no Excel',
    videoHighlights: [
      'Concatenação de textos usando & (e comercial) e CONCAT',
      'Padronização com MAIÚSCULA, MINÚSCULA e PRI.MAIÚSCULA',
      'Extração de caracteres com ESQUERDA, DIREITA e EXT.TEXTO',
      'Limpeza de espaços indesejados com ARRUMAR'
    ],
    theoryContent: {
      introduction: 'Bases de dados importadas de sistemas escolares, ERPs ou planilhas compartilhadas frequentemente chegam com textos despadronizados: nomes em maiúsculas misturadas, códigos com espaços sobrando ou nomes e sobrenomes em colunas separadas. As funções de texto do Excel permitem higienizar, concatenar e transformar essas informações com rapidez e precisão cirúrgica.',
      keyConcepts: [
        {
          title: 'Concatenação (& e CONCAT)',
          description: 'O operador comercial (&) une textos ou conteúdos de células em uma única sequência. Para incluir espaços ou pontuações, coloque-os entre aspas duplas (" ").',
          formulaOrExample: '=A2 & " " & B2  (Resultado: "Enzo Medeiros")'
        },
        {
          title: 'Padronização de Caixa',
          description: 'MAIÚSCULA transforma tudo em letras garrafais. MINÚSCULA deixa tudo minúsculo. PRI.MAIÚSCULA deixa a primeira letra de cada palavra em maiúscula (ideal para nomes próprios).',
          formulaOrExample: '=PRI.MAIÚSCULA("joão da silva") -> "João Da Silva"'
        },
        {
          title: 'Extração de Pedaços de Texto',
          description: 'ESQUERDA(texto; num_caracteres) extrai do início. DIREITA(texto; num_caracteres) extrai do final. EXT.TEXTO(texto; inicio; num_caracteres) extrai do meio.',
          formulaOrExample: '=ESQUERDA("CETEP2026"; 5) -> "CETEP"'
        }
      ],
      stepByStep: [
        'Abra uma planilha contendo uma coluna de Nomes (Coluna A) e Sobrenomes (Coluna B).',
        'Na coluna C, digite: =PRI.MAIÚSCULA(A2 & " " & B2) para unir e formatar o nome.',
        'Se o texto veio com espaços duplicados antes ou depois da palavra, envolva com =ARRUMAR(C2).',
        'Para saber o tamanho exato de um código ou CPF, use =NÚM.CARACT(A2).',
        'Copie a fórmula para toda a base com duplo clique na alça de preenchimento.'
      ],
      keyboardShortcuts: [
        { keys: 'Ctrl + E', action: 'Preenchimento Relâmpago (Flash Fill) - detecta padrões de texto e preenche sozinho' },
        { keys: 'Ctrl + L', action: 'Abrir caixa de diálogo Localizar e Substituir' },
        { keys: 'Ctrl + U', action: 'Substituir diretamente caracteres em massa' },
        { keys: 'Alt + Abaixo', action: 'Abrir lista suspensa com valores já digitados na coluna' }
      ],
      proTip: 'O atalho Ctrl + E (Preenchimento Relâmpago) é uma das maiores inovações do Excel: basta digitar manualmente o resultado esperado para a primeira linha e pressionar Ctrl + E na linha de baixo que o Excel deduz a regra automaticamente!',
      commonErrors: 'Esquecer de colocar aspas duplas (" ") ao concatenar palavras ou espaços fixos, gerando o erro de nome inválido #NOME?.'
    },
    quiz: [
      {
        id: 501,
        question: 'Qual operador de teclado é utilizado para concatenar (juntar) dois textos ou células no Excel?',
        options: ['#', '&', '@', '$'],
        correctIndex: 1,
        explanation: 'O caractere comercial (&) é o operador de concatenação no Excel.'
      },
      {
        id: 502,
        question: 'Qual função converte a primeira letra de cada palavra em maiúscula e todas as outras em minúsculas?',
        options: ['=MAIÚSCULA()', '=PRIMEIRA()', '=PRI.MAIÚSCULA()', '=CAPITALIZAR()'],
        correctIndex: 2,
        explanation: 'A função =PRI.MAIÚSCULA() ajusta nomes próprios deixando a primeira letra de cada palavra em maiúscula.'
      },
      {
        id: 503,
        question: 'O que retorna a fórmula: =ESQUERDA("EXCEL2026"; 5)?',
        options: ['"2026"', '"EXCEL"', '"E"', '"EX"'],
        correctIndex: 1,
        explanation: 'A função =ESQUERDA(texto; 5) extrai os 5 primeiros caracteres a partir da esquerda, resultando em "EXCEL".'
      },
      {
        id: 504,
        question: 'Qual é a função do Excel responsável por remover espaços indesejados no início e no final de um texto?',
        options: ['=LIMPAR()', '=ARRUMAR()', '=TIRARESPAÇO()', '=AJUSTAR()'],
        correctIndex: 1,
        explanation: 'A função =ARRUMAR() remove espaços extras no início, no fim e reduz múltiplos espaços internos a um só.'
      },
      {
        id: 505,
        question: 'Qual atalho de teclado ativa o "Preenchimento Relâmpago" (Flash Fill) no Excel?',
        options: ['Ctrl + E', 'Ctrl + F', 'Ctrl + P', 'Ctrl + T'],
        correctIndex: 0,
        explanation: 'Ctrl + E aciona o Preenchimento Relâmpago, reconhecendo padrões de digitação automaticamente.'
      },
      {
        id: 506,
        question: 'Como representar um espaço em branco dentro de uma fórmula de concatenação?',
        options: ['ESPAÇO()', '" "', 'BLANK', '{ }'],
        correctIndex: 1,
        explanation: 'Qualquer texto ou espaço literal em fórmulas do Excel deve ser delimitado por aspas duplas (" ").'
      },
      {
        id: 507,
        question: 'Qual função conta a quantidade total de caracteres (incluindo letras, números e espaços) em uma célula?',
        options: ['=TAMANHO()', '=NÚM.CARACT()', '=CONT.TEXTO()', '=LEN()'],
        correctIndex: 1,
        explanation: '=NÚM.CARACT() retorna o número de caracteres contidos em uma cadeia de texto.'
      },
      {
        id: 508,
        question: 'Qual é o resultado da fórmula =DIREITA("CETEP-BA"; 2)?',
        options: ['"CE"', '"BA"', '"-BA"', '"P-BA"'],
        correctIndex: 1,
        explanation: 'A função DIREITA extrai os últimos 2 caracteres a partir do final do texto, que são "BA".'
      },
      {
        id: 509,
        question: 'Qual função converte todo o texto de uma célula para letras minúsculas?',
        options: ['=BAIXO()', '=MINÚSCULA()', '=MENOR()', '=LOWERCASE()'],
        correctIndex: 1,
        explanation: '=MINÚSCULA() transforma todos os caracteres em minúsculos.'
      },
      {
        id: 510,
        question: 'Qual o erro retornado pelo Excel quando digitamos o nome de uma função incorretamente?',
        options: ['#DIV/0!', '#NOME?', '#N/D', '#REF!'],
        correctIndex: 1,
        explanation: 'O erro #NOME? indica que o Excel não reconheceu a fórmula ou o nome digitado.'
      }
    ]
  },
  {
    id: 6,
    lessonNumber: 6,
    title: 'Funções de Data e Hora no Excel',
    module: 'Módulo 2: Manipulação de Dados, Textos e Datas',
    duration: '27 min',
    summary: 'Como o Excel armazena datas (números seriais), funções HOJE, AGORA, cálculos de prazos e dias úteis.',
    videoUrl: 'https://www.youtube.com/embed/6i2x7M4Oa0E',
    videoTitle: 'Aula 06: Dominando Datas, Prazos e Horas no Excel',
    videoHighlights: [
      'O conceito de Número Serial de Datas (1 = 01/01/1900)',
      'Funções voláteis: =HOJE() e =AGORA()',
      'Extração com DIA, MÊS, ANO e HORA',
      'Cálculo de dias úteis com DIATRABALHOTOTAL'
    ],
    theoryContent: {
      introduction: 'Para o Excel, uma data não é um texto: é um número inteiro que representa quantos dias se passaram desde o dia 1 de janeiro de 1900. Por exemplo, o número serial 1 representa 01/01/1900, e o número 45.000 representa uma data em 2023. As horas são representadas por frações decimais (0,5 = 12 horas ao meio-dia). Por causa dessa lógica matemática, subtrair duas datas calcula instantaneamente a quantidade de dias entre elas.',
      keyConcepts: [
        {
          title: 'Função HOJE() vs. AGORA()',
          description: 'A função =HOJE() não aceita argumentos e retorna a data corrente do sistema. A função =AGORA() retorna a data e a hora atual com minutos e segundos. São funções voláteis que se recalculam a cada abertura de planilha.',
          formulaOrExample: '=HOJE()  ->  14/09/2026 | =AGORA() -> 14/09/2026 15:30'
        },
        {
          title: 'Cálculo de Idade ou Diferenças (DATADIF)',
          description: 'Embora oculta do preenchimento automático por compatibilidade com o antigo Lotus 1-2-3, a função DATADIF calcula com perfeição anos ("Y"), meses ("M") ou dias ("D") completos decorridos.',
          formulaOrExample: '=DATADIF(data_nascimento; HOJE(); "Y")'
        },
        {
          title: 'Dias Úteis (DIATRABALHOTOTAL)',
          description: 'Calcula quantos dias de trabalho existem entre duas datas, excluindo automaticamente finais de semana (sábado e domingo) e feriados customizados.',
          formulaOrExample: '=DIATRABALHOTOTAL(data_inicio; data_fim; intervalo_feriados)'
        }
      ],
      stepByStep: [
        'Para inserir a data de hoje fixa (estática), selecione a célula e aperte o atalho Ctrl + ; (ponto e vírgula).',
        'Para calcular a data de entrega de um projeto com prazo de 45 dias corridos: =A2 + 45.',
        'Para calcular quantos dias de atraso um pagamento possui: =HOJE() - B2 (onde B2 é a data de vencimento).',
        'Para extrair apenas o ano de uma data: =ANO(A2).',
        'Para calcular dias úteis: =DIATRABALHOTOTAL(A2; B2).'
      ],
      keyboardShortcuts: [
        { keys: 'Ctrl + ;', action: 'Inserir a data atual estática na célula' },
        { keys: 'Ctrl + Shift + ;', action: 'Inserir a hora atual estática na célula' },
        { keys: 'Ctrl + Shift + #', action: 'Formatar como data abreviada (DD/MM/AAAA)' },
        { keys: 'F9', action: 'Recalcular todas as fórmulas da planilha imediatamente' }
      ],
      proTip: 'Se você digitar uma data e a célula exibir um número estranho como 46123, não se assuste: apenas mude o formato de número da célula para "Data Abreviada". O número 46123 é a data real sob a ótica do Excel!',
      commonErrors: 'Digitar a função =HOJE sem abrir e fechar os parênteses. Deve ser sempre =HOJE() vazia, sem parâmetros internos.'
    },
    quiz: [
      {
        id: 601,
        question: 'Qual atalho de teclado insere a data atual estática diretamente na célula selecionada?',
        options: ['Ctrl + ;', 'Ctrl + D', 'Alt + D', 'Ctrl + Shift + D'],
        correctIndex: 0,
        explanation: 'Ctrl + ; insere a data corrente do sistema operacional de forma estática.'
      },
      {
        id: 602,
        question: 'Qual é a diferença entre a função =HOJE() e a função =AGORA()?',
        options: [
          'Não há diferença',
          '=HOJE() retorna apenas a data, enquanto =AGORA() retorna a data e o horário atual',
          '=AGORA() só funciona de noite',
          '=HOJE() requer que você digite o ano dentro dos parênteses'
        ],
        correctIndex: 1,
        explanation: '=HOJE() retorna somente a data atual, enquanto =AGORA() traz data e hora completas.'
      },
      {
        id: 603,
        question: 'Como o Excel armazena internamente qualquer data?',
        options: [
          'Como uma imagem JPEG invisível',
          'Como um número serial sequencial, iniciando em 1 para 01/01/1900',
          'Como uma palavra de texto fixa',
          'Como um endereço IP'
        ],
        correctIndex: 1,
        explanation: 'Datas no Excel são números seriais, o que permite operações matemáticas diretas.'
      },
      {
        id: 604,
        question: 'Qual fórmula calcula corretamente o prazo final somando 30 dias à data da célula A1?',
        options: ['=A1 + 30', '=SOMA(A1; 30_DIAS)', '=DATE_ADD(A1; 30)', '=A1 * 30'],
        correctIndex: 0,
        explanation: 'Como cada dia inteiro equivale ao valor 1, basta somar 30 à data: =A1 + 30.'
      },
      {
        id: 605,
        question: 'Qual função conta apenas os dias úteis entre duas datas, excluindo sábados e domingos?',
        options: ['=DIASÚTEIS()', '=DIATRABALHOTOTAL()', '=CONTAR.ÚTEIS()', '=WORKDAYS()'],
        correctIndex: 1,
        explanation: 'A função =DIATRABALHOTOTAL() calcula o número de dias úteis entre duas datas.'
      },
      {
        id: 606,
        question: 'Qual função extrai apenas o valor numérico do ano de uma data contida em B2?',
        options: ['=YEAR()', '=ANO(B2)', '=EXTRAIR.ANO(B2)', '=DATA.ANO(B2)'],
        correctIndex: 1,
        explanation: '=ANO(B2) retorna o ano com 4 dígitos da data indicada.'
      },
      {
        id: 607,
        question: 'O que o argumento "Y" faz na função =DATADIF(A1; A2; "Y")?',
        options: [
          'Retorna o resultado em dias de ontem (Yesterday)',
          'Retorna o número de anos completos decorridos (Years)',
          'Multiplica a data por 100',
          'Gera um erro de sintaxe'
        ],
        correctIndex: 1,
        explanation: '"Y" indica Years (anos completos entre a data inicial e a data final).'
      },
      {
        id: 608,
        question: 'Se a célula A1 contém uma data e ao subtrair A2 de A1 o Excel exibir "45", o que isso significa?',
        options: [
          'Existem 45 dias corridos de diferença entre as duas datas',
          'A fórmula falhou',
          'O valor corresponde a 45 semanas',
          'A data é do ano de 1945'
        ],
        correctIndex: 0,
        explanation: 'A subtração simples entre duas datas no Excel retorna a diferença exata em dias corridos.'
      },
      {
        id: 609,
        question: 'Qual é o resultado numérico interno correspondente a 12 horas (meio-dia) no Excel?',
        options: ['12', '0,5', '24', '720'],
        correctIndex: 1,
        explanation: 'Como 1 dia inteiro = 1, meio dia (12 horas) é representado pelo decimal 0,5.'
      },
      {
        id: 610,
        question: 'As funções =HOJE() e =AGORA() são chamadas de "voláteis" porque:',
        options: [
          'Apagam os dados do usuário se faltar energia',
          'Se recalculam automaticamente toda vez que a planilha é recalculada ou reaberta',
          'Só funcionam em notebooks novos',
          'Não podem ser impressas'
        ],
        correctIndex: 1,
        explanation: 'Funções voláteis recalculam seus valores toda vez que o Excel recalcula qualquer célula.'
      }
    ]
  },
  {
    id: 7,
    lessonNumber: 7,
    title: 'Lógica Condicional Básica: A Função SE e Operadores Relacionais',
    module: 'Módulo 2: Manipulação de Dados, Textos e Datas',
    duration: '32 min',
    summary: 'A função mais famosa do Excel. Testes lógicos, comparações (>, <, =, <>) e tomada de decisões automatizada.',
    videoUrl: 'https://www.youtube.com/embed/jZ8N7zU2qF0',
    videoTitle: 'Aula 07: Como Funciona a Função SE no Excel Passo a Passo',
    videoHighlights: [
      'Sintaxe da função: =SE(teste_lógico; valor_se_verdadeiro; valor_se_falso)',
      'Operadores de comparação (>, <, >=, <=, =, <>)',
      'Cálculo de Aprovação de Alunos (Média >= 7,0)',
      'Retorno de textos com aspas vs. retorno de números e cálculos'
    ],
    theoryContent: {
      introduction: 'A função SE é a espinha dorsal de qualquer análise de tomada de decisão em planilhas. Ela avalia uma condição lógica que pode resultar em apenas duas possibilidades: VERDADEIRO ou FALSO. Se a condição for verdadeira, o Excel executa a primeira ação; caso seja falsa, executa a segunda.',
      keyConcepts: [
        {
          title: 'Sintaxe Completa da Função SE',
          description: '=SE(teste_lógico; valor_se_verdadeiro; [valor_se_falso]). O teste compara duas coisas. Se a resposta for sim, entrega o segundo argumento; se for não, entrega o terceiro.',
          formulaOrExample: '=SE(Média >= 7; "Aprovado"; "Reprovado")'
        },
        {
          title: 'Operadores Relacionais',
          description: 'Maior (>), Menor (<), Maior ou Igual (>=), Menor ou Igual (<=), Igual (=) e Diferente (<>).',
          formulaOrExample: 'A1 <> 0  (significa "A1 é diferente de zero")'
        },
        {
          title: 'Textos com Aspas Duplas',
          description: 'Ao retornar mensagens textuais como "Aprovado", "Meta Atingida" ou "Pendente", o texto DEVE obrigatoriamente estar entre aspas duplas. Números e fórmulas não levam aspas.',
          formulaOrExample: '=SE(B2 > 1000; B2 * 0,1; 0)'
        }
      ],
      stepByStep: [
        'Clique na célula de Situação da nota do aluno (ex: E2).',
        'Digite =SE( e observe a dica de sintaxe do Excel.',
        'Selecione a célula da média (ex: D2), digite o operador >= e o valor 7: =SE(D2>=7;',
        'Digite entre aspas o que acontece se verdadeiro: "Aprovado";',
        'Digite entre aspas o que acontece se falso: "Recuperação")',
        'Pressione Enter e propague a fórmula pela coluna com duplo clique na alça.'
      ],
      keyboardShortcuts: [
        { keys: 'Shift + F3', action: 'Abrir o assistente "Inserir Função" para preencher argumentos guiados' },
        { keys: 'Ctrl + A', action: 'Com uma função digitada na barra, abre a janela de argumentos dela' },
        { keys: 'Tab', action: 'Autocompletar o nome da função sugerida pelo IntelliSense do Excel' }
      ],
      proTip: 'Use a tecla Tab para completar nomes de funções! Quando você começar a digitar =S e a palavra SE aparecer selecionada na lista, aperte Tab. O Excel preenche o nome e abre o parêntese para você automaticamente.',
      commonErrors: 'Esquecer o terceiro argumento (valor se falso). Se você omitir o valor se falso e o teste der falso, o Excel exibirá a palavra feia "FALSO" na sua planilha.'
    },
    quiz: [
      {
        id: 701,
        question: 'Quantos argumentos a função =SE() aceita na sua estrutura padrão?',
        options: ['1 argumento', '2 argumentos', '3 argumentos', '5 argumentos'],
        correctIndex: 2,
        explanation: 'A estrutura padrão possui 3 argumentos: teste_lógico, valor_se_verdadeiro e valor_se_falso.'
      },
      {
        id: 702,
        question: 'Qual operador representa "diferente de" no Excel?',
        options: ['!=', '<>', '=/=', '><'],
        correctIndex: 1,
        explanation: 'No Excel, o operador de diferença é formado por menor e maior juntos: <>.'
      },
      {
        id: 703,
        question: 'Se a célula A1 tiver o valor 8, qual será o resultado de: =SE(A1>=7; "Aprovado"; "Reprovado")?',
        options: ['"Reprovado"', '"Aprovado"', '7', '8'],
        correctIndex: 1,
        explanation: 'Como 8 é maior ou igual a 7, o teste é VERDADEIRO, retornando "Aprovado".'
      },
      {
        id: 704,
        question: 'Por que palavras como "Aprovado" devem ser digitadas entre aspas duplas (" ") dentro da função SE?',
        options: [
          'Para que a fonte fique colorida',
          'Para o Excel entender que se trata de uma cadeia de texto e não de uma fórmula ou nome de variável',
          'Porque o teclado obriga',
          'Para deixar o texto em itálico'
        ],
        correctIndex: 1,
        explanation: 'Aspas duplas identificam textos literais no Excel. Sem aspas, o Excel procura uma função de mesmo nome e dá erro #NOME?.'
      },
      {
        id: 705,
        question: 'Qual é o resultado da fórmula =SE(10 < 5; 100; 200)?',
        options: ['100', '200', '10', 'FALSO'],
        correctIndex: 1,
        explanation: '10 não é menor do que 5 (é FALSO), portanto o Excel retorna o valor do terceiro argumento: 200.'
      },
      {
        id: 706,
        question: 'O que o Excel exibe se o teste lógico for FALSO e você tiver omitido o terceiro argumento da função SE?',
        options: ['0', 'FALSO', 'ERRO', 'Vazio'],
        correctIndex: 1,
        explanation: 'Se o argumento valor_se_falso for omitido e o teste resultar em falso, o Excel retorna o valor lógico FALSO.'
      },
      {
        id: 707,
        question: 'Qual é a representação correta do operador "maior ou igual a" no Excel?',
        options: ['=>', '>=', '≥', '>=='],
        correctIndex: 1,
        explanation: 'O sinal de maior vem antes do igual: >=.'
      },
      {
        id: 708,
        question: 'Qual fórmula concede 10% de bônus sobre o valor da célula B2 apenas se as vendas em B2 forem maiores que 5000, e zero caso contrário?',
        options: [
          '=SE(B2 > 5000; B2 * 0,10; 0)',
          '=SE(B2 = 5000; 10%; 0)',
          '=B2 * 10% + 5000',
          '=SE(B2 < 5000; B2 * 0,10; 0)'
        ],
        correctIndex: 0,
        explanation: 'Se B2 > 5000, calcula B2 * 0,10 (10%), senão retorna 0.'
      },
      {
        id: 709,
        question: 'Ao começar a digitar o nome de uma função no Excel, qual tecla autocompleta o nome sugerido?',
        options: ['Espaço', 'Tab', 'Shift', 'Backspace'],
        correctIndex: 1,
        explanation: 'A tecla Tab autocompleta funções a partir da lista suspensa do IntelliSense.'
      },
      {
        id: 710,
        question: 'A expressão lógica "5 = 5" resulta em qual valor lógico interno no Excel?',
        options: ['1', 'VERDADEIRO', 'IGUAL', 'CORRETO'],
        correctIndex: 1,
        explanation: 'Comparações no Excel retornam os estados booleanos VERDADEIRO ou FALSO.'
      }
    ]
  },
  {
    id: 8,
    lessonNumber: 8,
    title: 'Lógica Condicional Avançada: SE Aninhado, E, OU e SEERRO',
    module: 'Módulo 2: Manipulação de Dados, Textos e Datas',
    duration: '35 min',
    summary: 'Múltiplas condições na mesma fórmula. Funções E(), OU(), aninhamento de testes e blindagem de planilhas com SEERRO.',
    videoUrl: 'https://www.youtube.com/embed/s5tq0jN68zQ',
    videoTitle: 'Aula 08: SE Aninhado, Funções E, OU e Tratamento de Erros com SEERRO',
    videoHighlights: [
      'SE Aninhado para mais de duas saídas (Aprovado, Recuperação, Reprovado)',
      'A função E() para exigir todas as condições verdadeiras',
      'A função OU() para exigir pelo menos uma condição verdadeira',
      'Tratamento profissional de erros com a função SEERRO()'
    ],
    theoryContent: {
      introduction: 'No dia a dia profissional, decisões raramente são binárias. Frequentemente temos 3 ou mais faixas de classificação (ex: Ótimo, Bom, Regular, Ruim) ou precisamos exigir que dois critérios aconteçam ao mesmo tempo (ex: Nota >= 7 E Frequência >= 75%). Para resolver esses cenários, utilizamos o aninhamento de funções SE e combinamos operadores lógicos com as funções E e OU.',
      keyConcepts: [
        {
          title: 'Função E(cond1; cond2; ...)',
          description: 'Retorna VERDADEIRO apenas se TODOS os testes forem simultaneamente verdadeiros. Se um único falhar, retorna FALSO.',
          formulaOrExample: '=SE(E(Nota>=7; Frequência>=75); "Aprovado"; "Reprovado")'
        },
        {
          title: 'Função OU(cond1; cond2; ...)',
          description: 'Retorna VERDADEIRO se PELO MENOS UM dos testes for verdadeiro. Só retorna FALSO se todas as condições falharem.',
          formulaOrExample: '=SE(OU(Vendas>10000; ClientesNovos>=5); "Bônus Concedido"; "Sem Bônus")'
        },
        {
          title: 'Função SEERRO(cálculo; valor_se_erro)',
          description: 'Mascara e protege a planilha contra erros visuais como #N/D, #DIV/0! ou #VALOR!. Se o cálculo der certo, exibe o resultado. Se der erro, exibe o valor alternativo (ex: 0 ou "-").',
          formulaOrExample: '=SEERRO(A1/B1; 0)'
        }
      ],
      stepByStep: [
        'Identifique o número de saídas possíveis: se você tem 3 resultados, precisará de 2 funções SE.',
        'Escreva o primeiro teste mais rigoroso: =SE(D2>=7; "Aprovado";',
        'No argumento valor_se_falso, abra outro SE: SE(D2>=5; "Recuperação"; "Reprovado"))',
        'Conte quantos parênteses foram abertos e feche todos no final.',
        'Para tratar divisões ou buscas, envolva a fórmula inteira com =SEERRO(sua_formula; "Valor Não Encontrado").'
      ],
      keyboardShortcuts: [
        { keys: 'F9', action: 'Avaliar uma parte selecionada da fórmula para ver o resultado parcial na barra' },
        { keys: 'Ctrl + Z', action: 'Desfazer a avaliação de F9 antes de apertar Enter' },
        { keys: 'Alt + Enter', action: 'Inserir uma quebra de linha na Barra de Fórmulas para organizar fórmulas longas' }
      ],
      proTip: 'Aperte Alt + Enter dentro da Barra de Fórmulas para quebrar linhas e identar cada nível da sua função SE aninhada. Isso torna fórmulas gigantes extremamente fáceis de ler e dar manutenção!',
      commonErrors: 'Fechar os parênteses no lugar errado ao aninhar o segundo SE. Lembre-se: o segundo SE deve ser inserido como argumento do primeiro, sem o sinal de igual.'
    },
    quiz: [
      {
        id: 801,
        question: 'Quando a função =E(teste1; teste2) retorna VERDADEIRO?',
        options: [
          'Quando pelo menos um dos testes for verdadeiro',
          'Apenas quando TODOS os testes dentro dela forem simultaneamente verdadeiros',
          'Quando ambos forem falsos',
          'Nunca retorna verdadeiro'
        ],
        correctIndex: 1,
        explanation: 'A função E() é restritiva: exige que 100% dos testes sejam verdadeiros.'
      },
      {
        id: 802,
        question: 'Quando a função =OU(teste1; teste2) retorna VERDADEIRO?',
        options: [
          'Apenas se todos os testes forem falsos',
          'Se pelo menos uma das condições for verdadeira',
          'Somente se ambas forem números pares',
          'Apenas no final da planilha'
        ],
        correctIndex: 1,
        explanation: 'A função OU() é inclusiva: basta que uma condição seja satisfeita para retornar VERDADEIRO.'
      },
      {
        id: 803,
        question: 'Para classificar alunos entre Aprovado, Recuperação e Reprovado (3 resultados possíveis), de quantas funções SE aninhadas precisamos no mínimo?',
        options: ['1 função SE', '2 funções SE', '3 funções SE', '5 funções SE'],
        correctIndex: 1,
        explanation: 'A regra é: Número de funções SE = Número de resultados possíveis - 1 (3 - 1 = 2).'
      },
      {
        id: 804,
        question: 'Para que serve a função =SEERRO(valor; valor_se_erro)?',
        options: [
          'Para provocar erros na planilha propositalmente',
          'Para capturar e substituir mensagens de erro do Excel por um valor amigável (como 0 ou texto)',
          'Para enviar um e-mail de alerta',
          'Para formatar a célula em vermelho'
        ],
        correctIndex: 1,
        explanation: 'SEERRO intercepta erros como #DIV/0! e #N/D, retornando um resultado alternativo limpo.'
      },
      {
        id: 805,
        question: 'Qual é o resultado de =SEERRO(100/0; "Erro no Cálculo")?',
        options: ['#DIV/0!', '"Erro no Cálculo"', '0', '100'],
        correctIndex: 1,
        explanation: 'Como 100/0 gera divisão por zero (#DIV/0!), o SEERRO captura o erro e retorna "Erro no Cálculo".'
      },
      {
        id: 806,
        question: 'Qual fórmula aprova um aluno somente se sua Nota (A1) for >= 7 E sua Frequência (B1) for >= 75%?',
        options: [
          '=SE(OU(A1>=7; B1>=0,75); "Aprovado"; "Reprovado")',
          '=SE(E(A1>=7; B1>=0,75); "Aprovado"; "Reprovado")',
          '=SE(A1+B1 >= 75; "Aprovado"; "Reprovado")',
          '=E(SE(A1>=7); SE(B1>=75))'
        ],
        correctIndex: 1,
        explanation: 'Usa-se a combinação SE + E: =SE(E(A1>=7; B1>=0,75); "Aprovado"; "Reprovado").'
      },
      {
        id: 807,
        question: 'Qual atalho dentro da Barra de Fórmulas cria uma quebra de linha para organizar fórmulas aninhadas?',
        options: ['Enter', 'Alt + Enter', 'Ctrl + Enter', 'Shift + Enter'],
        correctIndex: 1,
        explanation: 'Alt + Enter insere uma quebra de linha visual dentro da célula ou na barra de fórmulas.'
      },
      {
        id: 808,
        question: 'Qual é o resultado da expressão lógica: =OU(10 > 20; 5 = 5)?',
        options: ['FALSO', 'VERDADEIRO', '#VALOR!', '0'],
        correctIndex: 1,
        explanation: 'Embora 10 > 20 seja falso, 5 = 5 é verdadeiro. Como é a função OU, o resultado final é VERDADEIRO.'
      },
      {
        id: 809,
        question: 'Se na função =SEERRO(A1/B1; 0) o valor de A1 for 50 e B1 for 2, qual será o resultado?',
        options: ['0', '25', '#DIV/0!', '50'],
        correctIndex: 1,
        explanation: 'Como não há erro (50 / 2 = 25), o SEERRO retorna o resultado matemático normal: 25.'
      },
      {
        id: 810,
        question: 'Ao aninhar uma segunda função SE dentro da primeira, devemos colocar o sinal de igual (=) antes do segundo SE?',
        options: [
          'Sim, sempre',
          'Não, o sinal de igual só deve ser colocado uma única vez no início da fórmula',
          'Tanto faz',
          'Apenas se a planilha for salva na nuvem'
        ],
        correctIndex: 1,
        explanation: 'O sinal de igual só é inserido no começo absoluto da fórmula; funções aninhadas entram diretamente pelo nome.'
      }
    ]
  }
];
