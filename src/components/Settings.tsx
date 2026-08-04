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

  const compressImage = (file: File, maxDim = 250, quality = 0.70): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
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

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(e.target?.result as string);
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Falha ao processar a imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
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
        const updatedArr = usersArr.map(u => u.id === currentUser.id ? updatedUser : u);
        localStorage.setItem('cetep_all_users', JSON.stringify(updatedArr));
      } catch (e) {
        console.error(e);
      }
    }

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    try {
      // Sync to Firebase
      await setDoc(doc(db, 'usuarios', currentUser.id), {
        avatar: newAvatarUrl,
        avatar_url: newAvatarUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Foto de perfil salva com sucesso!');
    } catch (err: any) {
      console.warn('Firebase sync warning:', err);
      toast.success('Foto salva no dispositivo com sucesso!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file, 250, 0.70);
      await handleAvatarChange(compressedUrl);
    } catch (error) {
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
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6 font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12">
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter font-display mb-2">Configurações e Perfil</h1>
           <p className="text-slate-500 font-medium">Gerencie sua foto de perfil, preferências de privacidade e notificações do portal.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
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
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
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
            
            {/* User Profile Header Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-[32px] bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                          <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      </div>
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentUser.name}</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-0.5">{currentUser.email}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{currentUser.course} • {currentUser.grade}</p>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                            Conta Ativa
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB: PROFILE & AVATAR SELECTION */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <section>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Alterar Foto de Perfil</h3>
                  <p className="text-xs font-medium text-slate-500 mb-6">Escolha uma foto do seu dispositivo, cole um link direto de imagem ou escolha um avatar estilizado.</p>

                  <div className="space-y-6">
                    {/* Option 1: File Upload */}
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Enviar Imagem do Dispositivo</p>
                          <p className="text-xs text-slate-400 font-medium">Formatos PNG, JPG ou GIF (máx. 5MB)</p>
                        </div>
                      </div>
                      <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl cursor-pointer transition-all shadow-md shrink-0">
                        Selecionar Foto
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>

                    {/* Option 2: Image URL */}
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                      <p className="font-bold text-slate-900 text-sm">Cole a URL de uma foto da Web</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://exemplo.com/minha-foto.jpg"
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                          value={customPhotoUrl}
                          onChange={(e) => setCustomPhotoUrl(e.target.value)}
                        />
                        <button 
                          onClick={() => { handleAvatarChange(customPhotoUrl); setCustomPhotoUrl(''); }}
                          disabled={!customPhotoUrl.trim() || isUploading}
                          className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-all disabled:opacity-50"
                        >
                          Salvar Foto
                        </button>
                      </div>
                    </div>

                    {/* Option 3: Presets */}
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-3">Avatares Recomendados CETEP</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {avatarPresets.map((preset, i) => (
                          <button
                            key={i}
                            onClick={() => handleAvatarChange(preset)}
                            className="p-2 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-center group"
                          >
                            <img src={preset} alt="preset" className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform" />
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
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                           <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Notificações Push (FCM)</h3>
                          <p className="text-xs text-slate-400 font-medium">Receba alertas instantâneos no dispositivo quando novos comunicados forem postados.</p>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Notificações em Tempo Real no Navegador</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                            ? '✅ Permissão concedida! Você receberá avisos no seu dispositivo.'
                            : 'Ative para autorizar o serviço de avisos escolares em segundo plano.'}
                        </p>
                      </div>
                      <button
                        onClick={() => requestPushNotificationPermission(currentUser)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2"
                      >
                        <Bell className="w-4 h-4" />
                        Ativar Notificações Push
                      </button>
                    </div>
                </section>

                <section className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                           <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Comunicados por E-mail</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Avisos da Coordenação</p>
                                <p className="text-xs text-slate-400 font-medium">Receba comunicados oficiais e avisos de exames no seu Gmail.</p>
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
              </div>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Privacidade da Conta</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="font-bold text-slate-900">Perfil Público na Escola</p>
                        <p className="text-xs text-slate-400 font-medium">Permitir que outros alunos da mesma turma vejam seu perfil.</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('publicProfile')}
                        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.publicProfile ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.publicProfile ? 'left-7 shadow-lg' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between group pt-4 border-t border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Ocultar E-mail Pessoal</p>
                        <p className="text-xs text-slate-400 font-medium">Esconder seu endereço de e-mail das listas públicas de colegas.</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('hideEmail')}
                        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.hideEmail ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.hideEmail ? 'left-7 shadow-lg' : 'left-1'}`} />
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

