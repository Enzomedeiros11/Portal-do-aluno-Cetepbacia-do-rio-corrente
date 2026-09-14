import { ExcelLesson } from './excelTypes';

export const lessons13to16: ExcelLesson[] = [
  {
    id: 13,
    lessonNumber: 13,
    title: 'Validação de Dados, Regras de Entrada e Menus Suspensos',
    module: 'Módulo 4: Gerenciamento, Relatórios e Automação',
    duration: '28 min',
    summary: 'Evite erros de digitação na sua planilha. Crie listas suspensas (dropdowns), restrições de datas, notas e alertas de erro personalizados.',
    videoUrl: 'https://www.youtube.com/embed/z5eN6Q0pD1o',
    videoTitle: 'Aula 13: Criando Menus Suspensos e Validação de Dados Profissional',
    videoHighlights: [
      'Criação de Listas Suspensas (Dropdown) a partir de intervalos',
      'Validação de Número Inteiro, Decimal e Comprimento de Texto',
      'Mensagens de Entrada informativas ao clicar na célula',
      'Alertas de Erro customizados (Parar, Aviso e Informações)'
    ],
    theoryContent: {
      introduction: 'Planilhas corporativas são preenchidas por diversas pessoas, o que frequentemente gera inconsistências: uma pessoa digita "Informática", outra digita "Info", e uma terceira digita com erro de grafia "Informatca". Isso quebra filtros, SOMASE e gráficos. A Validação de Dados impede a digitação de valores inválidos restringindo as entradas a regras pré-estabelecidas ou a um menu suspenso selecionável.',
      keyConcepts: [
        {
          title: 'Lista Suspensa (Dropdown)',
          description: 'Permite selecionar a opção em uma setinha ao lado da célula. A fonte pode ser digitada manualmente separada por ponto e vírgula ou apontada para um intervalo na planilha.',
          formulaOrExample: 'Fonte: Informática;Administração;Enfermagem  ou  =$K$2:$K$10'
        },
        {
          title: 'Tipos de Validação',
          description: 'Número Inteiro (ex: idade entre 14 e 100), Decimal (ex: notas de 0,0 a 10,0), Data (ex: somente datas futuras) e Comprimento do Texto (ex: CPF com exatamente 11 dígitos).',
          formulaOrExample: 'Notas válidas: Decimal entre 0 e 10'
        },
        {
          title: 'Estilos de Alerta de Erro',
          description: 'Parar (ícone vermelho X): impede terminantemente a gravação de dados inválidos. Aviso (triângulo amarelo): alerta mas permite prosseguir se o usuário confirmar. Informações (ícone azul): apenas avisa.',
          formulaOrExample: 'Use sempre "Parar" para integridade total do banco'
        }
      ],
      stepByStep: [
        'Selecione a coluna que receberá a restrição (ex: Coluna de Curso C2:C100).',
        'Vá até a guia Dados > Ferramentas de Dados > Validação de Dados.',
        'Na aba Configurações, no campo Permitir, selecione "Lista".',
        'No campo Fonte, digite as opções separadas por ponto e vírgula ou selecione as células onde a lista de cursos está anotada.',
        'Vá até a aba "Alerta de Erro", digite o título "Curso Inválido" e a mensagem explicativa.',
        'Clique em OK e teste clicando na setinha da célula.'
      ],
      keyboardShortcuts: [
        { keys: 'Alt + Abaixo', action: 'Abrir a lista suspensa da célula selecionada usando o teclado' },
        { keys: 'Alt + D + V', action: 'Atalho clássico para abrir a caixa de Validação de Dados' }
      ],
      proTip: 'Para criar uma lista suspensa que se atualize automaticamente quando você adicionar novos cursos à base, converta a sua lista de opções em uma Tabela do Excel (Ctrl + T) antes de apontar na validação!',
      commonErrors: 'Separar os itens da lista suspensa por vírgula em vez de ponto e vírgula no Excel em português, fazendo todas as palavras ficarem juntas em uma única linha.'
    },
    quiz: [
      {
        id: 1301,
        question: 'Em qual guia da Faixa de Opções está localizada a ferramenta de "Validação de Dados"?',
        options: ['Guia Inserir', 'Guia Dados', 'Guia Exibir', 'Guia Página Inicial'],
        correctIndex: 1,
        explanation: 'A Validação de Dados fica no grupo Ferramentas de Dados da guia Dados.'
      },
      {
        id: 1302,
        question: 'Qual caractere deve ser usado para separar os itens manuais na fonte de uma Lista Suspensa no Excel em português?',
        options: ['Vírgula (,)', 'Ponto e vírgula (;)', 'Traço (-)', 'Barra (/)'],
        correctIndex: 1,
        explanation: 'No padrão brasileiro do Excel, usa-se o ponto e vírgula (;) para separar os itens da lista.'
      },
      {
        id: 1303,
        question: 'Qual estilo de Alerta de Erro IMPEDE que o usuário insira o dado inválido na célula de qualquer forma?',
        options: ['Aviso', 'Parar (Stop)', 'Informações', 'Recomendação'],
        correctIndex: 1,
        explanation: 'O estilo "Parar" bloqueia a inserção, forçando o usuário a corrigir ou cancelar.'
      },
      {
        id: 1304,
        question: 'Qual atalho de teclado abre o menu suspenso de uma célula validada sem usar o mouse?',
        options: ['Ctrl + Espaço', 'Alt + Seta para Baixo', 'Shift + Enter', 'F1'],
        correctIndex: 1,
        explanation: 'Alt + Seta Abaixo expande a lista suspensa na célula ativa via teclado.'
      },
      {
        id: 1305,
        question: 'Qual tipo de validação deve ser selecionado para restringir que uma coluna de notas só receba valores entre 0,0 e 10,0?',
        options: ['Número Inteiro', 'Decimal', 'Hora', 'Comprimento do Texto'],
        correctIndex: 1,
        explanation: 'Como as notas podem conter frações (ex: 7,5), deve-se escolher a validação "Decimal".'
      },
      {
        id: 1306,
        question: 'Para que serve a aba "Mensagem de Entrada" na janela de Validação de Dados?',
        options: [
          'Para mandar um WhatsApp ao usuário',
          'Para exibir uma dica flutuante assim que o usuário clica ou seleciona a célula',
          'Para tocar um som de alarme',
          'Para imprimir a folha'
        ],
        correctIndex: 1,
        explanation: 'A Mensagem de Entrada exibe um balão instrutivo ao posicionar o cursor na célula.'
      },
      {
        id: 1307,
        question: 'Para validar que um campo de CPF receba exatamente 11 dígitos, qual critério de validação deve ser usado?',
        options: ['Qualquer valor', 'Comprimento do texto igual a 11', 'Data entre 1 e 11', 'Fórmula =SOMA'],
        correctIndex: 1,
        explanation: 'A opção "Comprimento do texto" permite definir o tamanho exato de caracteres permitidos.'
      },
      {
        id: 1308,
        question: 'O que o recurso "Circular Dados Inválidos" faz na planilha?',
        options: [
          'Exclui as linhas com erro',
          'Desenha círculos vermelhos em volta das células que já continham dados violando a regra antes da validação ser aplicada',
          'Muda o tamanho da fonte',
          'Bloqueia a impressão'
        ],
        correctIndex: 1,
        explanation: '"Circular Dados Inválidos" destaca em vermelho as células pré-existentes fora da regra.'
      },
      {
        id: 1309,
        question: 'O que acontece com a lista suspensa se a célula de origem na planilha for apagada ou renomeada sem os devidos cuidados?',
        options: [
          'A lista continua funcionando com base no histórico',
          'A lista suspensa fica vazia ou exibe opções em branco',
          'O Excel fecha automaticamente',
          'A planilha é enviada para a lixeira'
        ],
        correctIndex: 1,
        explanation: 'Se a fonte for excluída, a lista suspensa perde sua referência e não exibe os valores esperados.'
      },
      {
        id: 1310,
        question: 'Qual é o maior benefício de aplicar validação de dados em planilhas compartilhadas?',
        options: [
          'Garantir padronização das informações e evitar erros humanos de digitação',
          'Fazer o arquivo ficar com o dobro do tamanho',
          'Impedir que a planilha seja aberta no celular',
          'Acelerar a velocidade da internet'
        ],
        correctIndex: 0,
        explanation: 'A validação padroniza o banco de dados e impede falhas de digitação que quebrariam análises.'
      }
    ]
  },
  {
    id: 14,
    lessonNumber: 14,
    title: 'Tabelas Estruturadas, Filtros Avançados e Segmentação de Dados',
    module: 'Módulo 4: Gerenciamento, Relatórios e Automação',
    duration: '32 min',
    summary: 'Transforme intervalos comuns em Tabelas Inteligentes (Ctrl + T). Fórmulas calculadas automáticas, totais e Segmentações de Dados modernas.',
    videoUrl: 'https://www.youtube.com/embed/Pj15RzBvEFE',
    videoTitle: 'Aula 14: O Poder das Tabelas Oficiais do Excel (Ctrl + T)',
    videoHighlights: [
      'Formatar como Tabela oficial (Ctrl + T) e suas vantagens',
      'Colunas Calculadas Automáticas (arraste automático de fórmulas)',
      'Linha de Totais nativa com menus dinâmicos',
      'Segmentação de Dados (Slicers) para filtros visuais interativos'
    ],
    theoryContent: {
      introduction: 'Muitas pessoas pensam que apenas colocar bordas pretas em células já cria uma "tabela" no Excel. Isso é apenas um intervalo formatado. Quando você clica em "Formatar como Tabela" (ou usa o atalho Ctrl + T), o Excel transforma aquele bloco de dados em um Objeto Tabela estruturado. Isso significa que ao adicionar uma nova linha, todas as fórmulas, formatações e regras se expandem sozinhas sem você precisar fazer nada.',
      keyConcepts: [
        {
          title: 'Referências Estruturadas',
          description: 'Em vez de referências crípticas como =C2*D2, as Tabelas utilizam nomes semânticos como =[@Preço] * [@Quantidade]. Isso torna a leitura da fórmula extremamente profissional e intuitiva.',
          formulaOrExample: '=[@Nota1] * 0,4 + [@Nota2] * 0,6'
        },
        {
          title: 'Expansão Dinâmica',
          description: 'Ao digitar um novo registro imediatamente na linha de baixo ou pressionar a tecla Tab na última célula, a tabela cresce automaticamente incorporando as cores, fórmulas e validações.',
          formulaOrExample: 'Não é necessário arrastar fórmulas manualmente!'
        },
        {
          title: 'Segmentação de Dados (Slicers)',
          description: 'Botões visuais e elegantes que funcionam como filtros de um clique. Ao clicar no botão "Informática", a tabela inteira é filtrada instantaneamente sem precisar abrir o menu do cabeçalho.',
          formulaOrExample: 'Design da Tabela > Inserir Segmentação de Dados'
        }
      ],
      stepByStep: [
        'Clique em qualquer célula dentro da sua base de dados.',
        'Pressione o atalho Ctrl + T.',
        'Marque a caixa "Minha tabela tem cabeçalhos" e clique em OK.',
        'Na nova guia que surge no topo (Design da Tabela), marque a opção "Linha de Totais".',
        'Clique em "Inserir Segmentação de Dados", marque a coluna Curso e Turno e organize os botões na tela.'
      ],
      keyboardShortcuts: [
        { keys: 'Ctrl + T', action: 'Converter o intervalo atual em Objeto Tabela Estruturada' },
        { keys: 'Ctrl + Shift + L', action: 'Ligar ou desligar os botões de filtro no cabeçalho' },
        { keys: 'Alt + Seta Abaixo', action: 'Abrir as opções de filtro e classificação da coluna selecionada' },
        { keys: 'Tab', action: 'Na última célula da tabela, cria uma nova linha formatada automaticamente' }
      ],
      proTip: 'Sempre dê um nome significativo para sua tabela na guia Design da Tabela (ex: TabelaAlunos ou BaseVendas). Isso facilita chamar essa tabela diretamente em fórmulas como =PROCV(A2; TabelaAlunos; 3; 0)!',
      commonErrors: 'Deixar linhas ou colunas totalmente em branco no meio do intervalo, fazendo o Excel cortar a tabela pela metade ao apertar Ctrl + T.'
    },
    quiz: [
      {
        id: 1401,
        question: 'Qual é o atalho de teclado para converter um intervalo comum em uma Tabela Estruturada oficial no Excel?',
        options: ['Ctrl + T', 'Ctrl + B', 'Ctrl + N', 'Ctrl + Shift + T'],
        correctIndex: 0,
        explanation: 'Ctrl + T (Tabela) converte o intervalo selecionado em um objeto de Tabela oficial.'
      },
      {
        id: 1402,
        question: 'O que é uma "Coluna Calculada Automática" em uma Tabela do Excel?',
        options: [
          'Um cálculo feito pela inteligência artificial sem você digitar nada',
          'Quando você digita a fórmula na primeira linha, a tabela replica o cálculo automaticamente para todas as outras linhas',
          'Uma coluna que só aceita números primos',
          'Um erro do sistema'
        ],
        correctIndex: 1,
        explanation: 'Tabelas estruturadas propagam a fórmula digitada em uma célula para toda a coluna instantaneamente.'
      },
      {
        id: 1403,
        question: 'Qual é o nome dado aos botões visuais interativos que permitem filtrar tabelas e relatórios com apenas um clique?',
        options: ['Segmentação de Dados (Slicers)', 'Macro Botões', 'Filtro Solar', 'Gatilhos'],
        correctIndex: 0,
        explanation: 'Segmentação de Dados (Slicers) cria botões clicáveis elegantes para filtragem instantânea.'
      },
      {
        id: 1404,
        question: 'O que acontece ao pressionar a tecla Tab enquanto estiver na última célula da última linha de uma Tabela do Excel?',
        options: [
          'A tabela é excluída',
          'Uma nova linha em branco é inserida e formatada automaticamente na tabela',
          'O cursor vai para a célula A1',
          'O arquivo é salvo'
        ],
        correctIndex: 1,
        explanation: 'Pressionar Tab no fim de uma tabela expande a estrutura adicionando uma nova linha pronta para digitação.'
      },
      {
        id: 1405,
        question: 'Como são chamadas as fórmulas escritas com os nomes das colunas da tabela (ex: =[@Valor]*[@Qtd])?',
        options: ['Referências Estruturadas', 'Fórmulas Secretas', 'Expressões Numéricas', 'Códigos Binários'],
        correctIndex: 0,
        explanation: 'Referências estruturadas substituem endereços de células pelos nomes reais dos cabeçalhos da tabela.'
      },
      {
        id: 1406,
        question: 'O que o recurso "Linha de Totais" da Tabela oficial permite fazer?',
        options: [
          'Adiciona uma linha no rodapé com menus suspensos para calcular Soma, Média, Contagem ou Máximo dos dados filtrados',
          'Apaga os dados duplicados',
          'Calcula a conta bancária do usuário',
          'Muda a cor do cabeçalho'
        ],
        correctIndex: 0,
        explanation: 'A Linha de Totais aplica funções subtotais dinâmicas que recalculam apenas as linhas visíveis.'
      },
      {
        id: 1407,
        question: 'O que a função SUBTOTAL faz de diferente em relação à função SOMA tradicional?',
        options: [
          'Ela ignora linhas ocultas por filtros, somando apenas os dados que estão visíveis na tela',
          'Ela soma de trás para frente',
          'Ela divide por dois',
          'Ela só soma números ímpares'
        ],
        correctIndex: 0,
        explanation: 'SUBTOTAL respeita os filtros aplicados, desconsiderando linhas que foram temporariamente ocultadas.'
      },
      {
        id: 1408,
        question: 'Onde podemos alterar o nome padrão da tabela (ex: de Tabela1 para "Matrículas2026")?',
        options: [
          'Na guia Design da Tabela, no campo "Nome da Tabela" no canto esquerdo',
          'No Painel de Controle do Windows',
          'Na Barra de Status',
          'No botão Iniciar'
        ],
        correctIndex: 0,
        explanation: 'Na guia contextual Design da Tabela, no canto esquerdo, fica a caixa com o nome da tabela.'
      },
      {
        id: 1409,
        question: 'Qual atalho liga ou desliga rapidamente as setinhas de filtro no cabeçalho das colunas?',
        options: ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + F4', 'Ctrl + P'],
        correctIndex: 0,
        explanation: 'Ctrl + Shift + L ativa e desativa os botões de autofiltro na planilha.'
      },
      {
        id: 1410,
        question: 'É possível converter uma Tabela estruturada de volta para um intervalo normal de células se for necessário?',
        options: [
          'Não, o processo é irreversível',
          'Sim, clicando no botão "Converter em Intervalo" na guia Design da Tabela',
          'Apenas reinstalando o Excel',
          'Apenas colando no Bloco de Notas'
        ],
        correctIndex: 1,
        explanation: 'O comando "Converter em Intervalo" desfaz a estrutura da tabela preservando dados e formatação.'
      }
    ]
  },
  {
    id: 15,
    lessonNumber: 15,
    title: 'Tabelas Dinâmicas (Pivot Tables) e Gráficos Dinâmicos',
    module: 'Módulo 4: Gerenciamento, Relatórios e Automação',
    duration: '38 min',
    summary: 'A ferramenta de inteligência analítica mais poderosa do Excel. Resuma centenas de milhares de linhas em segundos sem escrever nenhuma fórmula.',
    videoUrl: 'https://www.youtube.com/embed/LqE-jU9y9XQ',
    videoTitle: 'Aula 15: Tabelas Dinâmicas do Zero ao Avançado no Excel',
    videoHighlights: [
      'Os 4 quadrantes da Tabela Dinâmica: Filtros, Colunas, Linhas e Valores',
      'Agrupamento automático de datas por Mês, Trimestre e Ano',
      'Cálculos avançados: % do Total Geral e Variação Percentual',
      'Criação de Gráficos Dinâmicos conectados'
    ],
    theoryContent: {
      introduction: 'Se uma base de dados possui 50.000 linhas de vendas, tentar responder "Qual curso teve mais matrículas no primeiro trimestre?" usando fórmulas exigiria dezenas de SOMASES e CONT.SES complexos. A Tabela Dinâmica (Pivot Table) faz isso em menos de 5 segundos através do sistema de arrastar e soltar campos.',
      keyConcepts: [
        {
          title: 'Os 4 Quadrantes Analíticos',
          description: '1. Linhas: categorias que aparecem na vertical. 2. Colunas: categorias na horizontal (cruzamento matricial). 3. Valores: campos numéricos para somar, contar ou tirar média. 4. Filtros: segmentação geral do relatório.',
          formulaOrExample: 'Linhas: Curso | Valores: Contagem de Alunos'
        },
        {
          title: 'Mostrar Valores Como (% do Total)',
          description: 'Clicando com o botão direito no valor numérico > "Mostrar Valores Como", você transforma totais brutos em participações percentuais relativas (% do Total Geral ou % da Linha Pai).',
          formulaOrExample: 'Ex: Informática representa 38,5% do total da escola'
        },
        {
          title: 'O Botão Atualizar (Alt + F5)',
          description: 'Diferente das fórmulas normais, as Tabelas Dinâmicas gravam um cache de memória. Se você alterar ou adicionar dados na tabela original, deve obrigatoriamente clicar com o botão direito e selecionar "Atualizar" para refletir as mudanças.',
          formulaOrExample: 'Atalho para atualizar: Alt + F5'
        }
      ],
      stepByStep: [
        'Clique em qualquer célula da sua base de dados (de preferência já formatada como Tabela Ctrl + T).',
        'Vá até a guia Inserir > Tabela Dinâmica > Da Tabela/Intervalo.',
        'Escolha "Nova Planilha" e clique em OK.',
        'No painel direito "Campos da Tabela Dinâmica", arraste "Curso" para o quadrante Linhas.',
        'Arraste "Mensalidade" para o quadrante Valores (o Excel aplicará Soma de Mensalidade).',
        'Arraste "Turno" para Colunas para cruzar os dados.',
        'Na guia Inserir, clique em "Gráfico Dinâmico" para gerar um gráfico interativo simultâneo.'
      ],
      keyboardShortcuts: [
        { keys: 'Alt + F5', action: 'Atualizar a Tabela Dinâmica ativa' },
        { keys: 'Ctrl + Alt + F5', action: 'Atualizar TODAS as tabelas dinâmicas e conexões da pasta de trabalho' },
        { keys: 'F11', action: 'Criar um gráfico dinâmico em uma folha exclusiva instantaneamente' }
      ],
      proTip: 'Sempre crie sua Tabela Dinâmica a partir de uma Tabela Estruturada (Ctrl + T). Assim, quando novas linhas entrarem na base no mês que vem, basta clicar em "Atualizar" que a Tabela Dinâmica captará tudo automaticamente sem precisar alterar o intervalo de origem!',
      commonErrors: 'Alterar valores na planilha de dados e esquecer de clicar em "Atualizar" na Tabela Dinâmica, apresentando números desatualizados em reuniões.'
    },
    quiz: [
      {
        id: 1501,
        question: 'Qual é a principal finalidade de uma Tabela Dinâmica (Pivot Table) no Excel?',
        options: [
          'Digitar textos longos',
          'Resumir, agrupar, cruzar e analisar grandes volumes de dados de forma rápida e sem fórmulas manuais',
          'Criar planilhas que se autodestroem',
          'Fazer animações em 3D'
        ],
        correctIndex: 1,
        explanation: 'Tabelas Dinâmicas são o principal recurso de Business Intelligence e síntese analítica do Excel.'
      },
      {
        id: 1502,
        question: 'Quais são os 4 quadrantes fundamentais do painel de Campos da Tabela Dinâmica?',
        options: [
          'Norte, Sul, Leste e Oeste',
          'Filtros, Colunas, Linhas e Valores',
          'Entrada, Processamento, Memória e Saída',
          'Soma, Média, Máximo e Mínimo'
        ],
        correctIndex: 1,
        explanation: 'Os 4 quadrantes são: Filtros, Colunas, Linhas e Valores.'
      },
      {
        id: 1503,
        question: 'O que deve ser feito na Tabela Dinâmica após adicionar ou alterar dados na base de dados de origem?',
        options: [
          'Reiniciar o computador',
          'Clicar com o botão direito e escolher "Atualizar" (ou pressionar Alt + F5)',
          'Excluir o Excel',
          'Salvar com outro nome'
        ],
        correctIndex: 1,
        explanation: 'Tabelas Dinâmicas utilizam cache e precisam ser atualizadas (Refresh / Alt + F5) para ler novos dados.'
      },
      {
        id: 1504,
        question: 'O que o Excel faz por padrão quando você arrasta um campo que contém TEXTO para o quadrante de Valores?',
        options: [
          'Aplica a função SOMA',
          'Aplica automaticamente a função CONTAGEM',
          'Gera um erro de sintaxe',
          'Apaga o texto'
        ],
        correctIndex: 1,
        explanation: 'Como textos não podem ser somados, o Excel adota nativamente a Contagem como operação padrão.'
      },
      {
        id: 1505,
        question: 'Qual atalho de teclado atualiza TODAS as tabelas dinâmicas da pasta de trabalho simultaneamente?',
        options: ['Ctrl + Alt + F5', 'Ctrl + S', 'Shift + Esc', 'Alt + F4'],
        correctIndex: 0,
        explanation: 'Ctrl + Alt + F5 executa o comando "Atualizar Tudo" em toda a pasta de trabalho.'
      },
      {
        id: 1506,
        question: 'O que o recurso "Mostrar Valores Como > % do Total Geral" faz nos números da Tabela Dinâmica?',
        options: [
          'Acrescenta 10% de imposto em todas as células',
          'Converte os valores absolutos na porcentagem que cada linha representa em relação ao todo (100%)',
          'Multiplica todos os números por 100',
          'Esconde os valores'
        ],
        correctIndex: 1,
        explanation: 'Ele calcula a proporção percentual que cada item tem sobre o total global da tabela.'
      },
      {
        id: 1507,
        question: 'Como agrupar um campo de datas na Tabela Dinâmica para visualizar os dados consolidados por Mês ou Trimestre?',
        options: [
          'Clicar com o botão direito em uma data dentro da Tabela Dinâmica e selecionar a opção "Agrupar"',
          'Digitar as datas uma a uma à mão',
          'Excluir as colunas de dias',
          'Mudar o fuso horário'
        ],
        correctIndex: 0,
        explanation: 'A ferramenta "Agrupar" agrupa instantaneamente datas em Anos, Trimestres, Meses ou Dias.'
      },
      {
        id: 1508,
        question: 'Um Gráfico Dinâmico conectado a uma Tabela Dinâmica se comporta de que maneira?',
        options: [
          'Ele é totalmente fixo e estático',
          'Ele se atualiza e reflete instantaneamente qualquer filtro ou agrupamento feito na Tabela Dinâmica',
          'Ele só pode ser visto com óculos 3D',
          'Ele não aceita legendas'
        ],
        correctIndex: 1,
        explanation: 'O Gráfico Dinâmico é interativo e sincronizado em tempo real com a Tabela Dinâmica correspondente.'
      },
      {
        id: 1509,
        question: 'Por que é uma boa prática construir Tabelas Dinâmicas a partir de Tabelas Oficiais (Ctrl + T)?',
        options: [
          'Porque a Tabela Dinâmica reconhece automaticamente novas linhas inseridas na base sem precisar redefinir o intervalo',
          'Porque o arquivo fica protegido contra hackers',
          'Porque o Excel não permite fazer de outra forma',
          'Porque gasta menos bateria'
        ],
        correctIndex: 0,
        explanation: 'O dinamismo da tabela oficial expande a fonte de dados da tabela dinâmica de forma transparente.'
      },
      {
        id: 1510,
        question: 'Para retirar um campo que foi colocado por engano em um quadrante da Tabela Dinâmica, basta:',
        options: [
          'Desinstalar o Microsoft Office',
          'Arrastar o campo para fora do painel ou desmarcar sua caixa de seleção na lista',
          'Pressionar a tecla Esc 10 vezes',
          'Fechar a tampa do notebook'
        ],
        correctIndex: 1,
        explanation: 'Basta arrastar o campo para fora da área dos quadrantes para removê-lo da visualização.'
      }
    ]
  },
  {
    id: 16,
    lessonNumber: 16,
    title: 'Dashboards Executivos, Gráficos Modernos e Noções de Macros',
    module: 'Módulo 4: Gerenciamento, Relatórios e Automação',
    duration: '42 min',
    summary: 'Construção de painéis profissionais de controle (KPIs), design sem linhas de grade, gráficos combinados e gravação de sua primeira Macro.',
    videoUrl: 'https://www.youtube.com/embed/5T5uQk67f1k',
    videoTitle: 'Aula 16: Criando um Dashboard Executivo e Automação no Excel',
    videoHighlights: [
      'Princípios de UI/UX em Dashboards (limpeza visual e contraste)',
      'Cartões de Indicadores Chave (KPIs) com formas e valores vinculados',
      'Gráficos Combinados (Colunas com Eixo Secundário de Linha)',
      'Gravação da Primeira Macro VBA para automação de tarefas rotineiras'
    ],
    theoryContent: {
      introduction: 'O ápice da jornada no Excel é a entrega de valor através de Dashboards Executivos e automações. Um Dashboard é uma tela única que resume os indicadores mais cruciais de um negócio ou instituição (como notas, frequência, custos e metas) permitindo aos gestores tomar decisões em segundos. Finalizaremos explorando como gravar Macros para automatizar tarefas repetitivas.',
      keyConcepts: [
        {
          title: 'Design Limpo (Ocultar Linhas de Grade)',
          description: 'A primeira regra de ouro de um Dashboard profissional é ir na guia Exibir e desmarcar a opção "Linhas de Grade". Um fundo limpo (branco ou cinza suave #F8FAFC) com cartões brancos e sombras discretas cria um aspecto moderno de aplicativo.',
          formulaOrExample: 'Guia Exibir > Desmarcar "Linhas de Grade"'
        },
        {
          title: 'Cartões de KPI Dinâmicos',
          description: 'Inserir uma forma (Retângulo com Cantos Arredondados), clicar na barra de fórmulas, digitar = e clicar na célula que contém o total calculado. O número no cartão passará a se atualizar sozinho.',
          formulaOrExample: 'Forma selecionada > Barra de Fórmulas: =Resumo!$B$1'
        },
        {
          title: 'Introdução a Macros e Gravador',
          description: 'Uma Macro é uma sequência gravada de ações em código VBA (Visual Basic for Applications). Ao acionar o "Gravador de Macros", o Excel registra cada clique, filtro e formatação, permitindo repetir todo o trabalho instantaneamente ao apertar um botão.',
          formulaOrExample: 'Guia Desenvolvedor > Gravar Macro (Salvar como .xlsm)'
        }
      ],
      stepByStep: [
        'Crie uma nova planilha chamada "Dashboard".',
        'Vá na guia Exibir e desmarque "Linhas de Grade" e "Títulos".',
        'Crie um cabeçalho executivo no topo com o logotipo do CETEP e título do painel.',
        'Insira 4 retângulos com cantos arredondados para exibir os 4 principais KPIs (Total de Alunos, Média Geral, Taxa de Aprovação, Evasão).',
        'Insira um Gráfico de Colunas Dinâmico e conecte-o a uma Segmentação de Dados vinculada aos Cursos.',
        'Para automatizar: vá na guia Desenvolvedor, clique em "Gravar Macro", realize a formatação e clique em "Parar Gravação".',
        'Lembre-se de salvar a pasta de trabalho no formato especial "Pasta de Trabalho Habilitada para Macro do Excel (.xlsm)".'
      ],
      keyboardShortcuts: [
        { keys: 'Alt + F11', action: 'Abrir o editor do Visual Basic (VBA) do Excel' },
        { keys: 'Alt + F8', action: 'Exibir a lista de Macros disponíveis para executar' },
        { keys: 'Ctrl + P', action: 'Visualizar impressão e exportação do Dashboard em PDF' }
      ],
      proTip: 'Ao trabalhar com arquivos que contêm Macros, NUNCA salve como .xlsx comum, pois o Excel removerá todo o código gravado! Escolha sempre o tipo "Pasta de Trabalho Habilitada para Macro do Excel (*.xlsm)".',
      commonErrors: 'Poluir o dashboard com cores berrantes, 3D ou fontes ilegíveis. O bom dashboard prioriza a facilidade de leitura e a tomada de decisões ágil.'
    },
    quiz: [
      {
        id: 1601,
        question: 'Qual é o primeiro passo visual recomendado para dar uma aparência profissional de painel/aplicativo a um Dashboard no Excel?',
        options: [
          'Pintar tudo de amarelo fluorescente',
          'Ir na guia Exibir e desmarcar a opção "Linhas de Grade"',
          'Instalar jogos no computador',
          'Aumentar o zoom para 400%'
        ],
        correctIndex: 1,
        explanation: 'Desmarcar as linhas de grade remove a aparência crua de grade e cria uma área limpa de design.'
      },
      {
        id: 1602,
        question: 'O que significa a sigla KPI em gestão e análise de dados?',
        options: [
          'Key Performance Indicator (Indicador-Chave de Desempenho)',
          'Keyboard Protocol Interface',
          'Kit Para Impressão',
          'Kernel Process Integration'
        ],
        correctIndex: 0,
        explanation: 'KPI significa Key Performance Indicator, métrica essencial para acompanhar o sucesso de metas.'
      },
      {
        id: 1603,
        question: 'Como conectar o texto de uma Forma geométrica (caixa de KPI) ao valor dinâmico de uma célula calculada?',
        options: [
          'Digitar o valor fixo com o teclado',
          'Selecionar a forma, clicar na Barra de Fórmulas, digitar o sinal de igual (=) e clicar na célula com o resultado',
          'Colar como imagem estática',
          'Não é possível vincular formas a células'
        ],
        correctIndex: 1,
        explanation: 'Ao vincular a forma via barra de fórmulas (=Célula), ela passa a refletir qualquer alteração em tempo real.'
      },
      {
        id: 1604,
        question: 'Para que serve um "Gráfico Combinado" no Excel?',
        options: [
          'Para desenhar dois tipos de gráficos juntos (ex: Colunas para Faturamento e Linha para Margem) com eixos de escalas diferentes',
          'Para juntar planilhas de dois computadores',
          'Para misturar texto com fotos',
          'Para gráficos em preto e branco'
        ],
        correctIndex: 0,
        explanation: 'Gráficos combinados permitem plotar grandezas distintas (como valores em R$ e porcentagens) no mesmo visual.'
      },
      {
        id: 1605,
        question: 'Qual é a linguagem de programação interna utilizada pelo Excel para criar e editar Macros?',
        options: ['Python', 'VBA (Visual Basic for Applications)', 'JavaScript', 'HTML5'],
        correctIndex: 1,
        explanation: 'O VBA é a linguagem de programação nativa integrada às ferramentas do Microsoft Office.'
      },
      {
        id: 1606,
        question: 'Qual atalho de teclado abre o ambiente de desenvolvimento do Editor do VBA no Excel?',
        options: ['Ctrl + V', 'Alt + F11', 'Shift + F5', 'Ctrl + Alt + Del'],
        correctIndex: 1,
        explanation: 'Alt + F11 abre diretamente o ambiente de desenvolvimento (VBE) do VBA.'
      },
      {
        id: 1607,
        question: 'Qual extensão de arquivo DEVE ser utilizada para salvar uma pasta de trabalho que contém códigos de Macros gravadas?',
        options: ['.xlsx', '.xlsm (Pasta de Trabalho Habilitada para Macro)', '.txt', '.csv'],
        correctIndex: 1,
        explanation: 'Arquivos com macros devem ser salvos como .xlsm para que o Excel preserve o código executável.'
      },
      {
        id: 1608,
        question: 'O recurso "Gravador de Macros" serve para:',
        options: [
          'Gravar a voz do usuário pelo microfone',
          'Gravar os passos e cliques executados na planilha e traduzi-los automaticamente em código de automação',
          'Gravar vídeos para o YouTube',
          'Salvar a senha da rede'
        ],
        correctIndex: 1,
        explanation: 'O Gravador de Macros converte as ações manuais do usuário em rotinas reutilizáveis de código.'
      },
      {
        id: 1609,
        question: 'Como atribuir uma Macro para que ela seja disparada ao clicar em um botão bonito desenhado na planilha?',
        options: [
          'Clicar com o botão direito na forma/botão e selecionar "Atribuir Macro..."',
          'Renomear o botão para "Executar"',
          'Dar um chute na mesa',
          'Não é possível vincular botões a macros'
        ],
        correctIndex: 0,
        explanation: 'Clicando com o botão direito na forma e selecionando "Atribuir Macro", o clique do usuário roda o script.'
      },
      {
        id: 1610,
        question: 'Qual é o princípio fundamental de design que garante a eficácia de um Dashboard no ambiente corporativo?',
        options: [
          'Usar todas as 20 fontes diferentes do computador',
          'Clareza, objetividade, foco nas decisões do usuário e ausência de ruídos visuais desnecessários',
          'Inserir dezenas de animações piscantes',
          'Ocupar o máximo de páginas possíveis'
        ],
        correctIndex: 1,
        explanation: 'A clareza, simplicidade e foco nas métricas certas definem um dashboard executivo de alto impacto.'
      }
    ]
  }
];
