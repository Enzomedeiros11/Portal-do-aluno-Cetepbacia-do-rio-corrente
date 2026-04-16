import { motion } from 'motion/react';
import { Newspaper, Bell, TrendingUp, Calendar } from 'lucide-react';

export default function Journal() {
  const news = [
    {
      title: 'CETEP Celebra Semana de Tecnologia',
      date: '15 Mai 2024',
      category: 'Eventos',
      desc: 'Nossa escola sediou diversos workshops e palestras sobre inteligência artificial e o futuro do trabalho.'
    },
    {
      title: 'Novos Computadores no Lab 4',
      date: '10 Mai 2024',
      category: 'Estrutura',
      desc: 'O laboratório de informática recebeu 20 novas máquinas de última geração para as aulas de programação.'
    },
    {
      title: 'Inscrições Abertas para o Interclasse',
      date: '05 Mai 2024',
      category: 'Esportes',
      desc: 'Prepare seu time! As inscrições para o torneio deste semestre já estão disponíveis na coordenação.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="text-indigo-600 w-10 h-10" />
            <h1 className="text-4xl font-serif font-medium text-slate-900">Jornal CETEP</h1>
          </div>
          <p className="text-gray-500">Acompanhe as últimas novidades e o que acontece na nossa escola.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
           <div className="bg-indigo-900 text-white p-6 rounded-[32px] md:col-span-2 relative overflow-hidden">
              <div className="relative z-10">
                 <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block italic">Destaque do Mês</span>
                 <h2 className="text-3xl font-serif mb-4 leading-tight">Projeto de Reciclagem vence prêmio regional</h2>
                 <p className="text-white/70 mb-6 max-w-md">Estudantes do curso de Agropecuária desenvolvem novo método de compostagem acelerada.</p>
                 <button className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm">Ler mais</button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
           </div>
           <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <Bell className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Notificações</h3>
              <p className="text-xs text-gray-500">Você tem 3 novos avisos da coordenação.</p>
           </div>
        </div>

        <div className="space-y-6">
          {news.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center group cursor-pointer hover:border-indigo-600/20 transition-all"
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
