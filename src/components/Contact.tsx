import { motion } from 'motion/react';
import { 
  Bot, 
  SendHorizontal, 
  Sparkles, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  RefreshCw,
  User as UserIcon,
  BookOpen,
  Key,
  Check,
  X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import { User } from '../types';
import { askAiTeacher } from '../services/aiTeacherService';
import { sendContactFormEmail } from '../lib/emailService';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ContactProps {
  currentUser?: User | null;
}

export default function Contact({ currentUser }: ContactProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'ai' ? 'ai' : (searchParams.get('tab') === 'form' ? 'form' : 'ai');
  const [activeTab, setActiveTab] = useState<'ai' | 'form'>(initialTab);

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'ai' || tabParam === 'form') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // AI Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('cetep_ai_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it contained old verbose pedagogical template, reset to direct clean chat
        const hasOldSlop = parsed.some((m: ChatMessage) => 
          typeof m.text === 'string' && (
            m.text.includes('📚 Análise e Explicação Pedagógica') ||
            m.text.includes('No contexto acadêmico de Técnico Geral') ||
            m.text.includes('Principais Conceitos a Reter')
          )
        );
        if (!hasOldSlop && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [
      {
        id: '1',
        sender: 'ai',
        text: `Olá ${currentUser ? currentUser.name.split(' ')[0] : 'estudante'}! Sou o Assistente IA do CETEP.\n\nEstou aqui para responder suas dúvidas diretamente: cálculos, matemática, programação, redação, matérias escolares e exercícios. Como posso te ajudar?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('user_openai_key') || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('cetep_ai_chat', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const handleClearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Olá ${currentUser ? currentUser.name.split(' ')[0] : 'estudante'}! Conversa reiniciada. Pode enviar qualquer cálculo, exercício ou pergunta!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initial);
    try {
      localStorage.setItem('cetep_ai_chat', JSON.stringify(initial));
    } catch (e) {}
    toast.success('Conversa reiniciada.');
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (customApiKey.trim()) {
      localStorage.setItem('user_openai_key', customApiKey.trim());
      toast.success('Chave de API salva com sucesso no navegador!');
    } else {
      localStorage.removeItem('user_openai_key');
      toast.info('Chave removida. Usando motor direto integrado.');
    }
    setShowKeyModal(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'ai') {
      scrollToBottom();
    }
  }, [messages, isLoadingAi, activeTab]);

  // Support Form State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('Dúvida sobre Aulas / Notas');
  const [message, setMessage] = useState('');
  const [isSendingForm, setIsSendingForm] = useState(false);

  const handleAskAi = async (customPrompt?: string) => {
    const query = customPrompt || inputQuestion;
    if (!query.trim() || isLoadingAi) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuestion('');
    setIsLoadingAi(true);

    try {
      const responseText = await askAiTeacher(
        query,
        currentUser?.course || 'Técnico Geral',
        currentUser?.grade || '1º Ano'
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      toast.error('Erro ao conectar com a IA.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSendSupportForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !message.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSendingForm(true);
    try {
      // 1. Save directly to Firebase Firestore
      try {
        await addDoc(collection(db, 'mensagens_suporte'), {
          nome: contactName,
          email: contactEmail,
          assunto: subject,
          mensagem: message,
          usuario_id: currentUser?.id || null,
          data: new Date().toISOString()
        });
      } catch (fbErr) {
        console.warn('Firebase support message sync warning:', fbErr);
      }

      // 2. Email notification
      await sendContactFormEmail({
        name: contactName,
        email: contactEmail,
        subject,
        message
      });
      toast.success('Mensagem salva e enviada com sucesso para a equipe CETEP!');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem de suporte:', error);
      toast.error('Erro ao enviar mensagem.');
    } finally {
      setIsSendingForm(false);
    }
  };

  const quickPrompts = [
    { label: 'quanto e 34x34', query: 'quanto e 34x34' },
    { label: 'Explicar lógica de programação', query: 'Explique os conceitos básicos de variáveis, laços de repetição e funções em JavaScript.' },
    { label: 'Cálculo de dose (Enfermagem)', query: 'Como é calculada a regra de três para dosagem de medicação na enfermagem?' },
    { label: 'Dicas de Administração', query: 'Quais são as 4 funções clássicas da administração (planejar, organizar, dirigir e controlar)?' },
    { label: 'Equação de 2º Grau', query: 'Como resolver a equação x² - 5x + 6 = 0 pela fórmula de Bhaskara passo a passo?' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6 font-sans transition-colors duration-200">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 shadow-xs">
            <HelpCircle className="w-4 h-4" />
            <span>Central de Atendimento & Chat IA CETEP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-3">
            Como podemos te <span className="text-blue-600 dark:text-blue-400">ajudar</span> hoje?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl text-base">
            Tire suas dúvidas acadêmicas e faça cálculos com a <strong className="text-slate-800 dark:text-slate-200">IA CETEP</strong> ou envie uma mensagem direta para a secretaria escolar.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mt-8 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('ai'); setSearchParams({ tab: 'ai' }); }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" /> Chat IA
            </button>
            <button
              onClick={() => { setActiveTab('form'); setSearchParams({ tab: 'form' }); }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Ajuda & Secretaria
            </button>
          </div>
        </motion.div>

        {/* TAB 1: CHAT IA CETEP */}
        {activeTab === 'ai' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Interactive Chat Panel */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-xs flex flex-col h-[650px] transition-colors">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      Assistente IA CETEP
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                        Pronto
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Respostas diretas, sem enrolação e sem templates rígidos</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Configurar API Key"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Limpar conversa"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                      }`}
                    >
                      {msg.sender === 'ai' ? (
                        <div className="markdown-body text-sm leading-relaxed space-y-2 prose prose-slate dark:prose-invert max-w-none">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                      <p className={`text-[10px] mt-2 font-semibold ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400 dark:text-slate-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoadingAi && (
                  <div className="flex gap-3 items-end py-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-xs">
                      <span className="text-xs text-slate-500 dark:text-slate-300 font-semibold mr-1">IA formulando resposta</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAi();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="Digite sua dúvida, cálculo (ex: quanto é 34x34) ou questão..."
                    className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuestion.trim() || isLoadingAi}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                  >
                    <span>Enviar</span>
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Quick Prompts & Info Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-xs transition-colors">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Exemplos Rápidos
                </h4>
                <div className="space-y-2.5">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAi(item.query)}
                      className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/70 transition-all cursor-pointer group"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-slate-900/90 border border-slate-800 text-white rounded-[32px] p-6 shadow-lg space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base">Suporte Direto & Completo</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  A IA responde qualquer cálculo, matéria ou exercício de maneira direta. Assuntos de privacidade íntima ou pessoal são preservados por segurança.
                </p>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: SECRETARIA & FORM */}
        {activeTab === 'form' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Info Side */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Atendimento Presencial e Canais</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Caso necessite de atendimento administrativo para documentos, transferências ou certificados presenciais:
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { icon: Mail, label: 'E-mail Oficial', value: 'contato@cetep-brc.edu.br' },
                    { icon: Phone, label: 'Telefone / WhatsApp', value: '(77) 3483-3525' },
                    { icon: MapPin, label: 'Endereço', value: 'Av. Gov. Roberto Santos, 54 - Sambaíba, Santa Maria da Vitória - BA' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Enviar Mensagem de Ajuda</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">Preencha os dados abaixo para entrar em contato com nossa equipe de suporte escolar.</p>

              <form onSubmit={handleSendSupportForm} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: Ana Maria"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Seu E-mail *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="seu.email@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Assunto</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className="dark:bg-slate-800 dark:text-white">Dúvida sobre Aulas / Notas</option>
                    <option className="dark:bg-slate-800 dark:text-white">Solicitação de Documento ou Declaração</option>
                    <option className="dark:bg-slate-800 dark:text-white">Problemas de Acesso no Portal</option>
                    <option className="dark:bg-slate-800 dark:text-white">Informações sobre Estágios e Cursos Extra</option>
                    <option className="dark:bg-slate-800 dark:text-white">Outros Assuntos</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Mensagem *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingForm}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar Mensagem
                </button>
              </form>
            </div>

          </motion.div>
        )}

      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Configuração da API IA</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              O chat funciona normalmente com respostas diretas integradas. Se possuir uma chave OpenAI própria com créditos ativos, você pode salvá-la abaixo.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  OpenAI API Key (Opcional)
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
