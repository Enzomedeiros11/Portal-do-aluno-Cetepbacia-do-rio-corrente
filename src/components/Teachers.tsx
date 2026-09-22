import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Save, 
  BookOpen, 
  Send, 
  Mail, 
  Trash2, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Download, 
  Printer, 
  UserPlus, 
  X, 
  AlertTriangle,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { User, COURSES, GRADES } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';

interface TeachersProps {
  allUsers: User[];
  onUpdateUsers: (newUsers: User[]) => void;
  currentUser: User | null;
  onRefresh: () => Promise<void>;
}

export default function Teachers({ allUsers, onUpdateUsers, currentUser, onRefresh }: TeachersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'todos' | 'student' | 'teacher'>('todos');
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterGrade, setFilterGrade] = useState('Todos');
  const [selectedSubject, setSelectedSubject] = useState('Português');

  const [localGrades, setLocalGrades] = useState<Record<string, { n1: string; n2: string; n3: string }>>({});
  const [localFrequency, setLocalFrequency] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [announcement, setAnnouncement] = useState({ subject: '', message: '' });
  const [comunicadosList, setComunicadosList] = useState<{ id: string; texto: string; usuario: string; data: string }[]>([]);

  // Deduplicate users strictly by lowercase email to prevent any duplication in secretaria
  const uniqueUsers = useMemo(() => {
    const map = new Map<string, User>();
    (allUsers || []).forEach(u => {
      if (!u || !u.email) return;
      const key = u.email.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, u);
      } else {
        const existing = map.get(key)!;
        const uGradesCount = Object.keys(u.subjectGrades || {}).length;
        const exGradesCount = Object.keys(existing.subjectGrades || {}).length;
        if (uGradesCount > exGradesCount || u.role === 'teacher') {
          map.set(key, { ...existing, ...u });
        }
      }
    });
    return Array.from(map.values());
  }, [allUsers]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'mensagens'), (snap) => {
      const list: any[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.canal === 'Geral') {
          list.push({ id: docSnap.id, ...data });
        }
      });
      list.sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
      setComunicadosList(list);
    });
    return () => unsub();
  }, []);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form States
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'teacher',
    course: COURSES[0] || 'Técnico em Informática',
    grade: GRADES[0] || '1º Ano',
    frequencia: 100
  });

  const [editUser, setEditUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    course: string;
    grade: string;
    frequencia: number;
  }>({
    id: '',
    name: '',
    email: '',
    role: 'student',
    course: COURSES[0] || 'Técnico em Informática',
    grade: GRADES[0] || '1º Ano',
    frequencia: 100
  });

  useEffect(() => {
    const grades: Record<string, { n1: string; n2: string; n3: string }> = {};
    const freqs: Record<string, number> = {};
    uniqueUsers.forEach(u => {
      if (u.role === 'student') {
        const studentGrades = u.subjectGrades?.[selectedSubject] || { n1: '', n2: '', n3: '' };
        grades[u.id] = studentGrades;
        freqs[u.id] = u.frequencia || 100;
      }
    });
    setLocalGrades(grades);
    setLocalFrequency(freqs);
  }, [uniqueUsers, selectedSubject]);

  // Filtering users based on role, search term, course and grade
  const filteredUsers = uniqueUsers.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (roleFilter === 'student') matchesRole = u.role === 'student';
    if (roleFilter === 'teacher') matchesRole = u.role === 'teacher';

    const matchesCourse = filterCourse === 'Todos' || u.course === filterCourse;
    const matchesGrade = filterGrade === 'Todos' || u.grade === filterGrade;

    return matchesSearch && matchesRole && matchesCourse && matchesGrade;
  });

  const studentsCount = uniqueUsers.filter(u => u.role === 'student').length;
  const teachersCount = uniqueUsers.filter(u => u.role === 'teacher').length;
  const avgFrequency = (
    uniqueUsers.filter(u => u.role === 'student').reduce((acc, s) => acc + (s.frequencia || 0), 0) /
    (studentsCount || 1)
  ).toFixed(1);

  // Handlers for User CRUD
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('Preencha pelo menos Nome e E-mail.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = newUser.email.trim().toLowerCase();
      const newUid = `user_${Date.now()}`;
      const payload = {
        id: newUid,
        nome: newUser.name.trim(),
        email: cleanEmail,
        tipo: newUser.role,
        curso: newUser.course,
        grade: newUser.grade,
        frequencia: newUser.frequencia || 100,
        notas: {},
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase Firestore
      await setDoc(doc(db, 'usuarios', newUid), payload);

      // Also upsert in Supabase for backwards compatibility
      await supabase.from('usuarios').upsert([payload]);

      toast.success(`Usuário ${newUser.name} cadastrado com sucesso!`);
      setIsAddModalOpen(false);
      setNewUser({
        name: '',
        email: '',
        role: 'student',
        course: COURSES[0] || 'Técnico em Informática',
        grade: GRADES[0] || '1º Ano',
        frequencia: 100
      });

      await onRefresh();
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      toast.error('Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditUser({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      course: user.course || COURSES[0],
      grade: user.grade || GRADES[0],
      frequencia: user.frequencia || 100
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUserEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editUser.id) return;

    setLoading(true);
    try {
      const cleanEmail = editUser.email.trim().toLowerCase();
      const payload = {
        id: editUser.id,
        nome: editUser.name.trim(),
        email: cleanEmail,
        tipo: editUser.role,
        curso: editUser.course,
        grade: editUser.grade,
        frequencia: editUser.frequencia,
        updatedAt: new Date().toISOString()
      };

      // Update in Firebase Firestore
      await setDoc(doc(db, 'usuarios', editUser.id), payload, { merge: true });

      // Update in Supabase
      await supabase
        .from('usuarios')
        .update(payload)
        .eq('id', editUser.id);

      toast.success('Usuário atualizado com sucesso!');
      setIsEditModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error('Erro ao editar usuário:', err);
      toast.error('Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      // Delete from Firebase Firestore
      await deleteDoc(doc(db, 'usuarios', userToDelete.id));

      // Delete from Supabase
      await supabase
        .from('usuarios')
        .delete()
        .eq('id', userToDelete.id);

      toast.success(`Usuário ${userToDelete.name} excluído!`);
      setUserToDelete(null);
      await onRefresh();
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      toast.error('Erro ao excluir usuário.');
    } finally {
      setLoading(false);
    }
  };

  // High-compatibility Excel CSV export with BOM and semicolon delimiter
  const handleExportCSV = () => {
    if (!filteredUsers.length) {
      toast.error('Nenhum dado para exportar.');
      return;
    }

    const separator = ';';
    const headers = [
      'Nome Completo',
      'Gmail / E-mail',
      'Cargo',
      'Curso Técnico',
      'Série / Turma',
      'Frequência (%)',
      `Nota Bim 1 (${selectedSubject})`,
      `Nota Bim 2 (${selectedSubject})`,
      `Nota Bim 3 (${selectedSubject})`
    ];

    const rows = filteredUsers.map(u => {
      const studentGrades = u.subjectGrades?.[selectedSubject] || { n1: '', n2: '', n3: '' };
      return [
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${u.role === 'teacher' ? 'Professor / Gestão' : 'Aluno'}"`,
        `"${(u.course || 'Regular').replace(/"/g, '""')}"`,
        `"${(u.grade || '1º Ano').replace(/"/g, '""')}"`,
        `"${u.frequencia ?? 100}%"`,
        `"${studentGrades.n1 || '—'}"`,
        `"${studentGrades.n2 || '—'}"`,
        `"${studentGrades.n3 || '—'}"`
      ].join(separator);
    });

    // \uFEFF is the UTF-8 Byte Order Mark (BOM) which tells Excel to open with proper Brazilian Portuguese accents
    const csvContent = '\uFEFF' + [headers.join(separator), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_cetep_secretaria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Planilha Excel (.CSV) formatada e exportada com sucesso!');
  };

  const handlePrintTable = () => {
    window.print();
  };

  const handleBroadcast = async () => {
    if (!announcement.subject || !announcement.message) {
      toast.error('Preencha o assunto e a mensagem.');
      return;
    }

    setSendingEmail(true);
    try {
      const payload = {
        canal: 'Geral',
        usuario: currentUser?.name || 'Administração',
        email: currentUser?.email || '',
        avatar: currentUser?.avatar || null,
        texto: `[COMUNICADO OFICIAL: ${announcement.subject}] ${announcement.message}`,
        data: new Date().toISOString()
      };

      // Save to Firebase
      await addDoc(collection(db, 'mensagens'), payload);

      // Save to Supabase fallback
      await supabase.from('mensagens').insert([payload]);

      toast.success('Comunicado transmitido para a sala de aula com sucesso!');
      setAnnouncement({ subject: '', message: '' });
    } catch (err) {
      console.error('Erro ao transmitir:', err);
      toast.error('Erro ao enviar comunicado.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteComunicado = async (comId: string) => {
    try {
      await deleteDoc(doc(db, 'mensagens', comId));
      await supabase.from('mensagens').delete().eq('id', comId);
      toast.success('Comunicado excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao apagar comunicado:', err);
      toast.error('Erro ao apagar comunicado.');
    }
  };

  const handleSaveGrades = async () => {
    setLoading(true);
    try {
      let savedCount = 0;
      for (const studentId of Object.keys(localGrades)) {
        const student = uniqueUsers.find(u => u.id === studentId);
        if (student) {
          const updatedSubjectGrades = { ...(student.subjectGrades || {}), [selectedSubject]: localGrades[studentId] };
          
          // Update in Firebase Firestore
          await setDoc(doc(db, 'usuarios', studentId), {
            notas: updatedSubjectGrades,
            frequencia: localFrequency[studentId]
          }, { merge: true });

          // Update in Supabase
          const { error } = await supabase
            .from('usuarios')
            .update({ notas: updatedSubjectGrades, frequencia: localFrequency[studentId] })
            .eq('id', studentId);
          if (!error) savedCount++;
        }
      }
      toast.success(`${savedCount} registros de notas e frequência salvos no sistema!`);
      await onRefresh();
    } catch (err) {
      toast.error('Erro ao salvar algumas notas.');
    } finally {
      setLoading(false);
    }
  };

  const ALL_SUBJECTS = [
    'Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 'Geografia', 'Inglês', 
    'Banco de Dados', 'Robótica', 'Programação Web', 'Gestão de Pessoas', 'Nutrição Clínica', 'Farmacologia'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-12 px-6 print:bg-white print:text-black print:p-0 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
           <div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Users className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Secretaria & Controle de Pessoas</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Gerenciamento seguro de alunos, professores, notas e frequências com privacidade.</p>
           </div>

           <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                 <UserPlus className="w-4 h-4" /> Cadastrar Pessoa
              </button>

              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                title="Exportar para Excel (.CSV bonito e formatado)"
              >
                 <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Exportar Excel (.CSV)
              </button>

              <button 
                onClick={handlePrintTable}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                 <Printer className="w-4 h-4 text-slate-500" /> Imprimir
              </button>

              <button 
                onClick={async () => { await onRefresh(); toast.success('Dados atualizados!'); }} 
                className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                title="Atualizar lista"
              >
                 <RefreshCw className="w-4 h-4" />
              </button>
           </div>
        </header>

        {/* Dash Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Pessoas</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{uniqueUsers.length}</h3>
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Users className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alunos</p>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{studentsCount}</h3>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <GraduationCap className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Professores / Gestão</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{teachersCount}</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média Frequência</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{avgFrequency}%</h3>
              </div>
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
           </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 print:hidden">
           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Buscar por nome ou Gmail..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                 />
              </div>

              <select 
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value as any)}
                 className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
              >
                 <option value="todos">Todos os Cargos</option>
                 <option value="student">Somente Alunos</option>
                 <option value="teacher">Somente Professores</option>
              </select>

              <select 
                 value={filterCourse}
                 onChange={(e) => setFilterCourse(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
              >
                 <option value="Todos">Todos os Cursos</option>
                 {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                 value={filterGrade}
                 onChange={(e) => setFilterGrade(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
              >
                 <option value="Todos">Todas as Séries</option>
                 {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <button 
                onClick={handleSaveGrades}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                 {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 <span>Salvar Notas</span>
              </button>
           </div>

           {/* Subject Selector Bar */}
           <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider shrink-0">Matéria para Lançamento:</span>
              {ALL_SUBJECTS.map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedSubject === subj 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {subj}
                </button>
              ))}
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Exibindo {filteredUsers.length} de {uniqueUsers.length} pessoas cadastradas
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Matéria Atual: {selectedSubject}
              </span>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">Pessoa / Gmail</th>
                       <th className="px-4 py-4">Cargo</th>
                       <th className="px-4 py-4">Curso / Série</th>
                       <th className="px-4 py-4 text-center">Frequência (%)</th>
                       <th className="px-4 py-4 text-center">Bim 1 ({selectedSubject})</th>
                       <th className="px-4 py-4 text-center">Bim 2 ({selectedSubject})</th>
                       <th className="px-4 py-4 text-center">Bim 3 ({selectedSubject})</th>
                       <th className="px-6 py-4 text-right print:hidden">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                          Nenhum registro encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-slate-900 dark:text-white leading-tight">{s.name}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{s.email}</p>
                          </td>

                          <td className="px-4 py-4">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                               s.role === 'teacher' 
                                 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                                 : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                             }`}>
                                {s.role === 'teacher' ? 'Professor / Gestão' : 'Aluno'}
                             </span>
                          </td>

                          <td className="px-4 py-4">
                             <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{s.course || 'Regular'}</p>
                             <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{s.grade || '1º Ano'}</p>
                          </td>

                          <td className="px-4 py-4 text-center">
                             {s.role === 'student' ? (
                               <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-16 h-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500"
                                  value={localFrequency[s.id] ?? 100}
                                  onChange={(e) => setLocalFrequency(prev => ({ ...prev, [s.id]: parseInt(e.target.value) || 0 }))}
                               />
                             ) : (
                               <span className="text-xs text-slate-400 font-bold">—</span>
                             )}
                          </td>

                          {['n1', 'n2', 'n3'].map((field) => (
                            <td key={field} className="px-4 py-4 text-center">
                               {s.role === 'student' ? (
                                 <input 
                                    type="text"
                                    placeholder="—"
                                    className="w-12 h-9 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded text-center text-sm font-bold text-blue-900 dark:text-blue-300 outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500"
                                    value={localGrades[s.id]?.[field as keyof typeof localGrades[string]] || ''}
                                    onChange={(e) => setLocalGrades(prev => ({ 
                                       ...prev, 
                                       [s.id]: { ...prev[s.id], [field]: e.target.value } 
                                     }))}
                                 />
                               ) : (
                                 <span className="text-xs text-slate-400 font-bold">—</span>
                               )}
                            </td>
                          ))}

                          <td className="px-6 py-4 text-right print:hidden">
                             <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => handleOpenEditModal(s)}
                                  className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all cursor-pointer" 
                                  title="Editar dados desta pessoa"
                                >
                                   <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setUserToDelete(s)}
                                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all cursor-pointer" 
                                  title="Excluir pessoa da tabela"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Global Announcement */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Mail className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Comunicado Oficial para Turmas</h3>
              </div>
              <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Assunto da mensagem..." 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                    value={announcement.subject}
                    onChange={(e) => setAnnouncement({...announcement, subject: e.target.value})}
                 />
                 <textarea 
                    placeholder="Escreva a mensagem importante para publicação geral na Sala de Aula..." 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none resize-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                    rows={4}
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                 />
                 <button 
                    disabled={sendingEmail}
                    onClick={handleBroadcast}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                 >
                    {sendingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Publicar Comunicado na Sala de Aula</span>
                 </button>

                 {comunicadosList.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                     <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Comunicados Publicados ({comunicadosList.length})</h4>
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                       {comunicadosList.map((com) => (
                         <div key={com.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3">
                           <div className="text-xs space-y-1">
                             <p className="font-bold text-slate-800 dark:text-slate-200">{com.texto}</p>
                             <p className="text-[10px] text-slate-400 font-medium">
                               {com.usuario} • {new Date(com.data).toLocaleDateString('pt-BR')} às {new Date(com.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                             </p>
                           </div>
                           <button
                             onClick={() => handleDeleteComunicado(com.id)}
                             className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all shrink-0 cursor-pointer"
                             title="Apagar comunicado"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Controle Seguro de Dados</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                   As alterações de notas, presenças e cadastros são salvas com segurança no Firebase Firestore. Senhas de acesso são estritamente confidenciais e nunca expostas nesta interface.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
                 Sincronização ativa • Privacidade e Proteção LGPD
              </div>
           </div>
        </div>
      </div>

      {/* --- MODAL 1: CADASTRAR PESSOA --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold">Cadastrar Nova Pessoa</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Maria Clara Silva"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Gmail / E-mail</label>
                  <input 
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Cargo / Função</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor / Gestão</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Frequência Inicial (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={newUser.frequencia}
                      onChange={(e) => setNewUser({ ...newUser, frequencia: parseInt(e.target.value) || 100 })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Curso</label>
                    <select 
                      value={newUser.course}
                      onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Série / Turma</label>
                    <select 
                      value={newUser.grade}
                      onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Cadastrando...' : 'Salvar Cadastro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: EDITAR PESSOA --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold">Editar Dados da Pessoa</h3>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Gmail / E-mail</label>
                  <input 
                    type="email"
                    required
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Cargo</label>
                    <select 
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor / Gestão</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Frequência (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editUser.frequencia}
                      onChange={(e) => setEditUser({ ...editUser, frequencia: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Curso</label>
                    <select 
                      value={editUser.course}
                      onChange={(e) => setEditUser({ ...editUser, course: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Série / Turma</label>
                    <select 
                      value={editUser.grade}
                      onChange={(e) => setEditUser({ ...editUser, grade: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Salvando...' : 'Atualizar Dados'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: CONFIRMAR EXCLUSÃO --- */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 text-center"
            >
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Excluir Registro?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Tem certeza que deseja remover <strong className="text-slate-900 dark:text-white">{userToDelete.name}</strong> ({userToDelete.email}) do sistema? Esta ação desvincula todas as notas e registros.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
