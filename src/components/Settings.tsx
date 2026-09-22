import { User, Bell, Mail, Shield, LogOut, Camera, Upload } from 'lucide-react';
import { User as UserType } from '../types';
import { useState, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { requestPushNotificationPermission } from '../services/messagingService';

interface SettingsProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onUpdateUser?: (updated: UserType) => void;
}

export default function Settings({ currentUser, onLogout, onUpdateUser }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>('profile');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    publicProfile: false,
    hideEmail: false,
    showGradesInClass: true,
    twoFactor: false,
    language: 'Português (BR)'
  });

  if (!currentUser) return null;

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newVal = !prev[key];
      const newSettings = { ...prev, [key]: newVal };
      localStorage.setItem('cetep_settings', JSON.stringify(newSettings));
      toast.success(`Configuração alterada com sucesso!`);
      return newSettings;
    });
  };

  const compressImage = (file: File, maxDim = 320, quality = 0.80): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        if (!rawResult) {
          resolve('');
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = Math.max(width, 1);
            canvas.height = Math.max(height, 1);

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return resolve(rawResult);
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch {
            resolve(rawResult);
          }
        };
        img.onerror = () => {
          // Fallback to raw data without throwing
          resolve(rawResult);
        };
        img.src = rawResult;
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (!newAvatarUrl) return;
    setIsUploading(true);

    const updatedUser: UserType = {
      ...currentUser,
      avatar: newAvatarUrl
    };

    // Save locally immediately so UI updates and stays persistent
    localStorage.setItem('cetep_user', JSON.stringify(updatedUser));

    const savedAll = localStorage.getItem('cetep_all_users');
    if (savedAll) {
      try {
        const usersArr: UserType[] = JSON.parse(savedAll);
        const updatedArr = usersArr.map(u => (u.id === currentUser.id || u.email === currentUser.email) ? updatedUser : u);
        localStorage.setItem('cetep_all_users', JSON.stringify(updatedArr));
      } catch (e) {
        console.warn('Storage sync warning:', e);
      }
    }

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    try {
      const emailDocId = currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, '_') : null;
      const idsToUpdate = new Set<string>();
      if (currentUser.id) idsToUpdate.add(currentUser.id);
      if (emailDocId) idsToUpdate.add(emailDocId);
      if (currentUser.email === 'enzomedeirosdasilva6@gmail.com') {
        idsToUpdate.add('enzo_admin');
        idsToUpdate.add('enzomedeirosdasilva6_gmail_com');
      }

      const updateData = {
        avatar: newAvatarUrl,
        avatar_url: newAvatarUrl,
        updatedAt: new Date().toISOString()
      };

      for (const id of idsToUpdate) {
        await setDoc(doc(db, 'usuarios', id), updateData, { merge: true });
      }

      toast.success('Foto de perfil salva com sucesso no Firebase!');
    } catch (err: any) {
      console.warn('Firebase sync warning:', err);
      toast.success('Foto de perfil atualizada!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 15MB.');
      return;
    }

    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file, 280, 0.82);
      if (compressedUrl) {
        await handleAvatarChange(compressedUrl);
      } else {
        toast.error('Não foi possível ler a imagem selecionada.');
      }
    } catch {
      toast.error('Erro ao processar imagem. Tente outra foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const avatarPresets = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`,
    `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(currentUser.id)}`,
    `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(currentUser.email)}`,
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 px-6 font-sans transition-colors duration-200">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-10 text-left">
           <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Configurações e Perfil</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gerencie sua foto de perfil, preferências de privacidade e notificações do portal CETEP.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-4 space-y-2">
            {[
              { id: 'profile', label: 'Foto & Perfil', icon: User },
              { id: 'notifications', label: 'Notificações', icon: Bell },
              { id: 'privacy', label: 'Privacidade', icon: Shield }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            
            <div className="pt-6">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="md:col-span-8 space-y-6">
            
            {/* User Profile Header Card */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                          <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      </div>
                      <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105">
                        <Camera className="w-4 h-4" />
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{currentUser.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider mt-0.5">{currentUser.email}</p>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">{currentUser.course} • {currentUser.grade}</p>
                        <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                            Conta Ativa
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB: PROFILE & AVATAR SELECTION */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors text-left">
                <section>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Alterar Foto de Perfil</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">Envie uma foto do seu dispositivo, cole um link da internet ou escolha um avatar padrão.</p>

                  <div className="space-y-5">
                    {/* Option 1: File Upload */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Enviar Imagem do Dispositivo</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">JPG, PNG ou GIF (otimizada automaticamente)</p>
                        </div>
                      </div>
                      <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs shrink-0">
                        {isUploading ? 'Salvando...' : 'Selecionar Foto'}
                        <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleFileUpload} />
                      </label>
                    </div>

                    {/* Option 2: Image URL */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Ou cole o link de uma imagem da internet</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://exemplo.com/minha-foto.jpg"
                          className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                          value={customPhotoUrl}
                          onChange={(e) => setCustomPhotoUrl(e.target.value)}
                        />
                        <button 
                          onClick={() => { handleAvatarChange(customPhotoUrl); setCustomPhotoUrl(''); }}
                          disabled={!customPhotoUrl.trim() || isUploading}
                          className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>

                    {/* Option 3: Presets */}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs mb-3">Avatares Sugeridos</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {avatarPresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAvatarChange(preset)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer group"
                          >
                            <img src={preset} alt="preset" className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors text-left">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                           <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Notificações Push (FCM)</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Receba alertas instantâneos no dispositivo quando novos comunicados forem postados.</p>
                        </div>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Notificações em Tempo Real no Navegador</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                          {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                            ? 'Permissão concedida! Notificações ativas no dispositivo.'
                            : 'Ative para autorizar o serviço de avisos escolares em segundo plano.'}
                        </p>
                      </div>
                      <button
                        onClick={() => requestPushNotificationPermission(currentUser)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
                      >
                        <Bell className="w-4 h-4" />
                        Ativar Notificações
                      </button>
                    </div>
                </section>

                <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                           <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Comunicados por E-mail</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Avisos da Coordenação</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Receba comunicados oficiais e avisos de exames no seu Gmail.</p>
                            </div>
                            <button 
                                onClick={() => toggleSetting('emailNotif')}
                                className={`w-12 h-7 rounded-full relative transition-all duration-300 cursor-pointer ${settings.emailNotif ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${settings.emailNotif ? 'left-6 shadow-md' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>
              </div>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors text-left">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Privacidade da Conta</h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Perfil Público na Escola</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Permitir que outros alunos da mesma turma vejam seu perfil.</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('publicProfile')}
                        className={`w-12 h-7 rounded-full relative transition-all duration-300 cursor-pointer ${settings.publicProfile ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${settings.publicProfile ? 'left-6 shadow-md' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between group pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Ocultar E-mail Pessoal</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Esconder seu endereço de e-mail das listas de colegas.</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('hideEmail')}
                        className={`w-12 h-7 rounded-full relative transition-all duration-300 cursor-pointer ${settings.hideEmail ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${settings.hideEmail ? 'left-6 shadow-md' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

