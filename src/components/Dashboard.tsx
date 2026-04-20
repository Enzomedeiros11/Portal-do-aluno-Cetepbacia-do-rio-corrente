import { motion } from 'motion/react';
import { 
  BookOpen, 
  Bell, 
  ChevronRight, 
  Zap, 
  Download,
  Calendar as CalendarIcon,
  Layout
} from 'lucide-react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const displayUser = user || {
    name: 'Estudante',
    course: 'Técnico em Informática',
    grade: '2º Ano'
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Ação: ${action} iniciada com sucesso!`);
  };

  const handleDownload = (doc: string) => {
    if (doc === 'Boletim') {
      toast.info('Gerando seu Boletim Escolar Profissional...');
      
      const date = new Date().toLocaleDateString('pt-BR');
      const time = new Date().toLocaleTimeString('pt-BR');
      
      const getSubjectGrade = (subName: string) => {
        const grades = user?.subjectGrades?.[subName];
        if (!grades) return '-';
        const vals = [grades.n1, grades.n2, grades.n3].filter(v => v !== '' && !isNaN(Number(v)));
        if (vals.length === 0) return '-';
        const sum = vals.reduce((acc, val) => acc + Number(val), 0);
        return (sum / vals.length).toFixed(1);
      };

      const regular = [
        'Português', 'Matemática', 'Química', 'Física', 'Biologia', 
        'História', 'Geografia', 'Inglês', 'Filosofia', 'Sociologia', 
        'Educação Física', 'Artes'
      ];

      const technicalSubjects: Record<string, string[]> = {
        'Técnico em Informática': ['Banco de Dados', 'Robótica', 'Prática Profissional', 'Fundamentos e Arquitetura', 'Programação Web'],
        'Administração': ['Gestão de Pessoas', 'Logística', 'Contabilidade', 'Marketing', 'Administração Financeira'],
        'Nutrição': ['Anatomia', 'Fisiologia', 'Composição de Alimentos', 'Nutrição Clínica', 'Higiene de Alimentos'],
        'Agropecuária': ['Zootecnia', 'Fitotecnia', 'Máquinas Agrícolas', 'Solos', 'Topografia'],
        'Enfermagem': ['Fundamentos de Enfermagem', 'Anatomia Humana', 'Farmacologia', 'Saúde Coletiva', 'Enfermagem Cirúrgica'],
        'Meio Ambiente': ['Ecologia', 'Gestão Ambiental', 'Educação Ambiental', 'Poluição e Controle', 'Microbiologia Ambiental']
      };

      const tech = technicalSubjects[user?.course || ''] || [];
      const allSubjectNames = [...regular, ...tech];
      const subjectsWithGrades = allSubjectNames.map(name => ({
        name,
        grade: getSubjectGrade(name),
        g: user?.subjectGrades?.[name] || { n1: '-', n2: '-', n3: '-' }
      }));

      const validGrades = subjectsWithGrades.filter(s => s.grade !== '-').map(s => Number(s.grade));
      const ira = validGrades.length > 0 ? (validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(1) : '0.0';

      let content = `
================================================================================
          CENTRO TERRITORIAL DE EDUCAÇÃO PROFISSIONAL - CETEP
                      BOLETIM ESCOLAR PROFISSIONAL
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

      subjectsWithGrades.forEach(sub => {
        content += `${sub.name.padEnd(30)} | ${sub.g.n1.padEnd(8)} | ${sub.g.n2.padEnd(8)} | ${sub.g.n3.padEnd(8)} | ${sub.grade.padEnd(8)}\n`;
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
      link.download = `Boletim_${user?.name.replace(/\s+/g, '_')}.txt`;
      
      setTimeout(() => {
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Boletim exportado com sucesso!');
      }, 1500);

      return;
    }

    toast.info(`Baixando seu ${doc}...`);
    
    // Default simulation for other documents
    const content = `CETEP - DOCUMENTO: ${doc.toUpperCase()}\nStatus: Gerado eletronicamente.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.toLowerCase().replace(' ', '_')}.txt`;
    
    setTimeout(() => {
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${doc} baixado!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12 px-6 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Simplified Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Olá, {displayUser.name}! 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">
              {displayUser.course} • {displayUser.grade}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/settings" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm relative group active:scale-95">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </Link>
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Presença</p>
                  <p className="text-sm font-bold text-emerald-600">94.5%</p>
               </div>
               <Link to="/settings" className="h-12 w-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-all text-xs">
                 {displayUser.name.substring(0, 2).toUpperCase()}
               </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Actions Bar - Clean and direct like before */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => handleQuickAction('Novo Trabalho')} className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white rounded-[32px] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Trabalho</span>
              </button>
              <Link to="/extra-courses" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-indigo-50 rounded-[32px] hover:border-indigo-600 transition-all shadow-sm active:scale-95 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cursos</span>
              </Link>
              <Link to="/internships" className="flex flex-col items-center justify-center p-6 bg-indigo-900 text-white rounded-[32px] hover:bg-slate-900 transition-all shadow-lg active:scale-95 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Estágios</span>
              </Link>
              <button onClick={() => handleDownload('Boletim')} className="flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 rounded-[32px] hover:border-indigo-600 transition-all shadow-sm active:scale-95 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Boletim</span>
              </button>
            </div>

            <div className="bg-white p-12 rounded-[60px] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[350px] text-center relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                     <BookOpen className="text-indigo-600 w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Sala de Aula Virtual</h3>
                  <p className="text-gray-500 max-w-sm mb-10 mx-auto">Participe das interações no mural e envie seus trabalhos diretamente pelo portal.</p>
                  <Link to="/classroom" className="inline-flex px-12 py-5 bg-indigo-900 text-white rounded-full font-bold hover:bg-slate-900 transition-all shadow-xl hover:-translate-y-1">
                    Entrar agora
                  </Link>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32 transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Small Notification Summary */}
            <section className="bg-white border border-slate-200 rounded-[32px] p-8">
              <div className="flex items-center gap-2 mb-6">
                 <Bell className="w-4 h-4 text-indigo-600" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notificações</h4>
              </div>
              <div className="space-y-4">
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tudo em dia!</p>
                </div>
              </div>
              <Link to="/journal" className="w-full mt-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                Ver Jornal Escolar <ChevronRight className="w-4 h-4" />
              </Link>
            </section>

            {/* Compact Calendar */}
            <section className="bg-slate-900 rounded-[32px] p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Abril 2024</span>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-white/20 mb-4 tracking-widest">
                 <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                 {[...Array(30)].map((_, idx) => {
                   const d = idx + 1;
                   const isToday = d === 17;
                   const hasEvent = [12, 18, 25].includes(d);
                   return (
                     <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                       isToday ? 'bg-white text-indigo-900 shadow-xl' : 
                       hasEvent ? 'text-indigo-400' : 'text-white/20'
                     }`}>
                       {d}
                     </div>
                   );
                 })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
