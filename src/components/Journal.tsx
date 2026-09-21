import { motion } from 'motion/react';
import { Newspaper, Search, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Journal() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleReadMore = (title: string) => {
    if (title === '1º Simulado da Escola - CETEP') {
      window.open('https://www.instagram.com/reel/DXJzH7fgT-0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', '_blank');
    } else {
      toast.info(`Abrindo reportagem: "${title}"`);
    }
  };

  const news = [
    {
      title: 'CETEP - Bacia do Rio Corrente',
      date: '16 Mai 2024',
      category: 'Educação',
      desc: 'Nossa instituição continua transformando vidas através da educação profissional de excelência na região de Santa Maria da Vitória e cidades vizinhas.'
    },
    {
      title: '1º Simulado da Escola - CETEP',
      date: '10 Jun 2024',
      category: 'Acadêmico',
      desc: 'Confira os registros em vídeo e a participação dos estudantes no grande simulado preparatório de avaliação técnica.'
    }
  ];

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 px-6 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                <Newspaper className="w-6 h-6" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                Jornal & Notícias
              </h1>
            </motion.div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Acompanhe as últimas novidades, projetos e conquistas da nossa comunidade acadêmica.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar notícia..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs font-semibold shadow-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </header>

        <div className="space-y-6">
          {filteredNews.map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => handleReadMore(item.title)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer group-hover:shadow-md"
              >
                <span>Ver Reportagem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.article>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhuma notícia encontrada para "{searchTerm}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
