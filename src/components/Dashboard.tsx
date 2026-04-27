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
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '../types';

interface DashboardProps {
  user: User | null;
  allUsers: User[];
}

export default function Dashboard({ user, allUsers }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user) return null;

  const onlineUsersCount = allUsers.filter(u => u.isOnline).length;
  const classmates = allUsers.filter(u => u.course === user.course && u.id !== user.id);

  const handleQuickAction = (action: string) => {
    toast.success(`${action} iniciado com sucesso!`);
  };

  const handleDownload = (type: string) => {
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
    <div className="min-h-screen bg-[#fafbfc] pt-28 pb-12 px-6 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background elements optimized */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-7xl relative z-10"
      >
        {/* Modern Header */}
        <motion.header variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 w-fit"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Painel do Aluno</span>
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-none font-display">
              Olá, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg mt-4">
              Bem-vindo ao seu portal academicos.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
             <div className="flex -space-x-3">
                {classmates.slice(0, 3).map((student, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-50 overflow-hidden shadow-sm">
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="h-10 w-px bg-slate-100"></div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                   <p className="text-[11px] font-black text-slate-900 tracking-tighter uppercase leading-none">{onlineUsersCount} Online</p>
                </div>
             </div>
             <Link 
               to="/settings" 
               className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-indigo-50 transition-all shadow-inner"
             >
               <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
             </Link>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bento Grid - Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.button 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => handleQuickAction('Novo Trabalho')}
                className="group relative flex flex-col items-center justify-center p-8 bg-indigo-500 text-white rounded-[32px] shadow-lg shadow-indigo-500/10 active:scale-95 overflow-hidden transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
                <Zap className="w-8 h-8 mb-4 lg:mb-6 fill-current opacity-80" />
                <span className="text-[11px] font-black uppercase tracking-widest leading-none opacity-90">Novo Trabalho</span>
              </motion.button>

              <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                <Link to="/extra-courses" className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-xl hover:border-indigo-600/20 transition-all text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 leading-none">Cursos Extra</span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                <Link to="/classroom" className="group relative flex flex-col items-center justify-center p-8 bg-slate-800 text-white rounded-[32px] shadow-lg shadow-slate-800/10 hover:bg-slate-900 transition-all text-center">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-indigo-300 fill-current" />
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-widest leading-none opacity-90">Estágios</span>
                </Link>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => handleDownload('Boletim')}
                className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-xl hover:border-indigo-600/20 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 leading-none">Boletim</span>
              </motion.button>
            </div>

            {/* Performance Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Média Geral</p>
                    <h4 className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">9.2</h4>
                 </div>
                 <div className="w-12 h-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-indigo-500">
                    <Trophy className="w-6 h-6" />
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Frequência</p>
                    <h4 className="text-3xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{user.frequencia || 100}%</h4>
                 </div>
                 <div className="w-12 h-12 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Zap className="w-6 h-6 fill-current" />
                 </div>
              </div>
            </motion.div>

            {/* Feature Hero Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm group overflow-hidden transition-colors"
            >
              <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                <div className="text-center md:text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                    Acesso Rápido
                  </span>
                  <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter leading-tight font-display">
                    Sala de Aula Virtual
                  </h3>
                  <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
                    Acesse materiais exclusivos, participe de discussões e envie seus trabalhos de forma prática.
                  </p>
                  <Link to="/classroom" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group/btn">
                    Entrar na Sala <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-64 h-64 bg-indigo-50 rounded-[40px] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                     <Layout className="w-32 h-32 text-indigo-200 absolute -bottom-8 -right-8" />
                     <BookOpen className="w-24 h-24 text-indigo-600 relative z-10" />
                  </div>
                  {/* Decorative floaters */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-100 rounded-2xl animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="absolute -bottom-8 -right-2 w-16 h-16 bg-rose-100 rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Background gradient mask */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-50 to-transparent rounded-full translate-x-1/4 -translate-y-1/4 -z-1" />
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Real-time Notifications / Feed */}
            <motion.section variants={itemVariants} className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                     <Bell className="w-4 h-4" />
                   </div>
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Atividades</h4>
                 </div>
                 <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Nota Postada", time: "Há 10 min", color: "indigo" },
                  { title: "Novo Trabalho", time: "Há 2h", color: "emerald" },
                  { title: "Evento Escolar", time: "Amanhã", color: "rose" }
                ].map((notif, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`w-2 h-10 rounded-full ${
                      notif.color === 'indigo' ? 'bg-indigo-500/20 group-hover:bg-indigo-500' :
                      notif.color === 'emerald' ? 'bg-emerald-500/20 group-hover:bg-emerald-500' :
                      'bg-rose-500/20 group-hover:bg-rose-500'
                    } transition-all`} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{notif.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/journal" className="w-full mt-8 py-5 bg-slate-100 text-slate-600 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                Explorar Jornal <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.section>

            {/* Futuristic Calendar */}
            <motion.section 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-100 rounded-[40px] p-8 text-slate-900 shadow-2xl shadow-indigo-900/5 relative overflow-hidden border border-slate-200"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cronograma</p>
                     <h4 className="text-2xl font-black tracking-tighter">Abril 2024</h4>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                     <CalendarIcon className="w-6 h-6 text-white" />
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-[9px] font-black text-slate-400 mb-4 tracking-widest">
                   {['D','S','T','Q','Q','S','S'].map(d => <span key={d}>{d}</span>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                   {[...Array(30)].map((_, idx) => {
                     const d = idx + 1;
                     const isToday = d === 17;
                     const hasEvent = [12, 18, 25].includes(d);
                     return (
                        <div key={idx} className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isToday ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-110 ring-2 ring-white/20' : 
                          hasEvent ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-indigo-50'
                        } cursor-pointer`}>
                          {d}
                        </div>
                     );
                   })}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
