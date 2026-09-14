import { ExcelLesson } from './excelTypes';

export const lessons1to4: ExcelLesson[] = [
  {
    id: 1,
    lessonNumber: 1,
    title: 'Introdução ao Excel e Anatomia da Interface',
    module: 'Módulo 1: Fundamentos e Navegação',
    duration: '22 min',
    summary: 'Compreenda a estrutura de pastas de trabalho, linhas, colunas, células, faixa de opções e atalhos de navegação essenciais.',
    videoUrl: 'https://www.youtube.com/embed/z5eN6Q0pD1o',
    videoTitle: 'Aula 01: Primeiros Passos no Excel e Interface Completa',
    videoHighlights: [
      'Estrutura de Pastas de Trabalho (.xlsx) e Planilhas',
      'Faixa de Opções, Guias e Barra de Acesso Rápido',
      'Barra de Fórmulas e Caixa de Nome',
      'Navegação rápida com teclado (Ctrl + Setas)'
    ],
    theoryContent: {
      introduction: 'O Microsoft Excel é a ferramenta de planilhas mais utilizada no mundo corporativo e acadêmico. Uma planilha eletrônica é organizada em uma grade bidimensional composta por linhas identificadas por números (1 a 1.048.576) e colunas identificadas por letras (A a XFD). A interseção de uma linha com uma coluna forma uma célula (como A1, C15, Z100), que armazena dados, rótulos ou fórmulas.',
      keyConcepts: [
        {
          title: 'Célula Ativa e Caixa de Nome',
          description: 'A célula que está atualmente selecionada com a borda destacada chama-se Célula Ativa. A Caixa de Nome, localizada à esquerda da Barra de Fórmulas, exibe o endereço exato dessa célula ou intervalo nomeado.',
          formulaOrExample: 'Endereço: B4 (Coluna B, Linha 4)'
        },
        {
          title: 'Barra de Fórmulas',
          description: 'Espaço localizado acima da grade onde o conteúdo real da célula é exibido e editado. Enquanto a célula na grade pode mostrar o resultado numérico calculado, a barra de fórmulas mostra o cálculo original.',
          formulaOrExample: 'Exemplo na célula: 50 | Barra de Fórmulas: =25*2'
        },
        {
          title: 'Pasta de Trabalho vs. Planilha',
          description: 'O arquivo completo salvo no computador (.xlsx) é chamado de Pasta de Trabalho. Dentro de uma pasta de trabalho, podemos criar múltiplas abas chamadas Planilhas (Plan1, Plan2, etc.).'
        }
      ],
      stepByStep: [
        'Abra o Microsoft Excel e selecione "Pasta de trabalho em branco".',
        'Observe a Faixa de Opções no topo (Página Inicial, Inserir, Fórmulas, Dados, etc.).',
        'Clique na célula A1 e digite "Portal CETEP", pressionando Enter para descer para a célula A2.',
        'Use as setas do teclado ou as teclas de navegação para se mover entre as células.',
        'Clique duas vezes na guia inferior "Plan1" para renomeá-la para "Dados 2026".'
      ],
      keyboardShortcuts: [
        { keys: 'Ctrl + O', action: 'Criar uma nova pasta de trabalho em branco' },
        { keys: 'Ctrl + B', action: 'Salvar a pasta de trabalho atual' },
        { keys: 'Ctrl + Setas', action: 'Navegar até a última célula preenchida na direção selecionada' },
        { keys: 'Ctrl + Home', action: 'Retornar imediatamente à célula A1 da planilha' }
      ],
      proTip: 'Para selecionar todas as células de uma tabela de forma instantânea sem precisar arrastar o mouse, basta clicar em qualquer célula preenchida e pressionar Ctrl + T.',
      commonErrors: 'Digitar dados e esquecer de pressionar Enter ou Tab, deixando o Excel em modo de edição e travando botões da Faixa de Opções.'
    },
    quiz: [
      {
        id: 101,
        question: 'Qual é o nome dado à interseção entre uma coluna e uma linha no Excel?',
        options: ['Segmento', 'Célula', 'Bloco', 'Vetor'],
        correctIndex: 1,
        explanation: 'A interseção de uma linha com uma coluna é chamada de célula, como a célula A1.'
      },
      {
        id: 102,
        question: 'Onde no Excel é possível visualizar o endereço da célula que está selecionada no momento?',
        options: ['Barra de Status', 'Caixa de Nome', 'Barra de Título', 'Painel de Controle'],
        correctIndex: 1,
        explanation: 'A Caixa de Nome fica à esquerda da Barra de Fórmulas e mostra o endereço da célula ativa.'
      },
      {
        id: 103,
        question: 'Qual é a extensão padrão de arquivo de uma pasta de trabalho moderna no Excel?',
        options: ['.doc', '.xlsx', '.pdf', '.txt'],
        correctIndex: 1,
        explanation: 'Desde a versão 2007, o Excel utiliza o formato XML compactado com a extensão .xlsx.'
      },
      {
        id: 104,
        question: 'Qual atalho de teclado salva o arquivo atual no Excel em português?',
        options: ['Ctrl + S', 'Ctrl + B', 'Ctrl + P', 'Ctrl + Z'],
        correctIndex: 1,
        explanation: 'No Excel em português do Brasil, o atalho para Salvar é Ctrl + B (no padrão inglês é Ctrl + S).'
      },
      {
        id: 105,
        question: 'Quantas linhas uma única planilha do Excel moderno possui?',
        options: ['65.536', '1.048.576', '500.000', '10.000.000'],
        correctIndex: 1,
        explanation: 'O Excel moderno possui exatamente 1.048.576 linhas e 16.384 colunas por planilha.'
      },
      {
        id: 106,
        question: 'Como as colunas e as linhas são respectivamente identificadas no Excel?',
        options: [
          'Linhas por letras e colunas por números',
          'Colunas por letras e linhas por números',
          'Ambas por números decimais',
          'Ambas por caracteres alfabéticos'
        ],
        correctIndex: 1,
        explanation: 'As colunas são identificadas por letras (A, B, C... XFD) e as linhas por números (1, 2, 3...).'
      },
      {
        id: 107,
        question: 'O que acontece ao pressionar a tecla "Enter" após digitar um valor em uma célula?',
        options: [
          'O valor é apagado',
          'O valor é confirmado e o cursor move-se para a célula de baixo',
          'A planilha é fechada',
          'Uma nova planilha é inserida'
        ],
        correctIndex: 1,
        explanation: 'Ao pressionar Enter, o dado é gravado na célula e a seleção desce para a linha imediatamente inferior.'
      },
      {
        id: 108,
        question: 'Qual atalho permite ir diretamente para a célula A1 da planilha ativa?',
        options: ['Ctrl + Home', 'Ctrl + End', 'Shift + Esc', 'Alt + F4'],
        correctIndex: 0,
        explanation: 'Ctrl + Home move imediatamente o foco da seleção para o início da planilha (célula A1).'
      },
      {
        id: 109,
        question: 'Qual é a diferença fundamental entre uma Pasta de Trabalho e uma Planilha no Excel?',
        options: [
          'Não há diferença, são termos exatamente sinônimos',
          'A Pasta de Trabalho é o arquivo que pode conter várias Planilhas (abas)',
          'A Planilha é o arquivo e a Pasta é o computador',
          'A Pasta armazena apenas gráficos e a Planilha armazena apenas números'
        ],
        correctIndex: 1,
        explanation: 'A Pasta de Trabalho é o arquivo (.xlsx) que agrupa uma ou mais folhas de cálculo (planilhas/abas).'
      },
      {
        id: 110,
        question: 'O que a Barra de Fórmulas do Excel exibe?',
        options: [
          'Apenas a hora do sistema operacional',
          'O conteúdo real ou fórmula contida na célula selecionada',
          'A lista de impressoras disponíveis',
          'O histórico de senhas do usuário'
        ],
        correctIndex: 1,
        explanation: 'A Barra de Fórmulas exibe o texto, número ou fórmula exata da célula selecionada para edição.'
      }
    ]
  },
  {
    id: 2,
    lessonNumber: 2,
    title: 'Entrada, Tipos de Dados e Formatação Numérica',
    module: 'Módulo 1: Fundamentos e Navegação',
    duration: '26 min',
    summary: 'Aprenda a trabalhar com texto, números, datas, moedas, casas decimais, alinhamentos e estilos profissionais.',
    videoUrl: 'https://www.youtube.com/embed/Pj15RzBvEFE',
    videoTitle: 'Aula 02: Formatação Profissional e Tipos de Dados no Excel',
    videoHighlights: [
      'Tipos de dados: Texto (esquerda) vs. Números (direita)',
      'Formatação de Moeda (R$), Porcentagem (%) e Data',
      'Ajuste de largura de colunas e quebra de texto',
      'Pincel de Formatação e Estilos de Célula'
    ],
    theoryContent: {
      introduction: 'A correta formatação dos dados no Excel é fundamental não apenas para a estética visual, mas para garantir que o software interprete os valores como números calculáveis e não como texto simples. Por padrão, o Excel alinha textos à esquerda e números e datas à direita. Se um número estiver alinhado à esquerda sem formatação explícita, ele provavelmente foi gravado como texto e não participará de somas.',
      keyConcepts: [
        {
          title: 'Alinhamento Padrão por Tipo',
          description: 'Textos são automaticamente alinhados à esquerda. Números, moedas, horas e datas são alinhados à direita. Valores lógicos (VERDADEIRO/FALSO) e erros (#VALOR!) são centralizados.',
          formulaOrExample: 'Texto: "Alunos" (esquerda) | Valor: 1250,50 (direita)'
        },
        {
          title: 'Formatação de Moeda vs. Contábil',
          description: 'O formato Moeda coloca o símbolo R$ colado ao número. O formato Contábil alinha o R$ no canto esquerdo da célula e os números no canto direito, exibindo o zero como um traço (-).',
          formulaOrExample: 'Contábil: R$         1.500,00'
        },
        {
          title: 'Pincel de Formatação',
          description: 'Ferramenta localizada na guia Página Inicial que copia as propriedades visuais (cor, fonte, borda, formato numérico) de uma célula de origem e aplica em uma célula de destino sem alterar seu valor numérico.'
        }
      ],
      stepByStep: [
        'Selecione o intervalo de números a ser formatado (ex: B2:B10).',
        'Na guia Página Inicial, no grupo Número, clique no menu suspenso e escolha "Moeda" ou "Contábil".',
        'Use os botões de aumentar ou diminuir casas decimais para definir duas casas após a vírgula.',
        'Selecione uma célula com a formatação desejada e dê duplo clique no "Pincel de Formatação" para aplicar em vários locais.',
        'Dê um duplo clique na divisória entre duas colunas para ajustar a largura automaticamente ao maior texto.'
      ],
      keyboardShortcuts: [
        { keys: 'Ctrl + Shift + $', action: 'Aplicar formatação de Moeda (R$) instantaneamente' },
        { keys: 'Ctrl + Shift + %', action: 'Aplicar formato de Porcentagem sem casas decimais' },
        { keys: 'Ctrl + Shift + #', action: 'Aplicar formato de Data (dia-mês-ano)' },
        { keys: 'Ctrl + 1', action: 'Abrir a janela completa "Formatar Células"' }
      ],
      proTip: 'Se uma célula exibir vários símbolos "#####", não se preocupe: isso significa apenas que a coluna está estreita demais para exibir o número ou data. Basta dar um duplo clique na borda da coluna para ajustá-la.',
      commonErrors: 'Digitar pontos no lugar de vírgulas para casas decimais no padrão brasileiro, fazendo o Excel tratar o número como texto não somável.'
    },
    quiz: [
      {
        id: 201,
        question: 'Como o Excel alinha por padrão valores de texto e valores numéricos nas células?',
        options: [
          'Texto à esquerda e números à direita',
          'Texto à direita e números à esquerda',
          'Ambos sempre centralizados',
          'Texto no topo e números na base'
        ],
        correctIndex: 0,
        explanation: 'Por padrão, o Excel alinha textos à esquerda e números/datas à direita da célula.'
      },
      {
        id: 202,
        question: 'O que significa quando uma célula do Excel exibe o conteúdo "######"?',
        options: [
          'A fórmula possui um vírus grave',
          'A largura da coluna é insuficiente para exibir o número ou data formatada',
          'O valor digitado é negativo e proibido',
          'A planilha foi bloqueada por senha'
        ],
        correctIndex: 1,
        explanation: 'O símbolo "######" ocorre quando a coluna está muito estreita para mostrar o valor numérico ou data por completo.'
      },
      {
        id: 203,
        question: 'Qual atalho abre diretamente a janela avançada "Formatar Células"?',
        options: ['Ctrl + 1', 'Alt + F4', 'Ctrl + F', 'F12'],
        correctIndex: 0,
        explanation: 'Ctrl + 1 é o atalho universal no Excel para abrir a caixa de diálogo de Formatar Células.'
      },
      {
        id: 204,
        question: 'Para que serve o botão "Pincel de Formatação" no Excel?',
        options: [
          'Para pintar desenhos à mão livre na planilha',
          'Para copiar o formato visual de uma célula e aplicar em outra sem mudar seu conteúdo',
          'Para apagar o histórico de fórmulas',
          'Para trocar o idioma do Excel'
        ],
        correctIndex: 1,
        explanation: 'O Pincel de Formatação copia estilo, fontes, bordas e formatos de número de uma célula para outra.'
      },
      {
        id: 205,
        question: 'Qual é o separador decimal oficial utilizado pelo Excel configurado no idioma Português (Brasil)?',
        options: ['Ponto (.)', 'Vírgula (,)', 'Ponto e vírgula (;)', 'Dois pontos (:)'],
        correctIndex: 1,
        explanation: 'No padrão brasileiro (ABNT), a vírgula separa decimais e o ponto separa milhares.'
      },
      {
        id: 206,
        question: 'Qual é a principal diferença visual entre o formato Moeda e o formato Contábil?',
        options: [
          'Moeda calcula juros e Contábil calcula multas',
          'Contábil alinha o símbolo de moeda à esquerda e os números à direita, exibindo zero como um traço (-)',
          'O formato Contábil só aceita números inteiros',
          'O formato Moeda não permite centavos'
        ],
        correctIndex: 1,
        explanation: 'O formato Contábil alinha os símbolos de moeda na margem esquerda e valores zero são representados por hífen (-).'
      },
      {
        id: 207,
        question: 'Qual atalho de teclado aplica rapidamente a formatação de Porcentagem (%) à célula selecionada?',
        options: ['Ctrl + Shift + %', 'Ctrl + P', 'Alt + %', 'Ctrl + Shift + P'],
        correctIndex: 0,
        explanation: 'Ctrl + Shift + % aplica o estilo de porcentagem imediatamente.'
      },
      {
        id: 208,
        question: 'O recurso "Quebrar Texto Automaticamente" serve para:',
        options: [
          'Excluir palavras com mais de dez letras',
          'Fazer com que textos longos ocupem múltiplas linhas visíveis dentro da mesma célula',
          'Dividir uma planilha em dois arquivos separados',
          'Criar uma quebra de página para impressão'
        ],
        correctIndex: 1,
        explanation: 'Quebrar Texto Automaticamente ajusta o texto em várias linhas verticais dentro da altura da linha da célula.'
      },
      {
        id: 209,
        question: 'Ao digitar "10%" em uma célula, qual é o valor decimal matemático real armazenado pelo Excel?',
        options: ['10', '0,1', '100', '0,01'],
        correctIndex: 1,
        explanation: '10% equivale matematicamente a 10/100, ou seja, 0,1.'
      },
      {
        id: 210,
        question: 'Como ajustar automaticamente a largura de uma coluna para caber exatamente o maior conteúdo nela inserido?',
        options: [
          'Pressionar Delete',
          'Dar um duplo clique na linha divisória entre o cabeçalho da coluna e a próxima',
          'Desligar o monitor',
          'Reiniciar o computador'
        ],
        correctIndex: 1,
        explanation: 'Dar um duplo clique na divisória entre as letras das colunas ativa o AutoAjuste de largura instantâneo.'
      }
    ]
  },
  {
    id: 3,
    lessonNumber: 3,
    title: 'Operadores Matemáticos e Fórmulas Básicas (SOMA, MÉDIA, MÍN, MÁX)',
    module: 'Módulo 1: Fundamentos e Navegação',
    duration: '28 min',
    summary: 'Inicie a construção de cálculos reais. Compreenda operadores (+, -, *, /), precedência matemática e as funções mais usadas do mundo.',
    videoUrl: 'https://www.youtube.com/embed/LqE-jU9y9XQ',
    videoTitle: 'Aula 03: Fórmulas Básicas, Operadores e Funções Essenciais',
    videoHighlights: [
      'O sinal de igualdade obrigatório (=) para iniciar fórmulas',
      'Operadores aritméticos (+, -, *, /, ^)',
      'Funções SOMA, MÉDIA, MÁXIMO, MÍNIMO',
      'Ordem de precedência matemática (PEMDAS)'
    ],
    theoryContent: {
      introduction: 'Toda fórmula ou função no Excel DEVE obrigatoriamente começar com o sinal de igual (=). Sem ele, o Excel entenderá o que você digitou como texto simples. Além dos operadores matemáticos tradicionais, o Excel disponibiliza centenas de funções prontas que facilitam cálculos em grandes intervalos de dados, como a função SOMA e MÉDIA.',
      keyConcepts: [
        {
          title: 'Operadores Aritméticos',
          description: 'Adição (+), Subtração (-), Multiplicação (*), Divisão (/) e Exponenciação (^). O Excel segue a ordem de precedência: parênteses primeiro, depois potências, multiplicação/divisão e por fim adição/subtração.',
          formulaOrExample: '= (10 + 5) * 2  -> Resultado: 30'
        },
        {
          title: 'Dois Pontos (:) vs. Ponto e Vírgula (;)',
          description: 'Em argumentos de funções, os dois pontos (:) significam "ATÉ" (intervalo contínuo). O ponto e vírgula (;) significa "E" (células ou intervalos isolados).',
          formulaOrExample: '=SOMA(A1:A5) soma de A1 até A5 | =SOMA(A1;A5) soma apenas A1 e A5'
        },
        {
          title: 'Funções Estatísticas Básicas',
          description: 'MÉDIA calcula a média aritmética. MÁXIMO retorna o maior número do intervalo. MÍNIMO retorna o menor número do intervalo. CONT.NÚM conta quantas células possuem números.',
          formulaOrExample: '=MÉDIA(B2:B20) | =MÁXIMO(C2:C50) | =MÍNIMO(C2:C50)'
        }
      ],
      stepByStep: [
        'Clique na célula onde deseja ver o resultado (ex: D10).',
        'Digite o sinal de igual: =',
        'Digite o nome da função (ex: =SOMA() e abra parênteses.',
        'Com o mouse, clique e arraste sobre as células que deseja somar (ex: D2:D9).',
        'Feche o parênteses ) e pressione Enter para calcular.',
        'Experimente o recurso "AutoSoma" na guia Página Inicial ou use o atalho Alt + =.'
      ],
      keyboardShortcuts: [
        { keys: 'Alt + =', action: 'Inserir a função AutoSoma automaticamente no intervalo selecionado' },
        { keys: 'F2', action: 'Editar a fórmula da célula ativa diretamente na grade' },
        { keys: 'Esc', action: 'Cancelar a edição de uma fórmula sem salvar alterações' },
        { keys: 'Ctrl + `', action: 'Alternar entre exibir os resultados e exibir as fórmulas da planilha' }
      ],
      proTip: 'Nunca faça uma soma digitando =SOMA(A1+A2+A3). Isso é redundante! Use apenas =SOMA(A1:A3) ou =A1+A2+A3. As funções do Excel foram criadas para trabalhar com intervalos usando dois pontos.',
      commonErrors: 'Esquecer de fechar parênteses em cálculos complexos ou dividir por zero, o que gera o erro clássico #DIV/0!.'
    },
    quiz: [
      {
        id: 301,
        question: 'Com qual caractere toda fórmula ou função no Excel deve obrigatoriamente iniciar?',
        options: ['#', '=', '+', '@'],
        correctIndex: 1,
        explanation: 'Toda fórmula no Excel deve começar com o sinal de igual (=).'
      },
      {
        id: 302,
        question: 'Qual é o resultado da fórmula: =10 + 5 * 2?',
        options: ['30', '20', '25', '100'],
        correctIndex: 1,
        explanation: 'Pela ordem de precedência matemática, a multiplicação é feita antes: 5 * 2 = 10, depois 10 + 10 = 20.'
      },
      {
        id: 303,
        question: 'O que significa o operador de dois pontos (:) dentro de uma função como =SOMA(A1:A10)?',
        options: [
          'Dividir A1 por A10',
          'Indica um intervalo contínuo, significando "de A1 ATÉ A10"',
          'Significa somar apenas a célula A1 e a célula A10',
          'Indica que o cálculo é em dobro'
        ],
        correctIndex: 1,
        explanation: 'Os dois pontos (:) representam um intervalo contínuo (de... até).'
      },
      {
        id: 304,
        question: 'Qual função retorna o menor valor numérico contido em um intervalo de células?',
        options: ['=MENORVALOR()', '=MÍNIMO()', '=BAIXO()', '=PEQUENO()'],
        correctIndex: 1,
        explanation: 'A função =MÍNIMO() retorna o menor valor dentro de um intervalo de números.'
      },
      {
        id: 305,
        question: 'Qual é a diferença entre =SOMA(B1:B5) e =SOMA(B1;B5)?',
        options: [
          'Nenhuma diferença, são fórmulas idênticas',
          '=SOMA(B1:B5) soma todas as 5 células de B1 até B5, enquanto =SOMA(B1;B5) soma apenas B1 e B5',
          'O ponto e vírgula multiplica em vez de somar',
          'Os dois pontos causam erro no Excel'
        ],
        correctIndex: 1,
        explanation: 'Os dois pontos somam o intervalo contínuo; o ponto e vírgula soma apenas os dois argumentos especificados.'
      },
      {
        id: 306,
        question: 'Qual atalho insere automaticamente a função AutoSoma na célula selecionada?',
        options: ['Ctrl + S', 'Alt + =', 'Ctrl + Shift + S', 'Alt + Enter'],
        correctIndex: 1,
        explanation: 'Alt + = é o atalho clássico para aplicar o AutoSoma rapidamente.'
      },
      {
        id: 307,
        question: 'Qual função calcula a média aritmética simples dos números no intervalo C2:C10?',
        options: ['=MED()', '=MÉDIA(C2:C10)', '=AVERAGE_BR()', '=CALCULARMEDIA()'],
        correctIndex: 1,
        explanation: 'No Excel em português, a função correta é =MÉDIA() (com acento).'
      },
      {
        id: 308,
        question: 'O que o erro "#DIV/0!" indica em uma planilha do Excel?',
        options: [
          'A fórmula tentou dividir um número por zero ou por uma célula vazia',
          'O nome da função foi escrito errado',
          'A planilha não tem espaço em disco',
          'O arquivo não foi salvo'
        ],
        correctIndex: 0,
        explanation: '#DIV/0! ocorre quando ocorre uma divisão matemática impossível por zero.'
      },
      {
        id: 309,
        question: 'Qual operador aritmético representa a multiplicação no Excel?',
        options: ['x', '.', '*', '%'],
        correctIndex: 2,
        explanation: 'O asterisco (*) é o operador padrão de multiplicação no Excel.'
      },
      {
        id: 310,
        question: 'Qual função conta quantas células em um intervalo contêm valores numéricos válidos?',
        options: ['=CONTAR()', '=CONT.NÚM()', '=SOMAR.NÚM()', '=TOTAL()'],
        correctIndex: 1,
        explanation: '=CONT.NÚM() conta exclusivamente as células que contêm valores numéricos.'
      }
    ]
  },
  {
    id: 4,
    lessonNumber: 4,
    title: 'Referências de Células: Relativas, Absolutas ($) e Alça de Preenchimento',
    module: 'Módulo 1: Fundamentos e Navegação',
    duration: '30 min',
    summary: 'O conceito mais importante para automação de fórmulas: entenda o símbolo de cifrão ($), travamento de linhas e colunas e a tecla F4.',
    videoUrl: 'https://www.youtube.com/embed/9G0z_ZkGZJk',
    videoTitle: 'Aula 04: O Segredo do Cifrão ($) e Alça de Preenchimento no Excel',
    videoHighlights: [
      'Alça de Preenchimento (quadradinho verde no canto da célula)',
      'Referências Relativas (deslocamento automático de linhas e colunas)',
      'Referências Absolutas ($A$1) para fixar valores constantes',
      'Referências Mistas ($A1 vs. A$1) e uso da tecla F4'
    ],
    theoryContent: {
      introduction: 'Ao arrastar uma fórmula usando a Alça de Preenchimento, o Excel atualiza automaticamente as linhas e colunas das referências. Isso é chamado de Referência Relativa. Porém, quando precisamos multiplicar uma coluna inteira por uma única taxa fixa (ex: comissão ou cotação do dólar localizada na célula D1), devemos "travar" ou fixar essa célula utilizando o cifrão ($). Isso é uma Referência Absoluta.',
      keyConcepts: [
        {
          title: 'Referência Relativa (ex: A1)',
          description: 'Não possui nenhum cifrão. Ao arrastar para baixo, a linha aumenta (A2, A3, A4). Ao arrastar para o lado, a coluna muda (B1, C1, D1).',
          formulaOrExample: '=A1 * B1  (ao descer vira =A2 * B2)'
        },
        {
          title: 'Referência Absoluta (ex: $A$1)',
          description: 'Possui cifrão antes da coluna e antes da linha. Permanece exatamente na mesma célula A1 não importa para onde a fórmula seja arrastada ou copiada.',
          formulaOrExample: '=B2 * $D$1  (ao descer vira =B3 * $D$1)'
        },
        {
          title: 'Referências Mistas (ex: $A1 ou A$1)',
          description: '$A1 trava apenas a coluna A, mas deixa a linha livre. A$1 trava apenas a linha 1, mas deixa a coluna livre. Muito utilizado em matrizes de multiplicação e relatórios cruzados.',
          formulaOrExample: '=$A2 * B$1'
        }
      ],
      stepByStep: [
        'Crie uma tabela com produtos, valores e uma célula isolada contendo o percentual de imposto (ex: E1 = 15%).',
        'Na coluna de imposto a pagar, digite a fórmula multiplicando o valor do produto pela célula de imposto: =C2 * E1.',
        'Clique no meio da palavra E1 na fórmula e pressione a tecla F4. O Excel transformará em $E$1.',
        'Pressione Enter.',
        'Passe o mouse sobre o canto inferior direito da célula até o cursor virar uma cruz preta sólida (+).',
        'Dê um clique duplo na Alça de Preenchimento para propagar a fórmula para todas as linhas da tabela.'
      ],
      keyboardShortcuts: [
        { keys: 'F4', action: 'Alternar entre referências (A1 -> $A$1 -> A$1 -> $A1 -> A1)' },
        { keys: 'Ctrl + D', action: 'Copiar fórmula da célula de cima para a célula selecionada' },
        { keys: 'Ctrl + R', action: 'Copiar fórmula da célula da esquerda para a direita' },
        { keys: 'Clique duplo na Alça', action: 'Preencher automaticamente até o fim dos dados adjacentes' }
      ],
      proTip: 'Pressione F4 repetidamente ao digitar uma fórmula para ciclar rapidamente entre os 4 modos: Absoluto total ($A$1), Misto travando linha (A$1), Misto travando coluna ($A1) e Relativo sem travas (A1).',
      commonErrors: 'Esquecer de travar a célula da taxa ou porcentagem ($), fazendo com que a fórmula multiplique por células vazias e retorne zero ou valores errados nas linhas seguintes.'
    },
    quiz: [
      {
        id: 401,
        question: 'Qual símbolo é utilizado no Excel para travar (fixar) uma linha ou coluna em uma fórmula?',
        options: ['%', '$', '#', '&'],
        correctIndex: 1,
        explanation: 'O caractere cifrão ($) é utilizado para fixar referências no Excel.'
      },
      {
        id: 402,
        question: 'Qual tecla de atalho é utilizada para alternar entre referências relativas, absolutas e mistas?',
        options: ['F2', 'F4', 'F9', 'F12'],
        correctIndex: 1,
        explanation: 'A tecla F4 insere e alterna os cifrões de travamento na referência selecionada.'
      },
      {
        id: 403,
        question: 'Se a fórmula "=A1*B1" for copiada da célula C1 para a célula C2, como ela ficará?',
        options: ['=A1*B1', '=A2*B2', '=$A$1*$B$1', '=A2*B1'],
        correctIndex: 1,
        explanation: 'Por ser uma referência relativa, descer uma linha faz todas as linhas aumentarem em 1 (=A2*B2).'
      },
      {
        id: 404,
        question: 'Se a fórmula "=$A$1*B1" for copiada da linha 1 para a linha 5, qual parte da fórmula NÃO se alterará?',
        options: ['B1', '$A$1', 'Nenhuma, ambas mudam', 'O sinal de multiplicação'],
        correctIndex: 1,
        explanation: '$A$1 é uma referência absoluta (coluna e linha travadas), portanto permanece imutável.'
      },
      {
        id: 405,
        question: 'Na referência mista "$C5", o que está travado e o que está livre?',
        options: [
          'A coluna C está travada e a linha 5 está livre para variar',
          'A linha 5 está travada e a coluna C está livre',
          'Ambas estão travadas',
          'Nenhuma está travada'
        ],
        correctIndex: 0,
        explanation: 'O cifrão antes do C fixa a coluna C, enquanto o 5 sem cifrão varia livremente ao arrastar.'
      },
      {
        id: 406,
        question: 'Onde está localizada a "Alça de Preenchimento" no Excel?',
        options: [
          'No canto superior esquerdo da tela',
          'No canto inferior direito da célula ou intervalo selecionado',
          'Dentro da Barra de Fórmulas',
          'No rodapé do Windows'
        ],
        correctIndex: 1,
        explanation: 'A Alça de Preenchimento é o pequeno quadrado no canto inferior direito da célula ativa.'
      },
      {
        id: 407,
        question: 'O que acontece ao dar um duplo clique rápido na Alça de Preenchimento de uma célula calculada?',
        options: [
          'A célula é apagada',
          'A fórmula é preenchida automaticamente para baixo até o fim dos dados da coluna vizinha',
          'A planilha é salva em PDF',
          'O Excel exibe uma mensagem de erro'
        ],
        correctIndex: 1,
        explanation: 'O duplo clique na alça preenche a fórmula até o fim do bloco de dados contíguo.'
      },
      {
        id: 408,
        question: 'Qual atalho de teclado copia o conteúdo da célula de cima para a célula abaixo selecionada?',
        options: ['Ctrl + D', 'Ctrl + C', 'Ctrl + V', 'Ctrl + X'],
        correctIndex: 0,
        explanation: 'Ctrl + D (Down) copia a célula imediatamente superior para a selecionada.'
      },
      {
        id: 409,
        question: 'Por que o uso de referências absolutas ($) é essencial em tabelas de comissão de vendas?',
        options: [
          'Para deixar o texto em negrito',
          'Para garantir que todas as linhas continuem multiplicando pela mesma célula fixa da taxa de comissão',
          'Para que a planilha funcione sem internet',
          'Para impedir que outras pessoas leiam a tabela'
        ],
        correctIndex: 1,
        explanation: 'Fixar a célula da taxa ($) impede que a fórmula se desloque para células em branco ao ser arrastada.'
      },
      {
        id: 410,
        question: 'Quantas vezes a tecla F4 precisa ser pressionada a partir de "A1" para obter a referência mista "A$1"?',
        options: ['1 vez', '2 vezes', '3 vezes', '4 vezes'],
        correctIndex: 1,
        explanation: '1ª vez: $A$1 (absoluta). 2ª vez: A$1 (linha travada). 3ª vez: $A1 (coluna travada). 4ª vez: A1 (relativa).'
      }
    ]
  }
];
