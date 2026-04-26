import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
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
  ChevronRight,
  ClipboardList,
  User as UserIcon,
  Zap,
  Trophy
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

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
  file_url?: string;
  file_name?: string;
  file_type?: string;
}

export default function Classroom({ user, allUsers }: ClassroomProps) {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  }, []);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
      fetchMessages();
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel('classroom_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          if (newMessage.sender !== user.id) {
            setUnreadCount(prev => prev + 1);
            notificationSound.current?.play().catch(() => {});
            toast.info(`Nova mensagem de ${newMessage.senderName}`);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from('matriculas')
      .select('curso')
      .eq('usuario_id', user?.id);
    
    if (data) {
      setEnrolledCourses(data.map(m => m.curso));
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .order('timestamp', { ascending: true })
      .limit(50);
    
    if (data) {
      setMessages(data as any);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedClass]);

  const informaticsClasses = [
    { id: 1, title: 'Lógica de Programação', teacher: 'Prof. Ricardo', tasks: 1, students: 28, color: 'bg-indigo-600', description: 'Fundamentos de algoritmos e estruturas de dados.' },
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

  const handleSendMessage = async (e: FormEvent, fileData?: { url: string, name: string, type: string }) => {
    if (e) e.preventDefault();
    if (!message.trim() && !fileData) return;

    const newMessage = {
      sender: user?.id || 'anonymous',
      senderName: user?.name || 'Estudante',
      role: user?.role || 'student',
      content: message || `Enviou um arquivo: ${fileData?.name}`,
      timestamp: new Date().toISOString(),
      file_url: fileData?.url,
      file_name: fileData?.name,
      file_type: fileData?.type
    };

    const { error } = await supabase.from('mensagens').insert([newMessage]);
    
    if (error) {
      toast.error('Erro ao enviar mensagem');
    } else {
      setMessage('');
      if (!fileData) setUnreadCount(0); // Clear on our own send
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `chat_files/${fileName}`;

    try {
      // Simulate progress since Supabase JS doesn't provide progress for standard upload yet
      const interval = setInterval(() => setUploadProgress(p => p < 90 ? p + 10 : p), 200);

      const { data, error } = await supabase.storage
        .from('arquivos_turma')
        .upload(filePath, file);

      clearInterval(interval);
      setUploadProgress(100);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('arquivos_turma')
        .getPublicUrl(filePath);

      await handleSendMessage(null as any, { 
        url: publicUrl, 
        name: file.name, 
        type: file.type 
      });

      toast.success('Arquivo enviado com sucesso!');
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao enviar arquivo. Verifique se o bucket "arquivos_turma" existe.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (selectedClass) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-slate-950 pt-20 flex flex-col transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 fixed top-20 left-0 right-0 z-40 transition-colors">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Voltar para Turmas"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
              <div className={`w-10 h-10 ${selectedClass.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10`}>
                 <Layout className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white leading-none tracking-tight">{selectedClass.title}</h2>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 font-black uppercase tracking-widest">{selectedClass.teacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toast.info('Acessando atividades pendentes...')}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <ClipboardList className="w-4 h-4" /> Atividades
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl flex-1 flex flex-col md:flex-row gap-6 mt-20 mb-20 p-6">
          {/* Main Feed/Chat */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[40px] border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all relative">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="font-bold text-slate-900 dark:text-white">Mural da Turma</h3>
               </div>
               <div className="flex items-center gap-4">
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="px-3 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-tighter"
                    >
                      {unreadCount} Novas
                    </button>
                  )}
                  <div className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[600px] scroll-smooth custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <MessageSquare className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">Nenhuma mensagem ainda.<br/>Inicie uma conversa!</p>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={msg.id} 
                  className={`flex gap-4 ${msg.sender === user?.id ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${msg.role === 'teacher' ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800'}`}>
                    <UserIcon className={`w-6 h-6 ${msg.role === 'teacher' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  </div>
                  <div className={`max-w-[75%] ${msg.sender === user?.id ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-baseline gap-2 mb-1 ${msg.sender === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{msg.senderName}</span>
                      <span className="text-[9px] text-gray-400 font-bold">{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'teacher' 
                        ? 'bg-indigo-900 text-white rounded-tl-none shadow-lg shadow-indigo-900/20' 
                        : msg.sender === user?.id
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20'
                          : 'bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                      
                      {msg.file_url && (
                        <div className="mt-4 p-3 bg-black/10 dark:bg-white/10 rounded-2xl flex items-center justify-between gap-4 border border-white/10 hover:bg-black/20 transition-all cursor-pointer" onClick={() => window.open(msg.file_url, '_blank')}>
                          <div className="flex items-center gap-3 overflow-hidden">
                             <div className="p-2 bg-white/20 rounded-xl">
                                {msg.file_type?.includes('image') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                             </div>
                             <span className="text-xs font-bold truncate">{msg.file_name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {isUploading && (
              <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900 flex items-center gap-4">
                 <div className="w-full bg-indigo-200 dark:bg-indigo-900 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                 </div>
                 <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest whitespace-nowrap">Enviando {uploadProgress}%</span>
              </div>
            )}

            <form onSubmit={(e) => handleSendMessage(e)} className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-2 rounded-[30px] focus-within:ring-4 focus-within:ring-indigo-600/10 transition-all border border-gray-100 dark:border-slate-700">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 group"
                  title="Anexar arquivo (PDF, Imagem, Word...)"
                >
                  <Paperclip className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </button>
                <input 
                  type="text" 
                  placeholder="Escreva uma mensagem para a turma..." 
                  className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium text-slate-700 dark:text-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setUnreadCount(0)}
                />
                <button 
                  type="submit"
                  disabled={!message.trim() && !isUploading}
                  className="p-4 bg-indigo-600 text-white rounded-full hover:bg-slate-900 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-3 ml-4 font-bold uppercase tracking-widest">Pressione Enter para enviar • Limite 10MB</p>
            </form>
          </div>

          {/* Teacher Info / Materials */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Informações</h4>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
                 {selectedClass.description}
               </p>
               <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Turma Oficial CETEP</span>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-slate-800">
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Membros da Turma</h4>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <Users className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{classStudents.length + officialStaff.length + 1}</span>
                 </div>
               </div>
               
               <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Official Staff Section */}
                  <div className="space-y-4">
                     <h5 className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> STAFF DOCENTE
                     </h5>
                     
                     {user?.role === 'teacher' && (
                       <div className="flex items-center gap-3 bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
                                <img src={user?.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             </div>
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-indigo-950 dark:text-white leading-none">Você</p>
                             <p className="text-[9px] text-indigo-500 dark:text-indigo-400 font-black mt-1.5 uppercase tracking-widest">Online Agora</p>
                          </div>
                       </div>
                     )}

                     {officialStaff.map(staff => (
                       <div key={staff.id} className={`flex items-center gap-3 transition-opacity ${staff.isOnline ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-all'}`}>
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden text-slate-400">
                                {staff.avatar ? (
                                  <img src={staff.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <UserIcon className="w-5 h-5" />
                                )}
                             </div>
                             <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${staff.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">{staff.name}</p>
                             <p className={`text-[9px] font-black mt-1.5 uppercase tracking-widest ${staff.isOnline ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {staff.isOnline ? 'Equipe • Online' : 'Ausente'}
                             </p>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Students Section */}
                  <div className="space-y-4">
                     <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" /> COMUNIDADE DISCENTE
                     </h5>

                     {user?.role === 'student' && (
                        <div className="flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-900/10 p-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20">
                           <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
                                 <img src={user?.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Você</p>
                              <p className="text-[9px] text-emerald-500 font-black mt-1.5 uppercase tracking-widest">Online Agora</p>
                           </div>
                        </div>
                     )}

                     {classStudents.map(student => (
                       <div key={student.id} className={`flex items-center gap-3 transition-opacity ${student.isOnline ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-all'}`}>
                          <div className="relative">
                             <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden text-gray-400">
                                {student.avatar ? (
                                  <img src={student.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <UserIcon className="w-5 h-5" />
                                )}
                             </div>
                             <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${student.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-none">{student.name}</p>
                             <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold mt-1.5 uppercase tracking-widest">
                                {student.isOnline ? 'Conectado' : 'Offline'}
                             </p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 px-6 shadow-inner font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background accents optimized */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="md:flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Layout className="text-white w-6 h-6" />
              </div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-display">Minhas Turmas</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md">Acesse seus materiais de estudo e interaja com os professores em tempo real.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Pesquisar salas..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 rounded-[30px] border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all text-sm font-bold w-full md:w-72 shadow-sm dark:text-white" 
               />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayClasses.map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedClass(cls)}
              className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-900/[0.03] overflow-hidden flex flex-col group cursor-pointer transition-all"
            >
              <div className={`h-40 ${cls.color} p-10 relative flex flex-col justify-end overflow-hidden`}>
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
                 <h3 className="text-2xl text-white font-black tracking-tighter leading-tight font-display relative z-10">{cls.title}</h3>
                 <p className="text-white/70 text-[10px] mt-2 uppercase font-black tracking-widest relative z-10">{cls.teacher}</p>
                 <div className="absolute top-8 right-8 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                 <div className="flex flex-wrap items-center gap-2 mb-8">
                    <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                       Matriculado
                    </div>
                    {cls.tasks > 0 ? (
                      <div className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                         {cls.tasks} pendentes
                      </div>
                    ) : (
                      <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Em dia
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                       <MessageSquare className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mural Interativo</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-slate-900 dark:bg-slate-900/80 p-12 lg:p-16 rounded-[64px] text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/40"
        >
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Pin className="text-indigo-400 w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter font-display uppercase">Canal da Coordenação</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { author: 'Coordenação Pedagógica', msg: 'Atenção alunos: confiram as datas das provas do segundo bimestre no calendário oficial do portal.', date: 'Há 2 dias' },
                   { author: 'Coordenação Profissional', msg: 'Novas parcerias de estágio foram firmadas para alunos do curso de Informática e Administração.', date: 'Hoje' },
                 ].map((m, idx) => (
                   <div key={idx} className="p-10 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 hover:bg-white/10 transition-all group/msg">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest">{m.author}</span>
                        <span className="text-[10px] font-bold text-white/20">{m.date}</span>
                      </div>
                      <p className="text-lg text-white/70 leading-relaxed font-medium transition-colors group-hover/msg:text-white">"{m.msg}"</p>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full translate-x-1/4 translate-y-1/4 blur-3xl pointer-events-none" />
        </motion.section>
      </div>
    </div>
  );
}
