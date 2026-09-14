import { ExcelLesson } from './excelTypes';

export const lessons17to20: ExcelLesson[] = [
  {
    "id": 17,
    "lessonNumber": 17,
    "title": "Aula 17: Fórmulas Avançadas de Busca (PROCV, PROCH e PROCX)",
    "module": "Módulo 8: Fórmulas Avançadas de Busca e Referência",
    "duration": "31 min",
    "summary": "Domine as funções de busca mais exigidas no mercado de trabalho: entenda a mecânica do PROCV e PROCH, seus limites e armadilhas (busca exata com FALSO/0) e a revolução da nova função PROCX.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/SUcWo8g6hss",
    "videoTitle": "Aula 18 - Formulas Avançadas - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Sintaxe completa do PROCV: valor_procurado, matriz_tabela, núm_índice_coluna, procurar_intervalo",
      "A importância crítica do parâmetro 0 / FALSO para busca exata",
      "Limitações do PROCV (busca apenas para a direita, quebra ao inserir colunas)",
      "A nova função PROCX: busca bidirecional nativa sem quebras e com tratamento de erro embutido"
    ],
    "theoryContent": {
      "introduction": "O PROCV é considerado a função símbolo do nível intermediário/avançado de Excel em testes de contratação em todo o mundo. Ele atua como um mecanismo de busca que cruza duas tabelas diferentes a partir de uma chave comum (como uma matrícula de aluno, CPF ou código de produto), trazendo a informação correspondente de forma automatizada.",
      "keyConcepts": [
        {
          "title": "Sintaxe do PROCV (Procura Vertical)",
          "description": "=PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo]). A coluna onde o valor procurado reside DEVE ser obrigatoriamente a primeira coluna da matriz_tabela.",
          "formulaOrExample": "=PROCV(A2; tbAlunos; 3; FALSO)"
        },
        {
          "title": "Busca Exata (0 ou FALSO)",
          "description": "O 4º argumento é crucial! Se você omitir ou colocar VERDADEIRO (1), o Excel fará uma busca aproximada que trará dados errados se a tabela não estiver ordenada. Para cruzamentos de cadastros exatos, use sempre 0 ou FALSO.",
          "formulaOrExample": "=PROCV(A2; $G$2:$J$100; 2; 0)"
        },
        {
          "title": "Limitações do PROCV Tradicional",
          "description": "1) Só busca da esquerda para a direita (nunca para a esquerda). 2) Se alguém inserir uma nova coluna no meio da matriz, o número do índice quebra. 3) Retorna o erro #N/D se o valor não for encontrado."
        },
        {
          "title": "A Revolução da Função PROCX",
          "description": "Presente nas versões modernas do Excel (Microsoft 365 e Excel 2021+), o PROCX substitui o PROCV e PROCH com maestria: busca para a esquerda ou direita, busca por colunas isoladas e já possui argumento embutido para tratamento de erro.",
          "formulaOrExample": "=PROCX(A2; tbAlunos[ID]; tbAlunos[Nome]; \"Não Encontrado\")"
        }
      ],
      "stepByStep": [
        "Na célula onde deseja trazer o nome do curso pelo código (ex: B2), inicie a fórmula com =PROCV(.",
        "Selecione o código de busca (A2) e tecle ponto e vírgula (;).",
        "Selecione a tabela cadastral inteira e pressione F4 para travar com cifrões ($G$2:$J$100).",
        "Conte em qual coluna está a informação desejada (ex: se o Curso está na 3ª coluna, digite 3).",
        "Digite ; 0 (ou FALSO) para garantir busca exata e feche os parênteses: =PROCV(A2; $G$2:$J$100; 3; 0). Tecle Enter."
      ],
      "keyboardShortcuts": [
        {
          "keys": "F4",
          "action": "Alterna referências relativas para absolutas ($A$1) fixando a matriz de busca"
        },
        {
          "keys": "Ctrl + A (após digitar =PROCV()",
          "action": "Abre a janela gráfica com os campos de argumentos da função"
        }
      ],
      "proTip": "Se você usa versões modernas do Excel, adote o PROCX como padrão definitivo em todos os seus projetos. Ele é até 30% mais rápido no processamento de planilhas pesadas e muito menos suscetível a erros de manutenção!",
      "commonErrors": "Esquecer de travar a matriz de busca com F4 ao arrastar o PROCV para baixo, o que faz a matriz escorregar e gera erros de #N/D nas linhas inferiores."
    },
    "quiz": [
      {
        "id": 1701,
        "question": "Quantos argumentos obrigatórios e opcionais a função PROCV possui em sua sintaxe completa?",
        "options": [
          "2 argumentos",
          "1 argumento",
          "3 obrigatórios e 1 opcional (total 4)",
          "10 argumentos"
        ],
        "correctIndex": 2,
        "explanation": "São 4 argumentos: valor_procurado, matriz_tabela, núm_índice_coluna e [procurar_intervalo]."
      },
      {
        "id": 1702,
        "question": "O que o argumento [procurar_intervalo] deve receber para realizar uma busca estritamente EXATA?",
        "options": [
          "FALSO ou 0",
          "VERDADEIRO ou 1",
          "Texto \"EXATO\"",
          "Qualquer letra"
        ],
        "correctIndex": 0,
        "explanation": "FALSO ou 0 instrui o PROCV a localizar apenas correspondências exatas de dados."
      },
      {
        "id": 1703,
        "question": "O que o código de erro #N/D significa ao executar um PROCV?",
        "options": [
          "Número Dividido",
          "Nome Duplicado",
          "Nova Data",
          "Não Disponível / Não Encontrado (o valor procurado não existe na primeira coluna da matriz)"
        ],
        "correctIndex": 3,
        "explanation": "#N/D (Não Disponível) indica que a chave de busca não foi encontrada na primeira coluna."
      },
      {
        "id": 1704,
        "question": "Qual é uma limitação estrutural clássica do PROCV tradicional?",
        "options": [
          "Ele não aceita letras",
          "Ele só consegue retornar valores que estejam em colunas à DIREITA da coluna de busca",
          "Ele só funciona até as 18 horas",
          "Ele apaga o valor procurado"
        ],
        "correctIndex": 1,
        "explanation": "O PROCV não faz busca para a esquerda; a coluna de pesquisa deve ser sempre a 1ª coluna da matriz."
      },
      {
        "id": 1705,
        "question": "Por que é indispensável travar com a tecla F4 ($) o intervalo da matriz de busca no PROCV ao arrastar a fórmula?",
        "options": [
          "Para proteger o Excel contra hackers",
          "Para mudar a cor da tabela",
          "Porque senão a internet cai",
          "Para que a matriz não se desloque para baixo ao copiar a fórmula para as demais linhas"
        ],
        "correctIndex": 3,
        "explanation": "O travamento com referências absolutas ($) mantém a matriz fixa enquanto a linha de consulta avança."
      },
      {
        "id": 1706,
        "question": "Qual é a principal vantagem da moderna função PROCX em relação ao PROCV?",
        "options": [
          "Só funciona sem internet",
          "Muda a fonte do Windows",
          "Pode buscar para a esquerda e para a direita, não quebra com colunas inseridas e trata erros nativamente",
          "Custa mais caro"
        ],
        "correctIndex": 2,
        "explanation": "O PROCX elimina todas as fragilidades clássicas do PROCV e traz busca bidirecional simplificada."
      },
      {
        "id": 1707,
        "question": "Qual função tradicional realiza busca HORIZONTAL (ao longo de linhas em vez de colunas)?",
        "options": [
          "PROCH",
          "PROCV",
          "LINHA.BUSCA",
          "PESQUISA.H"
        ],
        "correctIndex": 0,
        "explanation": "O PROCH realiza a varredura na primeira linha e retorna o dado pelo índice da linha."
      },
      {
        "id": 1708,
        "question": "Como tratar o erro #N/D de um PROCV para exibir \"Não Encontrado\" no lugar do código?",
        "options": [
          "=CORRIGIR(PROCV(...))",
          "=SEERRO(PROCV(...); \"Não Encontrado\")",
          "=APAGAR(PROCV(...))",
          "=SEM_ERRO()"
        ],
        "correctIndex": 1,
        "explanation": "Envolver o PROCV com a função =SEERRO(...) trata a mensagem de forma elegante."
      },
      {
        "id": 1709,
        "question": "O que o 3º argumento (núm_índice_coluna) representa no PROCV?",
        "options": [
          "O total de linhas da planilha",
          "O número do telefone do cliente",
          "O número de ordem da coluna dentro da matriz de busca de onde o resultado deve ser extraído",
          "A versão do Excel"
        ],
        "correctIndex": 2,
        "explanation": "Representa a contagem ordinal da coluna da qual o dado deve ser trazido (1, 2, 3, etc.)."
      },
      {
        "id": 1710,
        "question": "Se na matriz A1:C10 a coluna A tem o código e a coluna B tem o nome do aluno, qual número de coluna usamos para trazer o nome?",
        "options": [
          "Coluna 1",
          "Coluna 3",
          "Coluna 10",
          "Coluna 2"
        ],
        "correctIndex": 3,
        "explanation": "A coluna B é a segunda coluna da matriz A1:C10, logo o índice de coluna é 2."
      }
    ]
  },
  {
    "id": 18,
    "lessonNumber": 18,
    "title": "Aula 18: Fórmulas Avançadas (ÍNDICE + CORRESP e Matrizes Dinâmicas)",
    "module": "Módulo 8: Fórmulas Avançadas de Busca e Referência",
    "duration": "30 min",
    "summary": "Aprenda a combinação mais robusta do Excel clássico: ÍNDICE com CORRESP para buscas bidirecionais livres de qualquer limitação de coluna, além das novas funções de Matriz Dinâmica (ÚNICO, CLASSIFICAR, FILTRO).",
    "videoUrl": "https://www.youtube-nocookie.com/embed/SUcWo8g6hss",
    "videoTitle": "Aula 18 - Formulas Avançadas: ÍNDICE, CORRESP e Matrizes Dinâmicas",
    "videoHighlights": [
      "Como a função CORRESP localiza posições relativas de itens",
      "Como a função ÍNDICE extrai conteúdos em coordenadas linha x coluna",
      "A combinação campeã: ÍNDICE + CORRESP para buscas à esquerda e matrizes cruzadas",
      "Matrizes Dinâmicas no Excel moderno: funções ÚNICO(), CLASSIFICAR() e FILTRO()"
    ],
    "theoryContent": {
      "introduction": "Antes da chegada do PROCX, os maiores especialistas em Excel utilizavam a combinação ÍNDICE + CORRESP para superar todas as deficiências do PROCV. Enquanto o PROCV exige que a chave de pesquisa esteja na primeira coluna e busca apenas para a direita, a dupla ÍNDICE + CORRESP permite buscar em qualquer direção (para a esquerda, para cima ou em cruzamentos matriciais de linha e coluna simultâneos).",
      "keyConcepts": [
        {
          "title": "Função CORRESP",
          "description": "Não retorna o valor em si, mas sim a POSIÇÃO NUMÉRICA (número de ordem) de onde o item está dentro de uma lista de uma única dimensão.",
          "formulaOrExample": "=CORRESP(\"CETEP\"; A1:A10; 0) retorna 3 se CETEP estiver na 3ª célula"
        },
        {
          "title": "Função ÍNDICE",
          "description": "Retorna o conteúdo da célula situada em uma coordenada específica da matriz: =ÍNDICE(matriz; número_da_linha; [número_da_coluna]).",
          "formulaOrExample": "=ÍNDICE(B1:B10; 3) retorna o valor da 3ª linha da coluna B"
        },
        {
          "title": "A Dupla ÍNDICE + CORRESP",
          "description": "Você aninha o CORRESP dentro do argumento de linha do ÍNDICE: =ÍNDICE(coluna_do_retorno; CORRESP(chave; coluna_da_chave; 0)). Não importa se a coluna de retorno está à esquerda ou à direita!",
          "formulaOrExample": "=ÍNDICE(A2:A100; CORRESP(D2; C2:C100; 0)) busca à esquerda com perfeição"
        },
        {
          "title": "Matrizes Dinâmicas Modernas",
          "description": "=ÚNICO(intervalo) gera uma lista sem repetições automaticamente. =CLASSIFICAR(intervalo) ordena uma lista dinamicamente com efeito de despejo (spill). =FILTRO(matriz; incluir) filtra dados inteiros por critérios sem tocar em menus manuais."
        }
      ],
      "stepByStep": [
        "Identifique qual coluna contém a informação que você deseja obter (ex: Coluna de Nomes A2:A50).",
        "Inicie a fórmula: =ÍNDICE(A2:A50; .",
        "Chame o CORRESP para achar a linha correspondente: CORRESP(chave_busca; C2:C50; 0)).",
        "A fórmula final fica: =ÍNDICE(A2:A50; CORRESP(E2; C2:C50; 0)).",
        "Pressione Enter e observe a busca acontecer mesmo que a coluna de busca esteja à direita da coluna de retorno!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Shift + F3",
          "action": "Abre o assistente de aninhamento de funções"
        },
        {
          "keys": "F9 (selecionando CORRESP)",
          "action": "Calcula o número da linha na Barra de Fórmulas para depuração"
        }
      ],
      "proTip": "A combinação ÍNDICE + CORRESP também é perfeita para buscas bidirecionais (cruzamento de uma tabela com linhas e colunas, como uma matriz de fretes ou tabela de comissões por faixa). Basta usar um CORRESP para a linha e um segundo CORRESP para a coluna dentro do mesmo ÍNDICE!",
      "commonErrors": "Passar uma matriz com várias colunas no primeiro argumento da função CORRESP. O CORRESP só deve receber uma linha ou uma coluna única como intervalo de pesquisa."
    },
    "quiz": [
      {
        "id": 1801,
        "question": "O que a função CORRESP retorna como resultado?",
        "options": [
          "O valor monetário da célula",
          "A posição numérica (número da linha ou coluna) onde o item foi encontrado na lista",
          "A cor da célula",
          "A data de hoje"
        ],
        "correctIndex": 1,
        "explanation": "CORRESP localiza e retorna o índice numérico da posição relativa do item."
      },
      {
        "id": 1802,
        "question": "O que a função ÍNDICE recebe como argumentos fundamentais?",
        "options": [
          "Apenas uma senha",
          "O nome do autor",
          "Três cores diferentes",
          "Uma matriz, um número de linha e opcionalmente um número de coluna"
        ],
        "correctIndex": 3,
        "explanation": "ÍNDICE localiza o dado no cruzamento da linha e coluna informadas da matriz."
      },
      {
        "id": 1803,
        "question": "Por que a combinação ÍNDICE + CORRESP é considerada superior ao PROCV tradicional?",
        "options": [
          "Porque consegue buscar dados à esquerda da coluna de pesquisa e não quebra se novas colunas forem inseridas",
          "Porque só pode ser usada por professores",
          "Porque é mais fácil de memorizar",
          "Porque apaga as linhas duplicadas"
        ],
        "correctIndex": 0,
        "explanation": "ÍNDICE + CORRESP não possui a restrição de buscar apenas para a direita nem sofre quebra com inserção de colunas."
      },
      {
        "id": 1804,
        "question": "Qual valor deve ser inserido no 3º argumento da função CORRESP para buscar correspondência exata?",
        "options": [
          "1",
          "-1",
          "0",
          "99"
        ],
        "correctIndex": 2,
        "explanation": "O número 0 indica busca exata no CORRESP (semelhante ao FALSO no PROCV)."
      },
      {
        "id": 1805,
        "question": "Qual fórmula representa a sintaxe correta da combinação ÍNDICE + CORRESP?",
        "options": [
          "=CORRESP(ÍNDICE(chave; 0); retorno)",
          "=ÍNDICE(coluna_retorno; CORRESP(chave; coluna_pesquisa; 0))",
          "=ÍNDICE + CORRESP(coluna)",
          "=BUSCAR(ÍNDICE; CORRESP)"
        ],
        "correctIndex": 1,
        "explanation": "O ÍNDICE envolve a coluna onde está o dado desejado e o CORRESP fornece a coordenada da linha."
      },
      {
        "id": 1806,
        "question": "O que a nova função de Matriz Dinâmica =ÚNICO(intervalo) faz no Excel moderno?",
        "options": [
          "Extrai automaticamente uma lista apenas com os valores distintos (sem repetições)",
          "Exclui a planilha",
          "Formata a célula com fonte única",
          "Imprime uma única folha"
        ],
        "correctIndex": 0,
        "explanation": "A função ÚNICO retorna valores exclusivos e preenche as células abaixo via despejo dinâmico (spill)."
      },
      {
        "id": 1807,
        "question": "Qual função de matriz dinâmica classifica uma lista em ordem alfabética ou numérica automaticamente por fórmula?",
        "options": [
          "=ORDENAR_TUDO()",
          "=ALFABÉTICO()",
          "=CRESCENTE()",
          "=CLASSIFICAR()"
        ],
        "correctIndex": 3,
        "explanation": "A função =CLASSIFICAR(matriz) ordena listas dinamicamente por fórmula."
      },
      {
        "id": 1808,
        "question": "O que o erro #DESPEJO! (#SPILL!) indica no Excel ao trabalhar com matrizes dinâmicas?",
        "options": [
          "Que o computador está superaquecendo",
          "Que a internet caiu",
          "Que a fórmula precisa expandir seus resultados para as células adjacentes, mas há dados bloqueando o caminho",
          "Que o arquivo foi corrompido"
        ],
        "correctIndex": 2,
        "explanation": "#DESPEJO! surge quando alguma célula no caminho da expansão da matriz dinâmica já contém conteúdo."
      },
      {
        "id": 1809,
        "question": "Como funciona uma \"Busca Bidimensional\" com ÍNDICE e dois CORRESP?",
        "options": [
          "Um CORRESP acha a linha e o outro CORRESP acha a coluna no mesmo ÍNDICE",
          "A fórmula é digitada em dois computadores ao mesmo tempo",
          "São usados dois monitores",
          "Apenas calcula 2 vezes mais rápido"
        ],
        "correctIndex": 0,
        "explanation": "Permite cruzar cabeçalhos verticais e horizontais em matrizes de dados complexas."
      },
      {
        "id": 1810,
        "question": "Qual das seguintes funções permite filtrar uma tabela inteira dinamicamente com base em critérios lógicos?",
        "options": [
          "=SELECIONAR()",
          "=FILTRO()",
          "=SEPARAR()",
          "=CORTAR()"
        ],
        "correctIndex": 1,
        "explanation": "A função =FILTRO(matriz; critério) extrai registros correspondentes dinamicamente."
      }
    ]
  },
  {
    "id": 19,
    "lessonNumber": 19,
    "title": "Aula 19: Introdução ao VBA e Automação de Tarefas com Macros",
    "module": "Módulo 9: Automação com VBA e Dashboards Profissionais",
    "duration": "32 min",
    "summary": "Dê os primeiros passos na programação do Excel: habilite a guia Desenvolvedor, utilize o Gravador de Macros para automatizar tarefas repetitivas, explore o Editor VBA (Alt + F11), crie subrotinas e salve no formato .xlsm.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/J1sxncVrhCc",
    "videoTitle": "Aula 20 - Introdução ao VBA - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Habilitação da Guia Desenvolvedor no Excel",
      "Gravador de Macros: automação sem necessidade inicial de código",
      "Ambiente VBE (Visual Basic Editor) pelo atalho Alt + F11",
      "Atribuição de macros a botões interativos e salvamento obrigatório em .xlsm"
    ],
    "theoryContent": {
      "introduction": "VBA (Visual Basic for Applications) é a linguagem de programação nativa embutida em todos os aplicativos do pacote Microsoft Office. Com ela, tarefas que levariam 3 horas de cliques manuais repetitivos todos os dias (como formatar relatórios, consolidar 50 planilhas ou exportar boletos) são executadas com perfeição em menos de 2 segundos ao clique de um botão.",
      "keyConcepts": [
        {
          "title": "Habilitando a Guia Desenvolvedor",
          "description": "A guia Desenvolvedor vem oculta por padrão no Excel. Para ativá-la: Arquivo -> Opções -> Personalizar Faixa de Opções -> marque a caixinha \"Desenvolvedor\" na coluna da direita e clique em OK."
        },
        {
          "title": "Gravador de Macros",
          "description": "Ferramenta que registra em segundo plano cada clique, digitação e formatação executados na planilha, convertendo suas ações humanas em código de programação VBA limpo e reutilizável."
        },
        {
          "title": "Visual Basic Editor (VBE)",
          "description": "O ambiente de desenvolvimento integrado acessível pelo atalho Alt + F11. Onde você insere Módulos de código, visualiza os comandos gravados e escreve procedimentos (Sub) personalizados."
        },
        {
          "title": "Salvamento Obrigatório: .xlsm",
          "description": "Pastas de trabalho comuns (.xlsx) NÃO suportam macros por motivos de segurança. Se você salvar como .xlsx, o Excel apagará todo o código VBA! É OBRIGATÓRIO salvar como \"Pasta de Trabalho Habilitada para Macro do Excel (*.xlsm)\"."
        }
      ],
      "stepByStep": [
        "Habilite a guia \"Desenvolvedor\" nas Opções do Excel.",
        "Clique em \"Gravar Macro\", dê o nome \"FormatarRelatorio\" (sem espaços nem caracteres especiais) e clique em OK.",
        "Execute as ações desejadas: formate cabeçalhos em azul escuro, aplique negrito e ative AutoSoma na base.",
        "Clique em \"Parar Gravação\" na guia Desenvolvedor.",
        "Insira uma forma geométrica (retângulo arredondado) na planilha, clique com botão direito e selecione \"Atribuir Macro...\". Escolha a macro e clique em OK. Agora ela roda com um clique no botão!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + F11",
          "action": "Abre instantaneamente a janela do Editor VBA (VBE)"
        },
        {
          "keys": "Alt + F8",
          "action": "Abre a caixa de diálogo \"Macro\" para executar, editar ou depurar"
        },
        {
          "keys": "F5 (dentro do VBE)",
          "action": "Executa a rotina ou Sub selecionada"
        },
        {
          "keys": "F8 (dentro do VBE)",
          "action": "Executa o código linha por linha (depuração passo a passo)"
        }
      ],
      "proTip": "Nunca coloque espaços ou acentos no nome de uma macro (use FormatarPlanilha ou Limpar_Dados). Sempre use Referências Relativas caso queira que a macro seja executada na célula em que você estiver clicado no momento!",
      "commonErrors": "Salvar o arquivo com extensão padrão .xlsx após programar ou gravar macros. Ao fechar, o Excel apaga irreversivelmente todos os módulos de programação!"
    },
    "quiz": [
      {
        "id": 1901,
        "question": "O que significa a sigla VBA no ecossistema do Microsoft Excel?",
        "options": [
          "Virtual Base Analytics",
          "Variable Binary Algorithm",
          "Vector Board Administration",
          "Visual Basic for Applications"
        ],
        "correctIndex": 3,
        "explanation": "VBA significa Visual Basic for Applications, a linguagem de automação do Office."
      },
      {
        "id": 1902,
        "question": "Qual atalho de teclado abre diretamente a janela do Editor do Visual Basic (VBE)?",
        "options": [
          "Ctrl + Shift + V",
          "Alt + F11",
          "F1",
          "Alt + F4"
        ],
        "correctIndex": 1,
        "explanation": "Alt + F11 é o atalho universal do Office para abrir o Editor de VBA."
      },
      {
        "id": 1903,
        "question": "Qual extensão de arquivo é OBRIGATÓRIA para que uma pasta de trabalho conserve seus códigos e macros de VBA?",
        "options": [
          ".xlsx",
          ".csv",
          ".xlsm (Pasta de Trabalho Habilitada para Macro)",
          ".txt"
        ],
        "correctIndex": 2,
        "explanation": "Apenas a extensão .xlsm (ou .xlsb) armazena macros de forma segura; arquivos .xlsx descartam macros ao salvar."
      },
      {
        "id": 1904,
        "question": "Como se ativa a guia \"Desenvolvedor\" caso ela não esteja aparecendo na Faixa de Opções?",
        "options": [
          "Arquivo -> Opções -> Personalizar Faixa de Opções -> marcar \"Desenvolvedor\"",
          "Desinstalar e reinstalar o Windows",
          "Reiniciar o roteador de internet",
          "Pressionar a barra de espaço 10 vezes"
        ],
        "correctIndex": 0,
        "explanation": "A ativação é feita na janela de Opções do Excel em Personalizar Faixa de Opções."
      },
      {
        "id": 1905,
        "question": "O que o \"Gravador de Macros\" faz enquanto está ativado?",
        "options": [
          "Grava o áudio do microfone",
          "Tira fotos da tela para a internet",
          "Registra e converte em código VBA todas as ações e cliques executados pelo usuário no Excel",
          "Calcula a velocidade de digitação"
        ],
        "correctIndex": 2,
        "explanation": "O gravador traduz cada operação realizada na grade do Excel em instruções correspondentes de VBA."
      },
      {
        "id": 1906,
        "question": "Qual comando em código VBA atribui o valor \"CETEP\" para a célula A1 da planilha ativa?",
        "options": [
          "Celular(\"A1\") = \"CETEP\"",
          "Escreva \"CETEP\" em A1",
          "Print A1 -> CETEP",
          "Range(\"A1\").Value = \"CETEP\""
        ],
        "correctIndex": 3,
        "explanation": "No modelo de objetos do VBA, Range(\"A1\").Value define o conteúdo daquela célula."
      },
      {
        "id": 1907,
        "question": "Qual atalho abre a lista de macros existentes para execução ou exclusão na planilha?",
        "options": [
          "Ctrl + M",
          "Alt + F8",
          "Shift + Esc",
          "F7"
        ],
        "correctIndex": 1,
        "explanation": "Alt + F8 abre a janela de gerenciamento e execução de Macros."
      },
      {
        "id": 1908,
        "question": "Como permitir que um usuário comum execute uma macro de forma prática e amigável na tela?",
        "options": [
          "Desenhar uma forma geométrica (botão), clicar com o botão direito e escolher \"Atribuir Macro...\"",
          "Pedir para o usuário abrir o código e ler",
          "Obrigar o usuário a digitar a macro de memória",
          "Não é possível colocar botões"
        ],
        "correctIndex": 0,
        "explanation": "Atribuir a macro a uma forma ou ícone gráfico cria um botão executivo perfeito."
      },
      {
        "id": 1909,
        "question": "Qual tecla dentro do Editor VBA executa o código linha por linha (depuração passo a passo)?",
        "options": [
          "F1",
          "Esc",
          "Tab",
          "F8"
        ],
        "correctIndex": 3,
        "explanation": "A tecla F8 executa linha por linha, permitindo auditar o comportamento da macro em tempo real."
      },
      {
        "id": 1910,
        "question": "Qual é uma regra importante na escolha do nome de uma Macro no Excel?",
        "options": [
          "Deve ter exatamente 50 letras",
          "Deve começar com números",
          "Não deve conter espaços nem caracteres especiais ou símbolos matemáticos",
          "Deve ser escrita em latim"
        ],
        "correctIndex": 2,
        "explanation": "Nomes de macros devem começar com letras e não podem conter espaços ou pontuações."
      }
    ]
  },
  {
    "id": 20,
    "lessonNumber": 20,
    "title": "Aula 20: Construção de Dashboards Profissionais no Excel",
    "module": "Módulo 9: Automação com VBA e Dashboards Profissionais",
    "duration": "35 min",
    "summary": "A aula definitiva de conclusão: integre todos os conhecimentos do curso para arquitetar Dashboards de alto impacto executivo com estrutura em 3 camadas, cartões de KPI dinâmicos, segmentações sincronizadas e design limpo.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/ldvhmbWTlZo",
    "videoTitle": "Aula 21 - Dashboard no Excel - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Arquitetura em 3 camadas de abas: Dados (Base), Motor (Cálculos) e Apresentação (Dashboard)",
      "Criação de Cartões de KPI (Key Performance Indicators) interligados a células",
      "Harmonização visual executiva: ocultação de linhas de grade e barra de títulos",
      "Conexão universal de Segmentadores de Dados para filtragem em um clique"
    ],
    "theoryContent": {
      "introduction": "Parabéns por chegar à aula final do curso! Um Dashboard profissional no Excel é um painel visual de controle gerencial que reúne os principais indicadores-chave de desempenho (KPIs), tabelas dinâmicas e gráficos estratégicos em uma única tela interativa. Ele permite que diretores e gestores compreendam o panorama da instituição em poucos segundos para tomar decisões fundamentadas.",
      "keyConcepts": [
        {
          "title": "Arquitetura Profissional em 3 Camadas",
          "description": "A regra fundamental dos analistas seniores: NUNCA misture dados brutos com o painel final. Separe sua pasta de trabalho em 3 abas distintas: 1) \"BaseDados\": onde residem as tabelas brutas; 2) \"Calculos\": onde ficam as Tabelas Dinâmicas e fórmulas de apoio; 3) \"Dashboard\": a tela limpa e elegante que o usuário final visualiza."
        },
        {
          "title": "Cartões de KPI (Key Performance Indicators)",
          "description": "Retângulos com cantos arredondados contendo números grandes em destaque (ex: \"Total de Alunos Matriculados: 1.250\", \"Taxa de Aprovação: 87%\", \"Faturamento Mensal: R$ 450.000\"). O valor é vinculado a uma célula de cálculo usando a Barra de Fórmulas com uma caixa de texto selecionada."
        },
        {
          "title": "Limpeza e Polimento Executivo",
          "description": "Na guia Exibir da aba do Dashboard, desmarque \"Linhas de Grade\", \"Títulos\" (letras de colunas e números de linhas) e \"Barra de Fórmulas\". Isso transforma a aparência de uma simples planilha na de um sistema web ou aplicativo sob medida."
        },
        {
          "title": "Segmentação de Dados Universal",
          "description": "Segmentadores conectados a todas as Tabelas Dinâmicas do painel ao mesmo tempo através de \"Conexões de Relatório\", fazendo com que um único clique de filtro atualize todos os gráficos e KPIs simultaneamente."
        }
      ],
      "stepByStep": [
        "Estruture sua base na aba \"BaseDados\" em formato de Tabela Oficial (Ctrl + Alt + T).",
        "Crie Tabelas Dinâmicas na aba \"Calculos\" para calcular totais por curso, mês e status.",
        "Gere Gráficos Dinâmicos e transfira-os (recortar e colar) para a aba \"Dashboard\".",
        "Na aba \"Dashboard\", desenhe cartões de KPI: insira formas retangulares, adicione caixas de texto e digite =Calculos!B2 na Barra de Fórmulas para ligá-las aos totais.",
        "Insira Segmentações de Dados (Slicers) para Curso e Ano, clique em \"Conexões de Relatório\" e marque todas as tabelas dinâmicas.",
        "Vá na guia \"Exibir\" e desmarque \"Linhas de Grade\" e \"Títulos\". Seu Dashboard está pronto para impressionar qualquer gestor!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + W + V + G",
          "action": "Ativa ou oculta as Linhas de Grade na guia Exibir"
        },
        {
          "keys": "Ctrl + Shift + F1",
          "action": "Modo Tela Inteira (oculta a Faixa de Opções para apresentação)"
        }
      ],
      "proTip": "Menos é mais! Escolha uma paleta de 3 cores no máximo (uma neutra predominante, uma de contraste para elementos secundários e uma cor de ênfase para os números-chave). Deixe espaço em branco (respiro) entre os cartões para garantir sofisticação visual.",
      "commonErrors": "Poluir o painel com excesso de cores berrantes e gráficos desnecessários, gerando sobrecarga cognitiva em vez de clareza analítica."
    },
    "quiz": [
      {
        "id": 2001,
        "question": "O que é um \"Dashboard\" profissional no Microsoft Excel?",
        "options": [
          "Um painel visual interativo em tela única que consolida os principais indicadores de desempenho (KPIs) para tomada de decisões",
          "Um jogo eletrônico de corrida",
          "Uma ferramenta para formatar o disco rígido",
          "Um tipo de impressora"
        ],
        "correctIndex": 0,
        "explanation": "Um Dashboard consolida métricas vitais e dados estratégicos em um layout executivo intuitivo."
      },
      {
        "id": 2002,
        "question": "Qual é a melhor prática de arquitetura de pastas de trabalho para construção de Dashboards?",
        "options": [
          "Colocar tudo misturado na mesma aba sem organização",
          "Criar 100 arquivos diferentes para cada linha",
          "Separar em 3 camadas de abas: Base de Dados, Cálculos de Apoio e Aba de Dashboard",
          "Apagar a base de dados após gerar os gráficos"
        ],
        "correctIndex": 2,
        "explanation": "A arquitetura em 3 camadas isola dados brutos, lógica de agregação e interface de apresentação."
      },
      {
        "id": 2003,
        "question": "O que são \"Cartões de KPI\" (Key Performance Indicators) em um painel?",
        "options": [
          "Cartões de crédito do banco",
          "Blocos visuais em destaque que exibem as métricas mais críticas com números grandes e rótulos claros",
          "Pedaços de papel impressos",
          "Ícones decorativos sem dados"
        ],
        "correctIndex": 1,
        "explanation": "Cartões de KPI destacam os números mais importantes do negócio em primeiro plano."
      },
      {
        "id": 2004,
        "question": "Como transformar o visual de uma planilha comum no aspecto profissional de um aplicativo na aba do Dashboard?",
        "options": [
          "Diminuir o brilho do monitor",
          "Mudar o papel de parede do Windows",
          "Pintar toda a tela de preto",
          "Na guia Exibir, desmarcar \"Linhas de Grade\", \"Títulos\" e \"Barra de Fórmulas\""
        ],
        "correctIndex": 3,
        "explanation": "Ocultar linhas de grade e réguas de cabeçalho transforma a planilha em um painel executivo refinado."
      },
      {
        "id": 2005,
        "question": "Como fazer com que uma única Segmentação de Dados (Slicer) filtre TODOS os gráficos do Dashboard ao mesmo tempo?",
        "options": [
          "Clicar com botão direito no segmentador, selecionar \"Conexões de Relatório\" e marcar todas as Tabelas Dinâmicas",
          "Copiar e colar o segmentador 10 vezes",
          "Digitar uma fórmula de soma",
          "Reiniciar o computador"
        ],
        "correctIndex": 0,
        "explanation": "As \"Conexões de Relatório\" interligam o mesmo filtro a todos os relatórios e gráficos dinâmicos."
      },
      {
        "id": 2006,
        "question": "Como vincular dinamicamente o valor de uma célula a uma Caixa de Texto ou Forma geométrica de KPI?",
        "options": [
          "Digitar o número manualmente todos os dias",
          "Selecionar a borda da caixa, clicar na Barra de Fórmulas, digitar = e clicar na célula de cálculo desejada",
          "Tirar uma captura de tela e colar",
          "Não é possível vincular formas a células"
        ],
        "correctIndex": 1,
        "explanation": "Apontar a Barra de Fórmulas para a célula de origem vincula o texto da forma em tempo real."
      },
      {
        "id": 2007,
        "question": "Qual atalho coloca o Excel em modo de tela cheia para apresentação de Dashboards?",
        "options": [
          "Alt + Tab",
          "Ctrl + P",
          "Ctrl + Shift + F1",
          "F2"
        ],
        "correctIndex": 2,
        "explanation": "Ctrl + Shift + F1 oculta menus e faixas, ampliando o espaço do painel para a plateia."
      },
      {
        "id": 2008,
        "question": "Por que o uso de uma paleta de cores restrita e consistente é essencial no design de Dashboards?",
        "options": [
          "Porque a tinta colorida da tela gasta mais rápido",
          "Porque a Microsoft proíbe mais de duas cores",
          "Porque reduz o consumo de memória RAM",
          "Porque evita sobrecarga sensorial e mantém o foco do tomador de decisão nos dados críticos"
        ],
        "correctIndex": 3,
        "explanation": "Design corporativo prioriza contraste sóbrio e hierarquia visual para não cansar o usuário."
      },
      {
        "id": 2009,
        "question": "Qual é o papel dos botões e hiperlinks internos em um painel do Excel?",
        "options": [
          "Abrir vídeos aleatórios no navegador",
          "Permitir navegação fluida entre o Dashboard e relatórios detalhados com um só clique",
          "Conectar impressoras",
          "Bloquear o teclado"
        ],
        "correctIndex": 1,
        "explanation": "Botões de navegação e hiperlinks conduzem o usuário com facilidade entre as abas do projeto."
      },
      {
        "id": 2010,
        "question": "Ao concluir este curso de 20 aulas de Excel do Básico ao Avançado do CETEP, quais habilidades o aluno desenvolveu?",
        "options": [
          "Domínio completo de interface, formatação, cálculos, lógica, funções de texto/data, tabelas, filtros, gráficos, PROCX, VBA e Dashboards",
          "Apenas sabe ligar o monitor",
          "Sabe apenas formatar texto em negrito",
          "Nenhuma habilidade"
        ],
        "correctIndex": 0,
        "explanation": "O aluno adquiriu competência analítica profunda e prática para atuar em qualquer segmento de mercado."
      }
    ]
  }
];
