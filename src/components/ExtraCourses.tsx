import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookMarked, ExternalLink, GraduationCap, Star, Clock, Globe, Award, CheckCircle2, Play, Download, HelpCircle } from 'lucide-react';
import ExcelCoursePlayer from './ExcelCoursePlayer';
import LogicCoursePlayer from './LogicCoursePlayer';
import { getCompletedLessonIds, TOTAL_EXCEL_LESSONS } from '../data/excelCourseData';
import { getCompletedLogicLessonIds, TOTAL_LOGIC_LESSONS } from '../data/logicCourseData';
import { downloadCertificatePDF } from '../lib/pdfUtils';

export default function ExtraCourses() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [excelCompletedCount, setExcelCompletedCount] = useState<number>(0);
  const [logicCompletedCount, setLogicCompletedCount] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>('Aluno(a)');

  useEffect(() => {
    setExcelCompletedCount(getCompletedLessonIds().length);
    setLogicCompletedCount(getCompletedLogicLessonIds().length);
    try {
      const savedUser = localStorage.getItem('cetep_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name) setStudentName(parsed.name);
      }
    } catch {}
  }, [activeCourse]);

  // If the user selected the Excel course, show the Excel course player
  if (activeCourse === 'excel') {
    return (
      <ExcelCoursePlayer
        onBack={() => {
          setActiveCourse(null);
          setExcelCompletedCount(getCompletedLessonIds().length);
        }}
        studentName={studentName}
      />
    );
  }

  // If the user selected the Lógica de Programação course, show the Logic course player
  if (activeCourse === 'logica') {
    return (
      <LogicCoursePlayer
        onBack={() => {
          setActiveCourse(null);
          setLogicCompletedCount(getCompletedLogicLessonIds().length);
        }}
        studentName={studentName}
      />
    );
  }

  const excelProgressPct = Math.round((excelCompletedCount / TOTAL_EXCEL_LESSONS) * 100);
  const logicProgressPct = Math.round((logicCompletedCount / TOTAL_LOGIC_LESSONS) * 100);

  const myCourses = [
    {
      id: 'excel',
      title: 'Excel do Zero ao Avançado',
      desc: 'Curso completo com Introdução + 20 aulas estruturadas: 1º Vídeo aula (Créditos: Prime Cursos do Brasil), 2º Aula teórica com fórmulas e atalhos, e 3º Questionário com 10 questões por aula.',
      duration: '20 Aulas (50h)',
      rating: '5.0',
      difficulty: 'Do Zero ao Avançado',
      completedCount: excelCompletedCount,
      totalCount: TOTAL_EXCEL_LESSONS,
      progressPct: excelProgressPct,
      hours: 50
    },
    {
      id: 'logica',
      title: 'Lógica de Programação',
      desc: 'O primeiro passo para o mundo do desenvolvimento. Aprenda raciocínio lógico, variáveis, estruturas condicionais, laços de repetição, vetores e teste de mesa com simulador de código interativo.',
      duration: '6 Aulas (30h)',
      rating: '5.0',
      difficulty: 'Iniciante ao Avançado',
      completedCount: logicCompletedCount,
      totalCount: TOTAL_LOGIC_LESSONS,
      progressPct: logicProgressPct,
      hours: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-12 px-6 transition-colors duration-200">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="text-indigo-600 dark:text-indigo-400 w-10 h-10" />
            <h1 className="text-4xl font-serif font-medium text-slate-900 dark:text-white">Cursos & Capacitação</h1>
          </div>
          <p className="text-gray-500 dark:text-slate-400">Aprimore seus conhecimentos com cursos gratuitos, certificados oficiais e plataformas recomendadas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-serif font-medium text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-400 pl-4">Cursos Gratuitos Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCourses.map((course) => {
                const isExcel = course.id === 'excel';
                const hasProgress = course.completedCount > 0;

                return (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col group overflow-hidden relative transition-colors"
                  >
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 text-amber-400 fill-current" />
                          ))}
                          <span className="text-[10px] font-bold text-gray-400 ml-1">{course.rating}</span>
                        </div>

                        {hasProgress && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {course.progressPct}% Concluído
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-serif font-medium text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
                        {course.desc}
                      </p>

                      {/* Progress bar */}
                      <div className="mb-6 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                            <Award className="w-3.5 h-3.5" /> Progresso Oficial
                          </span>
                          <span>{course.completedCount} / {course.totalCount} aulas</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${course.progressPct}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-auto border-t border-gray-50 dark:border-slate-800 pt-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-xs font-bold">{course.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={() => {
                          setActiveCourse(course.id);
                        }}
                        className={`flex-1 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isExcel
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {course.completedCount > 0
                          ? `Continuar ${isExcel ? 'Excel' : 'Lógica'}`
                          : `Iniciar Curso de ${isExcel ? 'Excel' : 'Lógica'}`}
                      </button>

                      <button
                        onClick={() => downloadCertificatePDF(studentName, course.title, course.hours)}
                        className="py-3.5 px-4 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        title="Baixar Certificado Oficial de Conclusão em PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span>Certificado</span>
                      </button>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#1A1A1A] dark:bg-slate-900 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden border border-transparent dark:border-slate-800">
              <div className="relative z-10">
                <Globe className="text-indigo-400 w-10 h-10 mb-6" />
                <h3 className="text-2xl font-serif mb-4 italic leading-tight">Plataforma Externa Recomendada</h3>
                <p className="text-white/60 mb-8 text-sm leading-relaxed">
                  Acesse a plataforma oficial do MEC para mais centenas de cursos certificados gratuitamente.
                </p>
                <a 
                  href="https://aprendamais.mec.gov.br/login/index.php" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
                >
                  Visitar MEC <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm text-center transition-colors">
              <p className="text-gray-400 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Suporte Acadêmico</p>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Dúvidas sobre os Cursos?</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Entre em contato com a coordenação ou envie uma mensagem direta pela Central de Ajuda.</p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-2xl text-indigo-900 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Central de Ajuda & Dúvidas</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
