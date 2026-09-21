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
      'Nutrição': [
        { name: 'Anatomia', teacher: 'Profa. Luciana' },
        { name: 'Fisiologia', teacher: 'Profa. Luciana' },
        { name: 'Composição de Alimentos', teacher: 'Profa. Luciana' },
        { name: 'Nutrição Clínica', teacher: 'Profa. Luciana' },
        { name: 'Higiene de Alimentos', teacher: 'Profa. Luciana' },
      ],
      'Agropecuária': [
        { name: 'Zootecnia', teacher: 'Prof. Carlos' },
        { name: 'Fitotecnia', teacher: 'Prof. Carlos' },
        { name: 'Máquinas Agrícolas', teacher: 'Prof. Carlos' },
        { name: 'Solos', teacher: 'Prof. Carlos' },
        { name: 'Topografia', teacher: 'Prof. Carlos' },
      ],
      'Enfermagem': [
        { name: 'Fundamentos de Enfermagem', teacher: 'Profa. Sandra' },
        { name: 'Anatomia Humana', teacher: 'Profa. Sandra' },
        { name: 'Farmacologia', teacher: 'Profa. Sandra' },
        { name: 'Saúde Coletiva', teacher: 'Profa. Sandra' },
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm text-white">
                <FileText className="w-6 h-6" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registro de Notas</h1>
          </div>
          <p className="text-slate-500 mt-1">Acompanhamento detalhado do seu rendimento acadêmico.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Boletim de Notas</h3>
                <button onClick={handleExport} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  <Download className="w-4 h-4" /> Exportar Relatório
                </button>
              </div>
              
              <div className="divide-y divide-slate-100">
                {subjects.map((sub, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">{sub.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.teacher}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Média</p>
                         <p className={`text-lg font-bold ${sub.grade === '-' ? 'text-slate-300' : Number(sub.grade) >= 7 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
             <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg shadow-slate-900/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IRA Acumulado</p>
                <h2 className="text-6xl font-bold tracking-tight mb-6">{ira}</h2>
                <div className="w-full bg-white/10 h-1.5 rounded-full mb-2">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(Number(ira) / 10) * 100}%` }} 
                  />
                </div>
                <p className="text-[10px] font-medium text-slate-500">Índice de Rendimento Acadêmico</p>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presença Global</p>
                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{user?.frequencia || 100}%</h2>
                <div className="mt-4 flex gap-1">
                   {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full ${i < (user?.frequencia || 100) / 10 ? 'bg-emerald-500' : 'bg-slate-100'}`}
                      />
                   ))}
                </div>
             </div>

             <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                   <AlertTriangle className="w-4 h-4" /> Informação
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                   As notas finais são computadas ao final de cada bimestre letivo conforme as diretrizes da coordenação.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
