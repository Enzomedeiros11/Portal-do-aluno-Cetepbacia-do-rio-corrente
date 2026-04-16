import { Link } from 'react-router-dom';
import { Map, Home, BookOpen, Users, Settings, MessageSquare, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Sitemap() {
  const routes = [
    { path: '/lp-video', name: 'Início / Landing Page', icon: Home, desc: 'Página principal da escola' },
    { path: '/auth', name: 'Login / Cadastro', icon: LogIn, desc: 'Acesso ao portal acadêmico' },
    { path: '/students', name: 'Portal do Aluno', icon: BookOpen, desc: 'Acesso para estudantes' },
    { path: '/teachers', name: 'Painel do Professor', icon: Users, desc: 'Ferramentas para educadores' },
    { path: '/settings', name: 'Configurações', icon: Settings, desc: 'Administração do sistema' },
    { path: '/contact', name: 'Suporte', icon: MessageSquare, desc: 'Fale conosco' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-12 border-b border-indigo-100 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Map className="text-indigo-600 w-8 h-8" />
            <h1 className="text-4xl font-serif font-medium text-slate-900">Mapa do Site (Dev)</h1>
          </div>
          <p className="text-slate-500">Navegação rápida para o ambiente de desenvolvimento.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route, i) => (
            <Link 
              key={route.path} 
              to={route.path}
              className="group block p-6 bg-white rounded-2xl border border-indigo-50 hover:border-indigo-600 transition-all shadow-sm"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
                  <route.icon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-900 mb-1">{route.name}</h3>
                  <p className="text-sm text-slate-500">{route.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
