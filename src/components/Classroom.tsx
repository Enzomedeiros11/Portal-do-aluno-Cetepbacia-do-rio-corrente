import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Layout, 
  Users, 
  FileText, 
  Pin, 
  ShieldCheck,
  ArrowLeft, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  MoreVertical,
  Search,
  MessageSquare,
  ClipboardList,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface ClassroomProps {
  user: User | null;
  allUsers: User[];
}

interface Message {
  id: string;
  sender: string;
  senderName: string;
  role: 'student' | 'teacher';
  content: string;
  timestamp: string;
}

export default function Classroom({ user, allUsers }: ClassroomProps) {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync Messages from Firestore
  useEffect(() => {
    if (!selectedClass) return;

    const q = query(
      collection(db, 'messages'),
      where('course', '==', selectedClass.title),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.senderId,
          senderName: data.senderName,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || '...'
        } as Message;
      });
      setMessages(msgs);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [selectedClass]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const informaticsClasses = [
    { id: 1, title: 'Banco de Dados', teacher: 'Prof. Ricardo', tasks: 1, students: 28, color: 'bg-indigo-600', description: 'Modelagem e implementação de bancos de dados relacionais.' },
    { id: 2, title: 'Robótica', teacher: 'Prof. Ricardo', tasks: 0, students: 15, color: 'bg-emerald-600', description: 'Programação de microcontroladores e montagem de circuitos.' },
    { id: 3, title: 'Prática Profissional', teacher: 'Prof. Ricardo', tasks: 2, students: 30, color: 'bg-amber-600', description: 'Vivência em projetos reais e mercado de trabalho.' },
    { id: 4, title: 'Fundamentos e Arquitetura', teacher: 'Prof. Ricardo', tasks: 1, students: 25, color: 'bg-rose-600', description: 'Estrutura física e lógica de computadores.' },
  ];

  const genericClasses = [
    { id: 5, title: 'Matemática Aplicada', teacher: 'Profa. Ana Costa', tasks: 0, students: 35, color: 'bg-blue-600', description: 'Cálculos essenciais para atividades técnicas.' },
    { id: 6, title: 'Português Instrumental', teacher: 'Profa. Regina Duarte', tasks: 2, students: 30, color: 'bg-purple-600', description: 'Redação técnica e comunicação eficaz.' },
    { id: 7, title: 'Ética e Cidadania', teacher: 'Prof. Roberto Melo', tasks: 1, students: 32, color: 'bg-slate-600', description: 'Valores morais e responsabilidade social.' },
  ];

  const isInformatica = user?.course?.toLowerCase().includes('informática') || user?.role === 'teacher';
  const initialClasses = isInformatica ? informaticsClasses : genericClasses;

  const classStudents = allUsers.filter(u => 
    u.id !== user?.id && 
    u.course === user?.course && 
    u.role === 'student'
  ).sort((a, b) => {
    // Online first, then alphabetically
    if (a.isOnline === b.isOnline) return a.name.localeCompare(b.name);
    return a.isOnline ? -1 : 1;
  });

  const officialStaff = allUsers.filter(u => 
    u.id !== user?.id && 
    u.role === 'teacher'
  ).sort((a, b) => {
    if (a.isOnline === b.isOnline) return a.name.localeCompare(b.name);
    return a.isOnline ? -1 : 1;
  });

  const onlineCount = allUsers.filter(u => u.isOnline).length;

  const displayClasses = initialClasses.filter(cls => 
    cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinWithCode = () => {
    const code = prompt('Digite o código da turma:');
    if (code) {
      toast.info(`Tentando entrar na turma com código: ${code}`);
      setTimeout(() => toast.error('Código inválido ou expirado.'), 1500);
    }
  };

  const handleDownloadFile = (fileName: string) => {
    toast.success(`Iniciando download de: ${fileName}`);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedClass) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.id,
        senderName: user.name,
        role: user.role,
        content: message,
        course: selectedClass.title,
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erro ao enviar mensagem.');
    }
  };

  if (selectedClass) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] pt-20 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 fixed top-20 left-0 right-0 z-40">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Voltar para Turmas"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className={`w-10 h-10 ${selectedClass.color} rounded-xl flex items-center justify-center shrink-0`}>
                 <Layout className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 leading-none">{selectedClass.title}</h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">{selectedClass.teacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toast.info('Acessando atividades pendentes...')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20"
              >
                <ClipboardList className="w-4 h-4" /> Atividades
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl flex-1 flex flex-col md:flex-row gap-6 mt-20 mb-20 p-6">
          {/* Main Feed/Chat */}
          <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-2">
                 <MessageSquare className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-bold text-slate-900">Mural da Turma</h3>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-xs font-black text-emerald-500 uppercase flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px]">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-4 ${msg.role === 'teacher' ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${msg.role === 'teacher' ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <UserIcon className={`w-6 h-6 ${msg.role === 'teacher' ? 'text-indigo-600' : 'text-emerald-600'}`} />
                  </div>
                  <div className={`max-w-[70%] ${msg.role === 'teacher' ? '' : 'text-right'}`}>
                    <div className="flex items-baseline gap-2 mb-1 justify-inherit">
                      <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${msg.role === 'teacher' ? 'bg-indigo-900 text-white rounded-tl-none' : 'bg-white border border-indigo-100 text-slate-700 rounded-tr-none shadow-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-600 transition-all border border-gray-100">
                <button 
                  type="button" 
                  onClick={() => toast.info('Escolha um arquivo para anexar')}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>
                <input 
                  type="text" 
                  placeholder="Escreva uma mensagem para a turma..." 
                  className="flex-1 bg-transparent px-2 py-3 outline-none text-sm font-medium"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 bg-indigo-900 text-white rounded-xl hover:bg-slate-950 transition-all shadow-lg shadow-indigo-900/10 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 ml-2">Pressione Enter para enviar. {messages.length} mensagens trocadas.</p>
            </form>
          </div>

          {/* Teacher Info / Materials */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
               <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Informações</h4>
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 {selectedClass.description}
               </p>
               <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">Turma Oficial CETEP</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Membros da Turma</h4>
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-full">
                    <Users className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-600">{classStudents.length + officialStaff.length + 1}</span>
                 </div>
               </div>
               
               <div className="space-y-6">
                  {/* Official Staff Section */}
                  <div className="space-y-3">
                     <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Officiais
                     </h5>
                     
                     {user?.role === 'teacher' && (
                       <div className="flex items-center gap-3 bg-indigo-50/50 p-2 rounded-2xl border border-indigo-100/50">
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                <img src={user?.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             </div>
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-indigo-950 leading-none">Você</p>
                             <p className="text-[9px] text-indigo-500 font-black mt-1 uppercase">Docente • Online</p>
                          </div>
                       </div>
                     )}

                     {officialStaff.map(staff => (
                       <div key={staff.id} className={`flex items-center gap-3 transition-opacity ${staff.isOnline ? 'opacity-100' : 'opacity-60'}`}>
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-white">
                                {staff.avatar ? (
                                  <img src={staff.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <UserIcon className="w-5 h-5" />
                                )}
                             </div>
                             <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${staff.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 leading-none">{staff.name}</p>
                             <p className="text-[9px] text-indigo-500 font-black mt-1 uppercase">
                                {staff.isOnline ? 'Equipe • Online' : 'Ausente'}
                             </p>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Students Section */}
                  <div className="space-y-3">
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" /> Alunos
                     </h5>

                     {user?.role === 'student' && (
                        <div className="flex items-center gap-3">
                           <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                 <img src={user?.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 leading-none">Você</p>
                              <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-widest">Online Agora</p>
                           </div>
                        </div>
                     )}

                     {classStudents.map(student => (
                       <div key={student.id} className={`flex items-center gap-3 transition-opacity ${student.isOnline ? 'opacity-100' : 'opacity-50'}`}>
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-gray-400">
                                {student.avatar ? (
                                  <img src={student.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <UserIcon className="w-5 h-5" />
                                )}
                             </div>
                             <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${student.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-700 leading-none">{student.name}</p>
                             <p className="text-[10px] text-gray-400 font-medium mt-1">
                                {student.isOnline ? 'Conectado' : 'Offline'}
                             </p>
                          </div>
                       </div>
                     ))}
                  </div>

                  {classStudents.length === 0 && user?.role !== 'student' && officialStaff.length === 0 && user?.role !== 'teacher' && (
                    <p className="text-[10px] text-gray-400 font-medium italic text-center py-2">Nenhum membro encontrado.</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-6 shadow-inner">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="md:flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Layout className="text-indigo-600 w-10 h-10" />
              <h1 className="text-4xl font-serif font-medium text-slate-900">Minhas Turmas</h1>
            </div>
            <p className="text-gray-500">Acesse seus materiais de estudo e interaja com os professores.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Pesquisar salas..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all text-sm font-medium w-full md:w-64" 
               />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayClasses.map((cls, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedClass(cls)}
              className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-indigo-900/[0.03] overflow-hidden flex flex-col group cursor-pointer transition-all"
            >
              <div className={`h-32 ${cls.color} p-8 relative flex flex-col justify-end`}>
                 <h3 className="text-xl text-white font-serif font-medium leading-tight group-hover:underline">{cls.title}</h3>
                 <p className="text-white/70 text-xs mt-1 italic font-medium">{cls.teacher}</p>
                 <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <ChevronRight className="text-white w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                       Turma Ativa
                    </div>
                    {cls.tasks > 0 && (
                      <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                         {cls.tasks} tarefas
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-indigo-600">
                       <MessageSquare className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mural de Avisos</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-20 bg-[#F9F9FB] p-10 rounded-[56px] border border-gray-100 relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <Pin className="text-indigo-600 w-8 h-8 rotate-45 group-hover:scale-110 transition-transform" />
                 <h2 className="text-3xl font-serif font-medium text-slate-900">Mural Acadêmico</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { author: 'Coordenação', msg: 'Lembre-se: O portal acadêmico é sua ferramenta oficial de estudos.', date: 'Hoje' },
                 ].map((m, idx) => (
                   <div key={idx} className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black uppercase text-indigo-600 tracking-[0.2em]">{m.author}</span>
                        <span className="text-[10px] font-bold text-gray-300">{m.date}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">"{m.msg}"</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -translate-y-32 translate-x-32" />
        </section>
      </div>
    </div>
  );
}
