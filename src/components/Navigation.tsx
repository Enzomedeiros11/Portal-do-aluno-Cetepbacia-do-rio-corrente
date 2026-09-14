import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEnzoAdmin = userEmail === 'enzomedeirosdasilva6@gmail.com';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items (text only, no icons)
  const primaryNavItems = [
    { name: 'Início', path: '/dashboard' },
    { name: 'Sala de Aula', path: '/classroom' },
    { name: 'Cursos Extras', path: '/extra-courses' },
    { name: 'Estágios', path: '/internships' },
    { name: 'Boletim', path: '/boletim' },
  ];

  // Secondary tools (text only)
  const secondaryNavItems = [
    { name: 'Jornal CETEP', path: '/journal', desc: 'Notícias e avisos escolares' },
    { name: 'Chat IA', path: '/contact?tab=ai', desc: 'Plantão de dúvidas' },
    { name: 'Ajuda', path: '/contact?tab=form', desc: 'Fale com a coordenação' },
  ];

  const publicNavItems = [
    { name: 'Página Inicial', path: '/lp-video' },
    { name: 'Sobre Nós', path: '/about' },
    { name: 'Ajuda', path: '/contact?tab=form' },
    { name: 'Chat IA', path: '/contact?tab=ai' },
  ];

  const isSecondaryActive = secondaryNavItems.some(
    item => location.pathname === item.path || (location.pathname + location.search) === item.path
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 shrink-0 active:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <Logo className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            CETEP
          </span>
        </Link>
        
        {/* Desktop Navigation - Text Only */}
        {isAuthenticated ? (
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* "Mais" Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSecondaryActive || isDropdownOpen
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Mais</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50"
                  >
                    {secondaryNavItems.map((item) => {
                      const isActive = (location.pathname + location.search) === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <p className="text-xs font-bold">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{item.desc}</p>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Badges if Enzo */}
            {isEnzoAdmin && (
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                <Link
                  to="/teachers"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    location.pathname === '/teachers'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Secretaria
                </Link>
                <Link
                  to="/database"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    location.pathname === '/database'
                      ? 'bg-slate-200 text-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Banco de Dados
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-6">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section: Profile & Logout */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/settings"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  location.pathname === '/settings'
                    ? 'bg-slate-100 text-slate-900 border-slate-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Perfil
              </Link>
              <button 
                onClick={logout}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/auth?mode=register"
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
              >
                Criar Conta
              </Link>
              <Link 
                to="/auth"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 overflow-hidden shadow-lg"
          >
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {primaryNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {isEnzoAdmin && (
                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <Link
                      to="/teachers"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold text-center"
                    >
                      Secretaria
                    </Link>
                    <Link
                      to="/database"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 p-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    >
                      Banco de Dados
                    </Link>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-center text-xs font-bold"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-center text-xs font-bold cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-bold text-slate-800 py-1"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <Link
                    to="/auth?mode=register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold border border-blue-200 text-blue-600 rounded-lg"
                  >
                    Criar Conta
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold bg-blue-600 text-white rounded-lg"
                  >
                    Entrar
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

