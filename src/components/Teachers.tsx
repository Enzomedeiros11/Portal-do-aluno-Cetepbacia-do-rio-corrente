import { motion } from 'motion/react';
import { Users, Search, Plus, Save, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const students = [
    { id: 1, name: 'Enzo Medeiros', curso: 'Técnico em Informática', n1: '8.5', n2: '9.0', n3: '', n4: '' },
    { id: 2, name: 'Ana Oliveira', curso: 'Técnico em Informática', n1: '7.0', n2: '8.5', n3: '', n4: '' },
    { id: 3, name: 'Bruno Santos', curso: 'Técnico em Informática', n1: '9.0', n2: '9.5', n3: '', n4: '' },
    { id: 4, name: 'Clara Lima', curso: 'Técnico em Informática', n1: '6.5', n2: '7.0', n3: '', n4: '' },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-indigo-600 w-10 h-10" />
              <h1 className="text-4xl font-serif font-medium text-slate-900">Painel do Professor</h1>
            </div>
            <p className="text-gray-500">Gestão acadêmica e lançamento de notas da CETEP Bacia do Rio Corrente.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 bg-indigo-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-indigo-900/10">
                <Plus className="w-5 h-5" /> Novo Aluno
             </button>
          </div>
        </header>

        <div className="bg-[#F8F9FA] p-8 rounded-[48px] border border-gray-100 shadow-sm mb-12">
           <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                 <input 
                   type="text" 
                   placeholder="Buscar aluno por nome..." 
                   className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-4">
                 <button className="p-3 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5 text-gray-500" />
                 </button>
                 <select className="px-4 py-3 bg-white rounded-2xl border border-gray-200 outline-none">
                    <option>Técnico em Informática</option>
                    <option>Administração</option>
                    <option>Nutrição</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50">
                       <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Estudante</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-center">1º Bim</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-center">2º Bim</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-center">3º Bim</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-center">4º Bim</th>
                       <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-right whitespace-nowrap">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                         <td className="px-8 py-5">
                            <h4 className="font-bold text-slate-900 leading-none">{s.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 font-bold">{s.curso}</p>
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input type="text" defaultValue={s.n1} className="w-12 h-10 bg-indigo-50 border border-indigo-100 rounded-lg text-center font-bold text-indigo-900 focus:bg-white transition-colors" />
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input type="text" defaultValue={s.n2} className="w-12 h-10 bg-indigo-50 border border-indigo-100 rounded-lg text-center font-bold text-indigo-900 focus:bg-white transition-colors" />
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input type="text" className="w-12 h-10 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold text-slate-400 focus:bg-white transition-colors" />
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input type="text" className="w-12 h-10 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold text-slate-400 focus:bg-white transition-colors" />
                         </td>
                         <td className="px-8 py-5 text-right">
                             <button className="p-2.5 bg-indigo-900 text-white rounded-xl hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                <Save className="w-4 h-4" />
                             </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-indigo-100">
                 <Save className="text-indigo-600 w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-indigo-900 italic">Modo de Edição Ativo</h4>
                 <p className="text-xs text-indigo-600/60 font-medium">As alterações serão salvas diretamente no sistema acadêmico.</p>
              </div>
           </div>
           <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
              Aplicar a Todos
           </button>
        </div>
      </div>
    </div>
  );
}
