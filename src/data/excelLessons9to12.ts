import { ExcelLesson } from './excelTypes';

export const lessons9to12: ExcelLesson[] = [
  {
    id: 9,
    lessonNumber: 9,
    title: 'Cálculos Condicionais: SOMASE, SOMASES, CONT.SE e CONT.SES',
    module: 'Módulo 3: Análise Condicional e Localização de Dados',
    duration: '34 min',
    summary: 'Aprenda a somar, contar e tirar médias apenas das linhas que atendem a critérios específicos (ex: Vendas de Informática em Salvador).',
    videoUrl: 'https://www.youtube.com/embed/PqY-k_i5o-4',
    videoTitle: 'Aula 09: Como Dominar SOMASE, SOMASES, CONT.SE e CONT.SES',
    videoHighlights: [
      'Diferença entre SOMASE (1 critério) e SOMASES (múltiplos critérios)',
      'Contagens inteligentes com CONT.SE e CONT.SES',
      'Ordem dos argumentos: intervalo_soma primeiro no SOMASES',
      'Uso de operadores como ">100" e coringas (* e ?)'
    ],
    theoryContent: {
      introduction: 'Em grandes relatórios com milhares de linhas, somar tudo não responde perguntas de negócio. Precisamos saber quanto vendemos de um produto específico, quantos alunos de uma determinada turma tiraram nota azul, ou qual o faturamento de uma filial. Para isso existem as funções condicionais da família SE (SOMASE, SOMASES, CONT.SE, CONT.SES, MÉDIASE e MÉDIASES).',
      keyConcepts: [
        {
          title: 'CONT.SE(intervalo; critérios)',
          description: 'Conta quantas células atendem a um critério especificado. Por exemplo, contar quantos alunos estão com a situação "Aprovado".',
          formulaOrExample: '=CONT.SE(E2:E100; "Aprovado")'
        },
        {
          title: 'SOMASE vs. SOMASES',
          description: 'SOMASE soma com base em apenas 1 critério: =SOMASE(intervalo_critério; critério; [intervalo_soma]). SOMASES permite de 1 a 127 critérios simultâneos, mas seu intervalo_soma fica OBRIGATORIAMENTE no primeiro argumento!',
          formulaOrExample: '=SOMASES(D2:D100; B2:B100; "Informática"; C2:C100; "2026")'
        },
        {
          title: 'Critérios com Operadores Matemáticos',
          description: 'Para critérios numéricos com operadores (>500, <=1000, <>0), o operador e o número devem ser colocados entre aspas duplas.',
          formulaOrExample: '=CONT.SE(C2:C50; ">=7")'
        }
      ],
      stepByStep: [
        'Monte um pequeno quadro resumo com os nomes dos Cursos (ex: Informática, Administração, Enfermagem).',
        'Para contar alunos do curso: =CONT.SE(B2:B100; G2) (onde G2 contém "Informática").',
        'Para somar a carga horária cursada desse curso: =SOMASE(B2:B100; G2; D2:D100).',
        'Para somar com 2 critérios (Curso = Informática E Turno = Matutino), use =SOMASES(D2:D100; B2:B100; "Informática"; C2:C100; "Matutino").',
        'Pressione Enter e trave os intervalos com F4 para poder arrastar o quadro resumo.'
      ],
      keyboardShortcuts: [
        { keys: 'F4', action: 'Travar ($) intervalos de pesquisa antes de arrastar a fórmula condicional' },
        { keys: 'Ctrl + Shift + L', action: 'Ativar filtros automáticos no cabeçalho para conferir os totais' },
        { keys: 'Shift + F3', action: 'Abrir o assistente de funções para conferir os campos de critérios' }
      ],
      proTip: 'Dê preferência para aprender e usar sempre o SOMASES, mesmo para apenas 1 critério! Como ele aceita quantos critérios você quiser e tem uma ordem mais lógica (o que somar vem primeiro), ele é mais moderno e versátil que o antigo SOMASE.',
      commonErrors: 'Inverter a ordem no SOMASES: lembrar sempre que no SOMASE o intervalo a somar é o ÚLTIMO argumento, enquanto no SOMASES o intervalo a somar é o PRIMEIRO argumento.'
    },
    quiz: [
      {
        id: 901,
        question: 'Qual função conta quantas vezes a palavra "Aprovado" aparece no intervalo D2:D50?',
        options: ['=SOMASE(D2:D50; "Aprovado")', '=CONT.SE(D2:D50; "Aprovado")', '=CONTAR(D2:D50)', '=TOTAL.SE(D2:D50; "Aprovado")'],
        correctIndex: 1,
        explanation: 'CONT.SE conta a frequência de ocorrência de determinado critério dentro do intervalo.'
      },
      {
        id: 902,
        question: 'Qual é a principal diferença estrutural entre a função SOMASE e a função SOMASES?',
        options: [
          'O SOMASE soma apenas números pares',
          'No SOMASES, o intervalo que será somado é obrigatoriamente o primeiro argumento da função',
          'O SOMASES não aceita números negativos',
          'O SOMASE é mais rápido e aceita 50 critérios'
        ],
        correctIndex: 1,
        explanation: 'Na sintaxe de SOMASES, o intervalo_soma vem primeiro, seguido dos pares de intervalo_critérios e critérios.'
      },
      {
        id: 903,
        question: 'Como deve ser escrita a condição para contar valores maiores ou iguais a 100 na função CONT.SE?',
        options: ['>= 100', '">=100"', '(>=100)', 'MAIOR.IGUAL(100)'],
        correctIndex: 1,
        explanation: 'Critérios com operadores lógicos devem ser escritos entre aspas duplas: ">=100".'
      },
      {
        id: 904,
        question: 'Qual função calcula a média aritmética apenas das notas dos alunos do curso de "Informática"?',
        options: ['=MÉDIA()', '=MÉDIASE()', '=MÉDIA.TOTAL()', '=CALCULAR.MÉDIA()'],
        correctIndex: 1,
        explanation: 'A função =MÉDIASE() calcula a média condicionada a um critério.'
      },
      {
        id: 905,
        question: 'Quantos pares de critérios a função SOMASES permite incluir em uma mesma fórmula no Excel?',
        options: ['Até 2', 'Até 127', 'Exatamente 10', 'Apenas 1'],
        correctIndex: 1,
        explanation: 'O Excel permite até 127 pares de intervalos e critérios em funções como SOMASES e CONT.SES.'
      },
      {
        id: 906,
        question: 'O que faz a fórmula =CONT.SE(B2:B50; "<>")?',
        options: [
          'Conta todas as células vazias',
          'Conta todas as células não vazias (preenchidas com qualquer conteúdo)',
          'Multiplica as células',
          'Gera um erro de sintaxe'
        ],
        correctIndex: 1,
        explanation: 'O critério "<>" significa diferente de vazio, contando todas as células que contêm dados.'
      },
      {
        id: 907,
        question: 'Se você precisa somar o faturamento onde a Região é "Nordeste" E o Vendedor é "Carlos", qual função é a indicada?',
        options: ['=SOMASE()', '=SOMASES()', '=SOMA()', '=SE()'],
        correctIndex: 1,
        explanation: 'Como temos dois critérios simultâneos (Região e Vendedor), a função correta é o SOMASES.'
      },
      {
        id: 908,
        question: 'O que o caractere coringa asterisco (*) representa dentro de um critério de CONT.SE, como em "Enf*"?',
        options: [
          'Multiplicação por 10',
          'Qualquer quantidade de caracteres subsequentes (ex: Enfermagem, Enfermeiro, Enfa)',
          'Apenas uma letra',
          'Um erro proposital'
        ],
        correctIndex: 1,
        explanation: 'O asterisco (*) é o caractere coringa que substitui qualquer sequência de caracteres.'
      },
      {
        id: 909,
        question: 'Para poder arrastar uma fórmula com CONT.SE para outras linhas sem que o intervalo original de dados se desloque, o que devemos fazer?',
        options: [
          'Salvar o arquivo em PDF',
          'Travar o intervalo com cifrões usando a tecla F4 (ex: $B$2:$B$100)',
          'Excluir a primeira coluna',
          'Mudar a cor da fonte'
        ],
        correctIndex: 1,
        explanation: 'Travar com F4 transforma as referências em absolutas, impedindo o deslocamento ao arrastar.'
      },
      {
        id: 910,
        question: 'Qual é o resultado de =CONT.SES(A1:A10; ">5"; A1:A10; "<10")?',
        options: [
          'Soma todos os números entre 5 e 10',
          'Conta quantos números no intervalo são estritamente maiores que 5 e menores que 10',
          'Retorna sempre o número 5',
          'Divide os números por 10'
        ],
        correctIndex: 1,
        explanation: 'CONT.SES conta as ocorrências que satisfazem as duas condições ao mesmo tempo (entre 6 e 9).'
      }
    ]
  },
  {
    id: 10,
    lessonNumber: 10,
    title: 'Formatação Condicional Inteligente e Visualização de Dados',
    module: 'Módulo 3: Análise Condicional e Localização de Dados',
    duration: '26 min',
    summary: 'Destaque automático de células com cores, barras de dados, escalas térmicas, conjuntos de ícones e fórmulas customizadas.',
    videoUrl: 'https://www.youtube.com/embed/s3hI2fK90r4',
    videoTitle: 'Aula 10: Formatação Condicional Profissional no Excel',
    videoHighlights: [
      'Regras de Realce de Células (Maior que, Menor que, Texto que Contém)',
      'Barras de Dados em gradiente e Escalas de Cor (Mapas de Calor)',
      'Conjuntos de Ícones (Semáforos e Indicadores de Desempenho)',
      'Formatação Condicional baseada em Fórmulas (destacar a linha inteira)'
    ],
    theoryContent: {
      introduction: 'Um bom analista não obriga o usuário a ler número por número para entender se os resultados são positivos ou negativos. A Formatação Condicional altera dinamicamente o aspecto visual de uma célula (cor de fundo, cor da fonte, bordas, ícones) com base no valor que ela possui. Se a meta for batida, fica verde; se estiver em atraso, fica vermelho automaticamente.',
      keyConcepts: [
        {
          title: 'Regras Pré-definidas',
          description: 'Localizadas na guia Página Inicial > Formatação Condicional. Permite aplicar regras instantâneas como "É Maior Que", "Está Entre", "Valores Duplicados" e "Os 10 Primeiros Itens".',
          formulaOrExample: 'Destacar notas < 5 em Vermelho Claro com texto Vermelho Escuro'
        },
        {
          title: 'Barras de Dados e Escalas de Cor',
          description: 'As Barras de Dados desenham uma barra horizontal dentro da própria célula cujo comprimento é proporcional ao valor. As Escalas de Cor criam um mapa de calor (ex: verde para o maior valor, amarelo no meio e vermelho no menor).',
          formulaOrExample: 'Página Inicial > Formatação Condicional > Barras de Dados'
        },
        {
          title: 'Regra com Fórmula (Pintar a Linha Inteira)',
          description: 'Para pintar todas as colunas de uma linha com base no valor de uma única coluna (ex: pintar toda a linha se a Situação for "Reprovado"), usamos uma fórmula com referência mista travando a coluna.',
          formulaOrExample: 'Fórmula: =$E2="Reprovado"'
        }
      ],
      stepByStep: [
        'Selecione a coluna com os números que deseja formatar (ex: C2:C30).',
        'Vá até Página Inicial > Formatação Condicional > Regras de Realce das Células > É Menor do que...',
        'Digite 7 e escolha o preenchimento Vermelho Claro.',
        'Repita o processo e escolha "É Maior ou Igual a" 7 com preenchimento Verde.',
        'Para destacar a linha inteira: selecione toda a tabela A2:E30, vá em "Nova Regra" > "Usar uma fórmula para determinar quais células devem ser formatadas" e digite =$E2="Aprovado".'
      ],
      keyboardShortcuts: [
        { keys: 'Alt + C + R', action: 'Acessar o menu de Formatação Condicional pelo teclado' },
        { keys: 'Gerenciador de Regras', action: 'Permite editar, reordenar ou excluir regras existentes na planilha' }
      ],
      proTip: 'Para colorir a linha completa da tabela com base no valor de uma coluna, NUNCA esqueça do cifrão antes da coluna na fórmula (=$E2="Concluído"). Sem o cifrão, cada célula da linha testará sua própria coluna e a formatação falhará.',
      commonErrors: 'Aplicar dezenas de formatações condicionais repetidas em intervalos picados, deixando a pasta de trabalho lenta. Use sempre o Gerenciador de Regras para limpar regras duplicadas.'
    },
    quiz: [
      {
        id: 1001,
        question: 'Onde está localizado o recurso de "Formatação Condicional" no Excel?',
        options: ['Guia Exibir', 'Guia Página Inicial, no grupo Estilo', 'Guia Arquivo', 'Guia Fórmulas'],
        correctIndex: 1,
        explanation: 'A Formatação Condicional fica centralizada na guia Página Inicial, grupo Estilo.'
      },
      {
        id: 1002,
        question: 'O que acontece com a cor da célula formatada condicionalmente se o valor contido nela for alterado?',
        options: [
          'A cor nunca mais muda',
          'A cor se atualiza instantaneamente para refletir a nova regra correspondente',
          'A planilha é travada com senha',
          'A célula é apagada'
        ],
        correctIndex: 1,
        explanation: 'A formatação condicional é dinâmica: ao mudar o valor da célula, o visual é recalculado na hora.'
      },
      {
        id: 1003,
        question: 'Qual recurso cria pequenas barras horizontais dentro das células simulando mini gráficos proporcionais?',
        options: ['Escala de Cor', 'Barras de Dados', 'Conjunto de Ícones', 'Pintura a Óleo'],
        correctIndex: 1,
        explanation: 'As Barras de Dados desenham barras internas proporcionais ao valor relativo de cada célula.'
      },
      {
        id: 1004,
        question: 'Qual regra rápida permite identificar imediatamente e colorir nomes ou CPFs cadastrados em duplicidade?',
        options: ['Valores Únicos', 'Valores Duplicados', 'Acima da Média', '10 Primeiros'],
        correctIndex: 1,
        explanation: 'A regra "Valores Duplicados" destaca automaticamente entradas repetidas na lista.'
      },
      {
        id: 1005,
        question: 'Para pintar a LINHA INTEIRA de uma tabela de A2 até F50 quando o status da coluna D for "Aprovado", qual fórmula deve ser usada na regra?',
        options: ['=D2="Aprovado"', '=$D2="Aprovado"', '=$D$2="Aprovado"', '=LINHA(D2)'],
        correctIndex: 1,
        explanation: 'A referência mista =$D2 fixa a coluna D para todas as colunas da linha, permitindo que a linha inteira mude de cor.'
      },
      {
        id: 1006,
        question: 'O que o recurso "Gerenciar Regras" permite fazer?',
        options: [
          'Visualizar, editar, alterar a ordem de prioridade e excluir regras de formatação ativas',
          'Excluir a planilha do computador',
          'Configurar a impressora',
          'Trocar a licença do Office'
        ],
        correctIndex: 0,
        explanation: 'O Gerenciador de Regras centraliza todas as regras existentes na seleção ou na planilha inteira.'
      },
      {
        id: 1007,
        question: 'Os "Conjuntos de Ícones" da formatação condicional incluem opções como:',
        options: [
          'Emojis animados',
          'Semáforos (verde, amarelo, vermelho), setas de tendência e estrelas de avaliação',
          'Vídeos do YouTube',
          'Fotos dos contatos'
        ],
        correctIndex: 1,
        explanation: 'Conjuntos de ícones oferecem semáforos, setas direcionais, bandeiras e formas geométricas.'
      },
      {
        id: 1008,
        question: 'O que é um "Mapa de Calor" (Heatmap) gerado por Escalas de Cor no Excel?',
        options: [
          'Um sensor que mede a temperatura física do processador',
          'Uma gradação de cores (ex: do verde ao vermelho) que evidencia extremos e padrões de dados',
          'Uma planilha que só funciona no verão',
          'Um tipo de vírus de computador'
        ],
        correctIndex: 1,
        explanation: 'Escalas de cor criam gradientes térmicos visuais facilitando a identificação de picos e vales.'
      },
      {
        id: 1009,
        question: 'O que acontece se duas regras de formatação condicional conflitarem para a mesma célula?',
        options: [
          'O Excel trava',
          'A regra que estiver mais no topo na lista do Gerenciador de Regras terá prioridade',
          'A célula fica transparente',
          'Nenhuma regra é aplicada'
        ],
        correctIndex: 1,
        explanation: 'O Excel aplica as regras de cima para baixo na ordem de precedência do Gerenciador.'
      },
      {
        id: 1010,
        question: 'É possível aplicar formatação condicional com base no texto contido em uma célula?',
        options: [
          'Não, apenas números são aceitos',
          'Sim, utilizando a regra "Texto que Contém" ou fórmulas lógicas',
          'Apenas se o texto tiver mais de 50 caracteres',
          'Apenas na versão paga para empresas'
        ],
        correctIndex: 1,
        explanation: 'A regra "Texto que Contém" permite formatar células que possuam palavras específicas.'
      }
    ]
  },
  {
    id: 11,
    lessonNumber: 11,
    title: 'Busca e Referência Clássica: PROCV, PROCH, ÍNDICE e CORRESP',
    module: 'Módulo 3: Análise Condicional e Localização de Dados',
    duration: '36 min',
    summary: 'O clássico PROCV desmistificado: matriz-tabela, número de índice da coluna, busca exata (0/FALSO) e a poderosa dupla ÍNDICE + CORRESP.',
    videoUrl: 'https://www.youtube.com/embed/jZ_n5Y2M0_4',
    videoTitle: 'Aula 11: PROCV Passo a Passo e a Dupla ÍNDICE + CORRESP',
    videoHighlights: [
      'Os 4 argumentos do PROCV: valor_procurado, matriz, índice, procurar_intervalo',
      'Obrigação do zero (0 ou FALSO) para busca exata',
      'Limitação clássica do PROCV (só busca para a direita)',
      'Superando limitações com ÍNDICE e CORRESP bidirecional'
    ],
    theoryContent: {
      introduction: 'A função PROCV (Procura Vertical) é historicamente a função corporativa mais cobrada em testes de entrevista de emprego. Ela permite que você procure uma chave única (como Matrícula, CPF ou Código de Produto) na primeira coluna de uma tabela e retorne uma informação correspondente situada em qualquer coluna à direita.',
      keyConcepts: [
        {
          title: 'Os 4 Argumentos do PROCV',
          description: '=PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo]). O valor procurado deve estar SEMPRE na coluna número 1 da matriz selecionada.',
          formulaOrExample: '=PROCV(A2; $G$2:$J$100; 3; 0)'
        },
        {
          title: 'Por que usar 0 (FALSO) no final?',
          description: 'O 4º argumento define o tipo de correspondência. 0 ou FALSO exige correspondência EXATA. 1 ou VERDADEIRO faz correspondência aproximada (usada apenas para faixas de imposto ordenadas).',
          formulaOrExample: '99% dos casos no trabalho exigem 0 (correspondência exata)'
        },
        {
          title: 'A Dupla ÍNDICE + CORRESP',
          description: 'Como o PROCV não consegue buscar dados situados à esquerda da coluna de pesquisa, a combinação de ÍNDICE (para buscar na matriz) com CORRESP (para achar a posição da linha) resolve qualquer busca sem limitações.',
          formulaOrExample: '=ÍNDICE(A2:A100; CORRESP("Enzo"; B2:B100; 0))'
        }
      ],
      stepByStep: [
        'Identifique o código de busca digitado pelo usuário (ex: Célula A2).',
        'Selecione a tabela banco de dados inteira, certificando-se de que o código procurado é a primeira coluna.',
        'Trave a tabela de busca com a tecla F4: $G$2:$K$50.',
        'Conte nos dedos a posição da coluna desejada da esquerda para a direita (1, 2, 3...).',
        'Digite 0 no final para correspondência exata: =PROCV(A2; $G$2:$K$50; 3; 0).',
        'Envolva com =SEERRO(PROCV(...); "Código não cadastrado") para evitar o erro #N/D.'
      ],
      keyboardShortcuts: [
        { keys: 'F4', action: 'Travar a matriz-tabela do PROCV imediatamente' },
        { keys: 'Ctrl + Espaço', action: 'Selecionar toda a coluna atual para contagem' },
        { keys: 'Shift + Espaço', action: 'Selecionar a linha inteira' }
      ],
      proTip: 'A maior causa de erro #N/D no PROCV é esquecer de travar a matriz com F4 antes de arrastar para baixo. Quando você não trava, a tabela se move para baixo e perde os registros iniciais.',
      commonErrors: 'Tentar buscar uma informação que está à esquerda do código de pesquisa usando o PROCV tradicional. O PROCV tradicional SÓ enxerga para a direita!'
    },
    quiz: [
      {
        id: 1101,
        question: 'O que significa a sigla PROCV?',
        options: ['Procura Variável', 'Procura Vertical', 'Processamento de Contas e Valores', 'Programa de Correlação Visual'],
        correctIndex: 1,
        explanation: 'PROCV significa Procura Vertical, buscando dados linha a linha de cima para baixo.'
      },
      {
        id: 1102,
        question: 'Em qual coluna da matriz-tabela deve OBRIGATORIAMENTE estar o valor procurado na função PROCV?',
        options: ['Na última coluna', 'Na primeira coluna da matriz', 'Em qualquer coluna', 'No cabeçalho'],
        correctIndex: 1,
        explanation: 'O PROCV exige que o valor pesquisado esteja na primeiríssima coluna do intervalo selecionado.'
      },
      {
        id: 1103,
        question: 'O que acontece se esquecermos o quarto argumento (ou colocar VERDADEIRO) no PROCV?',
        options: [
          'O Excel fecha',
          'O Excel assume busca aproximada, podendo retornar um valor completamente errado se os dados não estiverem em ordem alfabética estrita',
          'A tela pisca',
          'A fórmula é convertida para soma'
        ],
        correctIndex: 1,
        explanation: 'Sem o 0/FALSO, o PROCV assume busca aproximada, gerando dados incorretos em dados não ordenados.'
      },
      {
        id: 1104,
        question: 'Qual valor deve ser inserido no quarto argumento do PROCV para exigir busca exata?',
        options: ['1 ou VERDADEIRO', '0 ou FALSO', 'EXATO', 'NENHUM'],
        correctIndex: 1,
        explanation: 'O valor 0 ou a palavra lógica FALSO determinam a busca exata no PROCV.'
      },
      {
        id: 1105,
        question: 'O que o erro "#N/D" indica ao executar um PROCV?',
        options: [
          'Número Dividido',
          'Não Disponível (o valor procurado não foi encontrado na primeira coluna)',
          'Nota Descartada',
          'Nome Duplicado'
        ],
        correctIndex: 1,
        explanation: '#N/D significa "Não Disponível", ou seja, o código procurado não existe na base.'
      },
      {
        id: 1106,
        question: 'Qual é a grande limitação nativa do PROCV clássico em relação ao posicionamento dos dados?',
        options: [
          'Só funciona de manhã',
          'Ele só consegue retornar valores situados em colunas à DIREITA da coluna de pesquisa',
          'Não aceita mais de 5 linhas',
          'Só aceita números inteiros'
        ],
        correctIndex: 1,
        explanation: 'O PROCV clássico não pesquisa colunas à esquerda da coluna de pesquisa.'
      },
      {
        id: 1107,
        question: 'Para que serve a função CORRESP no Excel?',
        options: [
          'Para enviar correspondência pelos correios',
          'Para retornar a posição numérica relativa (linha ou coluna) de um item dentro de uma lista',
          'Para corrigir erros de português',
          'Para colorir a tabela'
        ],
        correctIndex: 1,
        explanation: 'CORRESP retorna a posição numérica da linha onde o item procurado se encontra.'
      },
      {
        id: 1108,
        question: 'Por que a combinação ÍNDICE + CORRESP é considerada superior ao PROCV tradicional?',
        options: [
          'Porque gasta menos memória do computador',
          'Porque permite buscar valores tanto para a direita quanto para a esquerda sem restrições de coluna',
          'Porque não precisa de teclado',
          'Porque funciona sem energia elétrica'
        ],
        correctIndex: 1,
        explanation: 'ÍNDICE + CORRESP supera o PROCV ao permitir busca bidirecional (esquerda, direita, cima e baixo).'
      },
      {
        id: 1109,
        question: 'Na fórmula =PROCV(A1; B1:E10; 3; 0), qual coluna do intervalo B1:E10 terá seu valor retornado?',
        options: ['Coluna B (coluna 1)', 'Coluna C (coluna 2)', 'Coluna D (coluna 3)', 'Coluna E (coluna 4)'],
        correctIndex: 2,
        explanation: 'A coluna 1 é B, a coluna 2 é C, e a coluna 3 é D.'
      },
      {
        id: 1110,
        question: 'Qual função é recomendada para envolver o PROCV e exibir "Não encontrado" caso ocorra #N/D?',
        options: ['=SEERRO()', '=APAGAR()', '=TENTAR()', '=EVITAR()'],
        correctIndex: 0,
        explanation: 'A função =SEERRO(PROCV(...); "Não encontrado") protege a planilha de mensagens feias de erro.'
      }
    ]
  },
  {
    id: 12,
    lessonNumber: 12,
    title: 'A Revolução da Função PROCX (XLOOKUP) e Busca Bidirecional',
    module: 'Módulo 3: Análise Condicional e Localização de Dados',
    duration: '30 min',
    summary: 'Conheça o substituto definitivo do PROCV e PROCH: busca em qualquer direção, tratamento de erro nativo e busca de baixo para cima.',
    videoUrl: 'https://www.youtube.com/embed/9G0z_ZkGZJk',
    videoTitle: 'Aula 12: Dominando a Função PROCX (XLOOKUP) no Excel Moderno',
    videoHighlights: [
      'Sintaxe simplificada: pesquisa_vetor e retorno_vetor separados',
      'Busca para a esquerda nativa sem precisar de ÍNDICE/CORRESP',
      'Argumento nativo [se_não_encontrado] eliminando a necessidade de SEERRO',
      'Modo de pesquisa reversa (do último para o primeiro)'
    ],
    theoryContent: {
      introduction: 'Lançada pela Microsoft para modernizar as buscas após décadas de limitações do PROCV, a função PROCX (em inglês, XLOOKUP) é muito mais rápida, intuitiva e segura. Ela não exige contagem de colunas, não quebra se colunas forem inseridas na tabela, busca tanto para a direita quanto para a esquerda e possui tratamento de erro embutido no próprio comando.',
      keyConcepts: [
        {
          title: 'Sintaxe Principal do PROCX',
          description: '=PROCX(pesquisa_valor; pesquisa_matriz; matriz_retorno; [se_não_encontrada]; [modo_correspondência]; [modo_pesquisa]). Por padrão, a correspondência do PROCX já é EXATA!',
          formulaOrExample: '=PROCX(A2; Clientes[CPF]; Clientes[Nome]; "Não encontrado")'
        },
        {
          title: 'Fim da Contagem de Colunas',
          description: 'No PROCV, se alguém inserisse uma nova coluna no meio da tabela, a fórmula quebrava porque o número 3 apontava para a coluna errada. No PROCX, como selecionamos diretamente o vetor de retorno, ela nunca quebra.',
          formulaOrExample: 'Imune à inserção e exclusão de colunas'
        },
        {
          title: 'Busca Reversa (De baixo para cima)',
          description: 'Ao definir o modo_pesquisa como -1, o PROCX pesquisa do final para o início da lista, ideal para encontrar a última compra ou última nota lançada de um aluno.',
          formulaOrExample: 'Modo de pesquisa: -1 (Do último para o primeiro)'
        }
      ],
      stepByStep: [
        'Digite =PROCX( e selecione a célula do código a procurar (ex: A2).',
        'Selecione apenas a coluna onde esse código está cadastrado (ex: F2:F100).',
        'Selecione a coluna de onde você quer trazer a resposta (ex: B2:B100 - pode estar à esquerda!).',
        'Digite o texto caso não encontre: "Cliente não localizado".',
        'Feche o parêntese e pressione Enter: =PROCX(A2; F2:F100; B2:B100; "Não localizado").'
      ],
      keyboardShortcuts: [
        { keys: 'Tab', action: 'Autocompletar =PROCX após digitar =PR' },
        { keys: 'Ctrl + Shift + Seta Abaixo', action: 'Selecionar rapidamente o vetor de pesquisa até o final da base' }
      ],
      proTip: 'O PROCX já vem configurado por padrão com correspondência EXATA. Você não precisa mais lembrar de digitar 0 ou FALSO no final como fazia obrigatoriamente no antigo PROCV!',
      commonErrors: 'Selecionar vetores de tamanhos diferentes (ex: pesquisar em F2:F100 mas selecionar retorno de B2:B80). O Excel exige que ambos os vetores tenham exatamente a mesma quantidade de linhas.'
    },
    quiz: [
      {
        id: 1201,
        question: 'Qual é o nome em inglês da função PROCX do Excel?',
        options: ['VLOOKUP', 'XLOOKUP', 'SEARCHX', 'INDEXLOOKUP'],
        correctIndex: 1,
        explanation: 'No Excel em inglês, PROCX chama-se XLOOKUP.'
      },
      {
        id: 1202,
        question: 'Qual é o comportamento padrão de correspondência do PROCX se você omitir esse argumento?',
        options: [
          'Correspondência aproximada',
          'Correspondência EXATA por padrão',
          'Ele gera um erro',
          'Ele soma os valores'
        ],
        correctIndex: 1,
        explanation: 'Diferente do PROCV, o PROCX adota correspondência EXATA por padrão, sem precisar de zero.'
      },
      {
        id: 1203,
        question: 'O PROCX consegue buscar e retornar valores que estão situados à ESQUERDA da coluna de pesquisa?',
        options: [
          'Não, ele tem a mesma limitação do PROCV',
          'Sim, nativamente e sem necessidade de funções auxiliares',
          'Apenas na versão para celular',
          'Apenas se a planilha for salva em CSV'
        ],
        correctIndex: 1,
        explanation: 'O PROCX é bidirecional e pesquisa livremente à esquerda, à direita, para cima e para baixo.'
      },
      {
        id: 1204,
        question: 'Para que serve o quarto argumento opcional [se_não_encontrada] na função PROCX?',
        options: [
          'Para definir a cor da célula',
          'Para fornecer um valor padrão caso a busca não localize o item, eliminando a necessidade de usar SEERRO',
          'Para reiniciar o Windows',
          'Para calcular juros compostos'
        ],
        correctIndex: 1,
        explanation: '[se_não_encontrada] substitui nativamente o erro #N/D por uma mensagem ou valor customizado.'
      },
      {
        id: 1205,
        question: 'O que acontece com o resultado do PROCX se uma nova coluna for inserida no meio da base de dados?',
        options: [
          'O resultado é corrompido',
          'A fórmula continua funcionando perfeitamente sem quebrar, pois os vetores se ajustam dinamicamente',
          'O Excel fecha sem salvar',
          'O valor vira zero'
        ],
        correctIndex: 1,
        explanation: 'Como o PROCX referencia colunas inteiras e não um número estático de coluna, ele nunca quebra.'
      },
      {
        id: 1206,
        question: 'Qual configuração no modo de pesquisa do PROCX permite localizar o ÚLTIMO registro lançado na tabela (pesquisa reversa)?',
        options: ['1', '-1 (pesquisar do último para o primeiro)', '0', '99'],
        correctIndex: 1,
        explanation: 'O parâmetro -1 ativa a busca de baixo para cima, encontrando a ocorrência mais recente.'
      },
      {
        id: 1207,
        question: 'Qual requisito é obrigatório em relação ao tamanho dos intervalos de pesquisa e de retorno no PROCX?',
        options: [
          'Devem ter no máximo 10 linhas',
          'Devem ter exatamente o mesmo número de linhas ou colunas',
          'O retorno deve ter o dobro do tamanho',
          'Não há nenhum requisito'
        ],
        correctIndex: 1,
        explanation: 'A matriz de pesquisa e a matriz de retorno devem ter dimensões compatíveis (mesmo número de linhas).'
      },
      {
        id: 1208,
        question: 'Em quais versões do Excel o PROCX está nativamente disponível?',
        options: [
          'Excel 2003 e 2007',
          'Microsoft 365, Excel 2021 e versões online mais recentes',
          'Apenas no Windows 98',
          'Apenas no Excel para DOS'
        ],
        correctIndex: 1,
        explanation: 'O PROCX foi introduzido no Microsoft 365 e incluído no pacote perpétuo a partir do Office 2021.'
      },
      {
        id: 1209,
        question: 'Qual é a principal vantagem do PROCX sobre a antiga dupla ÍNDICE + CORRESP?',
        options: [
          'Sintaxe muito mais simples, rápida e fácil de lembrar e digitar em uma única função',
          'ÍNDICE + CORRESP não funciona mais',
          'O PROCX é gratuito e o ÍNDICE é pago',
          'Não há vantagens'
        ],
        correctIndex: 0,
        explanation: 'O PROCX condensa o poder de ÍNDICE e CORRESP em uma sintaxe direta e muito mais legível.'
      },
      {
        id: 1210,
        question: 'Qual é o resultado de =PROCX("123"; A2:A10; B2:B10; "Não Cadastrado") se o código "123" não existir?',
        options: ['#N/D', '#VALOR!', '"Não Cadastrado"', '0'],
        correctIndex: 2,
        explanation: 'Como o código não foi localizado, o PROCX aciona o argumento de fallback retornando "Não Cadastrado".'
      }
    ]
  }
];
