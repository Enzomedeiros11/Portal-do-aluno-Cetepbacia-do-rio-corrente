import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  X,
  Filter,
  GraduationCap,
  FileText
} from 'lucide-react';
import { DailyClass, User, COURSES, GRADES } from '../types';
import { 
  getLocalDailyClasses, 
  publishDailyClass, 
  deleteDailyClass, 
  seedDailyClassesIfEmpty 
} from '../services/dailyClassService';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

interface DailyClassesBoardProps {
  currentUser: User | null;
  filterForCourse?: string;
  filterForGrade?: string;
  compact?: boolean;
}

export default function DailyClassesBoard({ 
  currentUser, 
  filterForCourse, 
  filterForGrade,
  compact = false 
}: DailyClassesBoardProps) {
  const [classes, setClasses] = useState<DailyClass[]>(getLocalDailyClasses());
  const [selectedCourse, setSelectedCourse] = useState<string>(filterForCourse || 'Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || 
    currentUser?.email === 'enzomedeirosdasilva6@gmail.com' || 
    currentUser?.email === 'adm@gmail.com' ||
    currentUser?.email === 'codernador12@gmail.com';

  const [formData, setFormData] = useState({
    disciplina: 'Técnico em Informática',
    curso: COURSES[1] || 'Técnico em Informática',
    turma: GRADES[0] || '1º Ano',
    tema: '',
    conteudo: '',
    atividades: '',
    horario: '07:30 - 09:10'
  });

  useEffect(() => {
    setClasses(getLocalDailyClasses());

    const unsub = onSnapshot(collection(db, 'aulas_hoje'), (snapshot) => {
      const list: DailyClass[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      if (list.length > 0) {
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setClasses(list);
      }
    }, (err) => {
      console.warn('aulas_hoje listener warning:', err);
    });

    return () => unsub();
  }, []);

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.tema.trim() || !formData.conteudo.trim()) {
      toast.error('Preencha pelo menos o tema e o conteúdo da aula.');
      return;
    }

    setLoading(true);
    try {
      const created = await publishDailyClass({
        professor: currentUser?.name || 'Professor do CETEP',
        professorEmail: currentUser?.email || '',
        disciplina: formData.disciplina,
        curso: formData.curso,
        turma: formData.turma,
        tema: formData.tema.trim(),
        conteudo: formData.conteudo.trim(),
        atividades: formData.atividades.trim() || undefined,
        horario: formData.horario,
        data: new Date().toISOString().split('T')[0]
      });

      // Immediately show on screen!
      setClasses((prev) => [created, ...prev.filter(c => c.id !== created.id)]);
      toast.success('Conteúdo publicado no mural com sucesso!');
      setIsAddModalOpen(false);
      setFormData({
        disciplina: 'Técnico em Informática',
        curso: COURSES[1] || 'Técnico em Informática',
        turma: GRADES[0] || '1º Ano',
        tema: '',
        conteudo: '',
        atividades: '',
        horario: '07:30 - 09:10'
      });
    } catch (err) {
      toast.error('Erro ao publicar aula no mural.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Optimistic delete: remove from screen immediately
      setClasses((prev) => prev.filter((item) => item.id !== id));
      await deleteDailyClass(id);
      toast.success('Publicação removida do mural.');
    } catch {
      toast.error('Erro ao remover publicação.');
    }
  };

  const filteredClasses = classes.filter((item) => {
    if (filterForCourse && filterForCourse !== 'Todos' && item.curso !== filterForCourse) {
      return false;
    }
    if (filterForGrade && filterForGrade !== 'Todos' && item.turma !== filterForGrade) {
      return false;
    }
    if (selectedCourse !== 'Todos' && item.curso !== selectedCourse) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3 h-3" /> Mural dos Professores
            </span>
            <span className="text-xs text-slate-400">• Hoje e Recentes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Mural de Conteúdos & Aulas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publicações dos professores sobre os conteúdos, temas e atividades das aulas de hoje.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!filterForCourse && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="Todos">Todos os Cursos</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {isTeacherOrAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Postar Aula de Hoje</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Daily Class Cards */}
      {filteredClasses.length === 0 ? (
        <div className="py-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum conteúdo postado para este filtro ainda.</p>
          <p className="text-xs text-slate-400 mt-1">Os professores postam aqui o tema e materiais assim que iniciam as aulas.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'md:grid-cols-2 gap-5'}`}>
          {filteredClasses.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 flex flex-col justify-between hover:border-blue-400/50 transition-all group"
            >
              <div>
                {/* Meta info */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                      {item.disciplina}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {item.turma} • {item.curso}
                    </span>
                  </div>

                  {item.horario && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.horario}
                    </span>
                  )}
                </div>

                {/* Tema da Aula */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.tema}
                </h3>

                {/* Conteúdo detalhado */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.conteudo}
                </p>

                {/* Atividades / Tarefas se houver */}
                {item.atividades && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Atividade / Exercício:</strong> {item.atividades}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer: Professor & actions */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.professor}</span>
                </div>

                {isTeacherOrAdmin && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Excluir postagem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL: POSTAR AULA DE HOJE */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Publicar Aula de Hoje</h3>
                    <p className="text-xs text-slate-400">Visível para alunos e responsáveis no mural oficial</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePublish} className="p-6 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Curso Técnico</label>
                    <select
                      value={formData.curso}
                      onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none"
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Turma / Série</label>
                    <select
                      value={formData.turma}
                      onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Disciplina / Matéria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Português, Banco de Dados..."
                      value={formData.disciplina}
                      onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Horário da Aula</label>
                    <input
                      type="text"
                      placeholder="Ex: 07:30 - 09:10"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Tema da Aula</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução à Programação Orientada a Objetos"
                    value={formData.tema}
                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">O que será trabalhado / Conteúdo</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explique os conceitos que serão ensinados, capítulos do livro ou prática em laboratório..."
                    value={formData.conteudo}
                    onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Atividades / Tarefa de Casa (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Exercícios da página 45 a 48, trazer jaleco amanhã..."
                    value={formData.atividades}
                    onChange={(e) => setFormData({ ...formData, atividades: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Publicando...' : 'Publicar no Mural'}
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
