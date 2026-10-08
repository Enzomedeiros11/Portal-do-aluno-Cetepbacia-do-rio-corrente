import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper,
  Calendar,
  Search,
  ArrowRight,
  Clock,
  User,
  Share2,
  X,
  BookOpen,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  desc: string;
  paragraphs: string[];
  quote?: string;
  quoteAuthor?: string;
  highlights?: string[];
}

export default function Journal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const articles: NewsArticle[] = [
    {
      id: 'noticia-1',
      title: 'CETEP - Bacia do Rio Corrente: Transformação e Excelência na Educação Profissional',
      subtitle: 'Como o polo educacional de Santa Maria da Vitória tem formado jovens preparados para o mercado tecnológico e regional.',
      date: '16 Mai 2026',
      category: 'Institucional',
      author: 'Comunicação CETEP & Direção',
      readTime: '4 min',
      desc: 'Nossa instituição continua transformando vidas através da educação técnica e profissionalizante de excelência em toda a Bacia do Rio Corrente.',
      paragraphs: [
        'O Centro Territorial de Educação Profissional (CETEP) da Bacia do Rio Corrente consolidou-se como referência no ensino médio integrado e técnico no estado da Bahia. Com cursos estruturados nas áreas de Informática, Administração, Agropecuária, Meio Ambiente e Nutrição, o campus proporciona aos estudantes uma formação prática conectada com as reais demandas do mundo do trabalho.',
        'Nos últimos anos, foram implementadas metodologias ativas, modernização contínua das salas de aula e plataformas digitais de apoio ao aprendizado. O objetivo central é aliar o rigor acadêmico com competências socioemocionais e capacitação prática de alto nível.',
        'Além das aulas teóricas regulares, os estudantes contam com projetos de extensão comunitária, visitas técnicas a empresas do agronegócio e tecnologia regional, e acesso a cursos preparatórios e estágios supervisionados.'
      ],
      quote: 'A educação profissional é a chave para o desenvolvimento sustentável da nossa região e para abrir portas concretas para a juventude.',
      quoteAuthor: 'Direção Acadêmica CETEP',
      highlights: [
        'Mais de 800 estudantes ativos nos cursos integrados e subsequentes',
        'Laboratórios equipados para aulas de redes, programação e robótica',
        'Parcerias firmadas com cooperativas e órgãos públicos do território'
      ]
    },
    {
      id: 'noticia-2',
      title: '1º Simulado Acadêmico Unificado: Estudantes Avaliam Desempenho para ENEM e Provas Técnicas',
      subtitle: 'Com mais de 100 questões aplicadas, a iniciativa simula as condições reais das principais bancas examinadoras do país.',
      date: '28 Abr 2026',
      category: 'Pedagógico',
      author: 'Coordenação Pedagógica',
      readTime: '3 min',
      desc: 'Mais de 400 alunos participaram do simulado presencial abrangendo linguagens, ciências da natureza, matemática e formação técnica.',
      paragraphs: [
        'A Coordenação Pedagógica do CETEP promoveu com sucesso a primeira edição do Simulado Geral Unificado de 2026. A avaliação teve como objetivo preparar os estudantes das 1ª, 2ª e 3ª séries para a maratona do ENEM e para as avaliações de certificação profissional.',
        'O simulado contou com questões de múltipla escolha no padrão TRI (Teoria de Resposta ao Item), além de prova de redação com tema voltado aos desafios socioambientais e à inclusão digital no semiárido brasileiro.',
        'Os resultados individuais agora podem ser consultados diretamente no Boletim Acadêmico do Portal, com devolutivas detalhadas por disciplina preparadas pelos docentes.'
      ],
      quote: 'A experiência de sentar, cronometrar o tempo e lidar com a concentração da prova faz toda a diferença na confiança do aluno.',
      quoteAuthor: 'Coordenação Pedagógica',
      highlights: [
        'Participação recorde de 94% dos alunos matriculados',
        'Gabarito comentado liberado pelos professores de cada área',
        'Premiação simbólica para os maiores desempenhos por turma'
      ]
    },
    {
      id: 'noticia-3',
      title: 'Modernização das Salas Tecnológicas e Novos Laboratórios de Informática',
      subtitle: 'Investimento em novos computadores e redes de fibra ótica de alta velocidade potencializa aulas de programação e design.',
      date: '10 Mar 2026',
      category: 'Infraestrutura',
      author: 'Núcleo de Tecnologia & TI',
      readTime: '3 min',
      desc: 'Os laboratórios de informática receberam melhorias completas de cabeamento, softwares atualizados e bancadas ergonômicas.',
      paragraphs: [
        'O CETEP concluiu a reforma e modernização das salas tecnológicas destinadas às turmas de Técnico em Informática. O espaço agora conta com rede de dados gigabit cabeada, ambientes de desenvolvimento modernos instalados e novos projetores interativos.',
        'Com as novas estações, as aulas práticas de Banco de Dados, Lógica de Programação, Web Design e Manutenção de Computadores ganharam mais fluidez e dinamismo, permitindo que cada estudante trabalhe individualmente com seu ambiente de simulação.',
        'A estrutura também está disponível para alunos dos demais cursos utilizarem em pesquisas extracurriculares, confecção de currículos e emissão de certificados dos cursos complementares.'
      ],
      quote: 'Ter uma infraestrutura estável e rápida é fundamental para que o aluno técnico sinta a vivência de uma empresa de tecnologia desde o primeiro ano.',
      quoteAuthor: 'Equipe de Suporte e Laboratórios'
    },
    {
      id: 'noticia-4',
      title: 'Abertura de Novas Vagas de Estágio Supervisionado e Parcerias Empresariais',
      subtitle: 'Secretarias municipais e empresas de comércio e serviços abrem postos para jovens aprendizes e estagiários técnicos.',
      date: '02 Fev 2026',
      category: 'Estágios & Mercado',
      author: 'Coordenação de Estágios',
      readTime: '4 min',
      desc: 'Confira as empresas parceiras que estão recebendo currículos dos alunos do CETEP com suporte do Termo de Compromisso de Estágio.',
      paragraphs: [
        'O Programa de Estágio Supervisionado do CETEP abriu formalmente o ciclo de encaminhamento para o mercado regional. Foram firmados novos acordos de cooperação técnica com instituições da região para atender estudantes dos cursos de Informática, Administração e Meio Ambiente.',
        'O estágio curricular é amparado pela Lei Federal nº 11.788/2008 e oferece aos jovens a oportunidade de colocar em prática os conhecimentos adquiridos em sala de aula, com bolsa-auxílio remunerada e seguro obrigatório.',
        'Os interessados devem consultar a aba "Estágios MEC" do Portal para verificar as vagas disponíveis e preencher a ficha de manifestação de interesse com orientação da coordenação.'
      ],
      quote: 'O estágio é a ponte decisiva entre a escola e o primeiro emprego formal. Nossos alunos chegam preparados e com postura exemplar.',
      quoteAuthor: 'Setor de Relações com o Mercado'
    }
  ];

  const filteredArticles = articles.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = (article: NewsArticle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/journal#${article.id}`);
      toast.success('Link da reportagem copiado com sucesso!');
    } else {
      toast.info(`Reportagem: "${article.title}"`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Informativo Acadêmico</span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Jornal & Notícias CETEP
                </h1>
              </div>
            </motion.div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Fique por dentro das últimas notícias, comunicados institucionais, eventos acadêmicos e projetos da Bacia do Rio Corrente.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar reportagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium shadow-sm"
            />
          </div>
        </header>

        {/* News Feed Cards */}
        <div className="space-y-6">
          {filteredArticles.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedArticle(item)}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row gap-6 items-start justify-between"
            >
              {/* Date Column */}
              <div className="w-full md:w-32 h-28 bg-slate-900 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden border border-white/5">
                <Calendar className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.date.split(' ')[0]}</span>
                <span className="text-xl font-black text-white">{item.date.split(' ')[1]}</span>
                <span className="text-[10px] text-slate-400">{item.date.split(' ')[2]}</span>
              </div>

              {/* Text Info */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.readTime}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• {item.author}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs group-hover:gap-3 transition-all">
                  <span>Ler reportagem completa</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Nenhuma reportagem encontrada</h3>
              <p className="text-xs text-slate-500">Tente buscar por outro termo ou categoria.</p>
            </div>
          )}
        </div>

      </div>

      {/* FULL ARTICLE READER MODAL (100% FUNCIONAL) */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Reader Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 sticky -top-6 bg-white dark:bg-slate-900 z-10 pt-2">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar ao Jornal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(selectedArticle)}
                    className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Compartilhar Link da Reportagem"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Article Header */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {selectedArticle.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h1>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-blue-500 pl-4">
                  {selectedArticle.subtitle}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Por <strong>{selectedArticle.author}</strong></span>
                </div>
              </header>

              {/* Full Article Content */}
              <div className="space-y-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                {selectedArticle.paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Highlight Quote */}
                {selectedArticle.quote && (
                  <div className="my-6 p-6 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border-l-4 border-blue-600 text-blue-950 dark:text-blue-200 italic space-y-2">
                    <p className="text-sm sm:text-base font-semibold leading-relaxed">
                      &ldquo;{selectedArticle.quote}&rdquo;
                    </p>
                    {selectedArticle.quoteAuthor && (
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 not-italic">
                        — {selectedArticle.quoteAuthor}
                      </p>
                    )}
                  </div>
                )}

                {/* Highlights List */}
                {selectedArticle.highlights && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Destaques da Reportagem
                    </h4>
                    <ul className="space-y-1.5 pt-1">
                      {selectedArticle.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Portal de Notícias • CETEP 2026</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Concluir Leitura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
