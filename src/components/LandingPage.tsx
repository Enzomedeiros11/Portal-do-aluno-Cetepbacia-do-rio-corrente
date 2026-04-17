import { motion } from 'motion/react';
import { ArrowRight, Play, BookCheck, ShieldCheck, Globe, Users, Trophy, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-white to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-3/5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 text-indigo-600 text-sm font-semibold mb-8">
                <Trophy className="w-4 h-4" />
                <span>Centro Territorial de Educação Profissional</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-serif font-medium leading-[0.9] text-[#1A1A1A] mb-8">
                Sua porta de entrada para o <span className="italic text-indigo-600 border-b-4 border-indigo-600/20">sucesso</span> profissional.
              </h1>
              <p className="text-xl text-[#1A1A1A]/70 mb-10 max-w-xl leading-relaxed">
                Portal acadêmico da <span className="font-bold text-[#1A1A1A]">CETEP Bacia do Rio Corrente</span>. Acesse suas notas, tarefas e acompanhe sua jornada acadêmica com facilidade.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth" className="px-10 py-5 bg-indigo-900 text-white rounded-full font-bold hover:bg-slate-900 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Acessar Portal do Aluno <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/auth" className="px-10 py-5 border-2 border-indigo-600/10 rounded-full font-bold text-slate-800 hover:bg-gray-50 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-indigo-600 fill-current" />
                  </div>
                  Painel do Professor
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

      {/* Stats/Feature Grid */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-serif font-medium text-[#1A1A1A] mb-6">Educação Profissional de Excelência</h2>
            <p className="text-gray-500 text-lg">Oferecemos cursos técnicos especializados para preparar você para os desafios do mercado de trabalho contemporâneo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Cursos Técnicos", 
                desc: "Informática, Administração, Nutrição e mais.",
                items: ["Laboratórios Modernos", "Projetos Reais", "Certificação"]
              },
              { 
                icon: ShieldCheck, 
                title: "Ambiente Seguro", 
                desc: "Controle de acesso e monitoramento constante.",
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
                className="bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-4">{feature.title}</h3>
                <p className="text-gray-500 mb-8">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
