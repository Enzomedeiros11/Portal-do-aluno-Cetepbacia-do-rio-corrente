import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Layout, 
  Users, 
  FileText, 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Search,
  MessageSquare,
  ChevronRight,
  ClipboardList,
  User as UserIcon,
  ShieldCheck,
  Bell,
  Trash2,
  Lock,
  Unlock,
  Crown,
  GraduationCap
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { requestPushNotificationPermission } from '../services/messagingService';

interface ClassroomProps {
  user: User | null;
  allUsers: User[];
}

interface Message {
  id: string;
  texto: string;
  usuario: string;
  email: string;
  role?: 'student' | 'teacher';
  canal: string;
  avatar?: string;
  arquivo_url?: string;
  arquivo_nome?: string;
  arquivo_tipo?: string;
  data: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  course: string;
  keywords: string[];
  color: string;
  description: string;
}

export const ALL_CLASS_GROUPS: ClassGroup[] = [
  // 1º Ano
  { id: '1_info', name: '1º Info', grade: '1º Ano', course: 'Técnico em Informática', keywords: ['info', 'informática', 'informatica'], color: 'bg-indigo-600', description: 'Grupo exclusivo da turma do 1º Ano de Informática.' },
  { id: '1_analises', name: '1º Análises', grade: '1º Ano', course: 'Análises Clínicas', keywords: ['análises', 'analises', 'clínicas', 'clinicas'], color: 'bg-teal-600', description: 'Grupo exclusivo da turma do 1º Ano de Análises Clínicas.' },
  { id: '1_enfermagem', name: '1º Enfermagem', grade: '1º Ano', course: 'Técnico em Enfermagem', keywords: ['enfermagem', 'saúde', 'saude'], color: 'bg-rose-600', description: 'Grupo exclusivo da turma do 1º Ano de Enfermagem.' },
  { id: '1_adm', name: '1º Administração', grade: '1º Ano', course: 'Técnico em Administração', keywords: ['adm', 'administração', 'administracao'], color: 'bg-amber-600', description: 'Grupo exclusivo da turma do 1º Ano de Administração.' },
  { id: '1_edif', name: '1º Edificações', grade: '1º Ano', course: 'Técnico em Edificações', keywords: ['edif', 'edificações', 'edificacoes'], color: 'bg-blue-600', description: 'Grupo exclusivo da turma do 1º Ano de Edificações.' },
  { id: '1_agro', name: '1º Agropecuária', grade: '1º Ano', course: 'Técnico em Agropecuária', keywords: ['agro', 'agropecuária', 'agropecuaria'], color: 'bg-emerald-600', description: 'Grupo exclusivo da turma do 1º Ano de Agropecuária.' },

  // 2º Ano
  { id: '2_info', name: '2º Info', grade: '2º Ano', course: 'Técnico em Informática', keywords: ['info', 'informática', 'informatica'], color: 'bg-indigo-700', description: 'Grupo exclusivo da turma do 2º Ano de Informática.' },
  { id: '2_analises', name: '2º Análises', grade: '2º Ano', course: 'Análises Clínicas', keywords: ['análises', 'analises', 'clínicas', 'clinicas'], color: 'bg-teal-700', description: 'Grupo exclusivo da turma do 2º Ano de Análises Clínicas.' },
  { id: '2_enfermagem', name: '2º Enfermagem', grade: '2º Ano', course: 'Técnico em Enfermagem', keywords: ['enfermagem', 'saúde', 'saude'], color: 'bg-rose-700', description: 'Grupo exclusivo da turma do 2º Ano de Enfermagem.' },
  { id: '2_adm', name: '2º Administração', grade: '2º Ano', course: 'Técnico em Administração', keywords: ['adm', 'administração', 'administracao'], color: 'bg-amber-700', description: 'Grupo exclusivo da turma do 2º Ano de Administração.' },
  { id: '2_edif', name: '2º Edificações', grade: '2º Ano', course: 'Técnico em Edificações', keywords: ['edif', 'edificações', 'edificacoes'], color: 'bg-blue-700', description: 'Grupo exclusivo da turma do 2º Ano de Edificações.' },
  { id: '2_agro', name: '2º Agropecuária', grade: '2º Ano', course: 'Técnico em Agropecuária', keywords: ['agro', 'agropecuária', 'agropecuaria'], color: 'bg-emerald-700', description: 'Grupo exclusivo da turma do 2º Ano de Agropecuária.' },

  // 3º Ano
  { id: '3_info', name: '3º Info', grade: '3º Ano', course: 'Técnico em Informática', keywords: ['info', 'informática', 'informatica'], color: 'bg-indigo-800', description: 'Grupo exclusivo da turma do 3º Ano de Informática.' },
  { id: '3_analises', name: '3º Análises', grade: '3º Ano', course: 'Análises Clínicas', keywords: ['análises', 'analises', 'clínicas', 'clinicas'], color: 'bg-teal-800', description: 'Grupo exclusivo da turma do 3º Ano de Análises Clínicas.' },
  { id: '3_enfermagem', name: '3º Enfermagem', grade: '3º Ano', course: 'Técnico em Enfermagem', keywords: ['enfermagem', 'saúde', 'saude'], color: 'bg-rose-800', description: 'Grupo exclusivo da turma do 3º Ano de Enfermagem.' },
  { id: '3_adm', name: '3º Administração', grade: '3º Ano', course: 'Técnico em Administração', keywords: ['adm', 'administração', 'administracao'], color: 'bg-amber-800', description: 'Grupo exclusivo da turma do 3º Ano de Administração.' },
  { id: '3_edif', name: '3º Edificações', grade: '3º Ano', course: 'Técnico em Edificações', keywords: ['edif', 'edificações', 'edificacoes'], color: 'bg-blue-800', description: 'Grupo exclusivo da turma do 3º Ano de Edificações.' },
  { id: '3_agro', name: '3º Agropecuária', grade: '3º Ano', course: 'Técnico em Agropecuária', keywords: ['agro', 'agropecuária', 'agropecuaria'], color: 'bg-emerald-800', description: 'Grupo exclusivo da turma do 3º Ano de Agropecuária.' },
];

export function checkUserAccessToGroup(u: User | null, grp: ClassGroup): boolean {
  if (!u) return false;
  // Full admin permission for Enzo Medeiros and official teachers
  if (u.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' || u.role === 'teacher') {
    return true;
  }

  // Student access rules (must match grade number and course keyword)
  const userGrade = (u.grade || '').toLowerCase();
  const grpGradeNum = grp.grade.charAt(0); // '1', '2', or '3'

  let matchesGrade = false;
  if (userGrade.includes('1')) {
    matchesGrade = grpGradeNum === '1';
  } else if (userGrade.includes('2')) {
    matchesGrade = grpGradeNum === '2';
  } else if (userGrade.includes('3')) {
    matchesGrade = grpGradeNum === '3';
  } else {
    // If grade is not specified, default allow grade match
    matchesGrade = true;
  }

  const userCourse = (u.course || '').toLowerCase();
  let matchesCourse = grp.keywords.some(k => userCourse.includes(k));
  if (!userCourse || userCourse.includes('todos') || userCourse.includes('geral')) {
    matchesCourse = true;
  }

  return matchesGrade && matchesCourse;
}

export default function Classroom({ user, allUsers }: ClassroomProps) {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'Todos' | '1º Ano' | '2º Ano' | '3º Ano'>('Todos');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEnzoOrTeacher = user?.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' || user?.role === 'teacher';

  useEffect(() => {
    if (user) {
      // Subscribe to Firebase Firestore 'mensagens' collection
      const msgsCol = collection(db, 'mensagens');
      const unsubscribe = onSnapshot(msgsCol, (snapshot) => {
        const msgsList: Message[] = [];
        snapshot.forEach((docSnap) => {
          msgsList.push({ id: docSnap.id, ...docSnap.data() } as Message);
        });
        // Sort by date ascending
        msgsList.sort((a, b) => new Date(a.data || 0).getTime() - new Date(b.data || 0).getTime());
        setMessages(msgsList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'mensagens');
        fetchMessagesFallback();
      });

      return () => unsubscribe();
    }
  }, [user]);

  const fetchMessagesFallback = async () => {
    try {
      const { data } = await supabase
        .from('mensagens')
        .select('*')
        .order('data', { ascending: true })
        .limit(100);
      if (data) setMessages(data as any);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedClass]);

  const displayGroups = ALL_CLASS_GROUPS.filter(grp => {
    // For students (not Enzo / not Teacher), hide all groups except the student's official group
    if (!isEnzoOrTeacher) {
      const hasAccess = checkUserAccessToGroup(user, grp);
      if (!hasAccess) return false;
    }

    const matchesSearch = grp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          grp.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          grp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGradeFilter = gradeFilter === 'Todos' || grp.grade === gradeFilter;
    return matchesSearch && matchesGradeFilter;
  });

  const handleSelectGroup = (grp: ClassGroup) => {
    const hasAccess = checkUserAccessToGroup(user, grp);
    if (!hasAccess) {
      const studentOfficialGroup = ALL_CLASS_GROUPS.find(g => checkUserAccessToGroup(user, g));
      toast.error(`Acesso Restrito ao Grupo ${grp.name}`, {
        description: `Sua conta pertence ao ${user?.grade || 'outro ano'}. Alunos do 1º ano não podem acessar o chat do 2º ou 3º ano. O seu grupo oficial é o ${studentOfficialGroup?.name || 'sua turma'}.`
      });
      return;
    }
    setSelectedClass(grp);
  };

  const handleSendMessage = async (e: FormEvent, fileData?: { url: string, name: string, type: string }) => {
    if (e) e.preventDefault();
    if (!message.trim() && !fileData) return;

    const newMessage = {
      texto: message || `Enviou um arquivo: ${fileData?.name}`,
      usuario: user?.name || 'Estudante',
      email: user?.email || '',
      canal: selectedClass?.id || 'Geral',
      avatar: user?.avatar || null,
      arquivo_url: fileData?.url || null,
      arquivo_nome: fileData?.name || null,
      arquivo_tipo: fileData?.type || null,
      data: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'mensagens'), newMessage);
      setMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem para Firebase:', err);
      // Fallback
      await supabase.from('mensagens').insert([newMessage]);
      setMessage('');
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id || 'anon'}/${Math.random()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('arquivos_turma')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('arquivos_turma')
        .getPublicUrl(filePath);

      await handleSendMessage(null as any, {
        url: publicUrl,
        name: file.name,
        type: file.type
      });

      toast.success('Arquivo enviado!');
    } catch (err: any) {
      toast.error('Erro ao enviar arquivo.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteDoc(doc(db, 'mensagens', msgId));
      await supabase.from('mensagens').delete().eq('id', msgId);
      toast.success('Comunicado/mensagem excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir mensagem:', err);
      toast.error('Erro ao excluir do banco de dados.');
    }
  };

  const classStudents = allUsers.filter(u => 
    u.role === 'student' && selectedClass && checkUserAccessToGroup(u, selectedClass)
  );

  const officialStaff = allUsers.filter(u => u.role === 'teacher' || u.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com');

  if (selectedClass) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex flex-col">
        {/* Header Sala */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-40 fixed top-16 left-0 right-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 leading-tight text-lg">Grupo {selectedClass.name}</h2>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full uppercase">
                    {selectedClass.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{selectedClass.course} • CETEP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               {isEnzoOrTeacher && (
                 <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl">
                   <Crown className="w-3.5 h-3.5 text-amber-600" /> Acesso Total Permitido
                 </span>
               )}
               <button 
                 onClick={() => navigate('/assignments')}
                 className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
               >
                  <ClipboardList className="w-4 h-4" /> Atividades
               </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 mt-20 p-6 mb-20">
          {/* Feed principal do Grupo */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Chat Oficial da Turma {selectedClass.name}</h3>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ao Vivo</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[600px] scroll-smooth">
              {messages.filter(m => m.canal === selectedClass.id || m.canal === selectedClass.name || m.canal === 'Geral').length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
                   <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                   <p className="text-sm font-bold text-slate-700">O chat da turma {selectedClass.name} está pronto!</p>
                   <p className="text-xs text-slate-400 mt-1">Envie a primeira mensagem para se conectar com seus colegas.</p>
                </div>
              )}
              {messages
                .filter(m => m.canal === selectedClass.id || m.canal === selectedClass.name || m.canal === 'Geral')
                .map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.email === user?.email ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${msg.canal === 'Geral' ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    {(msg.usuario || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className={`max-w-[80%] ${msg.email === user?.email ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                          {msg.canal === 'Geral' ? '📢 COMUNICADO GERAL' : msg.usuario}
                        </span>
                        {msg.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-black rounded">PROFE ENZO</span>
                        )}
                        <span className="text-[9px] text-slate-400">{new Date(msg.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {(user?.role === 'teacher' || user?.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' || msg.email === user?.email) && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Apagar mensagem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      msg.canal === 'Geral'
                        ? 'bg-amber-50 text-slate-900 border-2 border-amber-200'
                        : msg.email === user?.email 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-xs' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80'
                    }`}>
                      {msg.texto}
                      {msg.arquivo_url && (
                        <div 
                          className="mt-3 p-3 bg-black/5 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:bg-black/10 transition-colors"
                          onClick={() => window.open(msg.arquivo_url, '_blank')}
                        >
                           <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="text-[10px] font-bold truncate">{msg.arquivo_nome}</span>
                           </div>
                           <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-200">
               <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder={`Enviar mensagem no grupo ${selectedClass.name}...`} 
                    className="flex-1 px-3 py-2 outline-none text-sm font-medium"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim() && !isUploading}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
               </div>
               {isUploading && (
                 <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                 </div>
               )}
            </form>
          </div>

          {/* Lateral */}
          <div className="w-full lg:w-80 space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                   <Users className="w-3.5 h-3.5 text-blue-600" /> Integrantes da Turma {selectedClass.name}
                </h4>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {officialStaff.map(s => (
                     <div key={s.id} className="flex items-center gap-3">
                        <div className="relative">
                           <img src={s.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                           <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full bg-emerald-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900 leading-none">{s.name}</p>
                           <p className="text-[9px] font-black text-amber-600 uppercase mt-1">Docente / Admin</p>
                        </div>
                     </div>
                   ))}
                   <div className="pt-2 border-t border-slate-100">
                      {classStudents.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium py-2 text-center">Nenhum colega desta turma logado recentemente.</p>
                      ) : (
                        classStudents.map(s => (
                          <div key={s.id} className="flex items-center gap-3 mt-3">
                             <div className="relative">
                                <img src={s.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${s.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                             </div>
                             <div>
                               <p className="text-xs font-semibold text-slate-800">{s.name}</p>
                               <p className="text-[9px] text-slate-400 font-medium">{s.grade}</p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                <Users className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Grupos das Turmas</h1>
                <p className="text-slate-500 font-medium text-sm mt-0.5">Salas de chat e espaço oficial exclusivo por ano e curso do CETEP.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar grupo (ex: 1 Info, 2 Analises)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-xs font-semibold shadow-xs"
              />
            </div>
          </div>
        </header>

        {/* Permissão Badge Alert */}
        <div className="mb-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            {isEnzoOrTeacher ? (
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-extrabold text-slate-900">
                {isEnzoOrTeacher 
                  ? '👑 Acesso Especial Concedido (Professor / Admin Enzo Medeiros)' 
                  : `🎓 Aluno registrado no ${user?.grade || 'Ano Atual'} • ${user?.course || 'Curso Técnico'}`}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {isEnzoOrTeacher 
                  ? 'Você tem permissão total para visualizar, entrar e enviar mensagens em qualquer grupo de turma.' 
                  : 'Para garantir o foco pedagógico, cada aluno possui acesso privado somente ao grupo da sua turma.'}
              </p>
            </div>
          </div>

          {/* Filter by Grade */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            {(['Todos', '1º Ano', '2º Ano', '3º Ano'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  gradeFilter === g ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Layout em 3 Fileiras / Colunas Organizadas (1º Ano | 2º Ano | 3º Ano) */}
        <div className={`grid grid-cols-1 ${isEnzoOrTeacher ? 'lg:grid-cols-3' : 'max-w-xl mx-auto'} gap-8`}>
          {(['1º Ano', '2º Ano', '3º Ano'] as const).map((yearGrade, colIdx) => {
            const yearGroups = displayGroups.filter(grp => grp.grade === yearGrade);
            if (yearGroups.length === 0) {
              return null;
            }
            if (gradeFilter !== 'Todos' && gradeFilter !== yearGrade) {
              return null;
            }

            const headerColors = [
              { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200', badgeBg: 'bg-indigo-50', title: '1º Ano' },
              { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200', badgeBg: 'bg-teal-50', title: '2º Ano' },
              { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-200', badgeBg: 'bg-amber-50', title: '3º Ano' },
            ][colIdx];

            return (
              <div key={yearGrade} className="flex flex-col space-y-4">
                {/* Header da Coluna/Fileira */}
                <div className={`p-4 rounded-2xl bg-white border ${headerColors.border} shadow-xs flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${headerColors.bg} text-white font-black text-sm rounded-xl flex items-center justify-center shadow-xs`}>
                      {colIdx + 1}º
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 leading-tight">Turmas do {yearGrade}</h2>
                      <p className="text-[11px] text-slate-400 font-bold">{yearGroups.length} Cursos Ativos</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 ${headerColors.badgeBg} ${headerColors.text} text-[10px] font-black uppercase rounded-lg border ${headerColors.border}`}>
                    Fileira {colIdx + 1}
                  </span>
                </div>

                {/* Lista de Grupos da Fileira */}
                <div className="space-y-4">
                  {yearGroups.length === 0 ? (
                    <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-medium">
                      Nenhum grupo encontrado nesta fileira.
                    </div>
                  ) : (
                    yearGroups.map((grp) => {
                      const hasAccess = checkUserAccessToGroup(user, grp);
                      return (
                        <motion.div
                          key={grp.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -3 }}
                          onClick={() => handleSelectGroup(grp)}
                          className={`bg-white rounded-2xl border shadow-xs overflow-hidden cursor-pointer group transition-all relative ${
                            hasAccess 
                              ? 'border-slate-200 hover:border-blue-400 hover:shadow-md' 
                              : 'border-slate-200/60 opacity-80 bg-slate-50/50'
                          }`}
                        >
                          <div className={`h-20 ${grp.color} p-4 relative flex flex-col justify-end`}>
                             <div className="flex items-center justify-between relative z-10">
                               <h3 className="text-xl text-white font-black tracking-tight">{grp.name}</h3>
                               {hasAccess ? (
                                 <span className="p-1 bg-white/20 backdrop-blur-md rounded-lg text-white">
                                   <Unlock className="w-3.5 h-3.5" />
                                 </span>
                               ) : (
                                 <span className="p-1 bg-black/30 backdrop-blur-md rounded-lg text-white/70" title="Acesso Restrito a esta Turma">
                                   <Lock className="w-3.5 h-3.5" />
                                 </span>
                               )}
                             </div>
                             <p className="text-white/80 text-[10px] mt-0.5 font-bold uppercase tracking-wider relative z-10">{grp.course}</p>
                          </div>

                          <div className="p-4">
                             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">{grp.description}</p>
                             
                             <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                {hasAccess ? (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                                    <Unlock className="w-3 h-3" /> Acesso Liberado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                    <Lock className="w-3 h-3" /> Restrito ao {grp.grade}
                                  </span>
                                )}
                                
                                <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                   Entrar no Chat <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                             </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quadro de Avisos Geral / Comunicados Oficiais */}
        <section className="mt-16 bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-slate-900/10">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                 <Bell className="w-5 h-5 text-blue-400" />
                 <h2 className="text-lg font-bold uppercase tracking-widest text-blue-400">Mural Geral da Escola</h2>
              </div>
              <button
                onClick={() => requestPushNotificationPermission(user)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-all"
                title="Ativar Notificações Push FCM no Dispositivo"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Ativar Notificações Push</span>
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.filter(m => m.canal === 'Geral').length === 0 ? (
                <>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                     <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-100">Calendário de Avaliações</h4>
                        <span className="text-[10px] text-slate-500 font-bold">Secretaria</span>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">As datas para as avaliações do bimestre já estão disponíveis na secretaria escolar.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                     <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-100">Mural de Estágios</h4>
                        <span className="text-[10px] text-slate-500 font-bold">Coordenação</span>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">Novas oportunidades de estágio abertas no painel de estágios para alunos do CETEP.</p>
                  </div>
                </>
              ) : (
                messages.filter(m => m.canal === 'Geral').map((com) => (
                  <div key={com.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all relative group">
                     <div className="flex justify-between items-start mb-3">
                        <div>
                           <h4 className="font-bold text-amber-400 text-base">{com.usuario || 'Administração'}</h4>
                           <span className="text-[10px] text-slate-400 font-bold">
                              {new Date(com.data).toLocaleDateString('pt-BR')} às {new Date(com.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        {(user?.role === 'teacher' || user?.email?.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' || com.email === user?.email) && (
                          <button
                            onClick={() => handleDeleteMessage(com.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                            title="Apagar comunicado"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                     </div>
                     <p className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">{com.texto}</p>
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}

