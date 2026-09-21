import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, BookOpen, GraduationCap, FileText, Bot, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, isDark, toggleTheme } = useTheme();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 shrink-0 active:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
             <Logo className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
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
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50"
                  >
                    {secondaryNavItems.map((item) => {
                      const isActive = (location.pathname + location.search) === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <p className="text-xs font-bold">{item.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{item.desc}</p>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Badges if Enzo */}
            {isEnzoAdmin && (
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
                <Link
                  to="/teachers"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    location.pathname === '/teachers'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                      : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                  }`}
                >
                  Secretaria
                </Link>
                <Link
                  to="/database"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    location.pathname === '/database'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
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
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section: Theme Toggle, Profile & Logout */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs flex items-center justify-center"
            title={isDark ? "Mudar para Modo Claro (Branco)" : "Mudar para Modo Escuro (Preto)"}
            aria-label="Alternar modo escuro e claro"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/settings"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  location.pathname === '/settings'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Perfil
              </Link>
              <button 
                onClick={logout}
                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/auth?mode=register"
                className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg text-xs font-bold transition-colors"
              >
                Criar Conta
              </Link>
              <Link 
                to="/auth"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Entrar
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
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
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 overflow-hidden shadow-xl"
          >
            {/* Quick theme toggle in drawer */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Modo de Exibição</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-amber-400 cursor-pointer"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{isDark ? "Tema Escuro (Preto)" : "Tema Claro (Branco)"}</span>
              </button>
            </div>

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
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {isEnzoAdmin && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <Link
                      to="/teachers"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-bold text-center"
                    >
                      Secretaria
                    </Link>
                    <Link
                      to="/database"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                    >
                      Banco de Dados
                    </Link>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between py-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    Modo {isDark ? 'Escuro Ativado' : 'Claro Ativado'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Mudar para {isDark ? 'Branco' : 'Preto'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-center text-xs font-bold"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex-1 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-lg text-center text-xs font-bold cursor-pointer"
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
                    className="block text-sm font-bold text-slate-800 dark:text-slate-200 py-1"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between py-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    Modo {isDark ? 'Escuro Ativado' : 'Claro Ativado'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Mudar para {isDark ? 'Branco' : 'Preto'}
                  </button>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Link
                    to="/auth?mode=register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg"
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

      {/* Mobile Fixed Bottom Navigation Bar for quick access */}
      {isAuthenticated && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
          {[
            { name: 'Início', path: '/dashboard', icon: Home },
            { name: 'Aulas', path: '/classroom', icon: BookOpen },
            { name: 'Cursos', path: '/extra-courses', icon: GraduationCap },
            { name: 'Boletim', path: '/boletim', icon: FileText },
            { name: 'Chat IA', path: '/contact?tab=ai', icon: Bot },
          ].map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && (location.pathname + location.search) === item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400 stroke-[2.5]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-[10px] mt-1 leading-none">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

