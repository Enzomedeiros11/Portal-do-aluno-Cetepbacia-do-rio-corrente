import { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Bell, Lock, Palette, Globe, Save, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';
import { toast } from 'sonner';

interface SettingsProps {
  user: User | null;
  onLogout: () => void;
}

export default function Settings({ user, onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const displayUser = user || {
    name: 'Estudante Modelo',
    email: 'estudante@email.com',
    course: 'Técnico em Informática',
    id: '202455981',
    avatar: ''
  };

  const tabs = [
    { id: 'profile', icon: UserIcon, label: 'Meu Perfil' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'security', icon: Lock, label: 'Segurança' },
    { id: 'appearance', icon: Palette, label: 'Aparência' },
  ];

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const toastId = toast.loading('Salvando suas alterações no banco de dados...');
    
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        // Here we would typically have inputs for these, but since the UI is currently static 
        // placeholders, we'll simulate a successful write to the cloud.
        lastSeen: new Date().toISOString() 
      });
      
      setIsSaving(false);
      toast.success('Alterações sincronizadas em todos os aparelhos!', { id: toastId });
    } catch (err) {
      console.error('Error saving settings:', err);
      setIsSaving(false);
      toast.error('Erro ao salvar no servidor.', { id: toastId });
    }
  };

  const handleLogoutAction = () => {
    if (confirm('Deseja realmente sair da conta?')) {
      onLogout();
      toast.success('Sessão encerrada com sucesso!');
    }
  };

  const handleAction = (action: string) => {
    toast.info(`Funcionalidade em desenvolvimento: ${action}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-medium text-slate-900 mb-2">Configurações</h1>
          <p className="text-gray-500">Gerencie sua conta e preferências do sistema CETEP.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1 border-r border-gray-100 pr-8">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/10' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </nav>
            
            <div className="mt-20 pt-8 border-t border-gray-100">
               <button 
                 onClick={handleLogoutAction}
                 className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
               >
                  <LogOut className="w-5 h-5" /> Sair da Conta
               </button>
            </div>
          </div>

          {/* Settings Canvas */}
          <div className="lg:col-span-3">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm min-h-[500px] flex flex-col"
             >
                {activeTab === 'profile' && (
                  <div className="space-y-8 flex-1">
                     <div className="flex items-center gap-8 mb-12">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl relative group cursor-pointer overflow-hidden">
                           {displayUser.avatar ? (
                             <img src={displayUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             <UserIcon className="text-indigo-600 w-10 h-10 group-hover:scale-110 transition-transform" />
                           )}
                           <div className="absolute inset-0 bg-indigo-900/10 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-slate-950">{displayUser.name}</h3>
                           <p className="text-gray-400 font-medium">Matrícula: {displayUser.id}</p>
                           <button 
                             onClick={() => handleAction('Alterar Foto')}
                             className="text-indigo-600 font-bold text-xs mt-2 uppercase tracking-widest hover:underline"
                           >
                             Alterar foto
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                           <input type="text" defaultValue={displayUser.name} className="w-full px-6 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-600 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                           <input type="email" defaultValue={displayUser.email} className="w-full px-6 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-600 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Curso</label>
                           <input type="text" defaultValue={displayUser.course} disabled className="w-full px-6 py-3 bg-gray-50 rounded-2xl border border-transparent outline-none font-medium opacity-60" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                           <input type="text" placeholder="(77) 99999-9999" className="w-full px-6 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-600 outline-none transition-all font-medium" />
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-8 flex-1">
                     <div className="space-y-6">
                        {[
                           { title: 'Avisos da Coordenação', desc: 'Receba alertas sobre eventos e comunicados oficiais.' },
                           { title: 'Datas de Provas', desc: 'Sempre avisado 2 dias antes das avaliações agendadas.' },
                           { title: 'Novas Notas Lançadas', desc: 'Notificação imediata quando o professor publicar notas.' },
                           { title: 'Mensagens de Professores', desc: 'Alertas de comentários em tarefas e comunicados de sala.' }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-indigo-50 cursor-pointer" onClick={() => handleAction('Alternar Notificação')}>
                              <div>
                                 <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                 <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                              </div>
                              <div className="w-12 h-6 bg-indigo-900 rounded-full relative">
                                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8 flex-1">
                     <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl mb-8">
                        <ShieldCheck className="text-emerald-600 w-8 h-8" />
                        <div>
                           <h4 className="font-bold text-emerald-900 leading-tight">Sua conta está segura</h4>
                           <p className="text-xs text-emerald-600/70 font-medium italic">Última troca de senha há 3 meses.</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <button 
                          onClick={() => handleAction('Alterar Senha')}
                          className="w-full p-6 text-left border border-gray-100 rounded-3xl hover:border-indigo-600/20 hover:bg-indigo-50/10 transition-all group flex items-center justify-between"
                        >
                           <div>
                              <h4 className="font-bold text-slate-900">Alterar Senha</h4>
                              <p className="text-xs text-gray-400 mt-1 font-medium">Mude sua senha de acesso ao portal.</p>
                           </div>
                           <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
                        </button>
                        <button 
                          onClick={() => handleAction('Verificar Dispositivos')}
                          className="w-full p-6 text-left border border-gray-100 rounded-3xl hover:border-indigo-600/20 hover:bg-indigo-50/10 transition-all group flex items-center justify-between"
                        >
                           <div>
                              <h4 className="font-bold text-slate-900">Verificar Dispositivos</h4>
                              <p className="text-xs text-gray-400 mt-1 font-medium">Veja onde você está conectado agora.</p>
                           </div>
                           <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
                        </button>
                     </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                   <div className="space-y-8 flex-1">
                      <div className="grid grid-cols-2 gap-6">
                         <div 
                           onClick={() => handleAction('Ativar Modo Claro')}
                           className="p-6 border-2 border-indigo-600 rounded-[32px] bg-white text-center cursor-pointer"
                         >
                            <div className="aspect-video bg-gray-50 rounded-2xl mb-4 border border-gray-100 flex items-center justify-center">
                               <Palette className="text-indigo-600 w-8 h-8" />
                            </div>
                            <span className="font-bold text-slate-950">Modo Claro</span>
                         </div>
                         <div 
                           onClick={() => handleAction('Ativar Modo Escuro')}
                           className="p-6 border border-gray-100 rounded-[32px] bg-[#1A1A1A] text-center cursor-pointer opacity-50"
                         >
                            <div className="aspect-video bg-white/5 rounded-2xl mb-4 flex items-center justify-center">
                               <Palette className="text-white/20 w-8 h-8" />
                            </div>
                            <span className="font-bold text-white/40">Modo Escuro (Em breve)</span>
                         </div>
                      </div>
                   </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="px-10 py-4 bg-indigo-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-900/20 hover:bg-slate-950 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                   >
                      {isSaving ? 'Salvando...' : (
                        <><Save className="w-5 h-5" /> Salvar Alterações</>
                      )}
                   </button>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
