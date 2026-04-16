import { motion } from 'motion/react';
import { BookMarked, ExternalLink, GraduationCap, Star, Clock, Globe } from 'lucide-react';

export default function ExtraCourses() {
  const myCourses = [
    {
      title: 'Excel do Zero ao Avançado',
      desc: 'Domine a ferramenta mais essencial para o mercado de trabalho. Dashboards, fórmulas e automação.',
      duration: '40h',
      rating: '5.0',
      difficulty: 'Iniciante'
    },
    {
      title: 'Lógica de Programação',
      desc: 'O primeiro passo para quem quer entrar no mundo do desenvolvimento. Aprenda a pensar como um programador.',
      duration: '20h',
      rating: '4.8',
      difficulty: 'Iniciante'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="text-indigo-600 w-10 h-10" />
            <h1 className="text-4xl font-serif font-medium text-slate-900">Cursos & Capacitação</h1>
          </div>
          <p className="text-gray-500">Aprimore seus conhecimentos com cursos gratuitos e plataformas recomendadas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-serif font-medium text-slate-900 border-l-4 border-indigo-600 pl-4">Cursos Gratuitos Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCourses.map((course, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col group overflow-hidden relative"
                >
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                       {[...Array(5)].map((_, idx) => (
                         <Star key={idx} className="w-3 h-3 text-amber-400 fill-current" />
                       ))}
                       <span className="text-[10px] font-bold text-gray-400 ml-1">{course.rating}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-indigo-700 transition-colors">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">{course.desc}</p>
                    
                    <div className="flex items-center gap-6 mt-auto border-t border-gray-50 pt-6">
                       <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold">{course.duration}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-400">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-xs font-bold">{course.difficulty}</span>
                       </div>
                    </div>
                  </div>
                  <button className="mt-8 w-full py-3 bg-indigo-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all">
                     Iniciar Curso
                  </button>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <Globe className="text-indigo-400 w-10 h-10 mb-6" />
                 <h3 className="text-2xl font-serif mb-4 italic leading-tight">Plataforma Externa Recomendada</h3>
                 <p className="text-white/60 mb-8 text-sm leading-relaxed">
                   Acesse a plataforma oficial do MEC para mais centenas de cursos certificados gratuitamente.
                 </p>
                 <a 
                   href="https://aprendamais.mec.gov.br/login/index.php" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
                 >
                   Visitar MEC <ExternalLink className="w-4 h-4" />
                 </a>
               </div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
               <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Apoio</p>
               <h4 className="font-bold text-slate-900 mb-4">Dúvidas com Excel?</h4>
               <p className="text-sm text-gray-500 mb-6">Mande sua dúvida no grupo da turma ou fale com o professor.</p>
               <button className="w-full py-3 border-2 border-indigo-50 rounded-2xl text-indigo-900 font-bold hover:bg-indigo-50 transition-colors">
                  Contatar Coordenação
               </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
