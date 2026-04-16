import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Layout } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavigationProps {
  isAuthenticated: boolean;
  logout: () => void;
  userRole?: 'student' | 'teacher';
}

export default function Navigation({ isAuthenticated, logout, userRole }: NavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isTeacher = userRole === 'teacher';

  // Define nav items based on auth state and role
  const navItems = isAuthenticated 
    ? [
        { name: 'Início', path: '/dashboard', icon: Layout },
        { name: 'Jornal', path: '/journal' },
        { name: 'Sala de Aula', path: '/classroom' },
        { name: 'Cursos Extras', path: '/extra-courses' },
        { name: 'Notas', path: '/students' },
        { name: 'Estágios', path: '/internships' },
        ...(isTeacher ? [{ name: 'Painel Prof.', path: '/teachers' }] : []),
      ]
    : [
        { name: 'Início', path: '/lp-video' },
        { name: 'Sobre', path: '/about' },
        { name: 'Suporte', path: '/contact' },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <Logo className="w-14 h-14" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-indigo-900 leading-none">CETEP</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase leading-none mt-1">Bacia do Rio Corrente</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                location.pathname === item.path ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          ) : (
            <Link 
              to="/auth"
              className="px-6 py-2.5 bg-indigo-900 text-white rounded-full text-sm font-medium hover:bg-slate-900 transition-all shadow-sm"
            >
              Acessar Portal
            </Link>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-600 hover:text-indigo-600"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full py-3 px-6 bg-indigo-50 text-indigo-600 rounded-xl text-center font-bold text-lg"
                >
                  Sair do Portal
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-6 bg-indigo-900 text-white rounded-xl text-center font-medium"
                >
                  Acessar Portal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
