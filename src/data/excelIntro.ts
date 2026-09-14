export interface ExcelIntroData {
  title: string;
  videoUrl: string;
  videoId: string;
  duration: string;
  author: string;
  summary: string;
  highlights: string[];
  keyTopics: {
    title: string;
    description: string;
  }[];
  studyTips: string[];
}

export const excelIntroData: ExcelIntroData = {
  title: 'Introdução ao Curso: O que é o Excel e Fundamentos das Planilhas',
  videoUrl: 'https://www.youtube-nocookie.com/embed/qu2QBEMs1j4',
  videoId: 'qu2QBEMs1j4',
  duration: '15 min',
  author: 'Prime Cursos do Brasil',
  summary: 'Seja muito bem-vindo ao Curso Completo de Excel do CETEP! Nesta aula inaugural de introdução, você entenderá o que é o Microsoft Excel, sua evolução histórica, porque ele se tornou o software mais exigido no mercado de trabalho global e como funciona a estrutura fundamental de pastas de trabalho e planilhas.',
  highlights: [
    'O que é o Microsoft Excel e sua relevância no ambiente profissional',
    'Conceitos basilares: Pastas de trabalho, planilhas, colunas, linhas e células',
    'Aplicações práticas: finanças, controle de estoques, notas acadêmicas e relatórios',
    'Dicas essenciais para aproveitar 100% as 20 aulas do curso'
  ],
  keyTopics: [
    {
      title: 'O que é uma Planilha Eletrônica?',
      description: 'Uma planilha eletrônica é uma folha digital de cálculo estruturada em uma grade ortogonal composta por colunas verticais e linhas horizontais, permitindo a inserção, manipulação, cálculo matemático automatizado e visualização gráfica de grandes volumes de dados.'
    },
    {
      title: 'Por que dominar o Excel é indispensável?',
      description: 'Mais de 80% das empresas do mundo utilizam o Excel diariamente em setores financeiros, contábeis, logísticos, de recursos humanos e de engenharia. Ter proficiência em Excel comprova capacidade analítica, agilidade operacional e organização de processos.'
    },
    {
      title: 'Como o curso está estruturado?',
      description: 'O curso é composto por 20 aulas sequenciais com videoaulas oficiais, conteúdo teórico aprofundado e questionários práticos de 10 questões. A próxima aula é liberada automaticamente assim que você conclui a aula teórica e obtém nota mínima de aprovação (70%) no questionário.'
    }
  ],
  studyTips: [
    'Abra o Microsoft Excel ou o Excel Online em uma janela ao lado para testar cada função ensinada.',
    'Leia com atenção a aula teórica após assistir ao vídeo para fixar os conceitos e atalhos de teclado.',
    'Responda com atenção ao questionário de 10 questões. Caso não atinja 70%, revise o material e refaça a qualquer momento.'
  ]
};
