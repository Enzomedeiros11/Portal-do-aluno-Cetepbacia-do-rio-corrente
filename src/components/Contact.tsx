import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, HelpCircle, Clock, Building, ChevronDown, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { sendContactFormEmail } from '../services/emailService';
import { toast } from 'sonner';

interface ContactProps {
  currentUser?: User | null;
}

export default function Contact({ currentUser }: ContactProps) {
  // Support Form State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactMatricula, setContactMatricula] = useState(currentUser?.matricula || '');
  const [subject, setSubject] = useState('Dúvida sobre Aulas / Notas');
  const [message, setMessage] = useState('');
  const [isSendingForm, setIsSendingForm] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [lastSent, setLastSent] = useState<{ name: string; email: string; subject: string; message: string } | null>(null);

  const handleSendSupportForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !message.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSendingForm(true);
    const submittedData = {
      name: `${contactName} ${contactMatricula ? `(Matrícula: ${contactMatricula})` : ''}`,
      email: contactEmail,
      matricula: contactMatricula,
      subject,
      message
    };

    try {
      await sendContactFormEmail(submittedData);
      toast.success('Mensagem enviada com sucesso para o Gmail: enzomedeirosdasilva6@gmail.com!');
      setLastSent({
        name: contactName,
        email: contactEmail,
        subject,
        message
      });
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente mais tarde.');
    } finally {
      setIsSendingForm(false);
    }
  };

  const faqItems = [
    {
      q: 'Como emitir meu boletim oficial com notas e médias?',
      a: 'Você pode acessar a aba "Boletim" no menu superior. Lá estão listadas todas as disciplinas com notas por trimestre/unidade e o botão "Baixar Boletim em PDF" para emitir o documento oficial autenticado.'
    },
    {
      q: 'Como funciona o Portal da Família para pais e responsáveis?',
      a: 'Os responsáveis podem cadastrar-se no portal selecionando a opção "Sou Pai / Responsável". Ao vincular a matrícula ou e-mail do aluno, o portal exibe o boletim, mural de recados, frequência escolar e relatórios de acompanhamento em tempo real.'
    },
    {
      q: 'Como solicitar declaração de matrícula ou histórico escolar?',
      a: 'Você pode enviar uma mensagem pelo formulário nesta página selecionando o assunto "Solicitação de Documento ou Declaração" ou comparecer presencialmente na Secretaria do CETEP em horário comercial.'
    },
    {
      q: 'Quais os requisitos para realizar estágio supervisionado?',
      a: 'O estágio é regulamentado pela Lei nº 11.788/2008. Alunos a partir do 2º ano dos cursos técnicos podem estagiar mediante assinatura do Termo de Compromisso de Estágio (TCE) entre empresa, aluno e a Direção do CETEP. Acesse a aba "Estágios MEC" para modelos e orientações.'
    },
    {
      q: 'Como obter o certificado dos cursos de capacitação (Excel e Lógica)?',
      a: 'Nos Cursos Extras, após assistir às videoaulas e atingir média mínima de 7,0 nos questionários de cada aula, o botão oficial "Baixar Certificado em PDF" é liberado instantaneamente com registro acadêmico e carga horária certificada.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 sm:px-6 font-sans transition-colors duration-200">
      <div className="container mx-auto max-w-6xl space-y-12">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 shadow-xs">
            <HelpCircle className="w-4 h-4" />
            <span>Central de Atendimento & Ouvidoria CETEP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Como podemos te <span className="text-blue-600 dark:text-blue-400">ajudar</span> hoje?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed">
            Canal oficial de atendimento para alunos, pais e comunidade escolar. Fale diretamente com a Secretaria Escolar, Coordenação Pedagógica ou consulte as dúvidas frequentes.
          </p>
        </motion.div>

        {/* Main Grid: Form + Contact Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Enviar Mensagem Oficial</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Resposta encaminhada diretamente para seu e-mail cadastrado</p>
              </div>
            </div>

            <form onSubmit={handleSendSupportForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">E-mail para Retorno *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Matrícula (opcional)</label>
                  <input
                    type="text"
                    value={contactMatricula}
                    onChange={(e) => setContactMatricula(e.target.value)}
                    placeholder="Ex: 2026001"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Setor / Assunto *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className="dark:bg-slate-800 dark:text-white">Dúvida sobre Aulas / Notas</option>
                    <option className="dark:bg-slate-800 dark:text-white">Solicitação de Documento ou Declaração</option>
                    <option className="dark:bg-slate-800 dark:text-white">Secretaria Escolar / Matrícula</option>
                    <option className="dark:bg-slate-800 dark:text-white">Orientação sobre Estágio Supervisionado</option>
                    <option className="dark:bg-slate-800 dark:text-white">Suporte Técnico no Portal Acadêmico</option>
                    <option className="dark:bg-slate-800 dark:text-white">Ouvidoria / Elogios / Sugestões</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mensagem Detalhada *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva detalhadamente sua dúvida ou solicitação para que a equipe acadêmica possa responder com precisão..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {lastSent && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mensagem enviada com sucesso para enzomedeirosdasilva6@gmail.com!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Sua solicitação de ajuda foi registrada e direcionada para a coordenação do Professor Enzo Medeiros.
                  </p>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=enzomedeirosdasilva6@gmail.com&su=${encodeURIComponent(`[Ajuda CETEP] ${lastSent.subject} - ${lastSent.name}`)}&body=${encodeURIComponent(`Olá Professor Enzo,\n\nNome: ${lastSent.name}\nE-mail: ${lastSent.email}\nAssunto: ${lastSent.subject}\n\nMensagem:\n${lastSent.message}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer mt-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Abrir também no Gmail</span>
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingForm}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSendingForm ? 'Enviando para enzomedeirosdasilva6@gmail.com...' : 'Enviar Mensagem de Ajuda'}
              </button>
            </form>
          </div>

          {/* Contact Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Canais Oficiais & Presencial</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Você também pode entrar em contato diretamente com nossa equipe ou comparecer à unidade física durante os horários de funcionamento:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    icon: Building,
                    label: 'Campus Oficial',
                    value: 'CETEP - Centro Territorial de Educação Profissional',
                    sub: 'Unidade Territorial Bacia do Rio Corrente'
                  },
                  {
                    icon: MapPin,
                    label: 'Endereço',
                    value: 'Av. Gov. Roberto Santos, 54 - Sambaíba',
                    sub: 'Santa Maria da Vitória - BA'
                  },
                  {
                    icon: Mail,
                    label: 'E-mail de Ajuda & Coordenação',
                    value: 'enzomedeirosdasilva6@gmail.com',
                    sub: 'Direção & Coordenação (Professor Enzo Medeiros)',
                    href: 'mailto:enzomedeirosdasilva6@gmail.com'
                  },
                  {
                    icon: Phone,
                    label: 'Telefone Institucional',
                    value: '(77) 3483-3525',
                    sub: 'Atendimento de segunda a sexta-feira'
                  },
                  {
                    icon: Clock,
                    label: 'Horário de Atendimento',
                    value: '07h30 às 17h30 (Segunda a Sexta)',
                    sub: 'Plantão de secretaria das turmas técnicas'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-0.5 block break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.value}</p>
                      )}
                      {item.sub && <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Privacidade & Comunicação Segura</h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Todas as mensagens e dados enviados por estudantes e familiares são tratados com confidencialidade acadêmica conforme as diretrizes do CETEP.
              </p>
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Perguntas Frequentes (FAQ)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Respostas rápidas para as dúvidas mais comuns dos estudantes</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-3 text-left font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
