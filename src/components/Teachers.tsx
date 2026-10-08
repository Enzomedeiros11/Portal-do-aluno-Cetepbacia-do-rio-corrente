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
  Briefcase,
  IdCard,
  CheckCircle2,
  KeyRound,
  FileSpreadsheet,
  Check,
  Clock,
  UserCheck,
  UserX,
  HeartHandshake
} from 'lucide-react';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { User, COURSES, GRADES, AuthorizedUser, PreRegistrationRequest } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { 
  seedAuthorizedUsersIfEmpty, 
  saveAuthorizedUser, 
  deleteAuthorizedUser, 
  getLocalAuthorizedUsers 
} from '../services/authorizedService';
import { 
  getLocalPreRegistrations, 
  approvePreRegistration, 
  rejectPreRegistration 
} from '../services/approvalService';

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

  // Direção Whitelist States
  const [authorizedList, setAuthorizedList] = useState<AuthorizedUser[]>(getLocalAuthorizedUsers());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'aprovacoes' | 'matriculas' | 'novo'>('aprovacoes');
  const [authSearchTerm, setAuthSearchTerm] = useState('');
  const [isAddingAuth, setIsAddingAuth] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [batchImportText, setBatchImportText] = useState('');
  const [newAuth, setNewAuth] = useState({
    name: '',
    matricula: '',
    email: '',
    emailResponsavel: '',
    nomeResponsavel: '',
    role: 'student' as 'student' | 'teacher',
    course: COURSES[1] || 'Técnico em Informática',
    grade: GRADES[0] || '1º Ano'
  });

  // Pre-Registration Approval States
  const [pendingRequests, setPendingRequests] = useState<PreRegistrationRequest[]>(getLocalPreRegistrations());
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [requestFilter, setRequestFilter] = useState<'aguardando_aprovacao' | 'aprovado' | 'recusado' | 'todos'>('aguardando_aprovacao');

  useEffect(() => {
    seedAuthorizedUsersIfEmpty().catch(console.warn);

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

    const unsubAuth = onSnapshot(collection(db, 'autorizados'), (snap) => {
      const list: AuthorizedUser[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      if (list.length > 0) {
        setAuthorizedList(list);
      }
    });

    const unsubRequests = onSnapshot(collection(db, 'solicitacoes_cadastro'), (snap) => {
      const list: PreRegistrationRequest[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      if (list.length > 0) {
        setPendingRequests(list);
      }
    });

    return () => {
      unsub();
      unsubAuth();
      unsubRequests();
    };
  }, []);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form States
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    matricula: '',
    role: 'student' as 'student' | 'teacher',
    course: COURSES[0] || 'Técnico em Informática',
    grade: GRADES[0] || '1º Ano',
    frequencia: 100
  });

  const [editUser, setEditUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'parent';
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
      const generatedMatricula = (newUser.matricula && newUser.matricula.trim()) 
        ? newUser.matricula.trim().toUpperCase() 
        : `2026${Math.floor(100 + Math.random() * 900)}`;

      const payload = {
        id: newUid,
        nome: newUser.name.trim(),
        email: cleanEmail,
        matricula: generatedMatricula,
        tipo: newUser.role,
        curso: newUser.course,
        grade: newUser.grade,
        frequencia: newUser.frequencia || 100,
        notas: {},
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase Firestore
      await setDoc(doc(db, 'usuarios', newUid), payload);

      // Auto-authorize in /autorizados whitelist so student can log in
      await saveAuthorizedUser({
        id: cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        matricula: generatedMatricula,
        email: cleanEmail,
        name: newUser.name.trim(),
        role: newUser.role,
        course: newUser.course,
        grade: newUser.grade,
        status: 'ativo',
        cadastradoPor: currentUser?.name || 'Direção CETEP',
        isActivated: true
      });

      // Also upsert in Supabase for backwards compatibility
      await supabase.from('usuarios').upsert([payload]);

      toast.success(`Usuário ${newUser.name} cadastrado e autorizado com matrícula ${generatedMatricula}!`);
      setIsAddModalOpen(false);
      setNewUser({
        name: '',
        email: '',
        matricula: '',
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

  const handleSaveNewAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAuth.name.trim() || !newAuth.email.trim() || !newAuth.matricula.trim()) {
      toast.error('Preencha Nome, Matrícula e Gmail.');
      return;
    }
    setLoading(true);
    try {
      await saveAuthorizedUser({
        id: newAuth.matricula.trim().toUpperCase(),
        matricula: newAuth.matricula.trim().toUpperCase(),
        email: newAuth.email.trim().toLowerCase(),
        name: newAuth.name.trim(),
        role: newAuth.role,
        course: newAuth.course,
        grade: newAuth.grade,
        emailResponsavel: newAuth.emailResponsavel.trim() ? newAuth.emailResponsavel.trim().toLowerCase() : undefined,
        nomeResponsavel: newAuth.nomeResponsavel.trim() || undefined,
        status: 'ativo',
        cadastradoPor: currentUser?.name || 'Direção CETEP',
        isActivated: false
      });
      toast.success(`Matrícula ${newAuth.matricula} (${newAuth.name}) autorizada pela Direção!`);
      setIsAddingAuth(false);
      setNewAuth({
        name: '',
        matricula: '',
        email: '',
        emailResponsavel: '',
        nomeResponsavel: '',
        role: 'student',
        course: COURSES[1] || 'Técnico em Informática',
        grade: GRADES[0] || '1º Ano'
      });
    } catch (e) {
      toast.error('Erro ao salvar autorização.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuth = async (id: string, name: string) => {
    if (!window.confirm(`Deseja revogar a autorização de ${name}? O usuário não conseguirá mais entrar no portal.`)) return;
    setLoading(true);
    try {
      await deleteAuthorizedUser(id);
      toast.success(`Autorização de ${name} revogada.`);
    } catch (e) {
      toast.error('Erro ao revogar autorização.');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchImport = async () => {
    if (!batchImportText.trim()) {
      toast.error('Cole as linhas com os dados.');
      return;
    }
    setLoading(true);
    try {
      const lines = batchImportText.split('\n');
      let count = 0;
      for (const line of lines) {
        const parts = line.split(/[,;\t]/).map(p => p.trim());
        if (parts.length >= 3) {
          const [mat, nome, email, curso, grade] = parts;
          if (mat && email) {
            await saveAuthorizedUser({
              id: mat.toUpperCase(),
              matricula: mat.toUpperCase(),
              email: email.toLowerCase(),
              name: nome || 'Estudante CETEP',
              role: 'student',
              course: curso || 'Técnico em Informática',
              grade: grade || '1º Ano',
              status: 'ativo',
              cadastradoPor: 'Importação em Lote',
              isActivated: false
            });
            count++;
          }
        }
      }
      toast.success(`${count} matrículas importadas e autorizadas com sucesso!`);
      setBatchImportText('');
      setIsBatchImportOpen(false);
    } catch (e) {
      toast.error('Erro na importação em lote.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for approving/rejecting pre-registration requests
  const handleApproveRequest = async (req: PreRegistrationRequest) => {
    setLoading(true);
    try {
      await approvePreRegistration(req, currentUser?.name || 'Professor Enzo Medeiros');
      toast.success(
        `Cadastro de ${req.name} (${req.role === 'parent' ? '👨‍👩‍👧 Responsável' : '🎓 Aluno'}) aprovado com sucesso! Acesso liberado no portal.`
      );
      await onRefresh();
    } catch (e) {
      console.error('Error approving request:', e);
      toast.error('Erro ao aprovar solicitação de cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (req: PreRegistrationRequest) => {
    if (!window.confirm(`Deseja recusar a solicitação de cadastro de ${req.name}?`)) return;
    setLoading(true);
    try {
      await rejectPreRegistration(req.id, 'Dados não conferem com o cadastro oficial da Secretaria');
      toast.info(`Solicitação de ${req.name} recusada.`);
    } catch (e) {
      toast.error('Erro ao recusar solicitação.');
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
                onClick={() => {
                  setAuthModalTab('aprovacoes');
                  setIsAuthModalOpen(true);
                }}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                title="Pessoas que preencheram o pré-cadastro e aguardam aprovação do Professor"
              >
                 <Clock className="w-4 h-4 text-slate-950" />
                 <span>Aprovações Pendentes</span>
                 {pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length > 0 && (
                   <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-xs animate-bounce">
                     {pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length}
                   </span>
                 )}
              </button>

              <button 
                onClick={() => {
                  const hasPending = pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length > 0;
                  setAuthModalTab(hasPending ? 'aprovacoes' : 'matriculas');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Lista oficial de Matrículas e Aprovações de Pais e Alunos pela Direção"
              >
                 <ShieldCheck className="w-4 h-4" /> Matrículas & Direção
              </button>

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
                             <div className="flex items-center gap-2 flex-wrap">
                               <p className="font-bold text-slate-900 dark:text-white leading-tight">{s.name}</p>
                               {s.matricula && (
                                 <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800/60">
                                   {s.matricula}
                                 </span>
                               )}
                             </div>
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

      {/* --- MODAL DE APROVAÇÕES PENDENTES DA CONTA DE PROFESSOR --- */}
      <AnimatePresence>
        {isRequestsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span>Fila de Aprovações de Cadastro</span>
                      <span className="text-[10px] uppercase font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        Exclusivo Professor Enzo
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Alunos e responsáveis que preencheram o pré-cadastro com matrícula, Gmail e senha aguardando sua aprovação para logar.
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsRequestsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sub-bar / Filters */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestFilter('aguardando_aprovacao')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      requestFilter === 'aguardando_aprovacao'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Aguardando Aprovação ({pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestFilter('aprovado')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      requestFilter === 'aprovado'
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Já Aprovados ({pendingRequests.filter(r => r.status === 'aprovado').length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestFilter('todos')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      requestFilter === 'todos'
                        ? 'bg-blue-600 text-white font-black shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>Todos ({pendingRequests.length})</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {requestFilter === 'aguardando_aprovacao' && 'Apenas contas pendentes de liberação'}
                </div>
              </div>

              {/* Table / List of Requests */}
              <div className="flex-1 overflow-y-auto p-6">
                {pendingRequests.filter(r => requestFilter === 'todos' || r.status === requestFilter).length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tudo em dia!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Nenhuma solicitação encontrada neste filtro. Quando novos alunos ou responsáveis fizerem o pré-cadastro, eles aparecerão aqui para sua aprovação.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests
                      .filter(r => requestFilter === 'todos' || r.status === requestFilter)
                      .map((req) => (
                        <div 
                          key={req.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              req.role === 'parent'
                                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            }`}>
                              {req.role === 'parent' ? <HeartHandshake className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                  {req.name}
                                </h4>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  req.role === 'parent'
                                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                                    : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                                }`}>
                                  {req.role === 'parent' ? '👨‍👩‍👧 Responsável (Pai/Mãe)' : '🎓 Aluno(a)'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                  <IdCard className="w-3.5 h-3.5" />
                                  <span>Matrícula: {req.matricula}</span>
                                  {req.role === 'parent' && <span className="text-[10px] text-slate-400 font-normal">(mesma do filho)</span>}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                                  <Mail className="w-3.5 h-3.5" /> {req.email}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                <strong>Curso:</strong> {req.course} • <strong>Série:</strong> {req.grade} • <span className="text-slate-400">Enviado em: {new Date(req.createdAt).toLocaleString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons or Status Badge */}
                          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                            {req.status === 'aguardando_aprovacao' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRejectRequest(req)}
                                  disabled={loading}
                                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Recusar</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleApproveRequest(req)}
                                  disabled={loading}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  <span>Aprovar Cadastro</span>
                                </button>
                              </>
                            ) : req.status === 'aprovado' ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Aprovado & Liberado</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-800">
                                <UserX className="w-3.5 h-3.5 text-rose-600" />
                                <span>Solicitação Recusada</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
                <span>
                  Pendentes de aprovação: <strong>{pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length}</strong> de {pendingRequests.length} solicitações
                </span>
                <button
                  onClick={() => setIsRequestsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DA DIREÇÃO: GESTÃO DE MATRÍCULAS & AUTORIZADOS --- */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span>Matrículas & Direção Escolar</span>
                      <span className="text-[10px] uppercase font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                        Exclusivo Direção CETEP
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Aprovação de pré-cadastros de pais e alunos, matrículas ativas e controle de acesso.
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-6 pt-3 gap-2 overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('aprovacoes')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    authModalTab === 'aprovacoes'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Aprovar Pais e Alunos</span>
                  {pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length > 0 && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded-full animate-bounce">
                      {pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModalTab('matriculas')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    authModalTab === 'matriculas'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Matrículas Ativas ({authorizedList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('matriculas');
                    setIsAddingAuth(true);
                    setIsBatchImportOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    authModalTab === 'matriculas' && isAddingAuth
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Cadastrar Matrícula / Lote</span>
                </button>
              </div>

              {/* TAB 1: APROVAÇÕES DE PAIS E ALUNOS */}
              {authModalTab === 'aprovacoes' ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Filter Sub-bar */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRequestFilter('aguardando_aprovacao')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          requestFilter === 'aguardando_aprovacao'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Pendentes ({pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestFilter('aprovado')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          requestFilter === 'aprovado'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Aprovados ({pendingRequests.filter(r => r.status === 'aprovado').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestFilter('todos')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          requestFilter === 'todos'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Todos ({pendingRequests.length})
                      </button>
                    </div>

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Aprovação imediata de novos acessos de pais e estudantes
                    </span>
                  </div>

                  {/* Requests List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {pendingRequests.filter(r => requestFilter === 'todos' || r.status === requestFilter).length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tudo em dia!</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                          Nenhuma solicitação encontrada neste filtro. Quando pais ou alunos preencherem o formulário de cadastro, eles aparecerão aqui para sua aprovação.
                        </p>
                      </div>
                    ) : (
                      pendingRequests
                        .filter(r => requestFilter === 'todos' || r.status === requestFilter)
                        .map((req) => (
                          <div 
                            key={req.id}
                            className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                req.role === 'parent'
                                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              }`}>
                                {req.role === 'parent' ? <HeartHandshake className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {req.name}
                                  </h4>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    req.role === 'parent'
                                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                                      : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                                  }`}>
                                    {req.role === 'parent' ? '👨‍👩‍👧 Responsável (Pai/Mãe)' : '🎓 Aluno(a)'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <IdCard className="w-3.5 h-3.5" />
                                    <span>Matrícula: {req.matricula}</span>
                                    {req.role === 'parent' && <span className="text-[10px] text-slate-400 font-normal">(filho(a))</span>}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                                    <Mail className="w-3.5 h-3.5" /> {req.email}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  <strong>Curso:</strong> {req.course} • <strong>Série:</strong> {req.grade} • <span className="text-slate-400">Enviado em: {new Date(req.createdAt).toLocaleString('pt-BR')}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                              {req.status === 'aguardando_aprovacao' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectRequest(req)}
                                    disabled={loading}
                                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Recusar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleApproveRequest(req)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    <span>Aprovar Cadastro</span>
                                  </button>
                                </>
                              ) : req.status === 'aprovado' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Aprovado & Liberado</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-800">
                                  <UserX className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Solicitação Recusada</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Sub-bar / Actions */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar por matrícula, nome ou gmail..."
                          value={authSearchTerm}
                          onChange={(e) => setAuthSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setAuthModalTab('aprovacoes')}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Ver solicitações de pais e alunos aguardando aprovação"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Aprovações ({pendingRequests.filter(r => r.status === 'aguardando_aprovacao').length})</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          setIsAddingAuth(!isAddingAuth);
                          setIsBatchImportOpen(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAddingAuth 
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingAuth ? 'Fechar Formulário' : '+ Nova Matrícula'}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          setIsBatchImportOpen(!isBatchImportOpen);
                          setIsAddingAuth(false);
                        }}
                        className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Importar Lote</span>
                      </button>
                    </div>
                  </div>

              {/* Collapsible: Add Single Authorized Student */}
              <AnimatePresence>
                {isAddingAuth && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleSaveNewAuth}
                    className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30 overflow-hidden shrink-0 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" /> Cadastrar Aluno ou Professor Autorizado
                      </p>
                      <button 
                        type="button"
                        onClick={() => {
                          const nextNum = 2026000 + authorizedList.length + 1;
                          setNewAuth({ ...newAuth, matricula: nextNum.toString() });
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        ⚡ Gerar Matrícula 2026 Automática
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Matrícula Escolar</label>
                        <input 
                          type="text"
                          required
                          placeholder="Ex: 2026006"
                          value={newAuth.matricula}
                          onChange={(e) => setNewAuth({ ...newAuth, matricula: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Nome Completo</label>
                        <input 
                          type="text"
                          required
                          placeholder="Ex: Gabriel Souza"
                          value={newAuth.name}
                          onChange={(e) => setNewAuth({ ...newAuth, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Gmail Oficial</label>
                        <input 
                          type="email"
                          required
                          placeholder="gabriel.souza@gmail.com"
                          value={newAuth.email}
                          onChange={(e) => setNewAuth({ ...newAuth, email: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Gmail do Responsável (Pai/Mãe - Opcional)</label>
                        <input 
                          type="email"
                          placeholder="pais@gmail.com"
                          value={newAuth.emailResponsavel}
                          onChange={(e) => setNewAuth({ ...newAuth, emailResponsavel: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Nome do Responsável (Opcional)</label>
                        <input 
                          type="text"
                          placeholder="Ex: Márcia Silva (Mãe)"
                          value={newAuth.nomeResponsavel}
                          onChange={(e) => setNewAuth({ ...newAuth, nomeResponsavel: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Curso Técnico</label>
                        <select 
                          value={newAuth.course}
                          onChange={(e) => setNewAuth({ ...newAuth, course: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-white outline-none"
                        >
                          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Série / Turma</label>
                        <select 
                          value={newAuth.grade}
                          onChange={(e) => setNewAuth({ ...newAuth, grade: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-white outline-none"
                        >
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          {loading ? 'Salvando...' : 'Salvar Autorização'}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Collapsible: Batch Import */}
              <AnimatePresence>
                {isBatchImportOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-5 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 overflow-hidden shrink-0 space-y-3"
                  >
                    <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Importar Várias Matrículas (CSV ou Linhas)
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Cole uma linha por aluno no formato: <strong>Matrícula, Nome, Gmail, Curso, Série</strong>
                    </p>
                    <textarea 
                      rows={4}
                      placeholder={`2026010, Mariana Dias, mariana@gmail.com, Técnico em Informática, 1º Ano\n2026011, Felipe Ramos, felipe@gmail.com, Enfermagem, 2º Ano`}
                      value={batchImportText}
                      onChange={(e) => setBatchImportText(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setIsBatchImportOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        onClick={handleBatchImport}
                        disabled={loading}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Processando...' : 'Importar Matrículas'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table / List */}
              <div className="flex-1 overflow-y-auto p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Matrícula</th>
                      <th className="pb-3">Nome do Aluno / Servidor</th>
                      <th className="pb-3">Gmail Autorizado</th>
                      <th className="pb-3">Curso & Série</th>
                      <th className="pb-3">Situação</th>
                      <th className="pb-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {authorizedList
                      .filter(u => {
                        const term = authSearchTerm.toLowerCase();
                        return (
                          (u.matricula || '').toLowerCase().includes(term) ||
                          (u.name || '').toLowerCase().includes(term) ||
                          (u.email || '').toLowerCase().includes(term) ||
                          (u.course || '').toLowerCase().includes(term)
                        );
                      })
                      .map((item) => (
                        <tr key={item.id || item.matricula} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {item.matricula}
                          </td>
                          <td className="py-3 font-bold text-slate-800 dark:text-white">
                            {item.name}
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">
                            {item.email}
                          </td>
                          <td className="py-3 text-slate-500 dark:text-slate-400">
                            {item.course} • {item.grade}
                          </td>
                          <td className="py-3">
                            {item.isActivated ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Conta Ativa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                Primeiro Acesso Pendente
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {item.email !== 'enzomedeirosdasilva6@gmail.com' && item.email !== 'adm@gmail.com' && (
                              <button
                                onClick={() => handleDeleteAuth(item.id, item.name)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                                title="Revogar autorização"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
                <span>Total de pessoas autorizadas pela Direção: <strong>{authorizedList.length}</strong></span>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Matrícula Escolar (Opcional)</label>
                    <input 
                      type="text"
                      placeholder="Ex: 2026010 (ou auto)"
                      value={newUser.matricula}
                      onChange={(e) => setNewUser({ ...newUser, matricula: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 uppercase"
                    />
                  </div>
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
