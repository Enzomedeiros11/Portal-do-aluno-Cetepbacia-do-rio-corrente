import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Layout } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavigationProps {
  isAuthenticated: boolean;
  logout: () => void;
  userRole?: 'student' | 'teacher';
  userEmail?: string;
}

export default function Navigation({ isAuthenticated, logout, userRole, userEmail }: NavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isCoordinator = userEmail === 'codernador12@gmail.com' || userEmail === 'enzomedeirosdasilva6@gmail.com';

  const navItems = isAuthenticated 
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: Layout },
        { name: 'Sala de Aula', path: '/classroom' },
        { name: 'Boletim', path: '/students' },
        { name: 'Jornal', path: '/journal' },
        ...(isCoordinator ? [{ name: 'Secretaria', path: '/teachers' }] : []),
        { name: 'Perfil', path: '/settings' },
      ]
    : [
        { name: 'Página Inicial', path: '/lp-video' },
        { name: 'Sobre Nós', path: '/about' },
        { name: 'Suporte', path: '/contact' },
      ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-100/50 shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[40px] px-6 lg:px-10 h-20 flex items-center justify-between transition-colors duration-300">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-4 group perspective-1000">
          <div className="relative transform group-hover:rotate-12 transition-transform duration-500">
            <div className="w-14 h-14 bg-indigo-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/20 transition-all overflow-hidden">
               <Logo className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" title="Portal Ativo" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-slate-800 font-display leading-none group-hover:text-indigo-600 transition-colors">
                CETEP
              </span>
              <span className="px-2 py-0.5 bg-indigo-50/50 text-indigo-500 text-[8px] font-black rounded-full border border-indigo-100/50 tracking-tighter uppercase">
                Portal
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase leading-none mt-1.5 opacity-60">
              Bacia do Rio Corrente
            </span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-indigo-600 relative group/link ${
                location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-2 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                location.pathname === item.path ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 opacity-80" /> Sair
              </button>
            ) : (
              <Link 
                to="/auth"
                className="px-8 py-3 bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/10 active:scale-95"
              >
                Acessar Portal
              </Link>
            )}
          </div>

          <button className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-900" onClick={() => setIsOpen(!isOpen)}>
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
            className="lg:hidden mt-4 bg-white/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[32px] overflow-hidden"
          >
            <div className="px-8 py-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-2xl font-black tracking-tighter ${
                    location.pathname === item.path ? 'text-indigo-600' : 'text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full py-5 px-8 bg-rose-50 text-rose-600 rounded-3xl text-center font-black uppercase tracking-widest text-xs"
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
