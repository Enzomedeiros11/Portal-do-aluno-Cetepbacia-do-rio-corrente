import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:w-7/12 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <span>Secretaria da Educação da Bahia • CETEP</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Centro Territorial de Educação Profissional
              </h1>
              
              <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Portal acadêmico oficial da unidade <span className="font-bold text-slate-900">Bacia do Rio Corrente</span>. Acompanhe suas notas, frequência, comunicado dos docentes e oportunidades de estágio.
              </p>

              {/* Clean Executive Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link 
                  to="/auth" 
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Entrar no Portal</span>
                  <span>&rarr;</span>
                </Link>

                <Link 
                  to="/auth?mode=register" 
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <span>Criar Conta de Aluno</span>
                </Link>
              </div>

              {/* Status Bar */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">Ano Letivo:</span> 2026
                </div>
                <div>
                  <span className="font-bold text-slate-800">Modalidade:</span> Integrado & Subsequente
                </div>
                <div>
                  <span className="font-bold text-slate-800">Sistema:</span> Ativo
                </div>
              </div>
            </motion.div>

            {/* Right Photo Card (High-Resolution Academic Setting) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="lg:w-5/12 w-full"
            >
              <Link 
                to="/auth" 
                title="Clique para entrar no portal acadêmico"
                className="block group relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 transition-all hover:border-blue-400"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80" 
                  alt="Estudantes em ambiente técnico de aprendizagem"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-left">
                  <div className="inline-block px-2.5 py-1 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider rounded w-fit mb-2">
                    CETEP Bacia do Rio Corrente
                  </div>
                  <h3 className="text-white text-lg font-bold">Educação Técnica & Profissional</h3>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Formação prática em tecnologia, gestão e desenvolvimento regional.
                  </p>
                  <span className="mt-3 text-xs font-bold text-blue-300 group-hover:text-white transition-colors">
                    Acessar ambiente virtual &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Institutional Highlights Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recursos do Portal Acadêmico</h2>
            <p className="text-sm text-slate-500 font-medium">Ambiente centralizado de serviços para discentes e docentes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-7 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                Ambiente Virtual
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-4 mb-2">Sala de Aula & Materiais</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Acesso aos canais de comunicação com docentes, cronogramas de atividades escolares e download de materiais didáticos oficiais.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Histórico Escolar
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-4 mb-2">Boletim & Notas Digitais</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consulta individualizada de médias por disciplina bimestral, índice de frequência e emissão do boletim acadêmico em formato PDF.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                Carreira & Mercado
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-4 mb-2">Painel de Estágios</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quadro de oportunidades profissionais para alunos do ensino técnico, vagas de jovem aprendiz e orientações de documentação.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-900">CETEP</span> • Centro Territorial de Educação Profissional da Bacia do Rio Corrente
          </div>
          <div className="text-[11px] text-slate-400">
            Governo do Estado da Bahia • Secretaria da Educação
          </div>
        </div>
      </footer>

    </div>
  );
}
