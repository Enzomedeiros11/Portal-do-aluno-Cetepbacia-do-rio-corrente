import { motion } from 'motion/react';
import { Layout, Users, FileText, CheckCircle2, Pin } from 'lucide-react';

export default function Classroom() {
  const classes = [
    { title: 'Desenvolvimento Web', teacher: 'Prof. Marcos Silva', tasks: 3, students: 32 },
    { title: 'Banco de Dados', teacher: 'Prof. Carlos Santos', tasks: 1, students: 28 },
    { title: 'Matemática Aplicada', teacher: 'Profa. Ana Costa', tasks: 0, students: 35 },
    { title: 'Português Instrumental', teacher: 'Profa. Regina Duarte', tasks: 2, students: 30 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layout className="text-indigo-600 w-10 h-10" />
              <h1 className="text-4xl font-serif font-medium text-slate-900">Minhas Turmas</h1>
            </div>
            <p className="text-gray-500">Acesse seus materiais de estudo e entregue suas tarefas da CETEP.</p>
          </div>
          <button className="px-6 py-3 bg-indigo-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-900 shadow-lg">
             Entrar com Código
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="h-24 bg-indigo-600 p-6 relative">
                 <h3 className="text-white font-bold leading-tight group-hover:underline">{cls.title}</h3>
                 <p className="text-white/70 text-xs mt-1">{cls.teacher}</p>
                 <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Users className="w-4 h-4" />
                       <span className="text-xs font-bold">{cls.students} alunos</span>
                    </div>
                    {cls.tasks > 0 && (
                      <div className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                         {cls.tasks} pendentes
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                       <FileText className="w-4 h-4 text-indigo-400" />
                       <span className="text-xs font-medium text-slate-600">Material de Aula</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Pin className="text-indigo-600 w-6 h-6 rotate-45" />
              <h2 className="text-2xl font-serif font-medium text-slate-900">Mural Interno</h2>
           </div>
           <div className="space-y-4">
              {[
                { author: 'Coordenação', msg: 'Lembre-se: O prazo para o curso de Excel encerra nesta sexta-feira.' },
                { author: 'Bibliotecária', msg: 'Novos livros técnicos chegaram na biblioteca! Venham conferir.' },
              ].map((m, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                   <p className="text-xs font-black uppercase text-indigo-600 mb-2 tracking-widest">{m.author}</p>
                   <p className="text-slate-700 leading-relaxed italic">"{m.msg}"</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
