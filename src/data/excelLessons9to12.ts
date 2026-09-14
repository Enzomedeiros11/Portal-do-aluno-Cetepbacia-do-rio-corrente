import { ExcelLesson } from './excelTypes';

export const lessons9to12: ExcelLesson[] = [
  {
    "id": 9,
    "lessonNumber": 9,
    "title": "Aula 09: Estilos de Célula e Temas Corporativos",
    "module": "Módulo 5: Organização, Segurança e Limpeza de Dados",
    "duration": "23 min",
    "summary": "Aprenda a aplicar Estilos de Célula pré-definidos (Bom, Ruim, Neutro, Títulos, Ênfase), criar seus próprios estilos personalizados de marca e aplicar Temas do Excel para harmonia visual.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/UWJRaWE_WzM",
    "videoTitle": "Aula 10 - Estilo e Formatação de Célula - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Galeria de Estilos de Célula pré-configurados pelo Excel",
      "Criação e salvamento de novos Estilos de Célula personalizados",
      "Vantagens do uso de estilos para manutenção corporativa de relatórios",
      "Temas do Excel (cores, fontes e efeitos globais da planilha)"
    ],
    "theoryContent": {
      "introduction": "Em ambientes empresariais sérios, consistência visual é sinônimo de credibilidade. O recurso de Estilos de Célula permite salvar conjuntos completos de formatação (família de fontes, tamanho, cor de texto, cor de fundo, bordas e formato numérico) sob um único nome para reutilização com um só clique em qualquer parte da planilha.",
      "keyConcepts": [
        {
          "title": "Galeria de Estilos de Célula",
          "description": "Localizada na guia Página Inicial no grupo Estilo. Traz categorias prontas como: Bom/Ruim/Neutro (verde suave, vermelho claro, amarelo), Títulos e Cabeçalhos (Títulos 1 a 4 com linhas separadoras elegantes), Dados e Modelo (Célula de Entrada, Saída, Nota e Aviso)."
        },
        {
          "title": "Criação de Estilos Personalizados",
          "description": "Permite criar um estilo com as cores e tipografia da sua instituição ou empresa (como a identidade visual do CETEP). Se você alterar as características desse estilo mais tarde, TODAS as células da planilha vinculadas a ele serão atualizadas automaticamente!"
        },
        {
          "title": "Temas da Pasta de Trabalho",
          "description": "Acessível na guia Layout da Página -> Temas. Um tema define o trio: paleta de 12 cores coordenadas, fontes de cabeçalho e corpo e efeitos gráficos. Ao trocar o tema, toda a pasta de trabalho ganha uma nova roupagem estética harmônica sem quebrar contrastes."
        }
      ],
      "stepByStep": [
        "Selecione a linha de cabeçalhos de uma tabela de relatórios.",
        "Na guia Página Inicial, clique em \"Estilos de Célula\" e selecione \"Cabeçalho 3\" ou \"Ênfase 1\".",
        "Para criar um estilo próprio: formate uma célula com a cor e fonte desejadas, clique em Estilos de Célula -> \"Novo Estilo de Célula...\", dê o nome \"CETEP_Cabeçalho\" e salve.",
        "Selecione outras tabelas e aplique seu novo estilo com um clique.",
        "Vá até a guia Layout da Página -> Temas e experimente alternar entre diferentes paletas de cores."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + C + L + E",
          "action": "Abre diretamente a galeria de Estilos de Célula"
        },
        {
          "keys": "Alt + P + T",
          "action": "Abre a seleção de Temas na guia Layout da Página"
        }
      ],
      "proTip": "Se você gerencia relatórios financeiros mensais ou boletins acadêmicos recorrentes, criar estilos nomeados como \"Entrada de Dados\", \"Cálculo Automático\" e \"Total Geral\" ajuda os usuários a saberem exatamente onde podem digitar e onde não devem mexer.",
      "commonErrors": "Formatar cada célula manualmente célula por célula, o que demanda muito tempo e resulta em planilhas com tonalidades de cores ligeiramente diferentes e desordenadas."
    },
    "quiz": [
      {
        "id": 901,
        "question": "Qual é a principal vantagem de utilizar \"Estilos de Célula\" em vez de formatação manual avulsa?",
        "options": [
          "Deixa o computador mais rápido para navegar na internet",
          "Elimina a necessidade de digitar dados",
          "Garante padronização visual e permite atualizar todas as células do mesmo estilo de uma só vez",
          "Apenas muda o idioma para inglês"
        ],
        "correctIndex": 2,
        "explanation": "Os estilos padronizam o layout corporativo e facilitam alterações em lote com apenas um clique."
      },
      {
        "id": 902,
        "question": "Onde fica localizado o botão \"Estilos de Célula\" no Microsoft Excel?",
        "options": [
          "Na Guia Página Inicial, no grupo Estilo",
          "Na Guia Inserir",
          "Na Guia Dados",
          "Na Barra de Título"
        ],
        "correctIndex": 0,
        "explanation": "Fica no grupo Estilo da guia Página Inicial, ao lado de Formatação Condicional."
      },
      {
        "id": 903,
        "question": "Quais itens podem ser configurados e salvos dentro de um novo Estilo de Célula personalizado?",
        "options": [
          "Apenas a cor da fonte",
          "Apenas o tamanho da célula",
          "Apenas o endereço de e-mail",
          "Número, Alinhamento, Fonte, Borda, Preenchimento e Proteção"
        ],
        "correctIndex": 3,
        "explanation": "Um estilo pode conter todas as dimensões de formatação da caixa Formatar Células."
      },
      {
        "id": 904,
        "question": "Qual categoria pré-definida de estilos é ideal para sinalizar status como aprovado, reprovado ou alerta?",
        "options": [
          "Hiperlink",
          "Bom, Ruim e Neutro",
          "Vírgula [0]",
          "Texto de Ajuda"
        ],
        "correctIndex": 1,
        "explanation": "A categoria \"Bom, Ruim e Neutro\" oferece formatações elegantes prontas em tons de verde, vermelho e amarelo."
      },
      {
        "id": 905,
        "question": "Em qual guia do Excel você encontra a ferramenta de \"Temas\" para alterar paletas de cores globais?",
        "options": [
          "Revisão",
          "Desenvolvedor",
          "Ajuda",
          "Layout da Página"
        ],
        "correctIndex": 3,
        "explanation": "A ferramenta Temas está localizada na guia Layout da Página."
      },
      {
        "id": 906,
        "question": "O que acontece com os gráficos e tabelas da planilha quando você altera o \"Tema\" da pasta de trabalho?",
        "options": [
          "Eles são apagados",
          "O Excel pede uma senha",
          "As cores e fontes de todos os elementos que usam cores de tema se adaptam à nova paleta harmoniosa",
          "O arquivo é compactado em formato zip"
        ],
        "correctIndex": 2,
        "explanation": "Elementos que utilizam paletas de tema mudam automaticamente suas cores para combinar com o novo tema."
      },
      {
        "id": 907,
        "question": "Se você modificar a definição de um estilo personalizado chamado \"Meu_Estilo\", o que ocorrerá nas células que o utilizam?",
        "options": [
          "Todas as células já formatadas com aquele estilo refletirão a alteração instantaneamente",
          "Nada, a alteração só vale para células futuras",
          "A planilha apresentará o erro #REF!",
          "O estilo será excluído"
        ],
        "correctIndex": 0,
        "explanation": "O Excel atualiza de imediato todas as células associadas àquele estilo modificado."
      },
      {
        "id": 908,
        "question": "Qual é a função do estilo pré-configurado \"Célula de Entrada\" (Input Cell)?",
        "options": [
          "Conectar um microfone à planilha",
          "Indicar visualmente ao usuário que aquela célula é destinada ao preenchimento manual de dados",
          "Bloquear a digitação",
          "Enviar um e-mail com os dados"
        ],
        "correctIndex": 1,
        "explanation": "Serve como sinalização ergonômica de que o usuário deve preencher ou alterar aquele campo."
      },
      {
        "id": 909,
        "question": "Como se pode mesclar estilos de outra pasta de trabalho para a pasta atual?",
        "options": [
          "Copiando o arquivo pelo Windows Explorer",
          "Enviando por WhatsApp",
          "Pela opção \"Mesclar Estilos...\" no menu de Estilos de Célula",
          "Não é possível mesclar estilos entre arquivos"
        ],
        "correctIndex": 2,
        "explanation": "A opção \"Mesclar Estilos...\" importa os estilos criados em outra pasta de trabalho aberta."
      },
      {
        "id": 910,
        "question": "Por que o uso de paletas de cores sóbrias e estilos consistentes é recomendado no mercado profissional?",
        "options": [
          "Para economizar a bateria do monitor",
          "Porque o Excel não aceita mais de 3 cores",
          "Porque é uma lei trabalhista",
          "Porque melhora a legibilidade executiva, reduz fadiga visual e transmite profissionalismo aos relatórios"
        ],
        "correctIndex": 3,
        "explanation": "Planilhas bem estruturadas esteticamente transmitem credibilidade e agilizam a interpretação de dados."
      }
    ]
  },
  {
    "id": 10,
    "lessonNumber": 10,
    "title": "Aula 10: Proteção de Células, Planilhas e Pastas de Trabalho",
    "module": "Módulo 5: Organização, Segurança e Limpeza de Dados",
    "duration": "25 min",
    "summary": "Aprenda a proteger suas planilhas contra alterações indevidas, desbloquear apenas células de preenchimento, proteger fórmulas confidenciais com senha e resguardar a estrutura de abas.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/GLft0tZ86NM",
    "videoTitle": "Aula 11 - Proteger Pasta de Trabalho - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Propriedades de Célula: status \"Bloqueada\" vs \"Oculta\"",
      "Processo correto em 2 etapas: desbloquear células de entrada antes de proteger",
      "Proteção da Planilha com senha e controle de permissões do usuário",
      "Proteção da Pasta de Trabalho para impedir criação, exclusão ou renomeação de abas"
    ],
    "theoryContent": {
      "introduction": "Ao compartilhar uma planilha com colegas de equipe, alunos ou clientes, o maior medo de quem a desenvolveu é ter suas fórmulas complexas apagadas ou alteradas por engano. O Excel possui um sistema de segurança robusto que permite determinar exatamente quais células podem ser editadas e quais devem permanecer intocáveis.",
      "keyConcepts": [
        {
          "title": "Como funciona o Bloqueio de Células",
          "description": "Por padrão de fábrica, TODAS as células do Excel já vêm com a propriedade \"Bloqueada\" marcada. No entanto, esse bloqueio só tem efeito prático no momento em que você ativa o comando \"Proteger Planilha\" na guia Revisão."
        },
        {
          "title": "O Método em 2 Etapas",
          "description": "Etapa 1: Selecione apenas as células onde os outros usuários DEVEM digitar dados, pressione Ctrl + 1, vá na aba Proteção e DESMARQUE a caixa \"Bloqueada\". Etapa 2: Vá na guia Revisão e clique em \"Proteger Planilha\", definindo uma senha opcional."
        },
        {
          "title": "Ocultar Fórmulas Confidenciais",
          "description": "Ao marcar a opção \"Oculta\" na aba Proteção (Ctrl + 1) e proteger a planilha, a Barra de Fórmulas não exibirá o cálculo, mostrando apenas o valor resultante ao usuário final."
        },
        {
          "title": "Proteger Estrutura da Pasta de Trabalho",
          "description": "Impede que usuários excluam abas importantes, adicionem novas abas, renomeiem ou alterem a ordem das planilhas na barra inferior."
        }
      ],
      "stepByStep": [
        "Selecione as células que receberão as notas dos alunos (ex: B2:B30).",
        "Pressione Ctrl + 1, clique na aba \"Proteção\" e desmarque a caixa \"Bloqueada\". Clique em OK.",
        "Vá até a guia \"Revisão\" e clique em \"Proteger Planilha\".",
        "Defina uma senha (ou deixe em branco para proteção simples) e marque o que os usuários podem fazer.",
        "Clique em OK. Tente clicar em uma célula com fórmula e veja o Excel bloquear a edição com uma mensagem de segurança!"
      ],
      "keyboardShortcuts": [
        {
          "keys": "Ctrl + 1 -> Alt + P",
          "action": "Abre a aba de Proteção dentro da janela Formatar Células"
        },
        {
          "keys": "Alt + R + P + S",
          "action": "Atalho para Proteger Planilha na guia Revisão"
        },
        {
          "keys": "Alt + R + P + W",
          "action": "Atalho para Proteger Pasta de Trabalho na guia Revisão"
        }
      ],
      "proTip": "Guarde suas senhas de proteção em um gerenciador seguro. Se você esquecer a senha de uma planilha protegida no Excel, a Microsoft não oferece mecanismo nativo de recuperação de senha!",
      "commonErrors": "Clicar em \"Proteger Planilha\" sem antes desbloquear as células de digitação. O resultado é que a planilha inteira ficará congelada e ninguém conseguirá preencher nada."
    },
    "quiz": [
      {
        "id": 1001,
        "question": "Qual é o primeiro passo obrigatório para permitir que outras pessoas preencham apenas certos campos em uma planilha protegida?",
        "options": [
          "Excluir a guia Revisão",
          "Selecionar as células de digitação, abrir Formatar Células (Ctrl + 1) e DESMARCAR a opção \"Bloqueada\"",
          "Digitar uma senha em todas as células",
          "Salvar o arquivo como PDF"
        ],
        "correctIndex": 1,
        "explanation": "É preciso primeiro desmarcar a propriedade \"Bloqueada\" nas células que poderão ser editadas."
      },
      {
        "id": 1002,
        "question": "Em qual guia da Faixa de Opções ficam os comandos \"Proteger Planilha\" e \"Proteger Pasta de Trabalho\"?",
        "options": [
          "Guia Inserir",
          "Guia Ajuda",
          "Guia Exibir",
          "Guia Revisão"
        ],
        "correctIndex": 3,
        "explanation": "Todas as ferramentas de proteção e segurança estão situadas na guia Revisão."
      },
      {
        "id": 1003,
        "question": "Por que o bloqueio de uma célula não funciona se você apenas marcar \"Bloqueada\" sem ir na guia Revisão?",
        "options": [
          "Porque a propriedade de bloqueio só se torna ativa após acionar o comando \"Proteger Planilha\"",
          "Porque é necessário reiniciar o computador",
          "Porque é preciso pagar uma assinatura extra",
          "Porque o Excel tem um defeito"
        ],
        "correctIndex": 0,
        "explanation": "A propriedade \"Bloqueada\" só entra em vigor efetivo quando a proteção da planilha é ativada."
      },
      {
        "id": 1004,
        "question": "Qual é o efeito de proteger a \"Pasta de Trabalho\" (em vez de apenas a planilha)?",
        "options": [
          "Impede que o arquivo seja aberto sem internet",
          "Apaga todas as imagens",
          "Protege a estrutura das abas, impedindo adicionar, excluir, renomear ou mover planilhas",
          "Bloqueia o mouse"
        ],
        "correctIndex": 2,
        "explanation": "A proteção de pasta de trabalho resguarda a estrutura (criação, exclusão e renomeação de abas)."
      },
      {
        "id": 1005,
        "question": "O que a opção \"Oculta\" (na aba Proteção de Formatar Células) faz quando a planilha está protegida?",
        "options": [
          "Faz a célula inteira sumir da tela",
          "Impede que a fórmula seja visualizada na Barra de Fórmulas, exibindo apenas o resultado na célula",
          "Muda a cor do texto para branco",
          "Oculta a linha inteira"
        ],
        "correctIndex": 1,
        "explanation": "A opção \"Oculta\" esconde o texto da fórmula na Barra de Fórmulas para proteger a propriedade intelectual do cálculo."
      },
      {
        "id": 1006,
        "question": "O que o Excel exibe quando um usuário tenta editar uma célula bloqueada em uma planilha protegida?",
        "options": [
          "Um aviso informando que a célula está protegida e que para fazer alterações é preciso desproteger a planilha",
          "Uma tela azul com erro fatal",
          "Ele apaga o arquivo",
          "Ele toca um som estridente e trava o computador"
        ],
        "correctIndex": 0,
        "explanation": "O Excel exibe uma caixa de diálogo informativa de que a célula está em modo de leitura protegida."
      },
      {
        "id": 1007,
        "question": "A definição de uma senha para proteger a planilha no Excel é obrigatória ou opcional?",
        "options": [
          "Obrigatória (mínimo de 10 caracteres)",
          "Obrigatória apenas para alunos do CETEP",
          "Proibida pela Microsoft",
          "Opcional (se deixada em branco, qualquer um pode desproteger com um clique)"
        ],
        "correctIndex": 3,
        "explanation": "A senha é opcional; sem senha, a proteção serve como barreira de segurança contra cliques acidentais."
      },
      {
        "id": 1008,
        "question": "Como se chama o recurso que permite que diferentes usuários editem intervalos específicos mediante senhas individuais?",
        "options": [
          "Filtro por Senha",
          "Macro de Permissão",
          "Permitir Edição de Intervalos",
          "Divisão de Colunas"
        ],
        "correctIndex": 2,
        "explanation": "O recurso \"Permitir Edição de Intervalos\" na guia Revisão concede acessos diferenciados por área."
      },
      {
        "id": 1009,
        "question": "Como desproteger uma planilha que foi previamente protegida sem senha?",
        "options": [
          "Clicar novamente em \"Desproteger Planilha\" na guia Revisão",
          "Reiniciar o Excel",
          "Excluir o arquivo",
          "Pressionar Ctrl + Alt + Del"
        ],
        "correctIndex": 0,
        "explanation": "Basta clicar no botão \"Desproteger Planilha\" na guia Revisão."
      },
      {
        "id": 1010,
        "question": "Qual boa prática é recomendada antes de enviar uma planilha modelo para preenchimento de terceiros?",
        "options": [
          "Bloquear tudo sem deixar nenhuma célula de entrada",
          "Colorir as células desbloqueadas com um tom suave específico e testar o preenchimento antes de enviar",
          "Apagar todas as fórmulas",
          "Salvar como imagem JPEG"
        ],
        "correctIndex": 1,
        "explanation": "Identificar visualmente os campos desbloqueados e simular o preenchimento garante excelente usabilidade."
      }
    ]
  },
  {
    "id": 11,
    "lessonNumber": 11,
    "title": "Aula 11: Texto para Colunas, Remoção de Duplicatas e Classificação",
    "module": "Módulo 5: Organização, Segurança e Limpeza de Dados",
    "duration": "27 min",
    "summary": "Aprenda a higienizar bases de dados com o Assistente de Texto para Colunas (delimitadores e largura fixa), eliminar registros repetidos com Remover Duplicadas e ordenar dados em múltiplos níveis.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/N3qfZio0AUw",
    "videoTitle": "Aula 12 - Texto para Coluna, Remoção de Duplicidade, Classificação - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Assistente de Texto para Colunas com Delimitadores (vírgula, ponto e vírgula, espaço)",
      "Texto para Colunas por Largura Fixa de caracteres",
      "Remoção instantânea de registros duplicados com critério multi-colunas",
      "Classificação personalizada em múltiplos níveis (Ex: Curso e depois Aluno)"
    ],
    "theoryContent": {
      "introduction": "Bases de dados extraídas de sistemas em arquivos .csv ou .txt muitas vezes vêm com todas as informações compactadas em uma única coluna (\"Nome;Idade;Curso;Nota\"). A ferramenta Texto para Colunas separa esses dados em colunas individuais organizadas em segundos. Junto a isso, a remoção de duplicatas e a classificação em múltiplos níveis garantem a integridade da base.",
      "keyConcepts": [
        {
          "title": "Texto para Colunas: Delimitado",
          "description": "Divide o conteúdo de uma célula sempre que encontra um caractere especial separador, como Tabulação, Ponto e Vírgula, Vírgula, Espaço ou um caractere personalizado (como hífen ou barra)."
        },
        {
          "title": "Texto para Colunas: Largura Fixa",
          "description": "Utilizado quando o texto não possui caracteres separadores, mas cada campo possui uma quantidade exata e fixa de caracteres (ex: os 11 primeiros dígitos são CPF, os 8 seguintes são data)."
        },
        {
          "title": "Remover Duplicadas",
          "description": "Localizado na guia Dados. Permite comparar uma ou mais colunas para identificar e apagar linhas com registros idênticos, mantendo apenas a primeira ocorrência do dado."
        },
        {
          "title": "Classificação Avançada (Multinível)",
          "description": "Permite ordenar uma tabela por mais de um critério hierárquico. Por exemplo: ordenar primeiro por \"Curso\" (de A a Z) e, para os alunos do mesmo curso, ordenar por \"Nota Final\" (do Maior para o Menor)."
        }
      ],
      "stepByStep": [
        "Selecione a coluna que contém os textos agrupados (ex: A1:A100).",
        "Vá na guia \"Dados\" e clique em \"Texto para Colunas\".",
        "Escolha a opção \"Delimitado\" e clique em Avançar. Marque o delimitador correto (ex: Ponto e vírgula). Observe a prévia dos dados e clique em Concluir.",
        "Selecione a tabela recém-organizada e clique no botão \"Remover Duplicadas\" na guia Dados. Selecione as colunas-chave e clique em OK.",
        "Clique no botão \"Classificar\" na guia Dados, adicione o primeiro nível por \"Curso\" e adicione um segundo nível por \"Nome do Aluno\"."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + D + E",
          "action": "Abre diretamente o assistente de Texto para Colunas"
        },
        {
          "keys": "Alt + D + M",
          "action": "Abre a ferramenta de Remover Duplicadas na guia Dados"
        },
        {
          "keys": "Alt + D + S",
          "action": "Abre a janela detalhada de Classificação Avançada"
        }
      ],
      "proTip": "Antes de executar o \"Texto para Colunas\", certifique-se de que existem colunas vazias à direita da coluna original! Se houver colunas com dados existentes à direita, o assistente do Excel irá sobrescrevê-los.",
      "commonErrors": "Fazer classificação simples sem selecionar todas as colunas da tabela ou esquecer de marcar a opção \"Meus dados possuem cabeçalhos\", o que faz os títulos das colunas serem misturados aos dados."
    },
    "quiz": [
      {
        "id": 1101,
        "question": "Qual é o objetivo principal da ferramenta \"Texto para Colunas\" no Excel?",
        "options": [
          "Traduzir textos do português para o inglês",
          "Transformar letras maiúsculas em minúsculas",
          "Imprimir o documento em duas vias",
          "Dividir o conteúdo de uma única coluna em várias colunas com base em delimitadores ou largura fixa"
        ],
        "correctIndex": 3,
        "explanation": "Texto para Colunas fragmenta textos agrupados em colunas individuais organizadas."
      },
      {
        "id": 1102,
        "question": "Quais são os dois métodos oferecidos pelo assistente de Texto para Colunas?",
        "options": [
          "Rápido e Lento",
          "Delimitado e Largura Fixa",
          "Numérico e Alfabético",
          "Manual e Automático"
        ],
        "correctIndex": 1,
        "explanation": "Os dois métodos fundamentais são: Delimitado (por símbolos) e Largura Fixa (por posição dos caracteres)."
      },
      {
        "id": 1103,
        "question": "Se um texto está agrupado como \"Maria,22,Informática,9.5\", qual delimitador deve ser marcado?",
        "options": [
          "Espaço",
          "Ponto e Vírgula",
          "Vírgula",
          "Tabulação"
        ],
        "correctIndex": 2,
        "explanation": "O caractere que divide as informações no exemplo é a vírgula."
      },
      {
        "id": 1104,
        "question": "O que pode acontecer se você usar Texto para Colunas sem deixar colunas em branco à direita?",
        "options": [
          "Os dados já existentes nas colunas adjacentes à direita podem ser sobrescritos e perdidos",
          "O computador desliga",
          "O Excel cobra uma taxa",
          "O arquivo é protegido com senha"
        ],
        "correctIndex": 0,
        "explanation": "O Excel avisa que há dados à direita e que eles serão substituídos se você confirmar."
      },
      {
        "id": 1105,
        "question": "Onde está localizado o botão \"Remover Duplicadas\" no Excel?",
        "options": [
          "Na Guia Arquivo",
          "Na Barra de Status",
          "Na Guia Dados, no grupo Ferramentas de Dados",
          "Na Guia Fórmulas"
        ],
        "correctIndex": 2,
        "explanation": "Fica no grupo Ferramentas de Dados da guia Dados."
      },
      {
        "id": 1106,
        "question": "O que o recurso \"Remover Duplicadas\" faz quando encontra duas linhas com dados exatamente idênticos?",
        "options": [
          "Exclui ambas as linhas",
          "Pinta as linhas de vermelho",
          "Cria um gráfico de pizza",
          "Mantém a primeira ocorrência da linha e exclui permanentemente as repetições seguintes"
        ],
        "correctIndex": 3,
        "explanation": "Ele preserva o primeiro registro encontrado e remove todas as ocorrências duplicadas subsequentes."
      },
      {
        "id": 1107,
        "question": "Para que serve a opção \"Meus dados possuem cabeçalhos\" na janela de Classificação?",
        "options": [
          "Para mudar o nome da planilha",
          "Para que a primeira linha de títulos não seja classificada no meio dos dados dos alunos",
          "Para inserir logotipos automaticamente",
          "Para calcular juros"
        ],
        "correctIndex": 1,
        "explanation": "Garante que os títulos das colunas permaneçam no topo e não sejam ordenados como se fossem registros comuns."
      },
      {
        "id": 1108,
        "question": "O que é uma \"Classificação em Múltiplos Níveis\"?",
        "options": [
          "Ordenar dados por mais de uma coluna hierarquicamente (ex: primeiro por Cidade e depois por Nome)",
          "Classificar em 3 computadores diferentes",
          "Fazer cálculos matemáticos triplos",
          "Usar fontes coloridas"
        ],
        "correctIndex": 0,
        "explanation": "Permite definir uma ordem primária e critérios secundários de desempate."
      },
      {
        "id": 1109,
        "question": "Qual é o atalho rápido para abrir a ferramenta de Texto para Colunas?",
        "options": [
          "Ctrl + Shift + P",
          "F1",
          "Ctrl + N",
          "Alt + D + E"
        ],
        "correctIndex": 3,
        "explanation": "A sequência Alt + D + E aciona diretamente o assistente de Texto para Colunas."
      },
      {
        "id": 1110,
        "question": "Após remover duplicadas de uma base com 100 linhas onde 10 estavam repetidas, quantas linhas restarão?",
        "options": [
          "100 linhas",
          "10 linhas",
          "90 linhas",
          "80 linhas"
        ],
        "correctIndex": 2,
        "explanation": "Restarão 90 registros únicos (100 originais menos as 10 duplicadas excluídas)."
      }
    ]
  },
  {
    "id": 12,
    "lessonNumber": 12,
    "title": "Aula 12: Validação de Dados e Listas Suspensas",
    "module": "Módulo 6: Tabelas, Interatividade e Filtros Dinâmicos",
    "duration": "26 min",
    "summary": "Aprenda a restringir entradas incorretas no Excel criando listas suspensas (drop-down), validações de números inteiros, datas, comprimento de texto e personalização de mensagens e alertas de erro.",
    "videoUrl": "https://www.youtube-nocookie.com/embed/NHlvY9OCobw",
    "videoTitle": "Aula 13 - Validação de Dados - Excel do Básico ao Avançado",
    "videoHighlights": [
      "Criação de Listas Suspensas (menus drop-down) em células",
      "Restrições numéricas, intervalos de datas e limite de tamanho de texto",
      "Mensagens de Entrada informativas ao selecionar a célula",
      "Configuração de Alertas de Erro: Parar, Aviso e Informações"
    ],
    "theoryContent": {
      "introduction": "O ditado mais famoso da computação afirma: \"Entra lixo, sai lixo\". Se um usuário digitar \"Informática\" com erro ortográfico, suas fórmulas de SOMASE e relatórios falharão. A Validação de Dados é o mecanismo definitivo para garantir que os usuários só consigam inserir dados válidos, padronizados e dentro dos limites estipulados.",
      "keyConcepts": [
        {
          "title": "Validação por Lista (Menu Suspenso / Dropdown)",
          "description": "Exibe uma setinha na célula onde o usuário clica e escolhe uma opção pré-cadastrada (ex: \"Administração; Informática; Eletrotécnica; Enfermagem\" ou um intervalo =$Z$1:$Z$10)."
        },
        {
          "title": "Validação Numérica e de Datas",
          "description": "Restringe valores para que aceitem apenas Números Inteiros entre 0 e 10 (ex: notas escolares), Decimais ou datas dentro de um período vigente."
        },
        {
          "title": "Comprimento do Texto",
          "description": "Obriga o usuário a digitar uma quantidade exata ou máxima de caracteres (por exemplo, exigir exatamente 11 dígitos numéricos para o campo de CPF)."
        },
        {
          "title": "Alertas de Erro (Estilos)",
          "description": "Parar (ícone vermelho X: impede totalmente a digitação do valor inválido), Aviso (triângulo amarelo: avisa mas permite continuar) e Informações (balão azul: apenas notifica)."
        }
      ],
      "stepByStep": [
        "Selecione as células da coluna \"Curso\" (ex: C2:C50).",
        "Vá na guia \"Dados\" e clique em \"Validação de Dados\".",
        "Na aba Configurações, no campo \"Permitir\", escolha a opção \"Lista\".",
        "No campo \"Fonte\", digite: Informática;Administração;Eletrotécnica;Enfermagem (ou selecione o intervalo de uma tabela de apoio).",
        "Na aba \"Alerta de Erro\", digite o título \"Curso Inválido\" e a mensagem \"Por favor, selecione um curso oficial da lista suspensa\". Clique em OK."
      ],
      "keyboardShortcuts": [
        {
          "keys": "Alt + D + L",
          "action": "Abre diretamente a caixa de diálogo de Validação de Dados"
        },
        {
          "keys": "Alt + Seta Abaixo",
          "action": "Abre a lista suspensa da célula ativa pelo teclado"
        }
      ],
      "proTip": "Para criar uma lista suspensa com opções que crescem dinamicamente conforme novos itens são adicionados, coloque a lista de apoio dentro de uma Tabela Oficial do Excel (Ctrl + Alt + T) e use o intervalo dela na validação!",
      "commonErrors": "Separar os itens da lista suspensa por vírgula em computadores configurados no padrão brasileiro, onde o separador obrigatório é o ponto e vírgula (;)."
    },
    "quiz": [
      {
        "id": 1201,
        "question": "Qual é a finalidade do recurso de \"Validação de Dados\" no Excel?",
        "options": [
          "Definir regras que restringem o tipo e o intervalo de dados que os usuários podem digitar nas células",
          "Validar a licença do Office na internet",
          "Excluir planilhas antigas",
          "Fazer backup do computador"
        ],
        "correctIndex": 0,
        "explanation": "A Validação de Dados impede a inserção de valores inválidos ou fora de padrão nas células."
      },
      {
        "id": 1202,
        "question": "Qual tipo de validação cria uma pequena seta para escolha em um menu suspenso (drop-down) na célula?",
        "options": [
          "Validação por Data",
          "Comprimento do Texto",
          "Validação por Lista",
          "Personalizado"
        ],
        "correctIndex": 2,
        "explanation": "A opção \"Lista\" gera a lista suspensa com itens pré-determinados."
      },
      {
        "id": 1203,
        "question": "No Excel em português do Brasil, qual caractere deve separar os itens digitados manualmente no campo \"Fonte\" da lista suspensa?",
        "options": [
          "Vírgula (,)",
          "Ponto e vírgula (;)",
          "Barra (/)",
          "Hífen (-)"
        ],
        "correctIndex": 1,
        "explanation": "No padrão brasileiro, utiliza-se ponto e vírgula (;) para separar os itens da lista."
      },
      {
        "id": 1204,
        "question": "Qual estilo de Alerta de Erro IMPEDE terminantemente que o usuário insira um dado inválido na célula?",
        "options": [
          "Aviso (triângulo amarelo)",
          "Informações (círculo azul com i)",
          "Nenhum",
          "Parar (ícone vermelho com X)"
        ],
        "correctIndex": 3,
        "explanation": "O estilo \"Parar\" bloqueia a confirmação do dado, forçando o usuário a corrigir ou cancelar."
      },
      {
        "id": 1205,
        "question": "Qual atalho de teclado abre o menu da lista suspensa diretamente na célula sem precisar do mouse?",
        "options": [
          "Alt + Seta Abaixo",
          "Ctrl + L",
          "Shift + Enter",
          "F4"
        ],
        "correctIndex": 0,
        "explanation": "Alt + Seta Abaixo expande as opções da lista suspensa instantaneamente."
      },
      {
        "id": 1206,
        "question": "Para garantir que uma nota escolar seja cadastrada apenas entre 0 e 10, qual critério de validação deve ser usado?",
        "options": [
          "Comprimento do texto igual a 10",
          "Número Inteiro ou Decimal -> Está entre: mínimo 0 e máximo 10",
          "Hora válida",
          "Lista vazia"
        ],
        "correctIndex": 1,
        "explanation": "A validação por número decimal com critério \"está entre 0 e 10\" restringe perfeitamente a escala de notas."
      },
      {
        "id": 1207,
        "question": "Para que serve a \"Mensagem de Entrada\" na Validação de Dados?",
        "options": [
          "Para tocar uma música de boas-vindas",
          "Para mandar uma notificação por e-mail",
          "Para exibir uma dica flutuante orientando o usuário sobre o que digitar assim que ele seleciona a célula",
          "Para salvar o arquivo automaticamente"
        ],
        "correctIndex": 2,
        "explanation": "A Mensagem de Entrada atua como uma instrução de auxílio para o preenchimento."
      },
      {
        "id": 1208,
        "question": "Como aplicar a validação para que um campo de CPF exija exatamente 11 caracteres digitados?",
        "options": [
          "Permitir: Lista -> CPF",
          "Permitir: Hora -> 11:00",
          "Não é possível validar tamanho de texto",
          "Permitir: Comprimento do texto -> é igual a: 11"
        ],
        "correctIndex": 3,
        "explanation": "A regra de Comprimento do Texto com valor fixo 11 valida o número de dígitos digitados."
      },
      {
        "id": 1209,
        "question": "Onde se localiza o botão \"Validação de Dados\" na Faixa de Opções?",
        "options": [
          "Guia Inserir",
          "Guia Dados",
          "Guia Layout da Página",
          "Guia Exibir"
        ],
        "correctIndex": 1,
        "explanation": "Está situado no grupo Ferramentas de Dados da guia Dados."
      },
      {
        "id": 1210,
        "question": "Qual recurso dentro de Validação de Dados circula em vermelho todas as células que contenham dados inválidos que já haviam sido digitados anteriormente?",
        "options": [
          "Circular Dados Inválidos",
          "Pintar Erros",
          "Borracha Condicional",
          "Destacar Fórmulas"
        ],
        "correctIndex": 0,
        "explanation": "A opção \"Circular Dados Inválidos\" desenha ovais vermelhas sobre células que violam a regra definida."
      }
    ]
  }
];
