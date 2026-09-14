import { ExcelLesson } from './excelTypes';

export const lessons1to4: ExcelLesson[] = [
  {
    "id": 1,
    "lessonNumber": 1,
    "title": "Aula 01: Interface do Excel e Navegação",
    "module": "Módulo 1: Fundamentos e Interface",
    "duration": "22 min",
    "summary": "Aprenda detalhadamente como funciona a interface moderna do Excel: Faixa de Opções, Guias, Barra de Fórmulas, Caixa de Nome, linhas, colunas, células e atalhos rápidos de navegação.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/J9jSCL61a4k",
    "videoTitle": "Aula 02 - Interface do Excel - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Faixa de Opções e organização por guias temáticas",
      "Caixa de Nome e Barra de Fórmulas",
      "Dimensões da planilha: 1.048.576 linhas e 16.384 colunas (A a XFD)",
      "Barra de Status e atalhos rápidos de movimentação pelo teclado"
    ],
    "theoryContent": {
      "introduction": "A interface do Microsoft Excel foi projetada para oferecer acesso rápido e intuitivo a centenas de ferramentas analíticas. O ambiente de trabalho é centrado na Faixa de Opções (Ribbon) no topo, na Barra de Fórmulas logo abaixo e em uma imensa grade bidimensional composta por colunas (identificadas por letras de A a XFD) e linhas (identificadas por números de 1 a 1.048.576). Conhecer cada centímetro da interface é o primeiro passo para ganhar velocidade e confiança profissional.",
      "keyConcepts": [
        {
          "title": "Faixa de Opções e Guias",
          "description": "A barra superior onde as ferramentas são agrupadas por contexto: Página Inicial (formatação e edição rápida), Inserir (gráficos, tabelas e ilustrações), Fórmulas (biblioteca de cálculos), Dados (filtros e validações), Revisão (ortografia e proteção) e Exibir (modos de tela e linhas de grade)."
        },
        {
          "title": "Caixa de Nome e Célula Ativa",
          "description": "A Célula Ativa é aquela que está atualmente selecionada com a borda em destaque. A Caixa de Nome, situada no canto superior esquerdo da grade, exibe o endereço exato dessa célula ou o nome do intervalo selecionado.",
          "formulaOrExample": "Endereço: B4 (Coluna B, Linha 4)"
        },
        {
          "title": "Barra de Fórmulas",
          "description": "Espaço onde você visualiza e edita o conteúdo real de uma célula (o valor bruto digitado ou a fórmula que gerou o cálculo exibido na grade).",
          "formulaOrExample": "Na célula vê-se: 150 | Na Barra de Fórmulas: =50*3"
        },
        {
          "title": "Barra de Status",
          "description": "Localizada na parte inferior da janela do Excel. Quando você seleciona células com números, ela calcula instantaneamente a Média, Contagem e Soma sem que você precise digitar nenhuma fórmula, além de conter os controles de Zoom."
        }
      ],
      "stepByStep": [
        "Abra o Excel e observe a Faixa de Opções no topo.",
        "Clique na célula A1, digite seu nome e pressione Enter para descer para a célula A2.",
        "Pressione Tab para avançar para a célula B2 e Shift + Tab para retornar à A2.",
        "Selecione a Caixa de Nome no topo esquerdo, digite \"Z50\" e tecle Enter para saltar diretamente para aquela célula distante.",
        "Pressione Ctrl + Home para retornar instantaneamente para a célula A1 da planilha."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + Home",
          "action": "Retorna imediatamente para a primeira célula (A1)"
        },
        {
          "keys": "Ctrl + End",
          "action": "Vai para a última célula utilizada na planilha"
        },
        {
          "keys": "Ctrl + Setas",
          "action": "Salta até o início ou fim de blocos preenchidos de dados"
        },
        {
          "keys": "Shift + Espaço",
          "action": "Seleciona a linha inteira da célula atual"
        },
        {
          "keys": "Ctrl + Espaço",
          "action": "Seleciona a coluna inteira da célula atual"
        }
      ],
      "proTip": "Para ocultar temporariamente a Faixa de Opções e ganhar mais espaço visual na tela da planilha, basta dar um duplo clique sobre o nome de qualquer guia ou pressionar o atalho Ctrl + F1.",
      "commonErrors": "Digitar uma informação e clicar diretamente em outro comando antes de teclar Enter ou Tab, mantendo o Excel em modo de edição e bloqueando diversos botões da Faixa de Opções."
    },
    "quiz": [
      {
        "id": 101,
        "question": "Qual é o nome dado ao elemento superior do Excel onde ficam organizadas as guias como Página Inicial, Inserir e Fórmulas?",
        "options": [
          "Barra de Tarefas",
          "Menu Iniciar",
          "Faixa de Opções (Ribbon)",
          "Barra de Status"
        ],
        "correctIndex": 2,
        "explanation": "A Faixa de Opções (Ribbon) é o painel superior principal que reúne todos os comandos e ferramentas em guias temáticas."
      },
      {
        "id": 102,
        "question": "Onde na interface do Excel é possível visualizar o endereço da célula ativa no momento?",
        "options": [
          "Na Caixa de Nome",
          "Na Barra de Status",
          "No Painel de Controle",
          "Na Barra de Título"
        ],
        "correctIndex": 0,
        "explanation": "A Caixa de Nome, localizada à esquerda da Barra de Fórmulas, indica qual célula ou intervalo está selecionado."
      },
      {
        "id": 103,
        "question": "Quantas linhas no total existem em uma planilha padrão do Microsoft Excel moderno?",
        "options": [
          "65.536 linhas",
          "500.000 linhas",
          "100.000 linhas",
          "1.048.576 linhas"
        ],
        "correctIndex": 3,
        "explanation": "O Excel moderno (.xlsx) possui exatamente 1.048.576 linhas numeradas sequencialmente."
      },
      {
        "id": 104,
        "question": "Qual é a última coluna disponível em uma planilha padrão do Excel?",
        "options": [
          "ZZ",
          "XFD",
          "ABC",
          "ZZZ"
        ],
        "correctIndex": 1,
        "explanation": "As colunas vão de A até a coluna XFD (totalizando 16.384 colunas)."
      },
      {
        "id": 105,
        "question": "Qual é a tecla utilizada para confirmar o valor digitado e avançar uma célula para a DIREITA?",
        "options": [
          "Enter",
          "Espaço",
          "Esc",
          "Tab"
        ],
        "correctIndex": 3,
        "explanation": "A tecla Tab desloca a seleção para a célula imediatamente à direita; Shift+Tab move para a esquerda."
      },
      {
        "id": 106,
        "question": "Qual atalho de teclado leva o cursor imediatamente de volta para a célula A1 da planilha?",
        "options": [
          "Ctrl + A",
          "Alt + F4",
          "Ctrl + Home",
          "Ctrl + Z"
        ],
        "correctIndex": 2,
        "explanation": "O atalho Ctrl + Home retorna a seleção para o início da planilha (célula A1)."
      },
      {
        "id": 107,
        "question": "Ao selecionar um conjunto de células numéricas, onde o Excel exibe automaticamente a Soma, Contagem e Média instantâneas?",
        "options": [
          "Na Barra de Status (rodapé)",
          "Na Barra de Título",
          "Na Barra de Fórmulas",
          "Na Guia Arquivo"
        ],
        "correctIndex": 0,
        "explanation": "A Barra de Status, no rodapé inferior direito do Excel, calcula automaticamente estatísticas básicas das células numéricas selecionadas."
      },
      {
        "id": 108,
        "question": "Qual é a principal função da Barra de Fórmulas no Excel?",
        "options": [
          "Exibir o nome do computador do usuário",
          "Exibir e permitir editar o conteúdo real ou a fórmula da célula ativa",
          "Conectar o Excel à internet",
          "Alternar a cor de fundo do Windows"
        ],
        "correctIndex": 1,
        "explanation": "A Barra de Fórmulas mostra a fórmula exata ou o texto inserido na célula, permitindo edição completa."
      },
      {
        "id": 109,
        "question": "Qual atalho de teclado recolhe ou expande a Faixa de Opções para dar mais visibilidade à planilha?",
        "options": [
          "Ctrl + P",
          "Alt + Tab",
          "Ctrl + F1",
          "Ctrl + Shift + L"
        ],
        "correctIndex": 2,
        "explanation": "Ctrl + F1 oculta ou exibe a Faixa de Opções com agilidade."
      },
      {
        "id": 110,
        "question": "O que acontece ao pressionar a tecla Esc enquanto você está digitando dados em uma célula?",
        "options": [
          "A planilha inteira é excluída",
          "O computador reinicia",
          "O valor é salvo automaticamente",
          "A edição atual é cancelada e a célula retorna ao seu valor original anterior"
        ],
        "correctIndex": 3,
        "explanation": "A tecla Esc cancela a digitação ou edição atual sem alterar o conteúdo que já estava salvo na célula."
      }
    ]
  },
  {
    "id": 2,
    "lessonNumber": 2,
    "title": "Aula 02: Formatação Básica de Células",
    "module": "Módulo 1: Fundamentos e Interface",
    "duration": "24 min",
    "summary": "Aprenda a aplicar formatações essenciais de texto, alinhamento, bordas, cores de preenchimento, formatos numéricos (Moeda, Contábil, Porcentagem) e o uso do Pincel de Formatação.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/C5ouQPaCQjM",
    "videoTitle": "Aula 03 - Formatação Básica - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Fontes, tamanhos, cores e preenchimento de células",
      "Alinhamento horizontal, vertical e quebra automática de texto",
      "Formatos numéricos: Geral, Número, Moeda, Contábil e Porcentagem",
      "Pincel de Formatação para copiar estilos com agilidade"
    ],
    "theoryContent": {
      "introduction": "A formatação correta transforma planilhas amadoras e poluídas em documentos executivos fáceis de ler e compreender. No Excel, formatar uma célula altera apenas a sua aparência visual perante o usuário, mantendo o valor matemático subjacente inalterado para os cálculos.",
      "keyConcepts": [
        {
          "title": "Tipografia e Bordas",
          "description": "Ajuste de fontes (Segoe UI, Aptos, Arial, Calibri), pesos (Negrito Ctrl+N, Itálico Ctrl+I) e aplicação de bordas personalizadas (bordas externas espessas, bordas duplas para totalizadores) na guia Página Inicial."
        },
        {
          "title": "Alinhamento e Quebra de Texto",
          "description": "Organização do conteúdo dentro da célula verticalmente (Superior, Meio, Inferior) e horizontalmente (Esquerda para textos, Direita para números). O comando \"Quebrar Texto Automaticamente\" permite acomodar textos longos em várias linhas dentro da mesma célula sem alargar a coluna."
        },
        {
          "title": "Formatos Numéricos: Moeda vs. Contábil",
          "description": "O formato Moeda alinha o símbolo monetário (R$) encostado no número, enquanto o formato Contábil fixa o símbolo (R$) alinhado à esquerda da célula e alinha as casas decimais perfeitamente em coluna, exibindo um traço (-) para o valor zero."
        },
        {
          "title": "Pincel de Formatação",
          "description": "Ferramenta que copia todas as características de estilo (cor, fonte, borda, formato de número) de uma célula de origem para uma ou várias células de destino. Um clique simples copia uma vez; um duplo clique fixa o pincel para copiar em múltiplas células consecutivas."
        }
      ],
      "stepByStep": [
        "Selecione os cabeçalhos da tabela e clique em Negrito (Ctrl + N) e aplique uma cor de preenchimento azul escuro com texto branco.",
        "Selecione as células com valores financeiros e clique no botão de Formato de Número de Contabilização (R$).",
        "Selecione uma célula que contenha uma porcentagem (ex: 0,15) e clique no botão Estilo de Porcentagem (%) para exibir 15%.",
        "Selecione a célula com a formatação desejada, clique duas vezes no ícone do Pincel de Formatação e clique sobre as demais colunas.",
        "Pressione Esc para desativar o Pincel de Formatação."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + 1",
          "action": "Abre a caixa de diálogo completa \"Formatar Células\""
        },
        {
          "keys": "Ctrl + N",
          "action": "Aplica ou remove o estilo Negrito"
        },
        {
          "keys": "Ctrl + I",
          "action": "Aplica ou remove o estilo Itálico"
        },
        {
          "keys": "Ctrl + Shift + $",
          "action": "Aplica imediatamente o formato Moeda (R$)"
        },
        {
          "keys": "Ctrl + Shift + %",
          "action": "Aplica imediatamente o formato Porcentagem (%)"
        }
      ],
      "proTip": "Evite o uso excessivo de \"Mesclar e Centralizar\" em tabelas com dados contínuos, pois células mescladas podem prejudicar a ordenação, a filtragem e a seleção de colunas. Em vez disso, prefira o alinhamento \"Centralizar seleção\" na caixa Formatar Células (Ctrl + 1).",
      "commonErrors": "Digitar manualmente \"R$\" ou \"%\" junto ao número dentro da célula. Isso faz com que o Excel reconheça a célula como texto, impossibilitando que ela seja usada em cálculos matemáticos."
    },
    "quiz": [
      {
        "id": 201,
        "question": "Qual atalho universal no Excel abre a janela completa de \"Formatar Células\"?",
        "options": [
          "Ctrl + F",
          "Ctrl + 1",
          "Alt + F4",
          "Ctrl + Enter"
        ],
        "correctIndex": 1,
        "explanation": "Ctrl + 1 é o atalho mais importante para abrir o menu detalhado de Formatar Células."
      },
      {
        "id": 202,
        "question": "Qual é a principal diferença visual entre o formato \"Moeda\" e o formato \"Contábil\"?",
        "options": [
          "O formato Moeda não aceita centavos",
          "O formato Contábil só funciona com dólares",
          "Não existe nenhuma diferença entre eles",
          "O formato Contábil alinha o símbolo R$ à esquerda e alinha perfeitamente as vírgulas decimais na coluna"
        ],
        "correctIndex": 3,
        "explanation": "No formato Contábil o símbolo R$ fica fixo à esquerda da célula e os decimais perfeitamente alinhados."
      },
      {
        "id": 203,
        "question": "Se você digitar o número 0,25 em uma célula e aplicar o formato Porcentagem (%), como o número será exibido?",
        "options": [
          "25%",
          "0,25%",
          "2,5%",
          "250%"
        ],
        "correctIndex": 0,
        "explanation": "O Excel multiplica o valor decimal por 100 e adiciona o símbolo de porcentagem: 0,25 vira 25%."
      },
      {
        "id": 204,
        "question": "Para aplicar a mesma formatação de uma célula em várias outras de forma contínua, o que devemos fazer no ícone do Pincel de Formatação?",
        "options": [
          "Dar um único clique",
          "Pressionar a tecla Shift junto com o botão direito",
          "Dar um duplo clique rápido",
          "Arrastar o ícone até a lixeira"
        ],
        "correctIndex": 2,
        "explanation": "Dar um duplo clique no Pincel de Formatação mantém a ferramenta ativa para múltiplas seleções até que você tecle Esc."
      },
      {
        "id": 205,
        "question": "Por que não se deve digitar manualmente \"R$ 50,00\" com letras e espaços dentro da célula?",
        "options": [
          "Porque a célula fica invisível",
          "Porque o Excel passa a tratar o conteúdo como Texto, impedindo cálculos de soma e média",
          "Porque o Excel fecha sozinho",
          "Porque a letra R é proibida em planilhas"
        ],
        "correctIndex": 1,
        "explanation": "Digitar símbolos textuais converte o número em texto puro, quebrando fórmulas matemáticas."
      },
      {
        "id": 206,
        "question": "Qual recurso permite que um texto longo seja exibido em várias linhas dentro da mesma célula sem aumentar a largura da coluna?",
        "options": [
          "Quebrar Texto Automaticamente",
          "Mesclar e Centralizar",
          "Limpar Formatos",
          "Inverter Linhas"
        ],
        "correctIndex": 0,
        "explanation": "Quebrar Texto Automaticamente ajusta a altura da linha mantendo o texto visível em múltiplas linhas."
      },
      {
        "id": 207,
        "question": "Por padrão, como o Excel alinha textos e números não formatados nas células?",
        "options": [
          "Textos à direita e números à esquerda",
          "Ambos centralizados",
          "Ambos alinhados à direita",
          "Textos à esquerda e números à direita"
        ],
        "correctIndex": 3,
        "explanation": "Por padrão natural, o Excel alinha textos à esquerda e valores numéricos à direita."
      },
      {
        "id": 208,
        "question": "Qual atalho de teclado aplica formatação de Negrito no Excel em português?",
        "options": [
          "Ctrl + B",
          "Ctrl + G",
          "Ctrl + N",
          "Ctrl + T"
        ],
        "correctIndex": 2,
        "explanation": "No Excel em português, Ctrl + N ativa e desativa o Negrito (Ctrl + B é o atalho para salvar a pasta de trabalho)."
      },
      {
        "id": 209,
        "question": "O que o recurso \"Aumentar Casas Decimais\" faz com o número 12,5?",
        "options": [
          "Passa a exibir 12,50",
          "Multiplica o número por 10",
          "Converte para 125",
          "Arredonda para 13"
        ],
        "correctIndex": 0,
        "explanation": "Aumentar casas decimais adiciona zeros após a vírgula para maior precisão visual (ex: 12,5 vira 12,50)."
      },
      {
        "id": 210,
        "question": "Qual é o efeito do comando \"Limpar Formatos\" (ícone da borracha na guia Página Inicial)?",
        "options": [
          "Exclui os dados e a fórmula da célula",
          "Remove cores, bordas e formatações visuais, preservando o valor puro do conteúdo",
          "Exclui a coluna inteira",
          "Fecha a pasta de trabalho sem salvar"
        ],
        "correctIndex": 1,
        "explanation": "Limpar Formatos remove toda a estética e formatações aplicadas, deixando apenas o dado bruto."
      }
    ]
  },
  {
    "id": 3,
    "lessonNumber": 3,
    "title": "Aula 03: Funções Aritméticas e Ordem de Precedência",
    "module": "Módulo 2: Cálculos e Funções Essenciais",
    "duration": "26 min",
    "summary": "Domine os operadores aritméticos fundamentais (+, -, *, /, ^), a regra de precedência matemática PEMDAS, referências relativas e as funções SOMA e MULT.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/9X1pfhyBo0c",
    "videoTitle": "Aula 04 - Funções Aritmétricas - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Operadores matemáticos: Adição, Subtração, Multiplicação, Divisão e Potenciação",
      "Ordem de Precedência Matemática (Parênteses e Operadores)",
      "Função SOMA com intervalos contínuos e intercalados",
      "Uso da Alça de Preenchimento para replicar cálculos"
    ],
    "theoryContent": {
      "introduction": "Toda fórmula no Excel deve obrigatoriamente iniciar pelo sinal de igual (=). O Excel é um motor de cálculo de alta precisão que segue rigorosamente as regras da matemática tradicional. Compreender a ordem de cálculo evita erros graves em relatórios contábeis e financeiros.",
      "keyConcepts": [
        {
          "title": "Operadores Matemáticos Básicos",
          "description": "Adição (+), Subtração (-), Multiplicação (*), Divisão (/) e Exponenciação (^). Toda fórmula inicia com =.",
          "formulaOrExample": "=A1 + B1 | =A1 * 1,10 | =C4 / 12 | =2^3 (resultado 8)"
        },
        {
          "title": "Ordem de Precedência (PEMDAS)",
          "description": "O Excel resolve primeiro o que está entre Parênteses, em seguida Exponenciação, depois Multiplicação e Divisão (na ordem em que surgirem) e por último Adição e Subtração.",
          "formulaOrExample": "=10 + 5 * 2 resulta em 20 | =(10 + 5) * 2 resulta em 30"
        },
        {
          "title": "Função SOMA",
          "description": "Permite somar centenas ou milhares de células de forma simples e rápida sem precisar somar uma a uma com o operador +.",
          "formulaOrExample": "=SOMA(A1:A100) soma da célula A1 até A100 | =SOMA(A1; B5; C10) soma células isoladas"
        },
        {
          "title": "Alça de Preenchimento",
          "description": "O pequeno quadrado verde localizado no canto inferior direito da célula selecionada. Ao dar um duplo clique ou arrastar, o Excel replica a fórmula para as linhas abaixo ajustando as referências relativas automaticamente."
        }
      ],
      "stepByStep": [
        "Clique na célula C2 e digite =A2*B2 para calcular o total de uma venda (Quantidade x Preço).",
        "Pressione Enter para concluir o cálculo.",
        "Dê um duplo clique na Alça de Preenchimento no canto inferior direito de C2 para calcular toda a lista.",
        "Abaixo da coluna C, clique na ferramenta \"AutoSoma\" (Alt + =) na guia Página Inicial para gerar =SOMA(C2:C10).",
        "Pressione Enter para confirmar o total geral."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + =",
          "action": "Insere a função AutoSoma automaticamente no intervalo selecionado"
        },
        {
          "keys": "Ctrl + D",
          "action": "Copia a fórmula ou valor da célula superior para a célula atual"
        },
        {
          "keys": "Ctrl + R",
          "action": "Copia a fórmula ou valor da célula à esquerda para a célula atual"
        },
        {
          "keys": "F2",
          "action": "Entra no modo de edição da célula ativa"
        }
      ],
      "proTip": "Para somar colunas ou linhas inteiras instantaneamente, selecione toda a tabela incluindo a linha em branco de totais e pressione Alt + =. O Excel criará todas as somas de uma única vez!",
      "commonErrors": "Esquecer de colocar parênteses ao calcular médias ponderadas ou margens de lucro, por exemplo digitar =A1+B1/2 em vez de =(A1+B1)/2."
    },
    "quiz": [
      {
        "id": 301,
        "question": "Com qual caractere obrigatório deve se iniciar qualquer cálculo ou fórmula no Excel?",
        "options": [
          "Sinal de mais (+)",
          "Sinal de arroba (@)",
          "Ponto e vírgula (;)",
          "Sinal de igual (=)"
        ],
        "correctIndex": 3,
        "explanation": "Todas as fórmulas no Excel devem começar obrigatoriamente pelo sinal de igual (=)."
      },
      {
        "id": 302,
        "question": "Qual é o resultado da fórmula =10 + 2 * 5 no Excel?",
        "options": [
          "60",
          "20",
          "100",
          "25"
        ],
        "correctIndex": 1,
        "explanation": "Pela regra de precedência, a multiplicação é feita antes da soma: 2 * 5 = 10, e 10 + 10 = 20."
      },
      {
        "id": 303,
        "question": "Qual operador é utilizado para realizar uma exponenciação (potência) no Excel?",
        "options": [
          "*",
          "**",
          "^ (circunflexo)",
          "%"
        ],
        "correctIndex": 2,
        "explanation": "O acento circunflexo (^) é o operador de potenciação no Excel (ex: =2^3 resulta em 8)."
      },
      {
        "id": 304,
        "question": "Na fórmula =SOMA(A1:A5), o que indica o símbolo de dois pontos (:)?",
        "options": [
          "Que todas as células no intervalo contínuo de A1 até A5 serão somadas",
          "Que apenas as células A1 e A5 serão somadas",
          "Que a célula A1 será dividida por A5",
          "Que há um erro de sintaxe"
        ],
        "correctIndex": 0,
        "explanation": "Os dois pontos (:) indicam um intervalo contínuo (de A1 \"até\" A5)."
      },
      {
        "id": 305,
        "question": "Se quisermos somar apenas as células A1 e A5 de forma isolada, como a fórmula deve ser escrita?",
        "options": [
          "=SOMA(A1:A5)",
          "=SOMA(A1 - A5)",
          "=SOMA(A1; A5)",
          "=SOMA(A1 & A5)"
        ],
        "correctIndex": 2,
        "explanation": "O ponto e vírgula (;) serve como separador de argumentos isolados no Excel."
      },
      {
        "id": 306,
        "question": "Qual atalho de teclado insere a função AutoSoma de forma instantânea?",
        "options": [
          "Ctrl + S",
          "Ctrl + Shift + S",
          "F5",
          "Alt + ="
        ],
        "correctIndex": 3,
        "explanation": "O atalho Alt + = insere a função AutoSoma automaticamente na célula selecionada."
      },
      {
        "id": 307,
        "question": "Qual fórmula calcula corretamente a média de duas notas nas células A1 e B1 respeitando a ordem de cálculo?",
        "options": [
          "=A1 + B1 / 2",
          "=(A1 + B1) / 2",
          "=A1 / 2 + B1",
          "=A1 * B1 / 2"
        ],
        "correctIndex": 1,
        "explanation": "Os parênteses garantem que a soma de A1 + B1 ocorra antes da divisão por 2."
      },
      {
        "id": 308,
        "question": "Qual é o papel da Alça de Preenchimento (pequeno quadrado verde no canto da célula selecionada)?",
        "options": [
          "Arrastar e propagar fórmulas ou sequências lógicas para células adjacentes",
          "Excluir a linha atual",
          "Mudar o idioma do Excel",
          "Fechar o arquivo"
        ],
        "correctIndex": 0,
        "explanation": "A alça de preenchimento replica fórmulas e padrões para as células vizinhas com rapidez."
      },
      {
        "id": 309,
        "question": "Qual função nativa do Excel pode ser usada para multiplicar um intervalo de números?",
        "options": [
          "=VEZES",
          "=CALC_MULT",
          "=DUPLICAR",
          "=PRODUTO ou =MULT"
        ],
        "correctIndex": 3,
        "explanation": "A função =MULT (ou =PRODUTO) multiplica todos os números fornecidos em seus argumentos."
      },
      {
        "id": 310,
        "question": "Ao arrastar a fórmula =A1*2 da linha 1 para a linha 2, para qual fórmula ela é atualizada automaticamente pelo Excel?",
        "options": [
          "=A1*2",
          "=B1*2",
          "=A2*2",
          "=A2*3"
        ],
        "correctIndex": 2,
        "explanation": "Por ser uma referência relativa, a linha 1 se ajusta automaticamente para a linha 2 (=A2*2)."
      }
    ]
  },
  {
    "id": 4,
    "lessonNumber": 4,
    "title": "Aula 04: Funções Condicionais (SE, E, OU, SEERRO)",
    "module": "Módulo 2: Cálculos e Funções Essenciais",
    "duration": "28 min",
    "summary": "Aprenda a aplicar lógica condicional no Excel para tomada de decisões automatizadas com a função SE simples, SE aninhada, operadores relacionais, funções lógicas E/OU e tratamento com SEERRO.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/QiOdw-Fgjm0",
    "videoTitle": "Aula 05 - Funções Condicionais - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Sintaxe fundamental da função SE: teste_lógico, valor_se_verdadeiro, valor_se_falso",
      "Operadores de comparação: >, <, >=, <=, =, <>",
      "Funções lógicas combinadas: E() e OU()",
      "Função SEERRO para substituir mensagens de erro por textos elegantes"
    ],
    "theoryContent": {
      "introduction": "A função SE é um dos pilares mais fundamentais do Excel. Ela permite que a planilha tome decisões dinâmicas com base em critérios lógicos estabelecidos pelo usuário, como definir se um aluno do CETEP foi \"Aprovado\" ou \"Reprovado\", ou se um cliente tem direito a desconto comercial.",
      "keyConcepts": [
        {
          "title": "Sintaxe da Função SE",
          "description": "=SE(teste_lógico; valor_se_verdadeiro; valor_se_falso). Se a condição lógica for atendida, o Excel retorna o primeiro resultado; caso contrário, retorna o segundo.",
          "formulaOrExample": "=SE(B2>=7; \"Aprovado\"; \"Reprovado\")"
        },
        {
          "title": "Operadores Relacionais",
          "description": "Maior (>), Menor (<), Maior ou Igual (>=), Menor ou Igual (<=), Igual (=) e Diferente (<>)."
        },
        {
          "title": "Funções Lógicas E() e OU()",
          "description": "A função E exige que TODAS as condições sejam verdadeiras simultaneamente. A função OU exige que pelo menos UMA das condições seja verdadeira.",
          "formulaOrExample": "=SE(E(Nota>=7; Faltas<=10); \"Aprovado\"; \"Reprovado\")"
        },
        {
          "title": "Tratamento de Erros com SEERRO",
          "description": "Evita a exibição de códigos inestéticos como #DIV/0! ou #N/D caso um cálculo produza um erro.",
          "formulaOrExample": "=SEERRO(A1/B1; \"Valor Inválido\")"
        }
      ],
      "stepByStep": [
        "Clique na célula de Situação do aluno (ex: D2).",
        "Digite =SE(C2>=7; \"Aprovado\"; \"Reprovado\"). Lembre-se de colocar textos entre aspas duplas.",
        "Pressione Enter e observe o resultado calculado.",
        "Dê um duplo clique na Alça de Preenchimento para calcular a situação de todos os alunos.",
        "Para testar a robustez, altere a nota na célula C2 para 5 e veja a situação mudar automaticamente para \"Reprovado\"."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Shift + F3",
          "action": "Abre a janela \"Inserir Função\" para guiar a montagem da função SE"
        },
        {
          "keys": "F9",
          "action": "Avalia e calcula apenas a parte selecionada da fórmula na barra de fórmulas"
        },
        {
          "keys": "Ctrl + Z",
          "action": "Desfaz a última ação em caso de digitação incorreta"
        }
      ],
      "proTip": "Sempre que retornar textos dentro de fórmulas no Excel (como \"Aprovado\", \"Sim\", \"Pendente\"), você deve obrigatoriamente colocá-los entre aspas duplas (\" \"). Números e nomes de funções não usam aspas.",
      "commonErrors": "Esquecer as aspas duplas em textos ou trocar o ponto e vírgula (;) por vírgula em versões do Excel configuradas em português do Brasil."
    },
    "quiz": [
      {
        "id": 401,
        "question": "Quantos argumentos a função SE possui em sua sintaxe padrão?",
        "options": [
          "3 argumentos",
          "1 argumento",
          "2 argumentos",
          "5 argumentos"
        ],
        "correctIndex": 0,
        "explanation": "A função SE possui 3 argumentos: =SE(teste_lógico; valor_se_verdadeiro; valor_se_falso)."
      },
      {
        "id": 402,
        "question": "Qual operador representa a comparação \"Diferente de\" no Excel?",
        "options": [
          "!=",
          "><",
          "<>",
          "=/="
        ],
        "correctIndex": 2,
        "explanation": "No Excel, o operador de diferença é formado pelos sinais menor e maior juntos: <>."
      },
      {
        "id": 403,
        "question": "Qual é o resultado da fórmula =SE(10 > 5; \"Maior\"; \"Menor\")?",
        "options": [
          "\"Menor\"",
          "\"Maior\"",
          "VERDADEIRO",
          "10"
        ],
        "correctIndex": 1,
        "explanation": "Como 10 é maior que 5, o teste lógico é VERDADEIRO, retornando o texto \"Maior\"."
      },
      {
        "id": 404,
        "question": "Por que palavras e textos devem ser escritos entre aspas duplas (\" \") dentro de uma fórmula SE?",
        "options": [
          "Porque senão o texto fica em negrito",
          "Porque o Excel só fala inglês",
          "Para proteger a planilha com senha",
          "Para que o Excel entenda que se trata de uma sequência de texto e não o nome de uma função ou célula"
        ],
        "correctIndex": 3,
        "explanation": "Sem aspas, o Excel tenta interpretar a palavra como o nome de uma fórmula ou intervalo, gerando erro #NOME?."
      },
      {
        "id": 405,
        "question": "Quando a função lógica E(A1>5; B1>10) retorna VERDADEIRO?",
        "options": [
          "Apenas quando AMBAS as condições forem atendidas simultaneamente",
          "Quando apenas A1 for maior que 5",
          "Quando apenas B1 for maior que 10",
          "Quando nenhuma das duas for atendida"
        ],
        "correctIndex": 0,
        "explanation": "A função E só retorna VERDADEIRO se todas as suas condições forem verdadeiras ao mesmo tempo."
      },
      {
        "id": 406,
        "question": "Quando a função lógica OU(A1>5; B1>10) retorna VERDADEIRO?",
        "options": [
          "Apenas quando ambas forem verdadeiras",
          "Quando pelo menos UMA das condições for verdadeira",
          "Nunca retorna verdadeiro",
          "Apenas aos domingos"
        ],
        "correctIndex": 1,
        "explanation": "A função OU retorna VERDADEIRO se qualquer uma das condições for satisfeita."
      },
      {
        "id": 407,
        "question": "Para que serve a função =SEERRO(valor; valor_se_erro)?",
        "options": [
          "Para provocar erros na planilha propositalmente",
          "Para corrigir erros ortográficos em textos",
          "Para capturar e substituir mensagens de erro do Excel por uma mensagem ou valor personalizado",
          "Para calcular juros compostos"
        ],
        "correctIndex": 2,
        "explanation": "SEERRO intercepta qualquer erro gerado pela fórmula e exibe uma alternativa elegante definida pelo usuário."
      },
      {
        "id": 408,
        "question": "Qual fórmula avalia se uma nota na célula A1 é maior ou igual a 7 para aprovação?",
        "options": [
          "=SE(A1 = 7; \"Aprovado\"; \"Reprovado\")",
          "=SE(A1 > 7; \"Aprovado\"; \"Reprovado\")",
          "=SE(A1 => 7; \"Aprovado\"; \"Reprovado\")",
          "=SE(A1 >= 7; \"Aprovado\"; \"Reprovado\")"
        ],
        "correctIndex": 3,
        "explanation": "O operador correto para maior ou igual é >= (com o sinal de igual depois do sinal de maior)."
      },
      {
        "id": 409,
        "question": "Qual erro ocorre no Excel se você tentar dividir um número por zero em uma fórmula sem tratamento?",
        "options": [
          "#VALOR!",
          "#DIV/0!",
          "#N/D",
          "#NULO!"
        ],
        "correctIndex": 1,
        "explanation": "A divisão por zero gera no Excel o código clássico de erro #DIV/0!."
      },
      {
        "id": 410,
        "question": "O que é uma função \"SE Aninhada\"?",
        "options": [
          "Uma função SE dentro de outra função SE para avaliar mais de dois possíveis resultados",
          "Uma função que só roda uma vez por ano",
          "Uma fórmula com defeito de fábrica",
          "Uma macro em linguagem C"
        ],
        "correctIndex": 0,
        "explanation": "SE Aninhado consiste em colocar uma nova condição SE dentro do argumento valor_se_falso da anterior."
      }
    ]
  }
];
