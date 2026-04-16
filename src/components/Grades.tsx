import { motion } from 'motion/react';
import { FileText, TrendingUp, AlertTriangle, Download, Calendar } from 'lucide-react';

export default function Grades() {
  const academicData = [
    { module: 'Módulo I', period: '2024.1', status: 'Concluído', gpa: '8.8' },
    { module: 'Módulo II', period: '2024.2', status: 'Em curso', gpa: '7.9' },
  ];

  const subjects = [
    { name: 'Algoritmos e Lógica', teacher: 'Prof. Marcos Silva', grade: '9.2' },
    { name: 'Sistemas Operacionais', teacher: 'Profa. Ana Costa', grade: '7.8' },
    { name: 'Ética Profissional', teacher: 'Prof. Roberto Melo', grade: '8.5' },
    { name: 'Redes de Computadores', teacher: 'Prof. Carlos Santos', grade: '6.5' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-indigo-600 w-8 h-8" />
            <h1 className="text-4xl font-serif font-medium text-[#1A1A1A]">Histórico Escolar</h1>
          </div>
          <p className="text-gray-500">Acompanhamento detalhado do seu rendimento acadêmico na CETEP.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1A1A1A]">Notas Disciplinares</h3>
                <button className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <Download className="w-4 h-4" /> Exportar PDF
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {subjects.map((sub, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#1A1A1A]">{sub.name}</h4>
                        <p className="text-sm text-gray-400">{sub.teacher}</p>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Média</p>
                          <p className={`text-xl font-black ${Number(sub.grade) < 7 ? 'text-indigo-500' : 'text-gray-950'}`}>
                            {sub.grade}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">IRA Acumulado</p>
                <h2 className="text-6xl font-black mb-2 tracking-tighter">8.42</h2>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-4">
                  <div className="bg-white h-full rounded-full w-[84%]" />
                </div>
                <p className="text-[10px] mt-4 font-bold opacity-60">ACIMA DA MÉDIA DA TURMA (7.2)</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-orange-500 w-5 h-5" /> Avisos Acadêmicos
                </h4>
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                     <p className="text-sm text-orange-800 font-medium leading-relaxed">
                       Não há novos avisos no momento.
                     </p>
                  </div>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
