import { motion } from 'motion/react';
import { Users, Search, Save, BookOpen, Send, Mail, CheckCircle, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { User, COURSES, GRADES } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { sendEmail } from '../services/emailService';

interface TeachersProps {
  allUsers: User[];
  onUpdateUsers: (newUsers: User[]) => void;
  currentUser: User | null;
}

export default function Teachers({ allUsers, onUpdateUsers, currentUser }: TeachersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterGrade, setFilterGrade] = useState('Todos');
  const [selectedSubject, setSelectedSubject] = useState('Português');
  
  const [localGrades, setLocalGrades] = useState<Record<string, { n1: string; n2: string; n3: string }>>({});
  const [localFrequency, setLocalFrequency] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [announcement, setAnnouncement] = useState({ subject: '', message: '' });

  // Use the allUsers prop instead of local dbUsers
  useEffect(() => {
    const grades: Record<string, { n1: string; n2: string; n3: string }> = {};
    const freqs: Record<string, number> = {};
    allUsers.forEach(u => {
      if (u.role === 'student') {
        const studentGrades = u.subjectGrades?.[selectedSubject] || { n1: '', n2: '', n3: '' };
        grades[u.id] = studentGrades;
        freqs[u.id] = u.frequencia || 100;
      }
    });
    setLocalGrades(grades);
    setLocalFrequency(freqs);
  }, [allUsers, selectedSubject]);

  const studentsOnly = allUsers.filter(u => u.role === 'student');

  const filteredStudents = studentsOnly.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'Todos' || s.course === filterCourse;
    const matchesGrade = filterGrade === 'Todos' || s.grade === filterGrade;
    return matchesSearch && matchesCourse && matchesGrade;
  });

  const handleSaveGrades = async () => {
    setLoading(true);
    try {
      let savedCount = 0;
      for (const studentId of Object.keys(localGrades)) {
        const student = allUsers.find(u => u.id === studentId);
        if (student) {
          const updatedSubjectGrades = { ...(student.subjectGrades || {}), [selectedSubject]: localGrades[studentId] };
          const { error } = await supabase
            .from('usuarios')
            .update({ notas: updatedSubjectGrades, frequencia: localFrequency[studentId] })
            .eq('id', studentId);
          if (!error) savedCount++;
        }
      }
      toast.success(`${savedCount} registros atualizados!`);
    } catch (err) {
      toast.error('Erro ao salvar algumas notas.');
    } finally {
      setLoading(false);
    }
  };

  const ALL_SUBJECTS = [
    'Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 'Geografia', 'Inglês', 
    'Banco de Dados', 'Robótica', 'Programação Web', 'Gestão de Pessoas', 'Nutrição Clínica', 'Farmacologia'
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administração Acadêmica</h1>
              </div>
              <p className="text-slate-500 mt-1">Gerenciamento de estudantes, notas e frequências.</p>
           </div>
        </header>

        {/* Dash Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Estudantes</p>
              <h3 className="text-2xl font-bold text-slate-900">{studentsOnly.length}</h3>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Freq. Média</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                 {(studentsOnly.reduce((acc, s) => acc + (s.frequencia || 0), 0) / (studentsOnly.length || 1)).toFixed(1)}%
              </h3>
           </div>
           <div className="bg-blue-600 p-6 rounded-xl shadow-lg shadow-blue-600/10 text-white md:col-span-2">
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Matéria em Foco</p>
              <h3 className="text-2xl font-bold tracking-tight">{selectedSubject}</h3>
           </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Filtrar por nome..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                 />
              </div>
              <select 
                 value={filterCourse}
                 onChange={(e) => setFilterCourse(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none appearance-none"
              >
                 <option value="Todos">Todos os Cursos</option>
                 {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                 value={filterGrade}
                 onChange={(e) => setFilterGrade(e.target.value)}
                 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none appearance-none"
              >
                 <option value="Todos">Todas as Séries</option>
                 {GRADES.filter(g => g !== 'Docente').map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select 
                 value={selectedSubject}
                 onChange={(e) => setSelectedSubject(e.target.value)}
                 className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold text-blue-700 outline-none appearance-none"
              >
                 {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                onClick={handleSaveGrades}
                disabled={loading}
                className="bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                 {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 <span>Salvar Alterações</span>
              </button>
           </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estudante</th>
                       <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Frequência</th>
                       <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Bim 1</th>
                       <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Bim 2</th>
                       <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Bim 3</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Controles</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                           <p className="text-[10px] text-slate-400 mt-1 font-bold">{s.course}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                           <input 
                              type="number"
                              className="w-16 h-9 bg-slate-100 border border-slate-200 rounded text-center text-sm font-bold text-slate-700 outline-none focus:bg-white"
                              value={localFrequency[s.id] || 100}
                              onChange={(e) => setLocalFrequency(prev => ({ ...prev, [s.id]: parseInt(e.target.value) }))}
                           />
                        </td>
                        {['n1', 'n2', 'n3'].map((field) => (
                          <td key={field} className="px-4 py-4 text-center">
                             <input 
                                type="text"
                                className="w-12 h-9 bg-blue-50/50 border border-blue-100 rounded text-center text-sm font-bold text-blue-900 outline-none focus:bg-white"
                                value={localGrades[s.id]?.[field as keyof typeof localGrades[string]] || ''}
                                onChange={(e) => setLocalGrades(prev => ({ 
                                   ...prev, 
                                   [s.id]: { ...prev[s.id], [field]: e.target.value } 
                                 }))}
                             />
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Remover">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Global Announcement */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Mail className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Comunicado Oficial</h3>
              </div>
              <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Assunto da mensagem..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none"
                    value={announcement.subject}
                    onChange={(e) => setAnnouncement({...announcement, subject: e.target.value})}
                 />
                 <textarea 
                    placeholder="Escreva a mensagem importante para todos os alunos..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none resize-none"
                    rows={4}
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                 />
                 <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> 
                    <span>Transmitir para Alunos</span>
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-xl text-white shadow-xl shadow-slate-900/10">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Segurança de Dados</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                 Todas as alterações de notas e frequência são registradas permanentemente no banco de dados corporativo do CETEP. 
                 Relatórios de auditoria podem ser solicitados à coordenação central.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
