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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 active:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
             <Logo className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              CETEP
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter leading-none mt-1">
              Portal Acadêmico
            </span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold transition-all hover:text-blue-600 relative group/link ${
                location.pathname === item.path ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-100 transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4 opacity-70" /> Sair
              </button>
            ) : (
              <Link 
                to="/auth"
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
              >
                Acessar Portal
              </Link>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
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
