import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  BookOpen, 
  Bell, 
  ArrowRight, 
  Search, 
  Calendar as CalendarIcon,
  ChevronRight,
  Layout,
  Trophy,
  Download
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '../types';
import { downloadBoletimPDF } from '../lib/pdfUtils';

interface DashboardProps {
  user: User | null;
  allUsers: User[];
}

export default function Dashboard({ user, allUsers }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  if (!user) return null;

  const onlineUsersCount = allUsers.filter(u => u.isOnline).length;
  const classmates = allUsers.filter(u => u.course === user.course && u.id !== user.id);

  const handleQuickAction = (action: string) => {
    toast.success(`${action} iniciado com sucesso!`);
  };

  const handleDownload = async (type: string) => {
    if (type === 'Boletim') {
      if (user) {
        try {
          toast.info('Gerando Boletim em PDF...');
          downloadBoletimPDF(user);
          toast.success('Boletim gerado com sucesso!');
        } catch (error) {
          toast.error('Erro ao gerar o boletim.');
        }
      }
      return;
    }
    toast.info(`Iniciando download do ${type}...`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-7xl"
      >
        {/* Simplified Header */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Olá, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Bem-vindo ao portal acadêmico do CETEP.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{user.course}</p>
                <p className="text-sm font-semibold text-slate-700">{user.grade}</p>
             </div>
             <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
             <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
             </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.button 
                variants={itemVariants}
                whileHover={{ y: -2 }}
                onClick={() => handleQuickAction('Novo Trabalho')}
                className="flex flex-col items-start p-6 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all text-left"
              >
                <Zap className="w-6 h-6 mb-4 opacity-80" />
                <span className="text-xs font-bold uppercase tracking-wider">Novo Trabalho</span>
              </motion.button>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Link to="/extra-courses" className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-all text-left group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cursos Extra</span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Link to="/classroom" className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-all text-left group">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-colors">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                   <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Estágios</span>
                </Link>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                whileHover={{ y: -2 }}
                onClick={() => handleDownload('Boletim')}
                className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Boletim</span>
              </motion.button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Média Geral</p>
                    <h4 className="text-3xl font-bold text-slate-900">9.2</h4>
                 </div>
                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Trophy className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frequência</p>
                    <h4 className="text-3xl font-bold text-slate-900">{user.frequencia || 100}%</h4>
                 </div>
                 <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <Zap className="w-5 h-5 fill-current" />
                 </div>
              </div>
            </div>

            {/* Feature Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-100">
                      Novo Material
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Sala de Aula Virtual
                    </h3>
                    <p className="text-slate-500 mb-6 font-medium leading-relaxed">
                      Assista as aulas, participe das discussões e envie seus trabalhos acadêmicos de forma rápida e segura.
                    </p>
                    <Link to="/classroom" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-all active:scale-95 group">
                      Acessar Material <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="w-32 h-32 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 hidden md:flex">
                      <Layout className="w-12 h-12 text-slate-300" />
                  </div>
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Atividades Recentes</h4>
                 <Bell className="w-4 h-4 text-slate-300" />
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Nota Postada", time: "Há 10 min", color: "blue" },
                  { title: "Novo Trabalho", time: "Há 2h", color: "emerald" },
                  { title: "Evento Escolar", time: "Amanhã", color: "rose" }
                ].map((notif, i) => (
                  <div key={i} className="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                    <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${
                      notif.color === 'blue' ? 'bg-blue-500' :
                      notif.color === 'emerald' ? 'bg-emerald-500' :
                      'bg-rose-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Calendário</h4>
                   <CalendarIcon className="w-4 h-4 text-slate-300" />
                </div>
                {/* Simplified static calendar representation */}
                <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm font-bold text-slate-700">Abril 2026</p>
                    <div className="mt-4 grid grid-cols-7 gap-1 px-4">
                         {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-[10px] font-bold text-slate-300">{d}</div>)}
                         {[...Array(30)].map((_, i) => (
                           <div key={i} className={`text-xs p-1 rounded ${i + 1 === 27 ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                             {i + 1}
                           </div>
                         ))}
                    </div>
                </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
