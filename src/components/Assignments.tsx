import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, Calendar, Plus, Filter, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Assignments() {
  const handleAction = (label: string) => {
    toast.info(`Iniciando ${label}...`);
  };

  const handleTaskClick = (title: string) => {
    toast.info(`Atividade: ${title}`, {
      description: 'Deseja anexar um arquivo agora?',
      action: {
        label: 'Anexar',
        onClick: () => toast.success('Arquivo anexado com sucesso!')
      }
    });
  };
  const tasks = [
    { id: 1, title: 'Desenvolvimento Backend Node.js', due: '18 Abr', priority: 'Alta', status: 'pendente', type: 'Projeto' },
    { id: 2, title: 'Análise de Solo Rural', due: '20 Abr', priority: 'Média', status: 'concluido', type: 'Prática' },
    { id: 3, title: 'Gestão de RH - Estudo de Caso', due: '25 Abr', priority: 'Baixa', status: 'pendente', type: 'Teórica' },
    { id: 4, title: 'Laboratório de Química Orgânica', due: '22 Abr', priority: 'Alta', status: 'atrasado', type: 'Laboratório' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-medium text-[#1A1A1A] mb-2">Tarefas & Atividades</h1>
            <p className="text-gray-500">Gerencie seus prazos e entregas acadêmicas.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => handleAction('Filtragem')}
               className="px-6 py-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95 px-8"
             >
                <Filter className="w-4 h-4" /> Filtrar
             </button>
             <button 
               onClick={() => handleAction('Nova Entrega')}
               className="px-6 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-slate-900 transition-all active:scale-95 px-8"
             >
                <Plus className="w-4 h-4" /> Nova Entrega
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[
             { label: 'Em Aberto', count: '12', color: 'bg-indigo-500', icon: Clock },
             { label: 'Concluídas', count: '45', color: 'bg-emerald-500', icon: CheckCircle2 },
             { label: 'Atrasadas', count: '3', color: 'bg-rose-500', icon: AlertCircle },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                   </div>
                   <p className="font-bold text-gray-500 uppercase text-xs tracking-widest">{stat.label}</p>
                </div>
                <span className="text-3xl font-black text-slate-900">{stat.count}</span>
             </div>
           ))}
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={task.id}
              onClick={() => handleTaskClick(task.title)}
              className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-indigo-600/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                <Calendar className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                     {task.type}
                   </span>
                   <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{task.title}</h3>
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                   Prazo: <span className="font-medium text-gray-600">{task.due}</span> • Prioridade: <span className="font-medium text-slate-900">{task.priority}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  task.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 
                  task.status === 'atrasado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {task.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
