import { motion } from 'motion/react';
import { FileText, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../types';
import { downloadBoletimPDF } from '../lib/pdfUtils';

interface GradesProps {
  user: User | null;
}

export default function Grades({ user }: GradesProps) {
  const getSubjectGrade = (subName: string) => {
    const grades = user?.subjectGrades?.[subName];
    if (!grades) return '-';
    
    const vals = [grades.n1, grades.n2, grades.n3].filter(v => v !== '' && !isNaN(Number(v)));
    if (vals.length === 0) return '-';
    
    const sum = vals.reduce((acc, val) => acc + Number(val), 0);
    return (sum / vals.length).toFixed(1);
  };

  const calculateIRA = (currentSubjects: any[]) => {
    const validGrades = currentSubjects.filter(s => s.grade !== '-').map(s => Number(s.grade));
    if (validGrades.length === 0) return '0.0';
    const sum = validGrades.reduce((acc, val) => acc + val, 0);
    return (sum / validGrades.length).toFixed(1);
  };

  const getSubjects = (courseName?: string) => {
    const regular = [
      { name: 'Português', teacher: 'Profa. Regina Duarte' },
      { name: 'Matemática', teacher: 'Profa. Ana Costa' },
      { name: 'Química', teacher: 'Prof. Marcos Silva' },
      { name: 'Física', teacher: 'Prof. André Souza' },
      { name: 'Biologia', teacher: 'Profa. Carla Mendes' },
      { name: 'História', teacher: 'Prof. José Oliveira' },
      { name: 'Geografia', teacher: 'Profa. Sandra Lima' },
      { name: 'Inglês', teacher: 'Profa. Mary Johnson' },
      { name: 'Filosofia', teacher: 'Prof. Gilberto Gil' },
      { name: 'Sociologia', teacher: 'Profa. Maria Bethânia' },
      { name: 'Educação Física', teacher: 'Prof. Vanderlei Cordeiro' },
      { name: 'Artes', teacher: 'Profa. Ivete Sangalo' },
    ].map(s => ({ ...s, grade: getSubjectGrade(s.name) }));

    const technicalSubjects: Record<string, any[]> = {
      'Técnico em Informática': [
        { name: 'Banco de Dados', teacher: 'Prof. Ricardo' },
        { name: 'Robótica', teacher: 'Prof. Ricardo' },
        { name: 'Prática Profissional', teacher: 'Prof. Ricardo' },
        { name: 'Fundamentos e Arquitetura', teacher: 'Prof. Ricardo' },
        { name: 'Programação Web', teacher: 'Prof. Ricardo' },
      ],
      'Administração': [
        { name: 'Gestão de Pessoas', teacher: 'Prof. Roberto Melo' },
        { name: 'Logística', teacher: 'Prof. Roberto Melo' },
        { name: 'Contabilidade', teacher: 'Prof. Roberto Melo' },
        { name: 'Marketing', teacher: 'Prof. Roberto Melo' },
        { name: 'Administração Financeira', teacher: 'Prof. Roberto Melo' },
      ],
      'Enfermagem': [
        { name: 'Anatomia e Fisiologia', teacher: 'Profa. Sandra' },
        { name: 'Fundamentos de Enfermagem', teacher: 'Profa. Sandra' },
        { name: 'Farmacologia Básica', teacher: 'Profa. Sandra' },
        { name: 'Saúde Pública', teacher: 'Profa. Sandra' },
        { name: 'Enfermagem Cirúrgica', teacher: 'Profa. Sandra' },
      ],
      'Meio Ambiente': [
        { name: 'Ecologia', teacher: 'Prof. Eduardo' },
        { name: 'Gestão Ambiental', teacher: 'Prof. Eduardo' },
        { name: 'Educação Ambiental', teacher: 'Prof. Eduardo' },
        { name: 'Poluição e Controle', teacher: 'Prof. Eduardo' },
        { name: 'Microbiologia Ambiental', teacher: 'Prof. Eduardo' },
      ]
    };

    const techMapped = (technicalSubjects[courseName || ''] || []).map(s => ({ ...s, grade: getSubjectGrade(s.name) }));
    if (!courseName || courseName === 'Regular') return regular;
    return [...regular, ...techMapped];
  };

  const subjects = getSubjects(user?.course);
  const ira = calculateIRA(subjects);

  const handleExport = () => {
    if (!user) return;
    try {
      toast.info('Gerando PDF do Boletim...');
      downloadBoletimPDF(user);
      toast.success('Boletim baixado com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao gerar o PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Registro de Notas</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Acompanhamento detalhado do seu rendimento acadêmico no CETEP.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Boletim Escolar</h3>
                <button 
                  onClick={handleExport} 
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Exportar Relatório PDF
                </button>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((sub, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white leading-tight">{sub.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub.teacher}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Média</p>
                        <p className={`text-lg font-bold ${sub.grade === '-' ? 'text-slate-300 dark:text-slate-600' : Number(sub.grade) >= 7 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {sub.grade}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-8 rounded-2xl shadow-lg">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IRA Acumulado</p>
              <h2 className="text-6xl font-bold tracking-tight mb-6">{ira}</h2>
              <div className="w-full bg-white/10 h-2 rounded-full mb-3">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (Number(ira) / 10) * 100)}%` }} 
                />
              </div>
              <p className="text-xs text-slate-400">
                Índice de Rendimento Acadêmico calculado com base nas notas registradas pela coordenação.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs transition-colors">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Critérios de Aprovação</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Média mínima para aprovação: <strong>7.0</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Frequência mínima obrigatória: <strong>75%</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Avaliações por unidade: <strong>N1, N2 e N3</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
