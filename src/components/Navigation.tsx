import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Layout, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavigationProps {
  isAuthenticated: boolean;
  logout: () => void;
  userRole?: 'student' | 'teacher';
  userEmail?: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navigation({ isAuthenticated, logout, userRole, userEmail, theme, toggleTheme }: NavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isCoordinator = userEmail === 'codernador12@gmail.com';

  const navItems = isAuthenticated 
    ? [
        { name: 'Início', path: '/dashboard', icon: Layout },
        { name: 'Jornal', path: '/journal' },
        { name: 'Sala de Aula', path: '/classroom' },
        { name: 'Notas', path: '/students' },
        { name: 'Cursos', path: '/extra-courses' },
        { name: 'Estágios', path: '/internships' },
        { name: 'Sobre', path: '/about' },
        { name: 'Ajustes', path: '/settings' },
        ...(isCoordinator ? [{ name: 'Coordenação', path: '/teachers' }] : []),
      ]
    : [
        { name: 'Início', path: '/lp-video' },
        { name: 'Sobre', path: '/about' },
        { name: 'Suporte', path: '/contact' },
      ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-6 lg:px-10 h-20 flex items-center justify-between transition-colors duration-300">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <Logo className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-indigo-950 dark:text-white leading-none font-display">CETEP</span>
            <span className="text-[9px] font-black text-indigo-600/70 dark:text-indigo-400 tracking-widest uppercase leading-none mt-1">Bacia do Rio Corrente</span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-black uppercase tracking-widest transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group/link ${
                location.pathname === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                location.pathname === item.path ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-900/10 active:scale-95"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            ) : (
              <Link 
                to="/auth"
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Acessar Portal
              </Link>
            )}
          </div>

          <button className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="lg:hidden mt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-[32px] overflow-hidden"
          >
            <div className="px-8 py-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-2xl font-black tracking-tighter ${
                    location.pathname === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full py-5 px-8 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-3xl text-center font-black uppercase tracking-widest text-xs"
                  >
                    Encerrar Sessão
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block py-5 px-8 bg-indigo-600 text-white rounded-3xl text-center font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20"
                  >
                    Entrar no Portal
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
