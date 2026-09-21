import { motion } from 'motion/react';
import { Briefcase, MapPin, Building2, ExternalLink, Sparkles, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6 transition-colors duration-200 font-sans">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              Oportunidades de Estágio
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Conectando estudantes da CETEP com o mercado de trabalho local e programas oficiais de estágio.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Vagas Recentes na Região</h2>
            {opportunities.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Building2 className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company}</span>
                      <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                      <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-widest">Bolsa</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{job.remuneration}</p>
                  </div>
                  <button 
                    onClick={() => window.open('https://www.gov.br/mec/pt-br/assuntos/estagio-mec', '_blank')}
                    className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Candidatar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Official MEC Portal Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 dark:from-slate-900 dark:to-slate-900 border border-slate-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-xs">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-3">
                Programa Oficial
              </span>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                Programa de Estágio do MEC
              </h3>
              <p className="text-slate-300 mb-8 text-xs leading-relaxed max-w-xs">
                Consulte diretrizes, oportunidades e orientações oficiais do Ministério da Educação para estágio técnico supervisionado.
              </p>
              <a 
                href="https://www.gov.br/mec/pt-br/assuntos/estagio-mec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Acessar Portal do MEC</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
