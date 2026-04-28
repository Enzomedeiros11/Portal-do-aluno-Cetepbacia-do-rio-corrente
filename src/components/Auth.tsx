import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, User as UserIcon, BookOpen, Calendar, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { User, COURSES, GRADES } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

    if (!isSupabaseConfigured) {
      setError('Banco de dados real não conectado. Usando simulação local (LocalStorage).');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mode === 'login') {
        const user = users.find(u => u.email === formData.email);
        if (user) {
          onLogin(user);
        } else if (
          (formData.email === 'codernador12@gmail.com' || formData.email === 'enzomedeirosdasilva6@gmail.com') && 
          formData.password === '123'
        ) {
           onLogin({
             id: formData.email === 'codernador12@gmail.com' ? 'admin' : 'enzo',
             name: formData.email === 'codernador12@gmail.com' ? 'Coordenador' : 'Enzo Medeiros',
             email: formData.email,
             role: 'teacher',
             course: 'Todos',
             grade: 'Docente',
             avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
           });
        } else {
          setError('E-mail ou senha incorretos (Modo Local).');
        }
      } else {
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
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Por favor, preencha todos os campos.');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('Erro ao criar usuário.');

        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([{
            id: signUpData.user.id,
            nome: formData.name,
            email: formData.email,
            tipo: 'student',
            grade: formData.grade,
            curso: formData.course
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Solid Professional Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-20">
        <div className="relative z-10 max-w-lg">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg"
           >
              <Logo className="w-10 h-10 text-white fill-white" />
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
           >
             Sua educação profissional começa <span className="text-blue-400 font-medium">aqui.</span>
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-slate-400 leading-relaxed font-medium"
           >
             Acesse o Portal Acadêmico do CETEP para gerenciar sua vida estudantil com eficiência e organização.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="mt-12 flex gap-4"
           >
              <div className="flex-1 p-6 bg-white/5 rounded-xl border border-white/10">
                 <p className="text-3xl font-bold text-white mb-1 tracking-tight">1.2k+</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alunos</p>
              </div>
              <div className="flex-1 p-6 bg-white/5 rounded-xl border border-white/10">
                 <p className="text-3xl font-bold text-white mb-1 tracking-tight">98%</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aprovação</p>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden inline-flex w-12 h-12 bg-blue-600 rounded-lg items-center justify-center mb-6">
              <Logo className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Identificação' : 'Criar Conta'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Centro Territorial de Educação Profissional.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-600 text-sm font-semibold"
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
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nome completo"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none font-semibold text-sm"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        {GRADES.filter(g => g !== 'Docente').map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-xs font-bold uppercase tracking-tight"
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

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="E-mail principal"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Acessar Conta' : 'Finalizar Registro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
               {mode === 'login' 
                ? 'Novo por aqui? Crie sua conta' 
                : 'Já tem uma conta? Identifique-se'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
