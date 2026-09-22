import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, Calendar, Plus, Filter, Upload, FileText, X, Check, Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: number | string;
  title: string;
  due: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'pendente' | 'concluido' | 'atrasado';
  type: string;
  submittedFile?: string;
  submittedAt?: string;
  comment?: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Desenvolvimento Backend Node.js & Express', due: '28 Abr', priority: 'Alta', status: 'pendente', type: 'Projeto' },
  { id: 2, title: 'Análise de Solo Rural e Irrigação', due: '30 Abr', priority: 'Média', status: 'concluido', type: 'Prática', submittedFile: 'relatorio_solo_v1.pdf', submittedAt: '20 Abr, 14:30' },
  { id: 3, title: 'Gestão de RH - Estudo de Caso Empresarial', due: '05 Mai', priority: 'Baixa', status: 'pendente', type: 'Teórica' },
  { id: 4, title: 'Laboratório de Química Orgânica - Soluções', due: '22 Abr', priority: 'Alta', status: 'atrasado', type: 'Laboratório' },
];

export default function Assignments() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('cetep_assignments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState<'todas' | 'pendente' | 'concluido' | 'atrasado'>('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form submission state
  const [selectedTaskId, setSelectedTaskId] = useState<string | number>(tasks[0]?.id || 1);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [submissionComment, setSubmissionComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('cetep_assignments', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  const handleOpenSubmission = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setSelectedTaskId(task.id);
    } else {
      setSelectedTask(tasks[0] || null);
      setSelectedTaskId(tasks[0]?.id || 1);
    }
    setSelectedFileName('');
    setSubmissionComment('');
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileName && !submissionComment.trim()) {
      toast.error('Por favor, selecione um arquivo ou escreva uma resposta/link da atividade.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === Number(selectedTaskId) || t.id === selectedTaskId) {
          return {
            ...t,
            status: 'concluido',
            submittedFile: selectedFileName || 'resposta_enviada.txt',
            submittedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            comment: submissionComment.trim()
          };
        }
        return t;
      }));

      setIsSubmitting(false);
      setModalOpen(false);
      toast.success('Atividade enviada com sucesso para avaliação!');
    }, 600);
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'todas') return true;
    return t.status === activeFilter;
  });

  const countPending = tasks.filter(t => t.status === 'pendente').length;
  const countCompleted = tasks.filter(t => t.status === 'concluido').length;
  const countLate = tasks.filter(t => t.status === 'atrasado').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-12 px-6 transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">Tarefas & Atividades</h1>
            <p className="text-slate-500 dark:text-slate-400">Gerencie seus prazos e envie suas entregas acadêmicas com segurança.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-sm">
                {(['todas', 'pendente', 'concluido', 'atrasado'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      activeFilter === f
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f === 'todas' ? 'Todas' : f === 'pendente' ? 'Abertas' : f === 'concluido' ? 'Entregues' : 'Atrasadas'}
                  </button>
                ))}
             </div>

             <button 
               onClick={() => handleOpenSubmission()}
               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
             >
                <Upload className="w-4 h-4" /> Enviar Atividade
             </button>
          </div>
        </header>

        {/* Status Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div 
             onClick={() => setActiveFilter('pendente')}
             className={`p-6 rounded-[28px] border transition-all cursor-pointer ${
               activeFilter === 'pendente' 
                 ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700' 
                 : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
             } flex items-center justify-between shadow-sm`}
           >
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="w-6 h-6" />
                 </div>
                 <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">Em Aberto</p>
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{countPending}</span>
           </div>

           <div 
             onClick={() => setActiveFilter('concluido')}
             className={`p-6 rounded-[28px] border transition-all cursor-pointer ${
               activeFilter === 'concluido' 
                 ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700' 
                 : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
             } flex items-center justify-between shadow-sm`}
           >
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">Entregues</p>
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{countCompleted}</span>
           </div>

           <div 
             onClick={() => setActiveFilter('atrasado')}
             className={`p-6 rounded-[28px] border transition-all cursor-pointer ${
               activeFilter === 'atrasado' 
                 ? 'bg-rose-50/50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700' 
                 : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
             } flex items-center justify-between shadow-sm`}
           >
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                 </div>
                 <p className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">Atrasadas</p>
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{countLate}</span>
           </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhuma atividade nesta categoria</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Você está em dia com todas as suas tarefas!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={task.id}
                onClick={() => handleOpenSubmission(task)}
                className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-blue-500/40 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                  <Calendar className="w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                     <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                       {task.type}
                     </span>
                     <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                     Prazo: <span className="font-medium text-slate-700 dark:text-slate-300">{task.due}</span> • Prioridade: <span className={`font-semibold ${task.priority === 'Alta' ? 'text-rose-500' : task.priority === 'Média' ? 'text-amber-500' : 'text-emerald-500'}`}>{task.priority}</span>
                     {task.submittedFile && (
                       <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full ml-2">
                         <Paperclip className="w-3 h-3" /> {task.submittedFile} ({task.submittedAt})
                       </span>
                     )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    task.status === 'concluido' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 
                    task.status === 'atrasado' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' : 
                    'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}>
                    {task.status === 'concluido' ? 'Entregue' : task.status === 'atrasado' ? 'Atrasada' : 'Pendente'}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenSubmission(task); }}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Enviar arquivo para esta atividade"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enviar Atividade</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Anexe seus trabalhos ou digite a resposta para os professores.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Selecione a Atividade
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold cursor-pointer"
                  >
                    {tasks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} (Prazo: {t.due}) {t.status === 'concluido' ? '✓ Já enviada' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Arquivo do Trabalho (PDF, DOCX, ZIP, PNG, etc)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    {selectedFileName ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <FileText className="w-4 h-4" />
                        <span>{selectedFileName}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Clique para selecionar o arquivo</p>
                        <p className="text-xs text-slate-400 mt-1">Suporta PDF, Word, Imagens e Códigos</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Comment / Response text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Observações ou Link do Trabalho (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Adicione um link do Google Drive, GitHub ou considerações para o professor..."
                    value={submissionComment}
                    onChange={(e) => setSubmissionComment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirmar Entrega</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
