import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Plus, Save, Filter, Trash2, CheckCircle, BookOpen, Send, Mail } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterGrade, setFilterGrade] = useState('Todos');
  const [selectedSubject, setSelectedSubject] = useState('Português');
  
  const [localGrades, setLocalGrades] = useState<Record<string, { n1: string; n2: string; n3: string }>>({});
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [announcement, setAnnouncement] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const mapped: User[] = data.map(d => {
        let resolvedRole: 'student' | 'teacher' = 'student';
        if (d.tipo === 'teacher' || d.email === 'codernador12@gmail.com' || d.email === 'enzomedeirosdasilva6@gmail.com') {
          resolvedRole = 'teacher';
        }

        return {
          id: d.id,
          name: d.nome || d.email.split('@')[0],
          email: d.email,
          role: resolvedRole,
          grade: d.grade || 'Não informada',
          course: d.curso || 'Não informado',
          subjectGrades: d.notas || {},
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.id}`
        };
      });
      setDbUsers(mapped);
      onUpdateUsers(mapped);
    }
  };

  const handleSendAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!announcement.subject || !announcement.message) {
      toast.error('Preencha o assunto e a mensagem.');
      return;
    }

    setSendingEmail(true);
    const students = dbUsers.filter(u => u.role === 'student');
    
    try {
      toast.info(`Enviando comunicado para ${students.length} alunos...`);
      
      // We'll send emails in chunks or simulated
      let sentCount = 0;
      for (const student of students) {
        await sendEmail({
          to_name: student.name,
          to_email: student.email,
          subject: announcement.subject,
          message: announcement.message,
          type: 'announcement'
        });
        sentCount++;
      }

      toast.success(`${sentCount} e-mails enviados com sucesso!`);
      setAnnouncement({ subject: '', message: '' });
    } catch (error) {
      toast.error('Erro ao enviar alguns e-mails.');
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    // Sync local grades with the current subject when subject or users change
    const grades: Record<string, { n1: string; n2: string; n3: string }> = {};
    dbUsers.forEach(u => {
      if (u.role === 'student') {
        const studentGrades = u.subjectGrades?.[selectedSubject] || { n1: '', n2: '', n3: '' };
        grades[u.id] = studentGrades;
      }
    });
    setLocalGrades(grades);
  }, [dbUsers, selectedSubject]);

  const studentsOnly = dbUsers.filter(u => u.role === 'student');

  const filteredStudents = studentsOnly.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'Todos' || s.course === filterCourse;
    const matchesGrade = filterGrade === 'Todos' || s.grade === filterGrade;
    return matchesSearch && matchesCourse && matchesGrade;
  });

  const [newStudent, setNewStudent] = useState({ name: '', email: '', curso: 'Técnico em Informática', grade: '1º Ano' });

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (newStudent.name && newStudent.email) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          id: Math.random().toString(36).substring(2),
          nome: newStudent.name,
          email: newStudent.email,
          tipo: 'student',
          curso: newStudent.curso,
          grade: newStudent.grade,
          notas: {}
        }]);

      if (error) {
        toast.error('Erro ao adicionar aluno');
      } else {
        toast.success(`Estudante ${newStudent.name} adicionado com sucesso!`);
        fetchUsers();
        setNewStudent({ name: '', email: '', curso: 'Técnico em Informática', grade: '1º Ano' });
        setIsModalOpen(false);
      }
    } else {
      toast.error('Por favor, preencha nome e e-mail.');
    }
  };

  const handleRemoveStudent = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover ${name}?`)) {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);
      if (error) {
        toast.error('Erro ao remover aluno');
      } else {
        toast.success(`${name} removido.`);
        fetchUsers();
      }
    }
  };

  const handleGradeChange = (studentId: string, field: 'n1' | 'n2' | 'n3', value: string) => {
    setLocalGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    setLoading(true);
    let updatedCount = 0;
    try {
      for (const studentId of Object.keys(localGrades)) {
        const student = dbUsers.find(u => u.id === studentId);
        if (student) {
          const updatedSubjectGrades = {
            ...(student.subjectGrades || {}),
            [selectedSubject]: localGrades[studentId]
          };

          const { error } = await supabase
            .from('usuarios')
            .update({ notas: updatedSubjectGrades })
            .eq('id', studentId);

          if (!error) {
            updatedCount++;
            // Notify student via Gmail
            await sendEmail({
              to_name: student.name,
              to_email: student.email,
              subject: `Novas notas em ${selectedSubject}`,
              message: `Olá ${student.name},\r\n\r\nSuas notas na matéria de ${selectedSubject} foram atualizadas.\r\n1º Bimestre: ${localGrades[studentId]?.n1 || '-'}\r\n2º Bimestre: ${localGrades[studentId]?.n2 || '-'}\r\n3º Bimestre: ${localGrades[studentId]?.n3 || '-'}\r\n\r\nAcesse o portal para conferir.\r\n\r\nAtenciosamente,\r\nCoordenação CETEP`,
              type: 'grade_update'
            });
          }
        }
      }
      
      toast.success(`${updatedCount} notas de ${selectedSubject} salvas e alunos notificados!`);
      fetchUsers();
    } catch (err) {
      toast.error('Erro ao salvar algumas notas ou enviar notificações.');
    } finally {
      setLoading(false);
    }
  };

  const ALL_SUBJECTS = [
    'Português', 'Matemática', 'Química', 'Física', 'Biologia', 
    'História', 'Geografia', 'Inglês', 'Filosofia', 'Sociologia', 
    'Educação Física', 'Artes', 'Banco de Dados', 'Robótica', 
    'Prática Profissional', 'Fundamentos e Arquitetura', 'Programação Web',
    'Gestão de Pessoas', 'Logística', 'Contabilidade', 'Marketing', 
    'Administração Financeira', 'Anatomia', 'Fisiologia', 
    'Composição de Alimentos', 'Nutrição Clínica', 'Higiene de Alimentos',
    'Zootecnia', 'Fitotecnia', 'Máquinas Agrícolas', 'Solos', 'Topografia',
    'Fundamentos de Enfermagem', 'Farmacologia', 'Saúde Coletiva', 
    'Enfermagem Cirúrgica', 'Ecologia', 'Gestão Ambiental', 
    'Educação Ambiental', 'Poluição e Controle', 'Microbiologia Ambiental'
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-600 w-10 h-10" />
            <h1 className="text-4xl font-black text-slate-900 font-display tracking-tighter">Gestão de Alunos</h1>
          </div>
          <p className="text-slate-500 font-medium">Controle de notas e turmas de forma centralizada.</p>
        </header>

        <div className="bg-white p-8 rounded-[48px] border border-slate-200 mb-8 shadow-sm transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-4 relative">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-1">Pesquisar</label>
                  <Search className="absolute left-4 bottom-4 translate-y-0 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Nome do aluno..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Matéria Atual</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 underline" />
                      <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-xs font-bold shadow-sm appearance-none focus:ring-2 focus:ring-indigo-600"
                      >
                        {ALL_SUBJECTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Série</label>
                    <select 
                      value={filterGrade}
                      onChange={(e) => setFilterGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="Todos">Todas as Séries</option>
                      {GRADES.filter(g => g !== 'Docente').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Curso</label>
                    <select 
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="Todos">Todos os Cursos</option>
                      {COURSES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterCourse('Todos');
                        setFilterGrade('Todos');
                      }}
                      className="w-full py-3 bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
                    >
                      Limpar Filtros
                    </button>
                  </div>
              </div>
            </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden mb-12 transition-colors">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50">
                       <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-200">Estudante</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-center border-b border-slate-200">1º Bim</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-center border-b border-slate-200">2º Bim</th>
                       <th className="px-4 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-center border-b border-slate-200">3º Bim</th>
                       <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-right whitespace-nowrap border-b border-slate-200">Ação</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-8 py-5">
                            <h4 className="font-bold text-slate-900 leading-none">{s.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold">{s.course} • {s.grade}</p>
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input 
                              type="text" 
                              value={localGrades[s.id]?.n1 || ''} 
                              onChange={(e) => handleGradeChange(s.id, 'n1', e.target.value)}
                              className="w-12 h-10 bg-indigo-50 border border-indigo-100 rounded-lg text-center font-bold text-indigo-900 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-indigo-600" 
                            />
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input 
                              type="text" 
                              value={localGrades[s.id]?.n2 || ''} 
                              onChange={(e) => handleGradeChange(s.id, 'n2', e.target.value)}
                              className="w-12 h-10 bg-indigo-50 border border-indigo-100 rounded-lg text-center font-bold text-indigo-900 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-indigo-600" 
                            />
                         </td>
                         <td className="px-4 py-5 text-center">
                            <input 
                              type="text" 
                              value={localGrades[s.id]?.n3 || ''} 
                              onChange={(e) => handleGradeChange(s.id, 'n3', e.target.value)}
                              className="w-12 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-400 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-indigo-600" 
                            />
                         </td>
                         <td className="px-8 py-5 text-right whitespace-nowrap">
                            <button 
                              onClick={() => handleRemoveStudent(s.id, s.name)}
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm"
                              title="Remover aluno"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center gap-4">
                              <Users className="w-12 h-12 text-slate-200" />
                              <p className="text-slate-400 font-medium italic">Nenhum estudante encontrado com os filtros selecionados.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Save Grades Card */}
          <div className="bg-indigo-900 p-10 rounded-[48px] shadow-2xl shadow-indigo-900/20 flex flex-col justify-between gap-8 relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-6">
                 <div className="w-18 h-18 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-sm">
                    <CheckCircle className="text-white w-10 h-10" />
                 </div>
                 <div>
                    <h4 className="font-black text-white text-3xl tracking-tighter">Salvar Grade</h4>
                    <p className="text-sm text-indigo-100/70 font-medium italic">Vincular notas ao bimestre atual.</p>
                 </div>
              </div>
              <div className="relative z-10">
                 <button 
                   onClick={handleSaveGrades}
                   disabled={loading}
                   className="w-full py-6 bg-white text-indigo-900 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                 >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Salvar Notas de {selectedSubject}
                      </>
                    )}
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          </div>

          {/* Announcement Card (Email Integration) */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm transition-colors relative overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Aviso Geral</h4>
             </div>

             <form onSubmit={handleSendAnnouncement} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Assunto do comunicado"
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  value={announcement.subject}
                  onChange={(e) => setAnnouncement({...announcement, subject: e.target.value})}
                />
                <textarea 
                  placeholder="Descreva o comunicado importante para todos os alunos..."
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium resize-none"
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                />
                <button 
                  type="submit"
                  disabled={sendingEmail}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enviar para todos os Alunos
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[48px] w-full max-w-2xl p-12 shadow-2xl overflow-hidden relative border border-slate-200"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600" />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <Trash2 className="w-6 h-6" />
              </button>
              <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter font-display">Novo Registro</h3>
              
              <form onSubmit={handleAddStudent} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                      <input 
                        type="text" 
                        placeholder="Ex: João da Silva"
                        className="w-full px-8 py-5 bg-slate-50 rounded-3xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Acadêmico</label>
                       <input 
                        type="email" 
                        placeholder="Ex: joao@cetep.com"
                        className="w-full px-8 py-5 bg-slate-50 rounded-3xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      />
                    </div>
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Modalidade / Curso</label>
                    <select 
                      className="w-full px-8 py-5 bg-slate-50 rounded-3xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-black text-xs uppercase tracking-tight"
                      value={newStudent.curso}
                      onChange={(e) => setNewStudent({...newStudent, curso: e.target.value})}
                    >
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Série / Período</label>
                    <select 
                      className="w-full px-8 py-5 bg-slate-50 rounded-3xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-black text-xs uppercase tracking-tight"
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    >
                      {GRADES.filter(g => g !== 'Docente').map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-10 py-6 bg-slate-100 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-10 py-6 bg-indigo-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-2xl shadow-indigo-900/40 transition-all"
                  >
                    Confirmar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
