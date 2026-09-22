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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-12 px-6 transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="text-blue-600 dark:text-blue-400 w-10 h-10" />
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Oportunidades de Estágio</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Conectando estudantes do CETEP com a formação profissional técnica e o mercado regional.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">Vagas Recentes</h2>
            {opportunities.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                      <Building2 className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company}</span>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-8 justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-widest">Bolsa</p>
                      <p className="text-sm font-black text-blue-700 dark:text-blue-400">{job.remuneration}</p>
                   </div>
                   <button className="px-5 py-2 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                      Candidatar
                   </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
             <div className="relative z-10 w-full">
                <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-blue-500/30 backdrop-blur-sm">
                   <Sparkles className="w-10 h-10 text-blue-400 fill-current opacity-80" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 leading-tight">Ministério da Educação</h3>
                <p className="text-slate-300 mb-8 text-xs leading-relaxed">
                   Acesse as diretrizes oficiais de estágio técnico, legislação educacional (Lei nº 11.788) e programas de formação profissional no portal oficial do MEC.
                </p>
                <a 
                   href="https://www.gov.br/mec/pt-br" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-[24px] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                   Acessar Portal do MEC <ExternalLink className="w-4 h-4" />
                </a>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
