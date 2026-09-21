import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, Calendar, Plus, Filter, Upload, X, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: number;
  title: string;
  due: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'pendente' | 'concluido' | 'atrasado';
  type: string;
  submission?: {
    fileName: string;
    fileSize: string;
    date: string;
    comment: string;
  };
}

export default function Assignments() {
  const [filterType, setFilterType] = useState<'todos' | 'pendente' | 'concluido' | 'atrasado'>('todos');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [submissionComment, setSubmissionComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Desenvolvimento Backend Node.js', due: '18 Abr', priority: 'Alta', status: 'pendente', type: 'Projeto' },
    { id: 2, title: 'Análise de Solo Rural', due: '20 Abr', priority: 'Média', status: 'concluido', type: 'Prática' },
    { id: 3, title: 'Gestão de RH - Estudo de Caso', due: '25 Abr', priority: 'Baixa', status: 'pendente', type: 'Teórica' },
    { id: 4, title: 'Laboratório de Química Orgânica', due: '22 Abr', priority: 'Alta', status: 'atrasado', type: 'Laboratório' },
  ]);

  const handleOpenSubmit = (task: Task) => {
    setSelectedTask(task);
    setSubmissionComment('');
    setSelectedFile(null);
    setIsSubmitModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 30MB limit
    if (file.size > 30 * 1024 * 1024) {
      toast.error('O arquivo excede o limite máximo permitido de 30MB.');
      return;
    }

    setSelectedFile(file);
    toast.success(`Arquivo "${file.name}" selecionado (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!selectedFile && !submissionComment.trim()) {
      toast.error('Por favor, anexe um arquivo ou escreva uma mensagem de entrega.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      setTasks(prev =>
        prev.map(t =>
          t.id === selectedTask.id
            ? {
                ...t,
                status: 'concluido',
                submission: {
                  fileName: selectedFile?.name || 'Comentário de texto',
                  fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Texto',
                  date: new Date().toLocaleDateString('pt-BR'),
                  comment: submissionComment.trim()
                }
              }
            : t
        )
      );

      setIsUploading(false);
      setIsSubmitModalOpen(false);
      toast.success(`Atividade "${selectedTask.title}" entregue com sucesso!`);
    }, 600);
  };

  const filteredTasks = tasks.filter(t => {
    if (filterType === 'todos') return true;
    return t.status === filterType;
  });

  const countPending = tasks.filter(t => t.status === 'pendente').length;
  const countCompleted = tasks.filter(t => t.status === 'concluido').length;
  const countLate = tasks.filter(t => t.status === 'atrasado').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6 transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-medium text-slate-900 dark:text-white mb-2">Tarefas & Atividades</h1>
            <p className="text-slate-500 dark:text-slate-400">Gerencie seus prazos e envie suas entregas acadêmicas (arquivos de até 30MB).</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                const next: Record<typeof filterType, typeof filterType> = {
                  todos: 'pendente',
                  pendente: 'concluido',
                  concluido: 'atrasado',
                  atrasado: 'todos'
                };
                setFilterType(next[filterType]);
              }}
              className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Filtro: {filterType === 'todos' ? 'Todas' : filterType === 'pendente' ? 'Em Aberto' : filterType === 'concluido' ? 'Concluídas' : 'Atrasadas'}</span>
            </button>
            <button 
              onClick={() => {
                const firstPending = tasks.find(t => t.status !== 'concluido') || tasks[0];
                handleOpenSubmit(firstPending);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Enviar Atividade
            </button>
          </div>
        </header>

        {/* Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => setFilterType('pendente')}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer shadow-xs flex items-center justify-between ${
              filterType === 'pendente'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-widest">Em Aberto</p>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{countPending}</span>
          </div>

          <div 
            onClick={() => setFilterType('concluido')}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer shadow-xs flex items-center justify-between ${
              filterType === 'concluido'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-widest">Concluídas</p>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{countCompleted}</span>
          </div>

          <div 
            onClick={() => setFilterType('atrasado')}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer shadow-xs flex items-center justify-between ${
              filterType === 'atrasado'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-rose-500/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-widest">Atrasadas</p>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{countLate}</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={task.id}
              onClick={() => handleOpenSubmit(task)}
              className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center gap-6 group hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                <Calendar className="w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                    {task.type}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  Prazo: <span className="font-medium text-slate-700 dark:text-slate-200">{task.due}</span> • Prioridade: <span className="font-medium text-slate-900 dark:text-slate-100">{task.priority}</span>
                </p>
                {task.submission && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Entregue ({task.submission.fileName} • {task.submission.date})
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  task.status === 'concluido' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 
                  task.status === 'atrasado' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}>
                  {task.status === 'concluido' ? 'Concluída' : task.status === 'atrasado' ? 'Atrasada' : 'Em Aberto'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSubmit(task);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{task.status === 'concluido' ? 'Reenviar' : 'Entregar'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enviar Atividade</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTask.title}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitTask} className="space-y-5">
                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Arquivo da Tarefa (Limite de até 30MB)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.png,.jpg,.jpeg"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4" /> {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Clique para trocar
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Clique aqui para selecionar seu arquivo
                        </p>
                        <p className="text-xs text-slate-400">
                          PDF, Word, Excel, ZIP ou Imagens (máx. 30MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Observações ou Comentários (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={submissionComment}
                    onChange={(e) => setSubmissionComment(e.target.value)}
                    placeholder="Adicione informações adicionais sobre sua entrega para o professor..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
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
