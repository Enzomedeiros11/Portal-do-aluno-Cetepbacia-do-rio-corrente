import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Bot, Sparkles, User as UserIcon, BookOpen, SendHorizontal, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { User } from '../types';
import { askAiTeacher } from '../services/aiTeacherService';
import { sendContactFormEmail } from '../services/emailService';
import { toast } from 'sonner';

interface ContactProps {
  currentUser?: User | null;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function Contact({ currentUser }: ContactProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'form'>('ai');

  // AI Tutor Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Olá ${currentUser ? currentUser.name.split(' ')[0] : 'estudante'}! Sou o **Professor IA CETEP**, seu assistente pedagógico virtual.\n\nComo posso te ajudar nos seus estudos hoje? Você pode me enviar dúvidas de matérias, exercícios do seu curso técnico ou pedir dicas de estudo!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

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
      toast.error('Erro ao conectar com o Professor IA.');
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
      await sendContactFormEmail({
        name: contactName,
        email: contactEmail,
        subject,
        message
      });
      toast.success('Mensagem enviada com sucesso para a equipe CETEP!');
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem.');
    } finally {
      setIsSendingForm(false);
    }
  };

  const quickPrompts = [
    { label: '💡 Explicar lógica de programação', query: 'Pode me explicar os conceitos básicos de lógica de programação com exemplos em JavaScript?' },
    { label: '🩺 Cálculo de dose (Enfermagem)', query: 'Como faço para calcular o gotejamento de soro e doses de medicação na enfermagem?' },
    { label: '📊 Dicas de Gestão e Administração', query: 'Quais são os principais conceitos de administração e marketing para cursos técnicos?' },
    { label: '✍️ Estrutura de Redação', query: 'Como estruturar uma tese e argumentos fortes para uma redação escolar?' },
    { label: '📐 Resolução de Exatas passo a passo', query: 'Pode me ensinar como resolver regra de três composta e equações?' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 font-sans">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Central de Ajuda CETEP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-display mb-3">
            Como podemos te <span className="text-blue-600">ajudar</span> hoje?
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-base">
            Tire suas dúvidas acadêmicas instantaneamente com o <strong>Professor IA CETEP</strong> ou envie uma mensagem diretamente para a coordenação e secretaria escolar.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mt-8 border-b border-slate-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'ai'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bot className="w-4 h-4" /> Professor IA CETEP
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'form'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" /> Fale com a Secretaria / Suporte
            </button>
          </div>
        </motion.div>

        {/* TAB 1: PROFESSOR IA CETEP */}
        {activeTab === 'ai' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Interactive Chat Panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col h-[650px]">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      Professor IA CETEP
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Tutor pedagógico interativo para seu aprendizado</p>
                  </div>
                </div>
                <button
                  onClick={() => setMessages([messages[0]])}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Limpar conversa"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none whitespace-pre-wrap border border-slate-200/60'
                      }`}
                    >
                      <div>{msg.text}</div>
                      <p className={`text-[10px] mt-2 font-semibold ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoadingAi && (
                  <div className="flex gap-3 items-center text-slate-400 text-xs font-semibold p-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>Professor IA está pensando na resposta...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
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
                    placeholder="Digite sua dúvida de aula, matéria ou exercício..."
                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuestion.trim() || isLoadingAi}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shrink-0"
                  >
                    <span>Enviar</span>
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Quick Prompts & Info Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Tópicos Populares
                </h4>
                <div className="space-y-2.5">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAi(item.query)}
                      className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-all group"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-lg space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base">Atendimento Pedagógico 24h</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  O Professor IA CETEP está configurado para responder perguntas de todas as disciplinas técnicas e conteúdos do Ensino Médio.
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
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Atendimento Presencial e Canais</h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Caso necessite de atendimento administrativo para documentos, transferências ou certificados presenciais:
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { icon: Mail, label: 'E-mail Oficial', value: 'contato@cetep-brc.edu.br' },
                    { icon: Phone, label: 'Telefone / WhatsApp', value: '(77) 3483-3525' },
                    { icon: MapPin, label: 'Endereço', value: 'Av. Gov. Roberto Santos, 54 - Sambaíba, Santa Maria da Vitória - BA' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Enviar Mensagem para a Secretaria</h3>
              <p className="text-xs font-medium text-slate-500 mb-6">Preencha os dados abaixo. Respondemos em até 24 horas úteis.</p>

              <form onSubmit={handleSendSupportForm} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: Ana Maria"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Seu E-mail *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="seu.email@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Assunto</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Dúvida sobre Aulas / Notas</option>
                    <option>Solicitação de Documento ou Declaração</option>
                    <option>Problemas de Acesso no Portal</option>
                    <option>Informações sobre Estágios e Cursos Extra</option>
                    <option>Outros Assuntos</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Mensagem *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingForm}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Enviar Mensagem
                </button>
              </form>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
