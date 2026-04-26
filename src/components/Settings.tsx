import { motion } from 'motion/react';
import { User, Bell, Mail, Shield, Smartphone, Globe, Cloud, LogOut, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';

interface SettingsProps {
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Settings({ currentUser, onLogout }: SettingsProps) {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    publicProfile: false,
    twoFactor: false,
    language: 'Português (BR)'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newVal = !prev[key];
      const newSettings = { ...prev, [key]: newVal };
      localStorage.setItem('cetep_settings', JSON.stringify(newSettings));
      toast.success(`Configuração alterada com sucesso!`);
      return newSettings;
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6 font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12">
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter font-display mb-2">Configurações</h1>
           <p className="text-slate-500 font-medium">Gerencie sua conta e preferências de notificação.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-4 space-y-2">
            {[
              { label: 'Perfil', icon: User, active: true },
              { label: 'Notificações', icon: Bell },
              { label: 'Privacidade', icon: Shield },
              { label: 'Conexões', icon: Cloud }
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  item.active 
                    ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-500 hover:bg-white hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            
            <div className="pt-8">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sair da Conta
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="md:col-span-8 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[32px] bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentUser.name}</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{currentUser.email}</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                            Conta Ativa
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Sections */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                           <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Comunicados por E-mail</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Novidades e Avisos</p>
                                <p className="text-xs text-slate-400 font-medium">Receba avisos importantes da coordenação no seu e-mail.</p>
                            </div>
                            <button 
                                onClick={() => toggleSetting('emailNotif')}
                                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.emailNotif ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.emailNotif ? 'left-7 shadow-lg' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                           <Smartphone className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Preferências de App</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Notificações em Tempo Real</p>
                                <p className="text-xs text-slate-400 font-medium">Alertas visuais e sonoros para novas mensagens no chat.</p>
                            </div>
                            <button 
                                onClick={() => toggleSetting('pushNotif')}
                                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.pushNotif ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.pushNotif ? 'left-7 shadow-lg' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div>
                                <p className="font-bold text-slate-900">Idioma do Sistema</p>
                                <p className="text-xs text-slate-400 font-medium">O portal será exibido no idioma selecionado.</p>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 cursor-pointer border border-transparent hover:border-indigo-600/20 transition-all">
                                <Globe className="w-4 h-4" />
                                {settings.language}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-8 bg-slate-900 rounded-[40px] text-white flex items-center justify-between">
                <div>
                    <h4 className="font-black text-lg">Segurança de Acesso</h4>
                    <p className="text-white/40 text-xs font-medium">Mantenha sua conta sempre protegida.</p>
                </div>
                <button 
                    onClick={() => toggleSetting('twoFactor')}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.twoFactor ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                >
                    {settings.twoFactor ? '2FA ATIVO' : 'ATIVAR 2FA'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
