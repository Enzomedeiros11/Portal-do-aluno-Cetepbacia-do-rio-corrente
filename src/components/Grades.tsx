import { motion } from 'motion/react';
import { FileText, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../types';

interface GradesProps {
  user: User | null;
}

export default function Grades({ user }: GradesProps) {
  const handleExport = () => {
    toast.info('Gerando seu Histórico Escolar Profissional...');
    
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR');
    
    let content = `
================================================================================
          CENTRO TERRITORIAL DE EDUCAÇÃO PROFISSIONAL - CETEP
                      HISTÓRICO ESCOLAR UNIFICADO
================================================================================

DADOS DO ESTUDANTE:
--------------------------------------------------------------------------------
NOME: ${user?.name?.toUpperCase()}
CURSO: ${user?.course?.toUpperCase()}
SÉRIE: ${user?.grade?.toUpperCase()}
SITUAÇÃO: MATRICULADO
IRA ACUMULADO: ${ira}
DATA DE EMISSÃO: ${date} às ${time}
--------------------------------------------------------------------------------

RESUMO DE RENDIMENTO POR MATÉRIA:
--------------------------------------------------------------------------------
${'MATÉRIA'.padEnd(30)} | ${'1º BIM'.padEnd(8)} | ${'2º BIM'.padEnd(8)} | ${'3º BIM'.padEnd(8)} | ${'MÉDIA'.padEnd(8)}
--------------------------------------------------------------------------------
`;

    subjects.forEach(sub => {
      const g = user?.subjectGrades?.[sub.name] || { n1: '-', n2: '-', n3: '-' };
      content += `${sub.name.padEnd(30)} | ${g.n1.padEnd(8)} | ${g.n2.padEnd(8)} | ${g.n3.padEnd(8)} | ${sub.grade.padEnd(8)}\n`;
    });

    content += `
--------------------------------------------------------------------------------
ESTE DOCUMENTO É UMA CÓPIA DIGITAL PARA CONSULTA RÁPIDA.
PARA FINS OFICIAIS, SOLICITE O DOCUMENTO ASSINADO NA SECRETARIA.
================================================================================
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Historico_CETEP_${user?.name.replace(/\s+/g, '_')}.txt`;
    
    setTimeout(() => {
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Documento funcional exportado com sucesso!');
    }, 1800);
  };
  
  const getSubjects = (courseName?: string) => {
    const getSubjectGrade = (subName: string) => {
      const grades = user?.subjectGrades?.[subName];
      if (!grades) return '-';
      
      const vals = [grades.n1, grades.n2, grades.n3].filter(v => v !== '' && !isNaN(Number(v)));
      if (vals.length === 0) return '-';
      
      const sum = vals.reduce((acc, val) => acc + Number(val), 0);
      return (sum / vals.length).toFixed(1);
    };

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

  const calculateIRA = () => {
    const validGrades = subjects.filter(s => s.grade !== '-').map(s => Number(s.grade));
    if (validGrades.length === 0) return 0;
    const sum = validGrades.reduce((acc, val) => acc + val, 0);
    return (sum / validGrades.length).toFixed(1);
  };

  const ira = calculateIRA();

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-indigo-600 w-8 h-8" />
            <h1 className="text-4xl font-bold text-[#1A1A1A]">Histórico Escolar</h1>
          </div>
          <p className="text-gray-500">Acompanhamento detalhado do seu rendimento acadêmico na CETEP.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1A1A1A] uppercase text-xs tracking-widest">Matérias</h3>
                <button 
                  onClick={handleExport}
                  className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-900 transition-all active:scale-95 px-3 py-1 bg-indigo-50 rounded-lg"
                >
                  <Download className="w-4 h-4" /> Exportar PDF
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {subjects.length > 0 ? subjects.map((sub, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#1A1A1A]">{sub.name}</h4>
                        <p className="text-sm text-gray-400">{sub.teacher}</p>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Situação</p>
                          <p className={`text-xl font-black ${sub.grade === '-' ? 'text-gray-300' : Number(sub.grade) < 7 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {sub.grade}
                          </p>
                        </div>
                      </div>
                    </div>
                )) : (
                  <div className="p-20 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Nenhuma nota registrada no sistema ainda.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">IRA Acumulado</p>
                <h2 className="text-6xl font-black mb-2 tracking-tighter">{ira}</h2>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-4">
                  <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${(Number(ira) / 10) * 100}%` }} />
                </div>
                <p className="text-[10px] mt-4 font-bold opacity-60 uppercase tracking-widest">
                  {Number(ira) === 0 ? 'AGUARDANDO NOTAS' : 'RENDIMENTO ACADÊMICO'}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            </div>

            <div className="bg-emerald-600 text-white p-8 rounded-[40px] shadow-xl shadow-emerald-600/20 relative overflow-hidden">
               <div className="relative z-10 text-center">
                 <Zap className="w-10 h-10 mx-auto mb-4 opacity-80 text-emerald-200 fill-current" />
                 <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Frequência Global</p>
                 <h2 className="text-6xl font-black mb-2 tracking-tighter">{user?.frequencia || 100}%</h2>
                 <div className="w-full bg-white/20 h-1.5 rounded-full mt-4">
                   <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${user?.frequencia || 100}%` }} />
                 </div>
                 <p className="text-[10px] mt-4 font-bold opacity-60 uppercase tracking-widest">
                   { (user?.frequencia || 100) < 75 ? 'ALERTA DE FREQUÊNCIA BAIXA' : 'PRESENÇA EM DIA' }
                 </p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-orange-500 w-5 h-5" /> Avisos Acadêmicos
                </h4>
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                     <p className="text-sm text-orange-800 font-medium leading-relaxed">
                       Não há novos avisos no momento.
                     </p>
                  </div>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
