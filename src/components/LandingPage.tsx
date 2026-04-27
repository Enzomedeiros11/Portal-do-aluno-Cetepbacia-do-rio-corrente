import { motion } from 'motion/react';
import { ArrowRight, Play, BookOpen, ShieldCheck, Globe, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-slate-50/50 to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-3/5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-500 text-sm font-semibold mb-8 border border-indigo-100/50">
                <Trophy className="w-4 h-4" />
                <span>Educação Profissional de Elite</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] text-slate-800 mb-8 tracking-tighter font-display">
                Sua porta de entrada para o <span className="text-indigo-500">sucesso</span> profissional.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium">
                Portal acadêmico da <span className="font-bold text-slate-800">CETEP Bacia do Rio Corrente</span>. Acesse suas notas, tarefas e acompanhe sua jornada.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth" className="px-10 py-5 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:-translate-y-1">
                  Acessar Portal do Aluno <ArrowRight className="w-5 h-5 opacity-80" />
                </Link>
                <Link to="/auth" className="px-10 py-5 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Play className="w-4 h-4 text-indigo-500 fill-current" />
                  </div>
                  Área do Professor
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-2/5 relative"
            >
              <div className="relative rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-black/5 bg-gray-50 flex items-center justify-center p-12">
                <Logo className="w-64 h-64 hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-8 right-8">
                   <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-indigo-50 p-1">
                         <Logo className="w-full h-full" />
                      </div>
                      <span className="text-xl font-black text-indigo-950 tracking-tighter">CETEP</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-800 mb-6 font-display tracking-tight">Educação Profissional</h2>
            <p className="text-slate-500 text-lg font-medium">Oferecemos cursos técnicos especializados para preparar você para os desafios do mercado de trabalho.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Cursos Técnicos", 
                desc: "Informática, Administração, Nutrição e outros.",
                items: ["Laboratórios Modernos", "Projetos Reais", "Certificação"]
              },
              { 
                icon: ShieldCheck, 
                title: "Ambiente Seguro", 
                desc: "Controle de acesso e acompanhamento constante.",
                items: ["Segurança 24h", "Portal Monitorado", "Suporte"]
              },
              { 
                icon: Globe, 
                title: "Oportunidades", 
                desc: "Convênios com as maiores empresas da região.",
                items: ["Estágios", "Networking", "Carreira"]
              },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-slate-50/50 p-10 rounded-[32px] border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                  <feature.icon className="w-7 h-7 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 mb-8 text-sm font-medium">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[10px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
               <Logo className="w-10 h-10 grayscale opacity-50" />
               <div className="text-left">
                  <p className="text-xs font-black text-slate-900 tracking-tighter leading-none">CETEP</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Bacia do Rio Corrente</p>
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               © 2024 CETEP • PORTAL ACADÊMICO
            </p>
         </div>
      </footer>
    </div>
  );
}
