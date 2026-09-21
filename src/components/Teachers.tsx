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
import { useState, useEffect, FormEvent } from 'react';
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
    allUsers.forEach(u => {
      if (u.role === 'student') {
        const studentGrades = u.subjectGrades?.[selectedSubject] || { n1: '', n2: '', n3: '' };
        grades[u.id] = studentGrades;
        freqs[u.id] = u.frequencia || 100;
      }
    });
    setLocalGrades(grades);
    setLocalFrequency(freqs);
  }, [allUsers, selectedSubject]);

  // Filtering users based on role, search term, course and grade
  const filteredUsers = (allUsers || []).filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (roleFilter === 'student') matchesRole = u.role === 'student';
    if (roleFilter === 'teacher') matchesRole = u.role === 'teacher';

    const matchesCourse = filterCourse === 'Todos' || u.course === filterCourse;
    const matchesGrade = filterGrade === 'Todos' || u.grade === filterGrade;

    return matchesSearch && matchesRole && matchesCourse && matchesGrade;
  });

  const studentsCount = allUsers.filter(u => u.role === 'student').length;
  const teachersCount = allUsers.filter(u => u.role === 'teacher').length;
  const avgFrequency = (
    allUsers.filter(u => u.role === 'student').reduce((acc, s) => acc + (s.frequencia || 0), 0) /
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
      const newUid = `user_${Date.now()}`;
      const payload = {
        id: newUid,
        nome: newUser.name,
        email: newUser.email,
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

      toast.success(`Usuário ${newUser.name} cadastrado com sucesso no Firebase!`);
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
      const payload = {
        id: editUser.id,
        nome: editUser.name,
        email: editUser.email,
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

      toast.success('Usuário atualizado com sucesso no Firebase!');
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

      toast.success(`Usuário ${userToDelete.name} excluído do Firebase!`);
      setUserToDelete(null);
      await onRefresh();
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      toast.error('Erro ao excluir usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredUsers.length) {
      toast.error('Nenhum dado para exportar.');
      return;
    }

    const headers = ['ID', 'Nome', 'Email', 'Cargo', 'Curso', 'Serie/Turma', 'Frequencia (%)'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      u.role === 'teacher' ? 'Professor/Gestão' : 'Aluno',
      `"${u.course || ''}"`,
      `"${u.grade || ''}"`,
      u.frequencia || 100
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tabela_pessoas_cetep_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Tabela exportada em CSV com sucesso!');
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
        const student = allUsers.find(u => u.id === studentId);
        if (student) {
          const updatedSubjectGrades = { ...(student.subjectGrades || {}), [selectedSubject]: localGrades[studentId] };
          const { error } = await supabase
            .from('usuarios')
            .update({ notas: updatedSubjectGrades, frequencia: localFrequency[studentId] })
            .eq('id', studentId);
          if (!error) savedCount++;
        }
      }
      toast.success(`${savedCount} registros de notas e frequência salvos!`);
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
           <div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Secretaria & Controle de Pessoas</h1>
              </div>
              <p className="text-slate-500 mt-1">Gerenciamento completo de alunos, professores, notas e frequências.</p>
           </div>

           <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                 <Download className="w-4 h-4 text-emerald-600" /> Exportar CSV
              </button>

              <button 
                onClick={handlePrintTable}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                 <Printer className="w-4 h-4 text-slate-600" /> Imprimir
              </button>

              <button 
                onClick={async () => { await onRefresh(); toast.success('Dados atualizados!'); }} 
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                title="Atualizar"
              >
                 <RefreshCw className="w-4 h-4" />
              </button>
           </div>
        </header>

        {/* Dash Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pessoas</p>
                <h3 className="text-2xl font-bold text-slate-900">{allUsers.length}</h3>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                <Users className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alunos</p>
                <h3 className="text-2xl font-bold text-blue-600">{studentsCount}</h3>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Professores / Gestão</p>
                <h3 className="text-2xl font-bold text-emerald-600">{teachersCount}</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média Frequência</p>
                <h3 className="text-2xl font-bold text-slate-900">{avgFrequency}%</h3>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <BookOpen className="w-5 h-5" />
              </div>
           </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 print:hidden">
           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Buscar por nome ou e-mail..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                 />
              </div>

              <select 
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value as any)}
                 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none appearance-none"
              >
                 <option value="todos">Todos os Cargos</option>
                 <option value="student">Somente Alunos</option>
                 <option value="teacher">Somente Professores</option>
              </select>

              <select 
                 value={filterCourse}
                 onChange={(e) => setFilterCourse(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none appearance-none"
              >
                 <option value="Todos">Todos os Cursos</option>
                 {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                 value={filterGrade}
                 onChange={(e) => setFilterGrade(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none appearance-none"
              >
                 <option value="Todos">Todas as Séries</option>
                 {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <button 
                onClick={handleSaveGrades}
                disabled={loading}
                className="bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                 {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 <span>Salvar Notas</span>
              </button>
           </div>

           {/* Subject Selector Bar */}
           <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Matéria para Lançamento:</span>
              {ALL_SUBJECTS.map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedSubject === subj 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Exibindo {filteredUsers.length} de {allUsers.length} pessoas cadastradas
              </span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Matéria Atual: {selectedSubject}
              </span>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-4">Pessoa / Email</th>
                       <th className="px-4 py-4">Cargo</th>
                       <th className="px-4 py-4">Curso / Série</th>
                       <th className="px-4 py-4 text-center">Frequência (%)</th>
                       <th className="px-4 py-4 text-center">Bim 1 ({selectedSubject})</th>
                       <th className="px-4 py-4 text-center">Bim 2 ({selectedSubject})</th>
                       <th className="px-4 py-4 text-center">Bim 3 ({selectedSubject})</th>
                       <th className="px-6 py-4 text-right print:hidden">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                          Nenhum registro encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                             <p className="text-xs text-slate-400 font-mono mt-0.5">{s.email}</p>
                          </td>

                          <td className="px-4 py-4">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                               s.role === 'teacher' 
                                 ? 'bg-emerald-100 text-emerald-800' 
                                 : 'bg-blue-100 text-blue-800'
                             }`}>
                                {s.role === 'teacher' ? 'Professor / Gestão' : 'Aluno'}
                             </span>
                          </td>

                          <td className="px-4 py-4">
                             <p className="font-bold text-slate-800 text-xs">{s.course || 'Regular'}</p>
                             <p className="text-[11px] text-slate-400 font-medium">{s.grade || '1º Ano'}</p>
                          </td>

                          <td className="px-4 py-4 text-center">
                             {s.role === 'student' ? (
                               <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-16 h-9 bg-slate-100 border border-slate-200 rounded text-center text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                                  value={localFrequency[s.id] ?? 100}
                                  onChange={(e) => setLocalFrequency(prev => ({ ...prev, [s.id]: parseInt(e.target.value) || 0 }))}
                               />
                             ) : (
                               <span className="text-xs text-slate-300 font-bold">—</span>
                             )}
                          </td>

                          {['n1', 'n2', 'n3'].map((field) => (
                            <td key={field} className="px-4 py-4 text-center">
                               {s.role === 'student' ? (
                                 <input 
                                    type="text"
                                    placeholder="—"
                                    className="w-12 h-9 bg-blue-50/50 border border-blue-100 rounded text-center text-sm font-bold text-blue-900 outline-none focus:bg-white focus:border-blue-500"
                                    value={localGrades[s.id]?.[field as keyof typeof localGrades[string]] || ''}
                                    onChange={(e) => setLocalGrades(prev => ({ 
                                       ...prev, 
                                       [s.id]: { ...prev[s.id], [field]: e.target.value } 
                                     }))}
                                 />
                               ) : (
                                 <span className="text-xs text-slate-300 font-bold">—</span>
                               )}
                            </td>
                          ))}

                          <td className="px-6 py-4 text-right print:hidden">
                             <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => handleOpenEditModal(s)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                  title="Editar dados desta pessoa"
                                >
                                   <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setUserToDelete(s)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" 
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
           <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Mail className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Comunicado Oficial para Turmas</h3>
              </div>
              <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Assunto da mensagem..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    value={announcement.subject}
                    onChange={(e) => setAnnouncement({...announcement, subject: e.target.value})}
                 />
                 <textarea 
                    placeholder="Escreva a mensagem importante para publicação geral na Sala de Aula..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none resize-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    rows={4}
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                 />
                 <button 
                    disabled={sendingEmail}
                    onClick={handleBroadcast}
                    className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {sendingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Publicar Comunicado na Sala de Aula</span>
                 </button>

                 {comunicadosList.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                     <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Comunicados Publicados ({comunicadosList.length})</h4>
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                       {comunicadosList.map((com) => (
                         <div key={com.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                           <div className="text-xs space-y-1">
                             <p className="font-bold text-slate-800">{com.texto}</p>
                             <p className="text-[10px] text-slate-400 font-medium">
                               {com.usuario} • {new Date(com.data).toLocaleDateString('pt-BR')} às {new Date(com.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                             </p>
                           </div>
                           <button
                             onClick={() => handleDeleteComunicado(com.id)}
                             className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
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

           <div className="bg-slate-900 p-8 rounded-xl text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Controle Total de Dados</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                   Toda inclusão, alteração ou exclusão de usuários, notas e frequências é sincronizada em tempo real no banco de dados Supabase do CETEP.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
                 Sincronização ativa • Porta de Segurança do Sistema
              </div>
           </div>
        </div>
      </div>

      {/* --- MODAL 1: CADASTRAR PESSOA --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold">Cadastrar Nova Pessoa</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Maria Clara Silva"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">E-mail Corporativo / Pessoal</label>
                  <input 
                    type="email"
                    required
                    placeholder="exemplo@cetep.com.br"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cargo / Função</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor / Gestão</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Frequência Inicial (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={newUser.frequencia}
                      onChange={(e) => setNewUser({ ...newUser, frequencia: parseInt(e.target.value) || 100 })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Curso</label>
                    <select 
                      value={newUser.course}
                      onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Série / Turma</label>
                    <select 
                      value={newUser.grade}
                      onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold">Editar Dados da Pessoa</h3>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">E-mail</label>
                  <input 
                    type="email"
                    required
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cargo</label>
                    <select 
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor / Gestão</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Frequência (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editUser.frequencia}
                      onChange={(e) => setEditUser({ ...editUser, frequencia: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Curso</label>
                    <select 
                      value={editUser.course}
                      onChange={(e) => setEditUser({ ...editUser, course: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Série / Turma</label>
                    <select 
                      value={editUser.grade}
                      onChange={(e) => setEditUser({ ...editUser, grade: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-black transition-colors shadow-sm disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">Excluir Registro?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Tem certeza que deseja remover <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email}) do sistema? Esta ação desvincula todas as notas e registros.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
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
