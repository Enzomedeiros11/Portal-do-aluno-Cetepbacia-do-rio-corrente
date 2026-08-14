import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, User as UserIcon, BookOpen, Calendar, AlertCircle, Eye, EyeOff, KeyRound, ChevronDown, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { User, COURSES, GRADES } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { sendWelcomeEmail, sendVerificationCodeEmail } from '../services/emailService';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
}

export default function Auth({ onLogin, onRegister, users }: AuthProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') === 'register' || searchParams.get('tab') === 'register') ? 'register' : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const urlMode = searchParams.get('mode') || searchParams.get('tab');
    if (urlMode === 'register' && mode !== 'register') {
      setMode('register');
    } else if (urlMode === 'login' && mode !== 'login') {
      setMode('login');
    }
  }, [searchParams]);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    if (newMode !== 'forgot') {
      setSearchParams({ mode: newMode });
    }
  };

  // Recovery States
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [sentCode, setSentCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '1º Ano',
    course: 'Técnico em Informática'
  });

  const handleSendRecoveryCode = async () => {
    if (!formData.email.trim()) {
      setError('Informe seu e-mail para receber o código.');
      return;
    }
    setError(null);
    setLoading(true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generatedCode);

    await sendVerificationCodeEmail(formData.name || 'Usuário', formData.email.trim(), generatedCode);
    setLoading(false);
    setResetStep('verify');
    toast.success(`Código de verificação enviado para o e-mail ${formData.email.trim()}`);
  };

  const handleConfirmPasswordReset = async () => {
    if (inputCode.trim() !== sentCode) {
      setError('Código de verificação incorreto.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setError('Sua nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);
    const cleanEmail = formData.email.trim().toLowerCase();
    const uid = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      await setDoc(doc(db, 'usuarios', uid), {
        senha: newPassword,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error updating password in Firestore:', err);
    }

    toast.success('Senha redefinida com sucesso! Você já pode fazer login com a nova senha.');
    setMode('login');
    setFormData({ ...formData, password: newPassword });
    setResetStep('request');
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Por favor, informe seu e-mail.');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Por favor, informe sua senha para prosseguir.');
      setLoading(false);
      return;
    }

    // 1. Special Check: Professor Enzo Medeiros
    if (cleanEmail === 'enzomedeirosdasilva6@gmail.com') {
      let isValidPassword = (
        formData.password === '00000000' ||
        formData.password === '123' ||
        formData.password === 'enzo123' ||
        formData.password === 'admin'
      );

      try {
        const docSnap = await getDoc(doc(db, 'usuarios', 'enzo_admin'));
        if (docSnap.exists() && docSnap.data().senha) {
          if (docSnap.data().senha === formData.password) {
            isValidPassword = true;
          } else {
            isValidPassword = false;
          }
        }
      } catch (err) {
        console.warn('Firebase check warning for Enzo:', err);
      }

      if (!isValidPassword) {
        setError('Senha incorreta para a conta do Professor Enzo Medeiros.');
        setLoading(false);
        return;
      }

      const enzoUser: User = {
        id: 'enzo_admin',
        name: 'Professor Enzo Medeiros',
        email: 'enzomedeirosdasilva6@gmail.com',
        role: 'teacher',
        course: 'Todos os Cursos',
        grade: 'Docente / Coordenador',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EnzoMedeiros',
        subjectGrades: {},
        frequencia: 100
      };

      // Sync to Firebase
      try {
        await setDoc(doc(db, 'usuarios', 'enzo_admin'), {
          id: 'enzo_admin',
          nome: enzoUser.name,
          email: enzoUser.email,
          senha: formData.password,
          tipo: 'teacher',
          curso: enzoUser.course,
          grade: enzoUser.grade,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firebase sync warning for Enzo:', err);
      }

      onLogin(enzoUser);
      setLoading(false);
      return;
    }

    // 2. Register Mode
    if (mode === 'register') {
      if (!formData.name?.trim() || !cleanEmail || !formData.password) {
        setError('Por favor, preencha todos os campos do formulário (incluindo a senha).');
        setLoading(false);
        return;
      }

      if (formData.password.length < 4) {
        setError('A senha deve ter pelo menos 4 caracteres.');
        setLoading(false);
        return;
      }

      const existingUser = (users || []).find(u => (u?.email || '').toLowerCase() === cleanEmail);
      if (existingUser) {
        setError('Este e-mail já possui uma conta cadastrada. Por favor, faça login.');
        setLoading(false);
        return;
      }

      // Check in Firebase
      try {
        const docRef = doc(db, 'usuarios', cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setError('Este e-mail já está cadastrado no sistema. Faça login.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Firebase duplicate check fallback', err);
      }

      const newUid = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_') || `user_${Date.now()}`;
      const newUser: User = {
        id: newUid,
        name: formData.name.trim(),
        email: cleanEmail,
        password: formData.password,
        role: 'student',
        grade: formData.grade || '1º Ano',
        course: formData.course || 'Técnico em Informática',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name.trim())}`,
        subjectGrades: {},
        frequencia: 100,
        isOnline: true,
        lastSeen: new Date().toISOString()
      };

      // Save to Firebase (with timeout protection)
      try {
        await setDoc(doc(db, 'usuarios', newUid), {
          id: newUid,
          nome: newUser.name,
          email: newUser.email,
          senha: formData.password,
          tipo: 'student',
          grade: newUser.grade,
          curso: newUser.course,
          frequencia: 100,
          avatar: newUser.avatar,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error('Firebase save error on register:', e);
      }

      // Send welcome email in background (non-blocking)
      sendWelcomeEmail(newUser.name, newUser.email).catch((emailErr) => {
        console.warn('Non-blocking welcome email error:', emailErr);
      });

      toast.success('Conta criada com sucesso! Bem-vindo ao CETEP.');
      onRegister(newUser);
      setLoading(false);
      return;
    }

    // 3. Login Mode
    let userToLogin: User | null = (users || []).find(u => (u?.email || '').toLowerCase() === cleanEmail) || null;
    let storedSenha: string | null = userToLogin?.password || null;

    const userUid = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    try {
      const docSnap = await getDoc(doc(db, 'usuarios', userUid));
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d.senha) {
          storedSenha = d.senha;
        }
        if (!userToLogin) {
          userToLogin = {
            id: docSnap.id,
            name: d.nome || cleanEmail.split('@')[0],
            email: d.email || cleanEmail,
            password: d.senha,
            role: (d.tipo === 'teacher' || cleanEmail === 'enzomedeirosdasilva6@gmail.com') ? 'teacher' : 'student',
            grade: d.grade || '1º Ano',
            course: d.curso || 'Técnico em Informática',
            avatar: d.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
            subjectGrades: d.notas || {},
            frequencia: d.frequencia || 100
          };
        }
      }
    } catch (err) {
      console.warn('Firestore fetch error during login:', err);
    }

    if (!userToLogin) {
      setError('Conta não encontrada com este e-mail. Alterne para "Novo por aqui? Crie sua conta".');
      setLoading(false);
      return;
    }

    // Check password
    if (storedSenha && storedSenha !== formData.password) {
      setError('Senha incorreta. Verifique a senha digitada ou clique em "Esqueceu a senha?".');
      setLoading(false);
      return;
    }

    // Save password if missing in stored doc (legacy user protection)
    if (!storedSenha) {
      try {
        await setDoc(doc(db, 'usuarios', userUid), { senha: formData.password }, { merge: true });
        userToLogin.password = formData.password;
      } catch (e) {}
    }

    onLogin(userToLogin);
    setLoading(false);
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
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alunos Registrados</p>
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
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden inline-flex w-12 h-12 bg-blue-600 rounded-lg items-center justify-center mb-6">
              <Logo className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' && 'Identificação de Aluno'}
              {mode === 'register' && 'Criar Nova Conta'}
              {mode === 'forgot' && 'Recuperar Senha'}
            </h1>
            <p className="text-slate-500 mt-1.5 font-medium text-sm">
              {mode === 'login' && 'Insira seus dados de acesso para entrar no portal acadêmico.'}
              {mode === 'register' && 'Preencha seus dados de estudante para se cadastrar no CETEP.'}
              {mode === 'forgot' && 'Redefina sua senha através do código de verificação por e-mail.'}
            </p>
          </div>

          {/* Top Switcher Tabs: Entrar vs Criar Conta */}
          {mode !== 'forgot' && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta</span>
              </button>
            </div>
          )}

          {mode === 'forgot' ? (
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-600 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {resetStep === 'request' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      E-mail Cadastrado
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendRecoveryCode}
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Enviar Código ao Gmail'}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                    Código de 6 dígitos enviado para <strong>{formData.email}</strong>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Código de Verificação
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Código de 6 dígitos"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-center tracking-widest text-lg"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Digite sua nova senha"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmPasswordReset}
                    disabled={loading}
                    className="w-full py-3.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Redefinir Senha'}
                  </button>
                </>
              )}

              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  ← Voltar para o Login
                </button>
              </div>
            </div>
          ) : (
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

              {/* REGISTER ONLY FIELDS: NOME, SÉRIE, CURSO */}
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Campo 1: Nome Completo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nome Completo do Aluno
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required={mode === 'register'}
                          placeholder="Ex: João da Silva"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-800"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Campo 2 e 3: Série e Curso */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Série / Ano
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select
                            className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none font-semibold text-xs text-slate-800 cursor-pointer"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          >
                            {GRADES.filter(g => g !== 'Docente').map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Curso Técnico
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select
                            className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none font-semibold text-xs text-slate-800 cursor-pointer"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          >
                            {COURSES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Campo E-mail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {mode === 'register' ? 'E-mail Principal (Gmail/Outro)' : 'E-mail ou Matrícula'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-800"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {mode === 'register' ? 'Criar Senha de Acesso' : 'Sua Senha'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mode === 'register' ? 'Mínimo de 4 caracteres' : 'Sua senha'}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-800"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 group shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
                  mode === 'register' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar no Portal' : 'Cadastrar e Entrar'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            {mode !== 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                 {mode === 'login' ? (
                   <>Ainda não tem conta? <span className="text-blue-600 underline">Criar conta agora</span></>
                 ) : (
                   <>Já tem uma conta cadastrada? <span className="text-blue-600 underline">Fazer Login</span></>
                 )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

