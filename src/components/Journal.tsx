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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Newspaper className="text-indigo-600 w-10 h-10" />
              <h1 className="text-4xl font-serif font-medium text-slate-900">Jornal CETEP</h1>
            </div>
            <p className="text-gray-500">Acompanhe as últimas novidades e o que acontece na nossa escola.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar no jornal..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        {/* Featured News removed as requested - only showing Simulado news below */}

        <div className="space-y-6">
          {filteredNews.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleReadMore(item.title)}
              className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center group cursor-pointer hover:border-indigo-600/20 transition-all active:scale-[0.99]"
            >
              <div className="w-full md:w-32 h-32 bg-gray-50 rounded-3xl flex flex-col items-center justify-center border border-gray-100 shrink-0">
                 <Calendar className="w-6 h-6 text-indigo-300 mb-2" />
                 <span className="text-xs font-bold text-slate-400">{item.date.split(' ')[0]}</span>
                 <span className="text-lg font-black text-slate-900">{item.date.split(' ')[1]}</span>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
                   {item.category}
                </span>
                <h3 className="text-2xl font-serif font-medium text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
