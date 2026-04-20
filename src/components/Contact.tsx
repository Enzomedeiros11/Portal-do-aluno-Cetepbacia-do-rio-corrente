import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 text-sm font-bold mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Suporte Acadêmico</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-8">
              Estamos aqui para <span className="italic text-indigo-600">ajudar</span> você.
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed">
              Dúvidas sobre o portal, acesso ou questões pedagógicas? Nossa equipe da CETEP está pronta para atender.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'E-mail', value: 'contato@cetep-brc.edu.br' },
                { icon: Phone, label: 'Telefone', value: '(77) 3481-0000' },
                { icon: MapPin, label: 'Localização', value: 'Bacia do Rio Corrente, Bahia' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 bg-white shadow-md rounded-2xl flex items-center justify-center text-indigo-600">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-medium text-[#1A1A1A]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-50/30 p-10 lg:p-16 rounded-[60px] border border-indigo-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                  <input className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm outline-none" placeholder="Ex: João Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Assunto</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm appearance-none outline-none">
                    <option>Problema com Notas</option>
                    <option>Acesso ao Portal</option>
                    <option>Sugestões</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sua Mensagem</label>
                <textarea rows={6} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm resize-none outline-none" placeholder="Como podemos ajudar?" />
              </div>
              <button className="w-full py-5 bg-indigo-900 text-white rounded-full font-bold shadow-xl shadow-indigo-900/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95">
                Enviar Mensagem <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
