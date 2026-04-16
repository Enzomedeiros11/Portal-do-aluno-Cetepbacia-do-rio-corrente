import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Bell, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function Dashboard() {
  const user = {
    name: 'Estudante',
    curso: 'Técnico em Informática',
    ano: '2º Ano'
  };

  const notas = [
    { materia: 'Programação Web', b1: '8.5', b2: '9.0', b3: '-', b4: '-', media: '8.7' },
    { materia: 'Banco de Dados', b1: '7.0', b2: '8.5', b3: '-', b4: '-', media: '7.7' },
    { materia: 'Matemática', b1: '9.5', b2: '9.8', b3: '-', b4: '-', media: '9.6' },
    { materia: 'Língua Portuguesa', b1: '8.0', b2: '7.5', b3: '-', b4: '-', media: '7.7' },
  ];

  const tarefas = [
    { title: 'Projeto de React', disciplina: 'Programação', prazo: 'Hoje', status: 'pendente' },
    { title: 'Lista de Exercícios SQL', disciplina: 'Banco de Dados', prazo: 'Amanhã', status: 'concluido' },
    { title: 'Redação: IA no campo', disciplina: 'Português', prazo: '22 Abr', status: 'pendente' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header de Boas-vindas */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A1A1A]">Olá, {user.name} 👋</h1>
            <p className="text-[#5A5A40]/60 mt-1">{user.curso} • {user.ano}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold">
              ST
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Notas e Desempenho */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Média Geral</p>
                  <p className="text-2xl font-bold text-[#1A1A1A]">8.4</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <CheckSquare className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Tarefas Concluídas</p>
                  <p className="text-2xl font-bold text-[#1A1A1A]">12/15</p>
                </div>
              </div>
            </div>

            {/* Tabela de Notas */}
            <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#5A5A40] w-6 h-6" />
                  <h2 className="text-xl font-medium text-[#1A1A1A]">Boletim de Notas</h2>
                </div>
                <button className="text-sm font-bold text-[#5A5A40] hover:underline">Ver Detalhes</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Disciplina</th>
                      <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">1º Bim</th>
                      <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">2º Bim</th>
                      <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">3º Bim</th>
                      <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">4º Bim</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Média</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {notas.map((n, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5 font-medium text-[#1A1A1A]">{n.materia}</td>
                        <td className="px-4 py-5 text-center text-gray-600">{n.b1}</td>
                        <td className="px-4 py-5 text-center text-gray-600">{n.b2}</td>
                        <td className="px-4 py-5 text-center text-gray-400 font-light">{n.b3}</td>
                        <td className="px-4 py-5 text-center text-gray-400 font-light">{n.b4}</td>
                        <td className="px-8 py-5 text-right font-bold text-[#5A5A40]">{n.media}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar: Tarefas e Eventos */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#5A5A40] w-6 h-6" />
                  <h2 className="text-xl font-medium text-[#1A1A1A]">Tarefas Ativas</h2>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <div className="space-y-4">
                {tarefas.map((t, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className={`w-3 h-3 rounded-full ${t.status === 'concluido' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1A1A1A] text-sm group-hover:text-[#5A5A40] transition-colors">{t.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{t.disciplina} • {t.prazo}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-950 transition-colors" />
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-[#F5F5F0] text-[#5A5A40] rounded-2xl font-bold text-sm hover:bg-[#5A5A40] hover:text-white transition-all">
                Ver Todas as Tarefas
              </button>
            </section>

            <section className="bg-[#1A1A1A] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon className="w-6 h-6 opacity-60" />
                  <h2 className="text-xl font-medium">Próximos Eventos</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-14 bg-white/10 rounded-xl flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xs font-bold opacity-60">MAI</span>
                      <span className="text-xl font-black">12</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Feira de Ciências</h4>
                      <p className="text-xs opacity-60 mt-0.5">Auditório Principal • 09:00</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-14 bg-white/10 rounded-xl flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xs font-bold opacity-60">MAI</span>
                      <span className="text-xl font-black">15</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Prova Bimestral</h4>
                      <p className="text-xs opacity-60 mt-0.5">Matemática e Fisica</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
