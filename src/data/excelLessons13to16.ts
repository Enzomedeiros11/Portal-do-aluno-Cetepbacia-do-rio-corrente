import { ExcelLesson } from './excelTypes';

export const lessons13to16: ExcelLesson[] = [
  {
    "id": 13,
    "lessonNumber": 13,
    "title": "Aula 13: Objeto Tabela Oficial e Referências Estruturadas",
    "module": "Módulo 6: Tabelas, Interatividade e Filtros Dinâmicos",
    "duration": "27 min",
    "summary": "Descubra o verdadeiro poder do Objeto Tabela no Excel: formatação em zebra automática, propagação de fórmulas, Linha de Totais integrada, expansão automática de linhas e colunas e Referências Estruturadas.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Cm3GmwiQkOI",
    "videoTitle": "Aula 14 - Trabalhando com Tabelas - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Diferença entre intervalo comum e Objeto Tabela oficial (Ctrl + Alt + T / Ctrl + L)",
      "Expansão automática de dados e colunas calculadas",
      "Linha de Totais nativa com funções agregadoras instantâneas",
      "Referências estruturadas legíveis em vez de coordenadas rígidas (Ex: [@Preço] * [@Qtd])"
    ],
    "theoryContent": {
      "introduction": "Muitos usuários pensam que desenhar bordas pretas em torno de células significa ter uma \"tabela\". No Excel, uma Tabela Oficial é um objeto inteligente especial que revoluciona a forma como os dados são gerenciados. Ao converter uma lista em Tabela, você ganha automação de fórmulas, expansão inteligente e referências de nomes legíveis.",
      "keyConcepts": [
        {
          "title": "Criação da Tabela Oficial",
          "description": "Basta clicar dentro de qualquer célula da sua base e pressionar Ctrl + Alt + T (ou Ctrl + L). O Excel detecta os limites da tabela e a transforma em um objeto dinâmico com estilo visual em listras (zebra)."
        },
        {
          "title": "Colunas Calculadas Automáticas",
          "description": "Ao criar uma fórmula na primeira linha de uma nova coluna da tabela, o Excel preenche automaticamente toda a coluna até o final da tabela sem necessidade de arrastar a alça de preenchimento."
        },
        {
          "title": "Linha de Totais Integrada",
          "description": "Na guia Design da Tabela, marcar a caixa \"Linha de Totais\" (ou Ctrl + Shift + T) adiciona um rodapé com menus suspensos que calculam instantaneamente Soma, Média, Contagem ou Máximo ignorando linhas ocultas por filtros."
        },
        {
          "title": "Referências Estruturadas",
          "description": "Em vez de usar fórmulas indecifráveis como =B2*C2, a tabela usa o nome dos cabeçalhos: =[@Preço] * [@Quantidade]. Isso torna suas planilhas fáceis de auditar e entender."
        }
      ],
      "stepByStep": [
        "Clique em qualquer célula de uma lista contínua com cabeçalhos.",
        "Pressione Ctrl + Alt + T e verifique se a opção \"Minha tabela tem cabeçalhos\" está marcada.",
        "Na guia contextual \"Design da Tabela\" que surge no topo, dê um nome profissional para a tabela (ex: \"tbAlunos\" ou \"tbVendas\").",
        "Ative a \"Linha de Totais\" na barra de ferramentas e escolha \"Média\" na coluna de notas.",
        "Digite um novo registro na linha imediatamente abaixo da tabela: veja a tabela se expandir automaticamente e incluir a nova linha nos cálculos!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + Alt + T",
          "action": "Transforma o intervalo selecionado em Tabela Oficial"
        },
        {
          "keys": "Ctrl + Shift + T",
          "action": "Ativa ou desativa a Linha de Totais da Tabela"
        },
        {
          "keys": "Tab (na última célula)",
          "action": "Cria instantaneamente uma nova linha no final da tabela"
        }
      ],
      "proTip": "Sempre que for alimentar gráficos, tabelas dinâmicas ou fórmulas de busca (PROCV/PROCX), utilize Tabelas Oficiais como fonte de dados. Assim, sempre que novos dados forem inseridos, seus gráficos e relatórios incluirão as novas informações sem que você precise ajustar o intervalo manualmente!",
      "commonErrors": "Deixar linhas ou colunas totalmente em branco no meio dos dados antes de criar a tabela, fazendo com que o Excel interrompa a seleção no meio da base."
    },
    "quiz": [
      {
        "id": 1301,
        "question": "Qual atalho de teclado no Excel em português converte uma lista de dados em uma Tabela Oficial?",
        "options": [
          "Ctrl + P",
          "Alt + F4",
          "Ctrl + Alt + T (ou Ctrl + L)",
          "Ctrl + Shift + N"
        ],
        "correctIndex": 2,
        "explanation": "Ctrl + Alt + T (ou Ctrl + L em versões clássicas) cria uma Tabela Oficial do Excel."
      },
      {
        "id": 1302,
        "question": "Qual é o nome dado à guia especial que surge na Faixa de Opções quando você clica dentro de uma Tabela Oficial?",
        "options": [
          "Design da Tabela",
          "Ferramentas de Desenho",
          "Modo Desenvolvedor",
          "Visualizador"
        ],
        "correctIndex": 0,
        "explanation": "A guia contextual \"Design da Tabela\" agrupa todos os recursos exclusivos do objeto tabela."
      },
      {
        "id": 1303,
        "question": "O que acontece ao digitar um novo registro na linha imediatamente abaixo da última linha de uma Tabela Oficial?",
        "options": [
          "O Excel exibe um erro de limite",
          "A tabela perde sua formatação",
          "O arquivo é fechado",
          "A tabela se expande automaticamente, incorporando a nova linha às fórmulas e formatações"
        ],
        "correctIndex": 3,
        "explanation": "As tabelas do Excel têm redimensionamento automático para novas linhas e colunas adjacentes."
      },
      {
        "id": 1304,
        "question": "O que é uma \"Referência Estruturada\"?",
        "options": [
          "Uma coluna de concreto da engenharia civil",
          "Fórmula que usa os nomes dos cabeçalhos entre colchetes (ex: =[@Valor]*[@Qtd]) em vez de letras e números de células",
          "Uma planilha sem cores",
          "Uma macro em código binário"
        ],
        "correctIndex": 1,
        "explanation": "Referências estruturadas usam os nomes das colunas da tabela, tornando as fórmulas legíveis e intuitivas."
      },
      {
        "id": 1305,
        "question": "Qual atalho de teclado liga ou desliga instantaneamente a Linha de Totais da Tabela?",
        "options": [
          "Ctrl + T",
          "Alt + T",
          "F9",
          "Ctrl + Shift + T"
        ],
        "correctIndex": 3,
        "explanation": "Ctrl + Shift + T alterna a exibição da linha de totais no rodapé da tabela."
      },
      {
        "id": 1306,
        "question": "Qual tecla você deve pressionar quando está na última célula da última linha da tabela para adicionar uma nova linha rapidamente?",
        "options": [
          "Tecla Barra de Espaço",
          "Tecla Esc",
          "Tecla Tab",
          "Tecla Caps Lock"
        ],
        "correctIndex": 2,
        "explanation": "Pressionar Tab na última célula da tabela adiciona uma nova linha vazia automaticamente."
      },
      {
        "id": 1307,
        "question": "Qual função a Linha de Totais da tabela utiliza internamente para calcular somas sem somar linhas ocultadas por filtros?",
        "options": [
          "=SUBTOTAL()",
          "=SOMA()",
          "=OCULTO()",
          "=FILTRO_SOMA()"
        ],
        "correctIndex": 0,
        "explanation": "A linha de totais usa a função SUBTOTAL, que recalcula dinamicamente apenas as linhas visíveis."
      },
      {
        "id": 1308,
        "question": "Por que é uma boa prática nomear a tabela (ex: \"tbAlunos\") na guia Design da Tabela?",
        "options": [
          "Porque o Excel exige obrigatoriamente um nome de 20 letras",
          "Porque facilita encontrar e chamar a tabela em fórmulas, gráficos e relatórios dinâmicos",
          "Para mudar o idioma do computador",
          "Para criar um backup na nuvem"
        ],
        "correctIndex": 1,
        "explanation": "Nomear tabelas organiza o modelo de dados e facilita a escrita de fórmulas estruturadas."
      },
      {
        "id": 1309,
        "question": "O que faz o botão \"Converter em Intervalo\" na guia Design da Tabela?",
        "options": [
          "Apaga todos os dados da tabela",
          "Converte texto em imagens",
          "Transforma a Tabela Oficial de volta em um intervalo comum de células normais, preservando os dados e cores",
          "Imprime a tabela"
        ],
        "correctIndex": 2,
        "explanation": "Remove a inteligência da Tabela Oficial sem perder o conteúdo das células."
      },
      {
        "id": 1310,
        "question": "Ao escrever uma fórmula na primeira linha de uma nova coluna em uma Tabela Oficial, o que acontece?",
        "options": [
          "O usuário precisa arrastar a fórmula manualmente em cada linha",
          "A tabela trava",
          "O valor é apagado",
          "A fórmula é propagada automaticamente para todas as linhas daquela coluna (coluna calculada)"
        ],
        "correctIndex": 3,
        "explanation": "Tabelas possuem o recurso de \"Coluna Calculada\", preenchendo toda a extensão da coluna de forma automática."
      }
    ]
  },
  {
    "id": 14,
    "lessonNumber": 14,
    "title": "Aula 14: Segmentação de Dados (Slicers) e Filtros Interativos",
    "module": "Módulo 6: Tabelas, Interatividade e Filtros Dinâmicos",
    "duration": "26 min",
    "summary": "Aprenda a transformar filtros tradicionais em botões visuais interativos modernos com a Segmentação de Dados (Slicers) em Tabelas e Tabelas Dinâmicas, permitindo seleções múltiplas e layouts executivos.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/0zywbT1qHlY",
    "videoTitle": "Aula 15 - Segmentação de Dados - Excel do Básico ao Avançado",
    "videoHighlights": [
      "O que é uma Segmentação de Dados e sua superioridade sobre filtros convencionais",
      "Inserção de Slicers em Tabelas Oficiais e Tabelas Dinâmicas",
      "Configuração visual: estilos, quantidade de colunas, altura e largura dos botões",
      "Multisseleção com Ctrl e botão Limpar Filtros (Alt + C)"
    ],
    "theoryContent": {
      "introduction": "O filtro tradicional com a setinha cinza no cabeçalho da coluna é funcional, mas pouco atraente em apresentações executivas. A Segmentação de Dados (Slicer) substitui essa experiência por botões visuais interativos semelhantes aos de aplicativos modernos: ao clicar em um botão, toda a tabela ou dashboard é filtrada instantaneamente com transição suave.",
      "keyConcepts": [
        {
          "title": "O que é a Segmentação de Dados (Slicer)",
          "description": "Um componente visual flutuante composto por botões que representam os valores únicos de uma coluna da sua tabela (ex: nomes de cursos, cidades, status de matrículas ou anos)."
        },
        {
          "title": "Como Inserir Slicers",
          "description": "Selecione qualquer célula da sua Tabela Oficial (ou Tabela Dinâmica), vá na guia \"Inserir\" ou na guia \"Design da Tabela\" e clique em \"Inserir Segmentação de Dados\". Marque as colunas desejadas e clique em OK."
        },
        {
          "title": "Personalização do Layout dos Botões",
          "description": "Ao clicar no painel do segmentador, surge a guia \"Segmentação de Dados\". Nela você pode configurar a quantidade de colunas (transformando uma lista vertical em uma barra horizontal de botões elegantes) e escolher estilos de cores vibrantes ou discretas."
        },
        {
          "title": "Interatividade e Multisseleção",
          "description": "Clique em um botão para filtrar apenas aquele item. Segure a tecla Ctrl para selecionar mais de uma opção ao mesmo tempo. Use o botão no canto superior direito do segmentador para limpar todos os filtros."
        }
      ],
      "stepByStep": [
        "Certifique-se de que sua base de dados já está convertida em Tabela Oficial (Ctrl + Alt + T).",
        "Com a tabela selecionada, vá na guia \"Inserir\" -> \"Segmentação de Dados\".",
        "Marque as caixas \"Curso\" e \"Status\" e clique em OK.",
        "Posicione os dois painéis de segmentação lado a lado acima da tabela.",
        "Selecione a segmentação de \"Curso\", vá na guia superior Segmentação e altere o número de Colunas para 3 ou 4 para dispor os botões horizontalmente.",
        "Clique sobre o curso \"Informática\" e veja a tabela filtrar em tempo real!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + C",
          "action": "Limpa os filtros aplicados dentro da segmentação de dados selecionada"
        },
        {
          "keys": "Ctrl + Clique",
          "action": "Seleciona múltiplos botões na segmentação de dados"
        },
        {
          "keys": "Shift + Clique",
          "action": "Seleciona um intervalo contínuo de botões na segmentação"
        }
      ],
      "proTip": "Em dashboards corporativos, organize suas segmentações de dados no topo ou em uma coluna lateral esquerda, com botões bem dimensionados e cores coordenadas com o tema da sua planilha. Isso entrega uma experiência digna de software sob medida!",
      "commonErrors": "Tentar inserir Segmentação de Dados em um intervalo simples de células que não foi transformado previamente em Tabela Oficial ou em Tabela Dinâmica."
    },
    "quiz": [
      {
        "id": 1401,
        "question": "O que é a \"Segmentação de Dados\" (Slicer) no Microsoft Excel?",
        "options": [
          "Uma ferramenta para cortar a planilha em duas partes",
          "Um filtro visual interativo através de botões modernos que facilitam a filtragem de dados com um clique",
          "Uma função matemática para calcular raízes cúbicas",
          "Um vírus de computador"
        ],
        "correctIndex": 1,
        "explanation": "A Segmentação de Dados cria botões visuais intuitivos para filtrar dados com agilidade."
      },
      {
        "id": 1402,
        "question": "Em quais estruturas de dados do Excel a Segmentação de Dados pode ser inserida diretamente?",
        "options": [
          "Em qualquer célula de texto avulsa",
          "Apenas em planilhas salvas como PDF",
          "Apenas em gráficos 3D",
          "Em Tabelas Oficiais do Excel e em Tabelas Dinâmicas"
        ],
        "correctIndex": 3,
        "explanation": "Slicers operam nativamente sobre Tabelas Oficiais e Tabelas Dinâmicas."
      },
      {
        "id": 1403,
        "question": "Como selecionar dois ou mais botões simultaneamente em uma segmentação de dados?",
        "options": [
          "Segurando a tecla Ctrl enquanto clica nos botões desejados",
          "Pressionando a barra de espaço três vezes",
          "Dando um soco no teclado",
          "Fechando o Excel"
        ],
        "correctIndex": 0,
        "explanation": "A tecla Ctrl permite a multisseleção de filtros não adjacentes."
      },
      {
        "id": 1404,
        "question": "Como dispor os botões de uma segmentação de dados em formato horizontal em vez de uma coluna vertical comprida?",
        "options": [
          "Girar a tela do monitor",
          "Aumentar o zoom do navegador",
          "Na guia Segmentação, alterar o número de \"Colunas\" para 2, 3 ou mais",
          "Não é possível mudar a orientação dos botões"
        ],
        "correctIndex": 2,
        "explanation": "O ajuste de \"Colunas\" divide os botões em múltiplas colunas horizontais elegantes."
      },
      {
        "id": 1405,
        "question": "Qual atalho de teclado limpa os filtros da segmentação selecionada de volta para mostrar tudo?",
        "options": [
          "Ctrl + W",
          "Alt + C",
          "Shift + Del",
          "F2"
        ],
        "correctIndex": 1,
        "explanation": "Alt + C limpa instantaneamente a filtragem daquele segmentador ativo."
      },
      {
        "id": 1406,
        "question": "O que acontece visualmente com botões cujos dados não possuem nenhum registro correspondente devido a outro filtro ativo?",
        "options": [
          "Eles ficam desbotados (opacos/cinzas), indicando que não há itens disponíveis com aquela combinação",
          "Os botões explodem",
          "O Excel apaga os botões permanentemente",
          "O computador trava"
        ],
        "correctIndex": 0,
        "explanation": "A segmentação desbota visualmente opções que não possuem registros correspondentes na filtragem atual."
      },
      {
        "id": 1407,
        "question": "Onde fica localizado o botão \"Inserir Segmentação de Dados\" na Faixa de Opções?",
        "options": [
          "Na Guia Revisão",
          "Na Guia Ajuda",
          "Na Barra de Status",
          "Na Guia Inserir, grupo Filtros"
        ],
        "correctIndex": 3,
        "explanation": "Está situado na guia Inserir (no grupo Filtros) e também na guia contextual Design da Tabela."
      },
      {
        "id": 1408,
        "question": "É possível aplicar estilos de cores personalizados na segmentação para harmonizar com a empresa?",
        "options": [
          "Não, os botões só podem ser cinzas",
          "Apenas se você souber programar em C++",
          "Sim, através da galeria de Estilos de Segmentação de Dados na guia dedicada",
          "Apenas na versão paga para smartphones"
        ],
        "correctIndex": 2,
        "explanation": "A guia Segmentação oferece dezenas de estilos e permite criar temas de cores personalizados."
      },
      {
        "id": 1409,
        "question": "Para que serve o recurso \"Conexões de Relatório\" de uma Segmentação de Dados?",
        "options": [
          "Para conectar a mesma segmentação a múltiplas Tabelas Dinâmicas simultaneamente",
          "Para conectar a impressora ao Wi-Fi",
          "Para enviar relatórios por correio",
          "Para criar um gráfico de pizza"
        ],
        "correctIndex": 0,
        "explanation": "Conexões de Relatório vinculam um único conjunto de botões a vários relatórios e gráficos ao mesmo tempo."
      },
      {
        "id": 1410,
        "question": "Qual é o impacto de usar Segmentações de Dados na experiência de um gestor que analisa a planilha?",
        "options": [
          "Deixa o gestor confuso",
          "Torna a navegação rápida, amigável e acessível mesmo para quem não domina filtros avançados do Excel",
          "Impossibilita salvar o arquivo",
          "Aumenta o tamanho do arquivo em 10 Gigabytes"
        ],
        "correctIndex": 1,
        "explanation": "Slicers trazem usabilidade executiva de ponta e facilidade absoluta de análise gerencial."
      }
    ]
  },
  {
    "id": 15,
    "lessonNumber": 15,
    "title": "Aula 15: Gráficos Essenciais (Colunas, Barras, Linhas e Pizza)",
    "module": "Módulo 7: Visualização Gráfica de Dados",
    "duration": "28 min",
    "summary": "Aprenda os princípios da comunicação visual de dados: escolha o tipo ideal de gráfico (Colunas, Barras, Linhas e Pizza/Rosca), domine títulos, eixos, rótulos de dados e o atalho instantâneo Alt + F1.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/RFZN-Sacvdg",
    "videoTitle": "Aula 16 - Gráficos Parte 1 - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Princípios de storytelling e escolha do tipo de gráfico correto",
      "Gráficos de Colunas vs. Barras (quando usar cada um)",
      "Gráficos de Linhas para tendências no tempo e Gráficos de Pizza/Rosca para proporções",
      "Anatomia completa de um gráfico profissional e atalho instantâneo Alt + F1"
    ],
    "theoryContent": {
      "introduction": "Tabelas repletas de números são excelentes para armazenar informações, mas são lentas para tomada de decisão. Gráficos transformam esses dados em histórias visuais instantâneas. Aprender qual gráfico escolher para cada situação é a diferença entre um relatório que convence a diretoria e um que causa confusão.",
      "keyConcepts": [
        {
          "title": "Gráfico de Colunas vs. Barras",
          "description": "Gráfico de Colunas (vertical): ideal para comparar categorias distintas ou séries temporais curtas (meses). Gráfico de Barras (horizontal): indispensável quando os nomes das categorias são longos (ex: nomes de cursos técnicos ou departamentos) e para exibir rankings (do maior para o menor)."
        },
        {
          "title": "Gráfico de Linhas",
          "description": "Projetado especificamente para mostrar evolução e tendência contínua ao longo do tempo (dias, semanas, meses, trimestres ou anos)."
        },
        {
          "title": "Gráfico de Pizza ou Rosca",
          "description": "Mostra a relação entre as partes e um todo (100%). Regra de ouro corporativa: use apenas se houver no máximo 4 ou 5 categorias e quando as fatias tiverem diferenças expressivas de proporção."
        },
        {
          "title": "Anatomia do Gráfico",
          "description": "Título do Gráfico (objetivo e informativo), Eixos (Horizontal X e Vertical Y), Linhas de Grade (devem ser discretas), Rótulos de Dados (valores sobre as colunas) e Legenda."
        }
      ],
      "stepByStep": [
        "Selecione as colunas de \"Curso\" e \"Média de Notas\" da sua tabela.",
        "Pressione o atalho Alt + F1 para que o Excel gere instantaneamente um gráfico de colunas padrão na mesma planilha.",
        "Clique no título do gráfico e digite um título claro: \"Média de Desempenho por Curso - CETEP 2026\".",
        "Clique no botão verde de \"+\" no canto do gráfico (\"Elementos do Gráfico\") e ative \"Rótulos de Dados\".",
        "Clique com o botão direito sobre qualquer coluna e selecione \"Formatar Série de Dados\" para reduzir a \"Largura do Espaçamento\" para 80% a 100%, deixando as colunas mais elegantes e encorpadas."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + F1",
          "action": "Cria instantaneamente um gráfico de colunas padrão incorporado na planilha ativa"
        },
        {
          "keys": "F11",
          "action": "Cria instantaneamente um gráfico em uma nova aba exclusiva dedicada a gráficos"
        },
        {
          "keys": "Ctrl + 1 (com gráfico selecionado)",
          "action": "Abre o painel lateral completo \"Formatar Gráfico\""
        }
      ],
      "proTip": "Evite gráficos em 3D (tridimensionais com efeito de sombra)! O 3D distorce a percepção ótica das proporções das fatias e colunas, prejudicando a interpretação matemática correta dos dados pelo espectador.",
      "commonErrors": "Criar gráficos de pizza com 15 fatias minúsculas e cores parecidas, tornando impossível distinguir os dados sem esforço visual excessivo."
    },
    "quiz": [
      {
        "id": 1501,
        "question": "Qual atalho de teclado no Excel gera um gráfico de colunas padrão instantaneamente na planilha atual a partir dos dados selecionados?",
        "options": [
          "Ctrl + G",
          "F5",
          "Ctrl + Shift + G",
          "Alt + F1"
        ],
        "correctIndex": 3,
        "explanation": "O atalho Alt + F1 cria de forma instantânea um gráfico na mesma planilha."
      },
      {
        "id": 1502,
        "question": "O que acontece se você pressionar a tecla F11 com os dados da tabela selecionados?",
        "options": [
          "O Excel fecha o arquivo",
          "O gráfico é criado em uma nova aba de planilha dedicada exclusivamente a ele",
          "A tabela é impressa em papel",
          "O monitor entra em modo descanso"
        ],
        "correctIndex": 1,
        "explanation": "A tecla F11 gera o gráfico em uma aba própria de gráfico (Chart Sheet)."
      },
      {
        "id": 1503,
        "question": "Qual tipo de gráfico é o mais recomendado para demonstrar a evolução de notas ou faturamento ao longo dos 12 meses do ano?",
        "options": [
          "Gráfico de Pizza 3D",
          "Gráfico de Radar",
          "Gráfico de Linhas",
          "Gráfico de Dispersão pura"
        ],
        "correctIndex": 2,
        "explanation": "Gráficos de Linhas são os mais indicados para acompanhar continuidade e tendências no tempo."
      },
      {
        "id": 1504,
        "question": "Quando o Gráfico de Barras horizontais é preferível em relação ao de Colunas verticais?",
        "options": [
          "Quando os rótulos de texto das categorias são extensos (ex: nomes compridos de cursos) ou para rankings",
          "Apenas aos domingos",
          "Nunca, barras horizontais são proibidas",
          "Apenas para números negativos"
        ],
        "correctIndex": 0,
        "explanation": "Barras horizontais oferecem amplo espaço para a leitura linear de nomes extensos de categorias."
      },
      {
        "id": 1505,
        "question": "Qual é a boa prática recomendada para o uso de Gráficos de Pizza ou Rosca?",
        "options": [
          "Usar sempre com mais de 20 categorias",
          "Usar apenas efeito 3D inclinado",
          "Limitar o uso a no máximo 4 a 5 categorias para não poluir a compreensão do todo (100%)",
          "Colocar todas as fatias da mesma cor"
        ],
        "correctIndex": 2,
        "explanation": "Gráficos circulares só funcionam bem visualmente com poucas fatias e proporções contrastantes."
      },
      {
        "id": 1506,
        "question": "Para que servem os \"Rótulos de Dados\" em um gráfico?",
        "options": [
          "Para mudar o nome do arquivo",
          "Para criar links para a internet",
          "Para desenhar bordas na tela",
          "Para exibir o valor numérico exato no topo de cada coluna ou ponto do gráfico"
        ],
        "correctIndex": 3,
        "explanation": "Rótulos de dados mostram a grandeza exata diretamente sobre as barras, dispensando a leitura visual no eixo."
      },
      {
        "id": 1507,
        "question": "Por que profissionais de dados e finanças evitam gráficos com efeitos 3D (tridimensionais)?",
        "options": [
          "Porque o Excel cobra taxa extra por 3D",
          "Porque a perspectiva 3D distorce a percepção visual do tamanho real dos dados",
          "Porque não cabem na folha A4",
          "Porque não funcionam em computadores comuns"
        ],
        "correctIndex": 1,
        "explanation": "O ângulo de inclinação 3D engana o cérebro humano sobre as proporções reais dos dados."
      },
      {
        "id": 1508,
        "question": "Onde você clica para adicionar ou remover rapidamente elementos como Linhas de Grade, Legenda e Título no gráfico?",
        "options": [
          "No botão flutuante com o símbolo de \"+\" (Elementos do Gráfico) ao lado do gráfico selecionado",
          "Na Barra de Status",
          "No Painel de Controle do Windows",
          "No menu Ajuda"
        ],
        "correctIndex": 0,
        "explanation": "O botão de \"+\" permite ativar e desativar componentes do gráfico de forma prática."
      },
      {
        "id": 1509,
        "question": "O que o ajuste de \"Largura do Espaçamento\" faz nas propriedades de um Gráfico de Colunas?",
        "options": [
          "Muda a resolução do monitor",
          "Aumenta o tamanho da fonte do título",
          "Altera a velocidade do mouse",
          "Controla o espaço vazio entre uma coluna e outra, tornando as colunas mais largas ou mais finas"
        ],
        "correctIndex": 3,
        "explanation": "Reduzir a largura do espaçamento alarga as colunas, conferindo um visual corporativo moderno."
      },
      {
        "id": 1510,
        "question": "Se você alterar um número na tabela que alimenta o gráfico, o que acontece com a coluna correspondente no gráfico?",
        "options": [
          "O gráfico é deletado",
          "O usuário precisa recriar o gráfico do zero",
          "O gráfico atualiza sua altura imediatamente em tempo real",
          "Nada muda até o próximo ano"
        ],
        "correctIndex": 2,
        "explanation": "Gráficos do Excel são dinamicamente conectados às células de origem e se recalculam em tempo real."
      }
    ]
  },
  {
    "id": 16,
    "lessonNumber": 16,
    "title": "Aula 16: Gráficos Avançados (Combinação, Eixo Secundário e Sparklines)",
    "module": "Módulo 7: Visualização Gráfica de Dados",
    "duration": "29 min",
    "summary": "Aprenda a construir Gráficos Combinados (Colunas + Linhas com Eixo Secundário), Linhas de Tendência com projeções e Minigráficos (Sparklines) embutidos dentro de células individuais.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/ytgxP6amJhs",
    "videoTitle": "Aula 17 - Gráficos Parte 2 - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Gráficos Combinados (Combo Charts): Coluna e Linha juntos",
      "Configuração do Eixo Secundário para métricas de escalas distintas (R$ vs %)",
      "Minigráficos (Sparklines): tendências compactas direto na célula",
      "Linhas de Tendência e formatação avançada para relatórios gerenciais"
    ],
    "theoryContent": {
      "introduction": "Muitas análises de negócios envolvem comparar métricas com ordens de grandeza completamente distintas no mesmo período: por exemplo, comparar a Receita Bruta (na casa dos milhões de reais) com a Margem de Lucro (uma porcentagem entre 5% e 30%). Se colocados na mesma escala, o percentual parecerá uma linha colada no chão. A solução profissional para isso é o Gráfico Combinado com Eixo Secundário.",
      "keyConcepts": [
        {
          "title": "Gráfico Combinado (Misto)",
          "description": "Permite que diferentes séries de dados dentro do mesmo gráfico sejam representadas por tipos visuais diferentes: a série de faturamento é desenhada como Colunas agrupadas, enquanto a série de margem é desenhada como uma Linha com marcadores."
        },
        {
          "title": "Eixo Secundário",
          "description": "Um segundo eixo vertical posicionado no lado direito do gráfico. O eixo esquerdo mede a grandeza monetária (R$), enquanto o eixo direito mede a grandeza percentual (%), garantindo clareza visual para ambas as séries."
        },
        {
          "title": "Minigráficos (Sparklines)",
          "description": "Localizados na guia Inserir -> Minigráficos (Linha, Coluna, Ganhos/Perdas). São minúsculos gráficos desenhados inteiramente dentro de uma única célula da planilha, ideais para tabelas densas com acompanhamento mês a mês."
        },
        {
          "title": "Linha de Tendência (Trendline)",
          "description": "Uma reta ou curva analítica projetada sobre os pontos do gráfico (linear, exponencial ou polinomial) que indica a direção do crescimento ou queda dos dados ao longo do tempo."
        }
      ],
      "stepByStep": [
        "Selecione sua tabela com as colunas Mês, Vendas (R$) e Margem (%).",
        "Vá na guia \"Inserir\" -> \"Gráficos Recomendados\" -> aba \"Todos os Gráficos\" -> \"Combinação\".",
        "Para a série Vendas, selecione o tipo \"Coluna Agrupada\".",
        "Para a série Margem, selecione o tipo \"Linha\" e marque a caixa \"Eixo Secundário\". Clique em OK.",
        "Para adicionar minigráficos: selecione a célula ao lado da série temporal, vá em Inserir -> Minigráficos -> Linha, selecione o intervalo dos meses e tecle Enter."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + N + S + L",
          "action": "Atalho para inserir Minigráfico de Linha na célula"
        },
        {
          "keys": "Alt + N + S + C",
          "action": "Atalho para inserir Minigráfico de Coluna na célula"
        }
      ],
      "proTip": "Nos Minigráficos (Sparklines), ative a opção \"Ponto Alto\" e \"Ponto Baixo\" na guia Design do Minigráfico com cores contrastantes (ex: verde para o pico e vermelho para a queda). Isso entrega um resumo executivo instantâneo para quem bate o olho na tabela!",
      "commonErrors": "Esquecer de habilitar o Eixo Secundário em um gráfico misto, fazendo com que a série de porcentagem ou de valores pequenos fique achatada no valor zero na base do gráfico."
    },
    "quiz": [
      {
        "id": 1601,
        "question": "Quando é fundamental utilizar um \"Gráfico Combinado com Eixo Secundário\"?",
        "options": [
          "Quando comparamos duas métricas com grandezas ou escalas muito diferentes (como Valores em Reais e Taxas Percentuais)",
          "Apenas quando usamos computadores da Apple",
          "Quando a planilha tem mais de 100 abas",
          "Para desenhar plantas de casas"
        ],
        "correctIndex": 0,
        "explanation": "O eixo secundário permite que grandezas divergentes (ex: R$ 1.000.000 e 15%) convivam no mesmo gráfico sem achatamento."
      },
      {
        "id": 1602,
        "question": "Onde o Eixo Secundário é posicionado por padrão no gráfico do Excel?",
        "options": [
          "No topo horizontal",
          "No chão da planilha",
          "No lado direito vertical do gráfico",
          "No meio das colunas"
        ],
        "correctIndex": 2,
        "explanation": "O eixo principal fica na vertical esquerda e o eixo secundário na vertical direita."
      },
      {
        "id": 1603,
        "question": "O que são \"Minigráficos\" (Sparklines) no Excel?",
        "options": [
          "Gráficos para relógios de pulso",
          "Gráficos minúsculos que cabem inteiramente dentro de uma única célula da planilha",
          "Ícones decorativos sem dados reais",
          "Gráficos impressos em miniatura"
        ],
        "correctIndex": 1,
        "explanation": "Sparklines são gráficos compactos embutidos diretamente na célula que ilustram tendências sem ocupar espaço."
      },
      {
        "id": 1604,
        "question": "Em qual guia da Faixa de Opções encontramos as opções para inserir Minigráficos?",
        "options": [
          "Guia Exibir",
          "Guia Fórmulas",
          "Guia Arquivo",
          "Guia Inserir, grupo Minigráficos"
        ],
        "correctIndex": 3,
        "explanation": "Estão localizados na guia Inserir no grupo dedicado a Minigráficos."
      },
      {
        "id": 1605,
        "question": "Quais são os três tipos disponíveis de Minigráficos no Excel?",
        "options": [
          "Linha, Coluna e Ganhos/Perdas",
          "Pizza, Rosca e Pirâmide",
          "3D, 2D e Holograma",
          "Soma, Média e Contagem"
        ],
        "correctIndex": 0,
        "explanation": "Os três modelos nativos de sparklines são: Linha, Coluna e Ganhos/Perdas."
      },
      {
        "id": 1606,
        "question": "Qual recurso em Minigráficos permite destacar com cores especiais o melhor e o pior resultado do período?",
        "options": [
          "Pintar com o balde de tinta comum",
          "Marcar as opções \"Ponto Alto\" e \"Ponto Baixo\"",
          "Formatação Condicional de texto",
          "Não é possível destacar pontos"
        ],
        "correctIndex": 1,
        "explanation": "As caixas de seleção \"Ponto Alto\" e \"Ponto Baixo\" adicionam marcadores coloridos diferenciados."
      },
      {
        "id": 1607,
        "question": "O que uma \"Linha de Tendência\" (Trendline) adicionada a um gráfico de linhas demonstra?",
        "options": [
          "O nome do autor da planilha",
          "A data de expiração do software",
          "A trajetória geral e o padrão de direção histórica dos dados (se está subindo ou caindo)",
          "A velocidade da internet"
        ],
        "correctIndex": 2,
        "explanation": "A Linha de Tendência calcula matematicamente a inclinação média e a projeção dos dados."
      },
      {
        "id": 1608,
        "question": "Como se remove um Minigráfico de uma célula (já que a tecla Delete do teclado não o apaga)?",
        "options": [
          "Quebrar o computador",
          "Excluir a pasta de trabalho",
          "Reiniciar o roteador",
          "Clicar na guia Minigráfico -> botão \"Limpar\" -> Limpar Minigráficos Selecionados"
        ],
        "correctIndex": 3,
        "explanation": "Minigráficos são objetos gráficos embutidos e devem ser removidos pelo comando \"Limpar Minigráficos\"."
      },
      {
        "id": 1609,
        "question": "Em um gráfico combinado de Vendas e Margem, qual é a combinação visual mais clássica e recomendada?",
        "options": [
          "Ambos em Gráficos de Pizza",
          "Vendas em Colunas Agrupadas e Margem em Linha com marcadores no Eixo Secundário",
          "Vendas em círculos e Margem em triângulos",
          "Tudo em barras pretas"
        ],
        "correctIndex": 1,
        "explanation": "Colunas para volume e Linha para taxa percentual é o padrão internacional de visualização de dados."
      },
      {
        "id": 1610,
        "question": "Qual é o caminho no Excel para selecionar o tipo \"Combinação\" ao criar ou alterar um gráfico?",
        "options": [
          "Guia Inserir -> Gráficos Recomendados -> aba Todos os Gráficos -> Combinação",
          "Guia Exibir -> Zoom",
          "Guia Revisão -> Dicionário",
          "Guia Dados -> Filtro"
        ],
        "correctIndex": 0,
        "explanation": "Na janela \"Inserir Gráfico\", a última categoria da lista é \"Combinação\"."
      }
    ]
  }
];
