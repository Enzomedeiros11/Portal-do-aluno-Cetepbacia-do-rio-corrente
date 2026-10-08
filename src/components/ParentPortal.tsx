import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Download, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  HeartHandshake, 
  Phone, 
  Mail, 
  FileText
} from 'lucide-react';
import { User } from '../types';
import { downloadBoletimPDF } from '../lib/pdfUtils';
import { findStudentsForParent } from '../services/authorizedService';
import DailyClassesBoard from './DailyClassesBoard';
import { toast } from 'sonner';

interface ParentPortalProps {
  currentUser: User | null;
  allUsers: User[];
}

export default function ParentPortal({ currentUser, allUsers }: ParentPortalProps) {
  // Find linked children (by parent email or shared child matricula)
  const linkedChildren = useMemo(() => {
    if (!currentUser) return [];
    return findStudentsForParent(
      currentUser.email, 
      allUsers, 
      currentUser.matricula || currentUser.childStudentId,
      currentUser.nomeResponsavel || currentUser.name,
      currentUser.course,
      currentUser.grade
    );
  }, [currentUser, allUsers]);

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const activeChild = linkedChildren[selectedChildIndex] || linkedChildren[0] || null;

  const handleDownloadBoletim = () => {
    if (!activeChild) {
      toast.error('Nenhum aluno selecionado.');
      return;
    }
    try {
      toast.info(`Gerando boletim oficial de ${activeChild.name}...`);
      downloadBoletimPDF(activeChild);
      toast.success('Boletim baixado com sucesso!');
    } catch {
      toast.error('Erro ao gerar o PDF do boletim.');
    }
  };

  const calculateAverage = (grades?: { n1?: string; n2?: string; n3?: string }) => {
    if (!grades) return '-';
    const n1 = parseFloat(grades.n1 || '0');
    const n2 = parseFloat(grades.n2 || '0');
    const n3 = parseFloat(grades.n3 || '0');
    let count = 0;
    let sum = 0;
    if (grades.n1) { sum += n1; count++; }
    if (grades.n2) { sum += n2; count++; }
    if (grades.n3) { sum += n3; count++; }
    if (count === 0) return '-';
    return (sum / count).toFixed(1);
  };

  const subjects = [
    'Português', 'Matemática', 'Química', 'Física', 'Biologia', 
    'História', 'Geografia', 'Inglês', 'Informática Básica', 'Programação Web'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-16 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Institutional Header */}
        <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold mb-4 border border-white/10">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
              <span>Portal da Família • Acompanhamento Escolar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Olá, {currentUser?.nomeResponsavel || currentUser?.name || 'Responsável Legal'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Bem-vindo ao espaço dedicado aos pais e responsáveis. Aqui você acompanha em tempo real as notas, a frequência, as aulas de hoje e os avisos pedagógicos do seu filho(a) no CETEP.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </header>

        {/* Children Selector if more than 1 child */}
        {linkedChildren.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Seus Filhos:</span>
            {linkedChildren.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedChildIndex === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{child.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        {activeChild ? (
          <>
            {/* Student Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src={activeChild.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeChild.name)}`} 
                    alt={activeChild.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Aluno Regularmente Matriculado
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Matrícula: {activeChild.matricula || '2026001'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeChild.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {activeChild.grade || '1º Ano'} • {activeChild.course || 'Técnico em Informática'} • Turno Diurno
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleDownloadBoletim}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Boletim em PDF</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frequência Escolar</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{activeChild.frequencia || 96}%</h3>
                  <span className="text-xs text-emerald-600 font-bold">Excelente</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Mínimo exigido por lei: 75% para aprovação.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Situação Geral</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Aprovado por Média</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Todas as notas parciais estão dentro da média esperada.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ocorrências Pedagógicas</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">Nenhuma Pendência</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Comportamento e dedicação exemplares em sala.</p>
              </div>
            </div>

            {/* Live Board: O que os professores vão dar de aula hoje */}
            <DailyClassesBoard 
              currentUser={currentUser} 
              filterForCourse={activeChild.course} 
              filterForGrade={activeChild.grade}
            />

            {/* Complete Report Card / Grades Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Boletim Escolar Oficial ({activeChild.name})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Notas lançadas pelos professores no sistema acadêmico do CETEP.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBoletim}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Salvar Boletim (PDF)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Componente Curricular</th>
                      <th className="pb-3 text-center">1º Bimestre</th>
                      <th className="pb-3 text-center">2º Bimestre</th>
                      <th className="pb-3 text-center">3º Bimestre</th>
                      <th className="pb-3 text-center">Média Parcial</th>
                      <th className="pb-3 text-center">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {subjects.map((subj) => {
                      const grades = activeChild.subjectGrades?.[subj];
                      const n1 = grades?.n1 || '-';
                      const n2 = grades?.n2 || '-';
                      const n3 = grades?.n3 || '-';
                      const avg = calculateAverage(grades);
                      const isPassing = avg !== '-' && parseFloat(avg) >= 6.0;

                      return (
                        <tr key={subj} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 font-bold text-slate-800 dark:text-white">
                            {subj}
                          </td>
                          <td className="py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                            {n1}
                          </td>
                          <td className="py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                            {n2}
                          </td>
                          <td className="py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                            {n3}
                          </td>
                          <td className="py-3.5 text-center font-bold text-blue-600 dark:text-blue-400">
                            {avg}
                          </td>
                          <td className="py-3.5 text-center">
                            {avg === '-' ? (
                              <span className="text-[10px] text-slate-400 font-medium">Em andamento</span>
                            ) : isPassing ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                Acima da Média
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                Recuperação
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* School Contact Card for Parents */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>Precisa falar com a Direção ou Professores?</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  A coordenação pedagógica do CETEP está à disposição dos pais de segunda a sexta, das 07h às 17h.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="mailto:enzomedeirosdasilva6@gmail.com"
                  className="px-5 py-3 bg-white text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Enviar E-mail para Coordenação</span>
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nenhum aluno vinculado a este Gmail ainda</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
              Seu Gmail ({currentUser?.email}) foi autenticado com sucesso. Solicite à secretaria escolar ou ao professor que cadastre o seu Gmail no campo "Responsável" da matrícula do seu filho.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
