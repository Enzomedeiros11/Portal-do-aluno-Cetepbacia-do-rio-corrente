import { motion } from 'motion/react';
import { Briefcase, MapPin, Building2, ExternalLink, Sparkles } from 'lucide-react';

export default function Internships() {
  const opportunities = [
    {
      title: 'Técnico em Informática (Suporte)',
      company: 'Prefeitura Municipal',
      location: 'Centro',
      remuneration: 'R$ 800,00',
      hours: '20h/semanais'
    },
    {
      title: 'Auxiliar de Administração',
      company: 'Banco do Brasil',
      location: 'Centro',
      remuneration: 'R$ 1.100,00',
      hours: '30h/semanais'
    },
    {
      title: 'Técnico em Nutrição',
      company: 'Hospital Regional',
      location: 'São Félix',
      remuneration: 'R$ 900,00',
      hours: '20h/semanais'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="text-indigo-600 w-10 h-10" />
            <h1 className="text-4xl font-serif font-medium text-slate-900">Oportunidades de Estágio</h1>
          </div>
          <p className="text-gray-500">Conectando estudantes da CETEP com o mercado de trabalho local e regional.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-serif font-medium text-slate-900 mb-6">Vagas Recentes</h2>
            {opportunities.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-600/20 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                      <Building2 className="text-indigo-600 w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 font-medium">{job.company}</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-8 justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Bolsa</p>
                      <p className="text-sm font-black text-indigo-900">{job.remuneration}</p>
                   </div>
                   <button className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs hover:bg-indigo-700 hover:text-white transition-all">
                      Candidatar
                   </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-indigo-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
             <div className="relative z-10 w-full">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-white/10 backdrop-blur-sm">
                   <Sparkles className="w-10 h-10 text-white fill-current opacity-80" />
                </div>
                <h3 className="text-3xl font-serif italic mb-6 leading-tight">Plataforma Parceira</h3>
                <p className="text-white/60 mb-10 text-sm leading-relaxed">
                   Cadastre seu currículo na Super Estágios e acesse milhares de outras oportunidades em todo o Brasil.
                </p>
                <a 
                   href="https://www.superestagios.com.br/index/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-white text-indigo-950 rounded-[24px] font-bold shadow-xl hover:shadow-white/5 transition-all flex items-center justify-center gap-2"
                >
                   Acessar Site <ExternalLink className="w-4 h-4" />
                </a>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
