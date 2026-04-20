import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, GraduationCap, ArrowRight, Mail, Lock, User as UserIcon, BookOpen, Calendar, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

    // Simulação curta de carregamento
    setTimeout(() => {
      if (mode === 'login') {
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
          onLogin(user);
        } else {
          setError('E-mail ou senha incorretos.');
        }
      } else {
        // Registration
        if (users.some(u => u.email === formData.email)) {
          setError('Este e-mail já está cadastrado.');
        } else if (formData.name && formData.email && formData.password) {
          const newUser: User = {
            id: Date.now().toString(),
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: 'student', // Always student by default via register
            grade: formData.grade,
            course: formData.course,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
          };
          onRegister(newUser);
        } else {
          setError('Por favor, preencha todos os campos.');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-indigo-100 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Logo className="w-16 h-16" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-slate-500 mt-2">
              {mode === 'login' 
                ? 'Acesse o portal do aluno e professor' 
                : 'Junte-se à nossa comunidade acadêmica'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
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
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type="text"
                      placeholder="Nome completo"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                      <select
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all appearance-none"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        {GRADES.filter(g => g !== 'Docente').map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                      <select
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all appearance-none text-xs font-medium"
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
              <input
                type="email"
                placeholder="E-mail institucional"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-indigo-300 hover:text-indigo-600 transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-900 text-white rounded-xl font-medium hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {mode === 'login' 
                ? 'Não tem uma conta? Cadastre-se' 
                : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
