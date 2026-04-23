import { motion } from 'motion/react';
import { Newspaper, Bell, TrendingUp, Calendar, Search, Filter, ArrowRight } from 'lucide-react';
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
      title: '1º Simulado da Escola - CETEP',
      date: '14 Abr 2024',
      category: 'Avaliação',
      desc: 'Realizamos nosso primeiro simulado preparatório do ano. Clique para ver o vídeo da cobertura completa.'
    }
  ];

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6 relative overflow-hidden font-sans">
       {/* Background accents optimized */}
       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Newspaper className="text-white w-6 h-6" />
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter font-display uppercase">Portal de Notícias</h1>
            </motion.div>
            <p className="text-slate-500 text-lg font-medium">Acompanhe as últimas novidades e conquistas da nossa comunidade acadêmica.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar reportagem..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white rounded-[30px] border border-slate-200 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
        </header>

        <div className="space-y-8">
          {filteredNews.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleReadMore(item.title)}
              className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-2xl shadow-indigo-900/[0.03] flex flex-col md:flex-row gap-10 items-center group cursor-pointer hover:border-indigo-600/30 transition-all active:scale-[0.99] group/card overflow-hidden relative"
            >
              <div className="w-full md:w-40 h-40 bg-slate-900 rounded-[32px] flex flex-col items-center justify-center border border-white/10 shrink-0 text-white relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent" />
                 <Calendar className="w-8 h-8 text-indigo-400 mb-3 relative z-10" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40 relative z-10">{item.date.split(' ')[0]}</span>
                 <span className="text-2xl font-black tracking-tighter relative z-10">{item.date.split(' ')[1]}</span>
              </div>
              <div className="flex-1 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4 inline-block">
                   {item.category}
                </span>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter font-display leading-tight group-hover/card:text-indigo-600 transition-colors">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-base font-medium mb-6">{item.desc}</p>
                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover/card:gap-4 transition-all">
                   Ler reportagem completa <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full translate-x-16 -translate-y-16 blur-2xl group-hover/card:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
