import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, User as UserIcon, BookOpen, Calendar, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { User, COURSES, GRADES } from '../types';

type AuthMode = 'login' | 'register';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
}

export default function Auth({ onLogin, onRegister, users }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '1º Ano',
    course: 'Técnico em Informática'
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (mode === 'login') {
        const user = users.find(u => u.email === formData.email);
        if (user) {
          onLogin(user);
        } else if (formData.email === 'codernador12@gmail.com' && formData.password === '123') {
           onLogin({
             id: 'admin',
             name: 'Coordenador',
             email: 'codernador12@gmail.com',
             role: 'teacher',
             course: 'Todos',
             grade: 'Docente',
             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
           });
        } else {
          setError('E-mail ou senha incorretos.');
          setLoading(false);
        }
      } else {
        // Registration
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Por favor, preencha todos os campos.');
        }
        
        const emailExists = users.some(u => u.email === formData.email);
        if (emailExists) {
          throw new Error('Este e-mail já está em uso.');
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(2),
          name: formData.name,
          email: formData.email,
          role: 'student',
          grade: formData.grade,
          course: formData.course,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
          subjectGrades: {}
        };
        onRegister(newUser);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Dynamic Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4" />
        
        <div className="relative z-10 max-w-lg">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 flex items-center justify-center mb-12 shadow-2xl"
           >
              <Logo className="w-16 h-16" />
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-6xl font-black text-white leading-none tracking-tighter mb-8 font-display"
           >
             Sua jornada rumo ao <span className="text-indigo-400 italic">futuro</span> começa aqui.
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="text-xl text-white/50 leading-relaxed font-medium"
           >
             Acesse o Portal Acadêmico do CETEP e conecte-se com sua educação profissional de forma moderna e simplificada.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="mt-16 grid grid-cols-2 gap-4"
           >
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                 <p className="text-4xl font-black text-white font-display mb-1 tracking-tighter">1.2k+</p>
                 <p className="text-xs font-black text-white/40 uppercase tracking-widest">Alunos Ativos</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                 <p className="text-4xl font-black text-white font-display mb-1 tracking-tighter">98%</p>
                 <p className="text-xs font-black text-white/40 uppercase tracking-widest">Aprovação</p>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-slate-50 relative">
        <div className="lg:hidden absolute top-10 left-10">
           <Logo className="w-12 h-12" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-display">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar minha conta'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {mode === 'login' 
                ? 'Insira suas credenciais corporativas do CETEP.' 
                : 'Preencha os dados abaixo para iniciar seu cadastro.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Nome completo"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                      <select
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all appearance-none font-bold text-xs uppercase"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        {GRADES.filter(g => g !== 'Docente').map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                      <select
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all appearance-none text-[10px] uppercase font-black tracking-widest"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      >
                        {COURSES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                placeholder="E-mail institucional"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-indigo-900/40 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Acessar Portal' : 'Finalizar Cadastro'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="px-6 py-3 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
            >
              {mode === 'login' 
                ? 'Não possui conta? Registre-se agora' 
                : 'Já possui uma conta? Faça login aqui'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
