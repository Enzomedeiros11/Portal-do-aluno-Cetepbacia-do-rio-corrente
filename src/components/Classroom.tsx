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
  Bell
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface ClassroomProps {
  user: User | null;
  allUsers: User[];
}

interface Message {
  id: string;
  texto: string;
  usuario_nome: string;
  usuario_email: string;
  role: 'student' | 'teacher';
  turma_id: string;
  arquivo_url?: string;
  arquivo_nome?: string;
  arquivo_tipo?: string;
  created_at: string;
}

export default function Classroom({ user, allUsers }: ClassroomProps) {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      const channel = supabase
        .channel('classroom_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          if (newMessage.usuario_email !== user.email) {
            toast.info(`Nova mensagem de ${newMessage.usuario_nome}`);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('mensagens')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (data) setMessages(data as any);
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

  const displayClasses = initialClasses.filter(cls => 
    cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e: FormEvent, fileData?: { url: string, name: string, type: string }) => {
    if (e) e.preventDefault();
    if (!message.trim() && !fileData) return;

    const newMessage = {
      texto: message || `Enviou um arquivo: ${fileData?.name}`,
      usuario_nome: user?.name || 'Estudante',
      usuario_email: user?.email || '',
      turma_id: selectedClass?.id?.toString() || 'general',
      role: user?.role || 'student',
      arquivo_url: fileData?.url || null,
      arquivo_nome: fileData?.name || null,
      arquivo_tipo: fileData?.type || null,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('mensagens').insert([newMessage]);
    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem.');
    } else {
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

  const classStudents = allUsers.filter(u => 
    u.id !== user?.id && u.course === user?.course && u.role === 'student'
  );

  const officialStaff = allUsers.filter(u => u.role === 'teacher');

  if (selectedClass) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex flex-col">
        {/* Header Sala */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-40 fixed top-16 left-0 right-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="font-bold text-slate-900 leading-tight">{selectedClass.title}</h2>
                <p className="text-xs text-slate-500 font-medium">{selectedClass.teacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => navigate('/assignments')}
                 className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
               >
                  <ClipboardList className="w-4 h-4" /> Atividades
               </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 mt-20 p-6 mb-20">
          {/* Feed principal */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mural Interativo</h3>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tempo Real</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[600px] scroll-smooth">
              {messages.filter(m => m.turma_id === 'general' || m.turma_id === selectedClass?.id?.toString()).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                   <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                   <p className="text-sm font-medium">Inicie uma conversa nesta turma.</p>
                </div>
              )}
              {messages
                .filter(m => m.turma_id === 'general' || m.turma_id === selectedClass?.id?.toString())
                .map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.usuario_email === user?.email ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${msg.role === 'teacher' || msg.turma_id === 'general' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                    {msg.usuario_nome?.charAt(0) || '?'}
                  </div>
                  <div className={`max-w-[80%] ${msg.usuario_email === user?.email ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                        {msg.turma_id === 'general' ? '📢 SECRETARIA' : msg.usuario_nome}
                      </span>
                      <span className="text-[9px] text-slate-400">{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      msg.turma_id === 'general'
                        ? 'bg-amber-50 text-slate-900 border-2 border-amber-200'
                        : msg.usuario_email === user?.email 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
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
                    placeholder="Escreva sua mensagem..." 
                    className="flex-1 px-3 py-2 outline-none text-sm font-medium"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim() && !isUploading}
                    className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
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
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                   <Users className="w-3.5 h-3.5" /> Membros Conectados
                </h4>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {officialStaff.map(s => (
                     <div key={s.id} className="flex items-center gap-3">
                        <div className="relative">
                           <img src={s.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                           <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${s.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900 leading-none">{s.name}</p>
                           <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">Equipe Docente</p>
                        </div>
                     </div>
                   ))}
                   <div className="pt-2 border-t border-slate-100">
                      {classStudents.map(s => (
                        <div key={s.id} className="flex items-center gap-3 mt-4">
                           <div className="relative">
                              <img src={s.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${s.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                           </div>
                           <p className="text-xs font-semibold text-slate-700">{s.name}</p>
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Layout className="text-white w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Salas de Aula</h1>
            </div>
            <p className="text-slate-500 font-medium text-lg">Gerenciamento de materiais e comunicação acadêmica.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Localizar turma..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold shadow-sm"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayClasses.map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedClass(cls)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer group hover:border-blue-300 transition-all"
            >
              <div className={`h-32 ${cls.color} p-6 relative flex flex-col justify-end`}>
                 <h3 className="text-xl text-white font-bold leading-tight relative z-10">{cls.title}</h3>
                 <p className="text-white/80 text-[10px] mt-1 font-bold uppercase tracking-wider relative z-10">{cls.teacher}</p>
                 <div className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-white" />
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wide">
                       Ativo
                    </div>
                    {cls.tasks > 0 && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase">
                         <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                         {cls.tasks} Tarefas
                      </span>
                    )}
                 </div>
                 <div className="mt-auto py-3 border-t border-slate-50 flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                       <MessageSquare className="w-4 h-4" /> Mural
                    </span>
                    <span className="text-[10px] font-bold">{cls.students} Alunos</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quadro de Avisos Geral (opcional, simplificado) */}
        <section className="mt-16 bg-slate-900 rounded-3xl p-10 text-white shadow-xl shadow-slate-900/10">
           <div className="flex items-center gap-2 mb-8">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold uppercase tracking-widest text-blue-400">Comunicados Oficiais</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Calendário de Avaliações', msg: 'As datas para as avaliações do 2º bimestre já estão disponíveis na secretaria.', date: 'Há 1 dia' },
                { title: 'Vagas de Estágio', msg: 'Novas oportunidades para os cursos técnicos no mural da coordenação.', date: 'Hoje' },
              ].map((adv, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                   <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-100">{adv.title}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{adv.date}</span>
                   </div>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">{adv.msg}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
