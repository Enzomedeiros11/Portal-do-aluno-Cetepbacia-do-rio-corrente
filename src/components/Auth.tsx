import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  IdCard,
  CheckCircle2,
  Clock,
  School,
  HeartHandshake
} from 'lucide-react';
import Logo from './Logo';
import { User, COURSES, GRADES, AuthorizedUser, PreRegistrationRequest } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { sendWelcomeEmail, sendVerificationCodeEmail } from '../services/emailService';
import { checkAuthorization, normalizeIdentifier, normalizeMatricula } from '../services/authorizedService';
import { submitPreRegistration, checkPendingPreRegistration } from '../services/approvalService';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
}

export default function Auth({ onLogin, onRegister, users }: AuthProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParamMode = searchParams.get('mode') || searchParams.get('tab');
  const [mode, setMode] = useState<AuthMode>(() => {
    if (urlParamMode === 'register') return 'register';
    if (urlParamMode === 'forgot') return 'forgot';
    return 'login';
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifiedStudent, setVerifiedStudent] = useState<AuthorizedUser | null>(null);
  const [verifyingIdentifier, setVerifyingIdentifier] = useState(false);

  // Pre-Registration states
  const [registerRole, setRegisterRole] = useState<'student' | 'parent'>('student');
  const [preRegSuccess, setPreRegSuccess] = useState<PreRegistrationRequest | null>(null);

  const [registerForm, setRegisterForm] = useState({
    name: '',
    matricula: '',
    email: '',
    password: '',
    course: COURSES[1] || 'Técnico em Informática',
    grade: GRADES[0] || '1º Ano'
  });

  useEffect(() => {
    const urlMode = searchParams.get('mode') || searchParams.get('tab');
    if (urlMode === 'register') {
      setMode('register');
    } else if (urlMode === 'login') {
      setMode('login');
    } else if (urlMode === 'forgot') {
      setMode('forgot');
    }
  }, [searchParams]);

  const switchMode = (newMode: AuthMode) => {
    setError(null);
    setVerifiedStudent(null);
    setPreRegSuccess(null);
    setMode(newMode);
    try {
      if (newMode === 'login') {
        setSearchParams({}, { replace: true });
      } else if (newMode === 'register') {
        setSearchParams({ mode: 'register' }, { replace: true });
      } else if (newMode === 'forgot') {
        setSearchParams({ mode: 'forgot' }, { replace: true });
      }
    } catch (e) {
      console.warn('URL update warning:', e);
    }
  };

  // Recovery States
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [sentCode, setSentCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [recoveryTargetEmail, setRecoveryTargetEmail] = useState<string>('');

  const [formData, setFormData] = useState({
    identifier: '', // Matrícula or Gmail
    password: '',
  });

  // Pre-check identifier when user types (debounced or on blur)
  const handleVerifyIdentifier = async (val: string) => {
    const clean = val.trim();
    if (!clean || clean.length < 3) {
      setVerifiedStudent(null);
      return;
    }
    
    // Skip if it's Enzo or Adm
    if (
      clean.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' || 
      clean.toLowerCase() === 'dir-2026' || 
      clean.toLowerCase() === 'dir-2024'
    ) {
      setVerifiedStudent({
        id: 'dir_enzo',
        matricula: 'DIR-2026',
        email: 'enzomedeirosdasilva6@gmail.com',
        name: 'Professor Enzo Medeiros',
        role: 'teacher',
        course: 'Todos os Cursos',
        grade: 'Direção / Coordenação',
        status: 'ativo'
      });
      return;
    }

    if (
      clean.toLowerCase() === 'adm@gmail.com' || 
      clean.toLowerCase() === 'adm' || 
      clean.toLowerCase() === 'adm-2026'
    ) {
      setVerifiedStudent({
        id: 'dir_adm',
        matricula: 'ADM-2026',
        email: 'adm@gmail.com',
        name: 'Professor Administrador',
        role: 'teacher',
        course: 'Todos os Cursos',
        grade: 'Direção / Coordenação',
        status: 'ativo'
      });
      return;
    }

    setVerifyingIdentifier(true);
    try {
      const match = await checkAuthorization(clean);
      setVerifiedStudent(match);
    } catch (e) {
      console.warn('Verification check error:', e);
    } finally {
      setVerifyingIdentifier(false);
    }
  };

  const handleSendRecoveryCode = async () => {
    const cleanInput = formData.identifier.trim();
    if (!cleanInput) {
      setError('Informe sua Matrícula ou Gmail cadastrado.');
      return;
    }
    setError(null);
    setLoading(true);

    const authorized = await checkAuthorization(cleanInput);
    if (!authorized) {
      setError('Matrícula ou e-mail não encontrado no cadastro oficial do CETEP.');
      setLoading(false);
      return;
    }

    const targetEmail = authorized.email;
    setRecoveryTargetEmail(targetEmail);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generatedCode);

    await sendVerificationCodeEmail(authorized.name, targetEmail, generatedCode);
    setLoading(false);
    setResetStep('verify');
    toast.success(`Código de verificação enviado para o Gmail: ${targetEmail}`);
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
    const cleanEmail = (recoveryTargetEmail || formData.identifier).trim().toLowerCase();
    const uid = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      await setDoc(doc(db, 'usuarios', uid), {
        senha: newPassword,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error updating password in Firestore:', err);
    }

    toast.success('Senha redefinida com sucesso! Você já pode entrar com sua nova senha.');
    setMode('login');
    setFormData({ ...formData, password: newPassword });
    setResetStep('request');
    setLoading(false);
  };

  // Submit Handler for Pre-Registration
  const handlePreRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!registerForm.name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!registerForm.matricula.trim()) {
      setError(
        registerRole === 'parent' 
          ? 'Por favor, informe a matrícula do seu filho(a).' 
          : 'Por favor, informe sua matrícula escolar.'
      );
      return;
    }
    if (!registerForm.email.trim()) {
      setError('Por favor, informe seu Gmail para contato e acesso.');
      return;
    }
    if (!registerForm.password || registerForm.password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = normalizeIdentifier(registerForm.email);
      const cleanMat = normalizeMatricula(registerForm.matricula);

      // Check if already registered and approved
      const existingAuth = await checkAuthorization(cleanEmail);
      if (existingAuth && existingAuth.status === 'ativo' && existingAuth.isActivated) {
        setError(`O e-mail ${cleanEmail} já possui uma conta ativa. Faça login na aba "Entrar".`);
        setLoading(false);
        return;
      }

      // Check if pending
      const pending = await checkPendingPreRegistration(cleanEmail);
      if (pending) {
        setError(`Já existe um pré-cadastro em análise para o e-mail ${cleanEmail}. Aguarde a aprovação do Professor Enzo.`);
        setLoading(false);
        return;
      }

      const request = await submitPreRegistration({
        name: registerForm.name.trim(),
        email: cleanEmail,
        matricula: cleanMat,
        role: registerRole,
        course: registerForm.course,
        grade: registerForm.grade,
        password: registerForm.password
      });

      setPreRegSuccess(request);
      toast.success('Pré-cadastro enviado! Aguarde a aprovação do Professor Enzo.');
    } catch (err) {
      console.error('Pre-register error:', err);
      setError('Erro ao enviar pré-cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Login
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanInput = formData.identifier.trim();

    if (!cleanInput) {
      setError('Por favor, informe sua Matrícula ou seu Gmail cadastrado.');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Por favor, informe sua senha de acesso.');
      setLoading(false);
      return;
    }

    // 1. Special Case: Professor Enzo Medeiros (Direção / Super Admin)
    const isEnzoIdentifier = (
      cleanInput.toLowerCase() === 'enzomedeirosdasilva6@gmail.com' ||
      cleanInput.toUpperCase() === 'DIR-2026' ||
      cleanInput.toUpperCase() === 'DIR-2024' ||
      cleanInput.toLowerCase() === 'enzo'
    );

    if (isEnzoIdentifier) {
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
        setError('Senha incorreta para o acesso da Direção (Professor Enzo Medeiros).');
        setLoading(false);
        return;
      }

      const enzoUser: User = {
        id: 'enzo_admin',
        name: 'Professor Enzo Medeiros',
        email: 'enzomedeirosdasilva6@gmail.com',
        matricula: 'DIR-2026',
        role: 'teacher',
        course: 'Todos os Cursos',
        grade: 'Direção / Coordenação',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EnzoMedeiros',
        subjectGrades: {},
        frequencia: 100
      };

      try {
        await setDoc(doc(db, 'usuarios', 'enzo_admin'), {
          id: 'enzo_admin',
          nome: enzoUser.name,
          email: enzoUser.email,
          matricula: enzoUser.matricula,
          senha: formData.password,
          tipo: 'teacher',
          curso: enzoUser.course,
          grade: enzoUser.grade,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firebase sync warning for Enzo:', err);
      }

      toast.success('Bem-vindo, Professor Enzo Medeiros (Direção CETEP)!');
      onLogin(enzoUser);
      setLoading(false);
      return;
    }

    // 1b. Special Case: Professor Administrador (adm@gmail.com / senha 0000)
    const isAdmIdentifier = (
      cleanInput.toLowerCase() === 'adm@gmail.com' ||
      cleanInput.toUpperCase() === 'ADM-2026' ||
      cleanInput.toLowerCase() === 'adm'
    );

    if (isAdmIdentifier) {
      let isValidPassword = (
        formData.password === '0000' ||
        formData.password === '00000000' ||
        formData.password === '123' ||
        formData.password === 'admin'
      );

      try {
        const docSnap = await getDoc(doc(db, 'usuarios', 'adm_admin'));
        if (docSnap.exists() && docSnap.data().senha) {
          if (docSnap.data().senha === formData.password) {
            isValidPassword = true;
          } else {
            isValidPassword = false;
          }
        }
      } catch (err) {
        console.warn('Firebase check warning for Adm:', err);
      }

      if (!isValidPassword) {
        setError('Senha incorreta para a conta de administrador (senha: 0000).');
        setLoading(false);
        return;
      }

      const admUser: User = {
        id: 'adm_admin',
        name: 'Professor Administrador',
        email: 'adm@gmail.com',
        matricula: 'ADM-2026',
        role: 'teacher',
        course: 'Todos os Cursos',
        grade: 'Direção / Coordenação',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdmCETEP',
        subjectGrades: {},
        frequencia: 100
      };

      try {
        await setDoc(doc(db, 'usuarios', 'adm_admin'), {
          id: 'adm_admin',
          nome: admUser.name,
          email: admUser.email,
          matricula: admUser.matricula,
          senha: formData.password,
          tipo: 'teacher',
          curso: admUser.course,
          grade: admUser.grade,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firebase sync warning for Adm:', err);
      }

      toast.success('Bem-vindo, Professor Administrador (CETEP)!');
      onLogin(admUser);
      setLoading(false);
      return;
    }

    // 2. Check if this identifier is in pending pre-registration (Aguardando Aprovação)
    const pendingRequest = await checkPendingPreRegistration(cleanInput);
    if (pendingRequest) {
      setError(
        `⏳ Cadastro em análise: A solicitação de ${pendingRequest.name} (${pendingRequest.role === 'parent' ? 'Responsável' : 'Aluno'} • Matrícula: ${pendingRequest.matricula}) ` +
        `está aguardando aprovação da conta de professor (Professor Enzo Medeiros) para poder fazer login. ` +
        `Aguarde a liberação pela Secretaria escolar.`
      );
      setLoading(false);
      return;
    }

    // 3. Multi-Account Resolver: Check all accounts in /usuarios for this email or matrícula
    // (Crucial because Parent and Student share the same Matrícula, but have distinct Gmails and Passwords)
    const cleanEmail = normalizeIdentifier(cleanInput);
    const cleanMat = normalizeMatricula(cleanInput);
    let matchingUsers: any[] = [];

    try {
      const snapAll = await getDocs(collection(db, 'usuarios'));
      snapAll.forEach((docSnap) => {
        const d = docSnap.data();
        const dEmail = normalizeIdentifier(d.email || '');
        const dMat = normalizeMatricula(d.matricula || '');
        if (dEmail === cleanEmail || (cleanMat && dMat === cleanMat)) {
          matchingUsers.push({ id: docSnap.id, ...d });
        }
      });
    } catch (e) {
      console.warn('Error reading matching users:', e);
    }

    // Check if any matching user is still pending approval
    const pendingUser = matchingUsers.find(u => u.status === 'aguardando_aprovacao');
    if (pendingUser && !matchingUsers.some(u => u.senha === formData.password && u.status === 'ativo')) {
      setError(
        `⏳ Cadastro aguardando aprovação do Professor Enzo Medeiros na Secretaria escolar. ` +
        `Assim que aprovado, seu login estará liberado automaticamente.`
      );
      setLoading(false);
      return;
    }

    // Check if there is an account matching the password entered
    if (matchingUsers.length > 0) {
      const matchWithPassword = matchingUsers.find(u => u.senha === formData.password && u.status !== 'aguardando_aprovacao');
      if (matchWithPassword) {
        const userToLogin: User = {
          id: matchWithPassword.id,
          name: matchWithPassword.nome || matchWithPassword.name || 'Usuário',
          email: matchWithPassword.email || cleanEmail,
          matricula: matchWithPassword.matricula || cleanMat,
          password: matchWithPassword.senha,
          role: (matchWithPassword.tipo === 'teacher' || matchWithPassword.role === 'teacher')
            ? 'teacher'
            : (matchWithPassword.role === 'parent' || matchWithPassword.tipo === 'parent')
              ? 'parent'
              : 'student',
          grade: matchWithPassword.grade || '1º Ano',
          course: matchWithPassword.curso || matchWithPassword.course || 'Técnico em Informática',
          avatar: matchWithPassword.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(matchWithPassword.nome || 'User')}`,
          subjectGrades: matchWithPassword.notas || {},
          frequencia: matchWithPassword.frequencia || 100,
          emailResponsavel: matchWithPassword.emailResponsavel,
          nomeResponsavel: matchWithPassword.nomeResponsavel,
          childStudentId: matchWithPassword.childMatricula || matchWithPassword.childStudentId
        };

        toast.success(`Bem-vindo(a) de volta, ${userToLogin.name}! (${userToLogin.role === 'parent' ? 'Responsável' : userToLogin.role === 'teacher' ? 'Professor' : 'Aluno'})`);
        onLogin(userToLogin);
        setLoading(false);
        return;
      } else {
        // Matrícula or email was found, but password did not match
        setError('Senha incorreta. Verifique a senha digitada ou clique em "Esqueceu a senha?".');
        setLoading(false);
        return;
      }
    }

    // 4. Security Check: Validate against Authorization Whitelist (for users from default seed or newly authorized)
    const authorized = await checkAuthorization(cleanInput);

    if (!authorized) {
      setError(
        '⛔ Acesso Não Autorizado: Esta matrícula ou e-mail ainda não foi aprovado pelo Professor Enzo/Direção. ' +
        'Se você ainda não se cadastrou, clique na aba "Fazer Pré-Cadastro" para enviar seus dados para aprovação.'
      );
      setLoading(false);
      return;
    }

    const officialEmail = authorized.email.trim().toLowerCase();
    const userUid = officialEmail.replace(/[^a-zA-Z0-9]/g, '_');

    // 5. First Access Flow for approved user
    if (formData.password.length < 4) {
      setError(`Digite uma senha com pelo menos 4 caracteres para entrar.`);
      setLoading(false);
      return;
    }

    const firstAccessUser: User = {
      id: userUid,
      name: authorized.name,
      email: officialEmail,
      matricula: authorized.matricula,
      password: formData.password,
      role: authorized.role,
      grade: authorized.grade || '1º Ano',
      course: authorized.course || 'Técnico em Informática',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorized.name)}`,
      subjectGrades: {},
      frequencia: 100,
      isOnline: true,
      lastSeen: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'usuarios', userUid), {
        id: userUid,
        nome: firstAccessUser.name,
        email: firstAccessUser.email,
        matricula: firstAccessUser.matricula,
        senha: formData.password,
        tipo: firstAccessUser.role,
        role: firstAccessUser.role,
        grade: firstAccessUser.grade,
        curso: firstAccessUser.course,
        frequencia: 100,
        status: 'ativo',
        avatar: firstAccessUser.avatar,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      await setDoc(doc(db, 'autorizados', authorized.id), { isActivated: true }, { merge: true });
    } catch (e) {
      console.warn('First access user creation warning:', e);
    }

    toast.success(`Bem-vindo(a), ${authorized.name}!`);
    onLogin(firstAccessUser);
    setLoading(false);
    return;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans transition-colors duration-200">
      {/* Left Side: Institutional Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 relative items-center justify-center p-20">
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
            className="text-4xl xl:text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Portal Acadêmico <span className="text-blue-400 font-medium">Oficial.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base xl:text-lg text-slate-400 leading-relaxed font-medium mb-8"
          >
            Ambiente seguro e exclusivo para a comunidade escolar do CETEP da Bacia do Rio Corrente.
          </motion.p>

          {/* Security & Teacher Approval Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 bg-blue-950/40 border border-blue-800/40 rounded-2xl flex items-start gap-3.5 mb-8"
          >
            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-200">Aprovação Prévia pela Direção</p>
              <p className="text-xs text-blue-300/80 mt-1 leading-relaxed">
                Novos cadastros de alunos e responsáveis são validados e liberados pela conta do <strong>Professor Enzo Medeiros</strong> antes do primeiro acesso.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <div className="flex-1 p-5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acesso Seguro</p>
            </div>
            <div className="flex-1 p-5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">CETEP</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bacia do Rio Corrente</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white dark:bg-slate-900 transition-colors duration-200">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-6 text-center lg:text-left">
            <div className="lg:hidden inline-flex w-12 h-12 bg-blue-600 rounded-lg items-center justify-center mb-4">
              <Logo className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validação Oficial da Direção</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' && 'Entrar no Portal'}
              {mode === 'register' && 'Fazer Pré-Cadastro'}
              {mode === 'forgot' && 'Recuperar Senha'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium text-xs sm:text-sm">
              {mode === 'login' && 'Informe sua Matrícula ou Gmail para acessar.'}
              {mode === 'register' && 'Preencha seus dados para enviar seu cadastro para aprovação do professor.'}
              {mode === 'forgot' && 'Insira sua Matrícula ou Gmail para receber o código de verificação.'}
            </p>
          </div>

          {/* Top Switcher Tabs: Entrar vs Fazer Pré-Cadastro */}
          {mode !== 'forgot' && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-600 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
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
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Fazer Pré-Cadastro</span>
              </button>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold leading-relaxed"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* SCREEN: PRE-REGISTRATION SUCCESS CONFIRMATION */}
          {mode === 'register' && preRegSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Pré-Cadastro Enviado!
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 mt-1">
                    ⏳ Aguardando Aprovação do Professor
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-2">
                <p><strong>Nome:</strong> {preRegSuccess.name}</p>
                <p>
                  <strong>Tipo:</strong> {preRegSuccess.role === 'parent' ? '👨‍👩‍👧 Responsável (Pai/Mãe)' : '🎓 Aluno(a)'}
                </p>
                <p>
                  <strong>Matrícula:</strong> {preRegSuccess.matricula}
                  {preRegSuccess.role === 'parent' && <span className="text-[10px] text-slate-400 ml-1">(do filho)</span>}
                </p>
                <p><strong>Gmail:</strong> {preRegSuccess.email}</p>
                <p><strong>Curso & Turma:</strong> {preRegSuccess.course} • {preRegSuccess.grade}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Sua solicitação foi registrada no sistema do CETEP. O <strong>Professor Enzo Medeiros</strong> irá analisar e aprovar sua conta na Secretaria. Assim que aprovada, você poderá entrar usando sua senha cadastrada.
              </p>

              <button
                type="button"
                onClick={() => {
                  setPreRegSuccess(null);
                  switchMode('login');
                }}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Voltar para a Tela de Login
              </button>
            </motion.div>
          ) : mode === 'register' ? (
            /* PRE-REGISTRATION FORM */
            <form onSubmit={handlePreRegister} className="space-y-4">
              {/* Type Switcher: Aluno vs Responsável */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Quem está se cadastrando?
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('student')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      registerRole === 'student'
                        ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>🎓 Sou Aluno</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('parent')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      registerRole === 'parent'
                        ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>👨‍👩‍👧 Sou Pai / Mãe</span>
                  </button>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {registerRole === 'parent' ? 'Nome do Responsável (Pai / Mãe)' : 'Nome Completo do Aluno'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={registerRole === 'parent' ? 'Ex: Márcia Silva' : 'Ex: Carlos Eduardo Silva'}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Matrícula (mesma matrícula para pai e aluno!) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {registerRole === 'parent' ? 'Matrícula do Filho(a)' : 'Matrícula Escolar'}
                  </label>
                  {registerRole === 'parent' && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      Mesma matrícula do estudante
                    </span>
                  )}
                </div>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2026001"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 uppercase"
                    value={registerForm.matricula}
                    onChange={(e) => setRegisterForm({ ...registerForm, matricula: e.target.value })}
                  />
                </div>
              </div>

              {/* Gmail do Aluno ou Responsável */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {registerRole === 'parent' ? 'Gmail do Responsável' : 'Gmail do Aluno'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={registerRole === 'parent' ? 'responsavel@gmail.com' : 'aluno@gmail.com'}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Curso e Turma */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {registerRole === 'parent' ? 'Curso do Filho' : 'Curso Técnico'}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none cursor-pointer"
                      value={registerForm.course}
                      onChange={(e) => setRegisterForm({ ...registerForm, course: e.target.value })}
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {registerRole === 'parent' ? 'Série do Filho' : 'Série / Turma'}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none cursor-pointer"
                      value={registerForm.grade}
                      onChange={(e) => setRegisterForm({ ...registerForm, grade: e.target.value })}
                    >
                      {GRADES.filter(g => g !== 'Docente').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {registerRole === 'parent' ? 'Criar Senha do Responsável' : 'Criar Senha de Acesso'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo de 4 caracteres"
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
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

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Ao clicar em <strong>Enviar Pré-Cadastro</strong>, seus dados serão encaminhados para a aprovação do Professor Enzo Medeiros. Assim que aprovado, você poderá fazer login.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enviar Pré-Cadastro para Aprovação</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <div className="space-y-4">
              {resetStep === 'request' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Matrícula ou Gmail cadastrado
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ex: 2026001 ou seu.email@gmail.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendRecoveryCode}
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Verificar e Enviar Código'}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs rounded-lg font-medium">
                    Código de 6 dígitos enviado para o Gmail da matrícula: <strong>{recoveryTargetEmail}</strong>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Código de Verificação
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Código de 6 dígitos"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-center tracking-widest text-lg"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Digite sua nova senha"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium"
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
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  ← Voltar para o Login
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Matrícula ou Gmail Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Matrícula ou Gmail cadastrado
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Aluno ou Responsável
                  </span>
                </div>

                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2026001, aluno@gmail.com ou pais@gmail.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-800 dark:text-white"
                    value={formData.identifier}
                    onChange={(e) => {
                      setFormData({ ...formData, identifier: e.target.value });
                      handleVerifyIdentifier(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Verified Student or Parent Preview Card if Found */}
              {verifiedStudent && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-tight">
                        {verifiedStudent.name}
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        {verifiedStudent.role === 'parent' 
                          ? `Responsável Legal • Acompanhamento Escolar (${verifiedStudent.course})`
                          : `${verifiedStudent.course} • ${verifiedStudent.grade} (Matrícula: ${verifiedStudent.matricula === 'DIR-2024' ? 'DIR-2026' : verifiedStudent.matricula})`
                        }
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 rounded-full uppercase tracking-wider">
                    {verifiedStudent.role === 'parent' ? 'Família' : 'Aprovado'}
                  </span>
                </motion.div>
              )}

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Sua Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Digite sua senha cadastrada"
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm text-slate-800 dark:text-white"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Ainda não tem conta? Clique em <strong>Fazer Pré-Cadastro</strong> acima.</span>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
