import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  allExcelLessons,
  ExcelLesson,
  getCompletedLessonIds,
  getCompletedTheoryIds,
  markTheoryAsCompleted,
  isLessonUnlocked,
  isLessonFullyCompleted,
  getAllQuizScores,
  saveQuizScore,
  QuizScoreRecord,
  TOTAL_EXCEL_LESSONS,
  PRIME_CURSOS_PLAYLIST_URL,
  PRIME_CURSOS_CHANNEL_NAME,
  excelIntroData
} from '../data/excelCourseData';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Keyboard,
  Lightbulb,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  ShieldCheck,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadCertificatePDF } from '../lib/pdfUtils';

interface ExcelCoursePlayerProps {
  onBack: () => void;
  studentName?: string;
}

export default function ExcelCoursePlayer({ onBack, studentName = 'Aluno(a)' }: ExcelCoursePlayerProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'theory' | 'quiz'>('video');
  const [completedTheoryIds, setCompletedTheoryIds] = useState<number[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [quizScores, setQuizScores] = useState<Record<number, QuizScoreRecord>>({});

  // Quiz state for current lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Sync saved progress from LocalStorage
  useEffect(() => {
    setCompletedTheoryIds(getCompletedTheoryIds());
    setCompletedLessonIds(getCompletedLessonIds());
    setQuizScores(getAllQuizScores());
  }, []);

  const currentLesson: ExcelLesson = useMemo(() => {
    return allExcelLessons.find(l => l.id === selectedLessonId) || allExcelLessons[0];
  }, [selectedLessonId]);

  // Reset quiz state when switching lesson
  useEffect(() => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setActiveTab('video');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedLessonId]);

  const isCurrentTheoryDone = completedTheoryIds.includes(currentLesson.id);
  const currentScoreRecord = quizScores[currentLesson.id];
  const isCurrentQuizPassed = currentScoreRecord?.passed === true;
  const isCurrentLessonComplete = isCurrentTheoryDone && isCurrentQuizPassed;

  const nextLessonId = selectedLessonId + 1;
  const isNextUnlocked = nextLessonId <= TOTAL_EXCEL_LESSONS && isLessonUnlocked(nextLessonId, completedTheoryIds, quizScores);

  const totalCompleted = completedLessonIds.length;
  const progressPercentage = Math.round((totalCompleted / TOTAL_EXCEL_LESSONS) * 100);

  const handleDownloadCertificate = () => {
    downloadCertificatePDF(studentName, 'Excel do Zero ao Avançado', 50);
  };

  // Mark theory as completed
  const handleCompleteTheory = () => {
    const updated = markTheoryAsCompleted(currentLesson.id);
    setCompletedTheoryIds(updated);
    const updatedCompletedLessons = getCompletedLessonIds();
    setCompletedLessonIds(updatedCompletedLessons);

    if (isCurrentQuizPassed) {
      toast.success(`Aula Teórica concluída e Questionário aprovado! A Aula ${currentLesson.lessonNumber + 1} foi desbloqueada!`);
    } else {
      toast.success('Aula Teórica concluída com sucesso! Agora responda ao questionário de 10 questões para desbloquear a próxima aula.');
      setActiveTab('quiz');
    }
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    const unansweredCount = currentLesson.quiz.filter(q => selectedAnswers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      toast.warning(`Você ainda tem ${unansweredCount} questão(ões) sem resposta. Responda todas as 10 questões para avaliar!`);
      return;
    }

    let correctCount = 0;
    currentLesson.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const record = saveQuizScore(currentLesson.id, correctCount, currentLesson.quiz.length);
    setQuizScores(prev => ({ ...prev, [currentLesson.id]: record }));
    setIsQuizSubmitted(true);

    const updatedCompletedLessons = getCompletedLessonIds();
    setCompletedLessonIds(updatedCompletedLessons);

    if (record.passed) {
      if (isCurrentTheoryDone) {
        toast.success(`Parabéns! Você acertou ${correctCount}/10 e concluiu a Aula Teórica! A Aula ${currentLesson.lessonNumber + 1} está liberada!`);
      } else {
        toast.info(`Nota ${correctCount}/10 aprovada! Para liberar a próxima aula, lembre-se de ir à aba "2. Aula Teórica" e marcá-la como concluída.`);
      }
    } else {
      toast.error(`Você acertou ${correctCount} de 10. A média mínima de aprovação é 7 (70%). Revise o material e refaça o questionário!`);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handleLessonClick = (lessonNumber: number, lessonId: number) => {
    const unlocked = isLessonUnlocked(lessonNumber, completedTheoryIds, quizScores);
    if (!unlocked) {
      toast.error(`Aula ${lessonNumber} Bloqueada! Para desbloquear, complete a Aula Teórica e o Questionário da Aula ${lessonNumber - 1}.`);
      return;
    }
    setIsIntroActive(false);
    setSelectedLessonId(lessonId);
  };

  const handleNextLesson = () => {
    if (selectedLessonId < TOTAL_EXCEL_LESSONS) {
      if (!isNextUnlocked) {
        toast.warning(`A Aula ${nextLessonId} ainda está bloqueada. Conclua a Aula Teórica e obtenha nota mínima 7 no Questionário da Aula ${selectedLessonId}.`);
        return;
      }
      setSelectedLessonId(prev => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (selectedLessonId > 1) {
      setSelectedLessonId(prev => prev - 1);
    }
  };

  // Group lessons by module for sidebar
  const modules = useMemo(() => {
    const map = new Map<string, ExcelLesson[]>();
    allExcelLessons.forEach(lesson => {
      if (!map.has(lesson.module)) {
        map.set(lesson.module, []);
      }
      map.get(lesson.module)!.push(lesson);
    });
    return Array.from(map.entries()).map(([moduleName, lessons]) => ({
      name: moduleName,
      lessons
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Voltar aos Cursos"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Excel do Zero ao Avançado</h1>
                <p className="text-xs text-slate-500 font-medium">20 Aulas com Vídeo, Teoria e Questionários de 10 Questões</p>
              </div>
            </div>
          </div>

          {/* Credits & Progress Tracker */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href={PRIME_CURSOS_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Abrir playlist oficial no YouTube do Prime Cursos do Brasil"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Créditos: {PRIME_CURSOS_CHANNEL_NAME}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="hidden md:block text-right">
              <div className="text-xs font-bold text-slate-700">
                {totalCompleted} de {TOTAL_EXCEL_LESSONS} aulas liberadas & concluídas
              </div>
              <div className="w-36 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>{progressPercentage}%</span>
            </div>

            <button
              onClick={handleDownloadCertificate}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Baixar Certificado Oficial de Conclusão em PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Emitir Certificado</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Course Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: Course Syllabus (16 Lessons) */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" /> Grade Curricular
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">Liberação sequencial por aula</p>
                </div>
                <span className="text-[11px] font-bold text-slate-400">20 Aulas</span>
              </div>

              {/* Aula Inaugural / Vídeo de Introdução */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsIntroActive(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 text-xs cursor-pointer ${
                    isIntroActive
                      ? 'bg-emerald-600 text-white shadow-md font-semibold ring-2 ring-emerald-500/20'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-800 border border-emerald-200/80'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isIntroActive ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white shadow-xs'}`}>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isIntroActive ? 'text-emerald-200' : 'text-emerald-700'}`}>
                        Aula Inaugural
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isIntroActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        {excelIntroData.duration}
                      </span>
                    </div>
                    <p className={`truncate text-xs mt-0.5 ${isIntroActive ? 'text-white font-bold' : 'text-slate-800 font-bold'}`}>
                      {excelIntroData.title}
                    </p>
                    <p className={`text-[11px] truncate ${isIntroActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      O que é o Excel e Fundamentos
                    </p>
                  </div>
                </button>
              </div>

              <div className="space-y-5">
                {modules.map((mod, modIdx) => (
                  <div key={modIdx} className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">
                      {mod.name}
                    </h3>
                    <div className="space-y-1">
                      {mod.lessons.map(lesson => {
                        const isSelected = lesson.id === selectedLessonId;
                        const isUnlocked = isLessonUnlocked(lesson.lessonNumber, completedTheoryIds, quizScores);
                        const isTheoryDone = completedTheoryIds.includes(lesson.id);
                        const scoreRec = quizScores[lesson.id];
                        const isQuizDone = scoreRec?.passed === true;
                        const isCompleted = isTheoryDone && isQuizDone;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson.lessonNumber, lesson.id)}
                            className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                                : !isUnlocked
                                ? 'bg-slate-50/80 text-slate-400 border border-dashed border-slate-200 hover:bg-slate-100/70'
                                : isCompleted
                                ? 'bg-emerald-50/60 text-slate-700 hover:bg-emerald-50 border border-emerald-100/80'
                                : 'hover:bg-slate-100 text-slate-600 bg-white border border-slate-100'
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {!isUnlocked ? (
                                <div className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center">
                                  <Lock className="w-3 h-3" />
                                </div>
                              ) : isCompleted ? (
                                <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`} />
                              ) : (
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${
                                  isSelected ? 'border-white text-white' : 'border-slate-300 text-slate-500 bg-slate-50'
                                }`}>
                                  {lesson.lessonNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`truncate leading-snug ${
                                  isSelected ? 'text-white font-bold' : !isUnlocked ? 'text-slate-400 font-medium' : 'text-slate-800 font-medium'
                                }`}>
                                  {lesson.title}
                                </p>
                                {!isUnlocked && (
                                  <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                                    Bloqueada
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                                  {lesson.duration}
                                </span>
                                {isUnlocked && !isCompleted && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {isTheoryDone ? 'Teoria OK • Pendente Quiz' : 'Não Concluída'}
                                  </span>
                                )}
                                {scoreRec && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : scoreRec.passed
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {scoreRec.score}/10
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Attribution footer in sidebar */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" /> Videoaulas Oficiais
                </p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Créditos das aulas audiovisuais: <strong>{PRIME_CURSOS_CHANNEL_NAME}</strong>. Todos os direitos reservados.
                </p>
                <a
                  href={PRIME_CURSOS_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 mt-1"
                >
                  Canal no YouTube <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Certificate Notice if 100% */}
              {totalCompleted === TOTAL_EXCEL_LESSONS && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200/80 text-center">
                  <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-amber-900">Curso 100% Concluído!</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Você completou todas as 20 aulas, teorias e questionários com maestria.</p>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN LESSON VIEWER */}
          <main className="lg:col-span-8 space-y-6">
            {isIntroActive ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Intro Header */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Aula Inaugural • Introdução Oficial
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{excelIntroData.duration}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                    {excelIntroData.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                    {excelIntroData.summary}
                  </p>

                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Vídeo Oficial: Prime Cursos do Brasil</p>
                        <p className="text-[11px] text-slate-500">Assista para conhecer o ecossistema do Excel antes de iniciar as aulas práticas.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsIntroActive(false);
                        setSelectedLessonId(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-auto"
                    >
                      Ir para Aula 01 <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video Player */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="relative aspect-video w-full bg-slate-900">
                    <iframe
                      src={excelIntroData.videoUrl}
                      title={excelIntroData.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>

                  {/* Highlights & Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-amber-500" /> Destaques Desta Apresentação
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {excelIntroData.highlights.map((item, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-slate-700 font-medium leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Topics */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Tópicos Abordados
                      </h3>
                      <div className="space-y-3">
                        {excelIntroData.keyTopics.map((topic, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              {topic.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed pl-4">
                              {topic.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Study Tips */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Dicas de Estudo para o Curso
                      </h4>
                      <ul className="space-y-1.5 text-xs text-amber-900/90 list-disc list-inside leading-relaxed">
                        {excelIntroData.studyTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setIsIntroActive(false);
                          setSelectedLessonId(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        Iniciar Curso: Aula 01 - Interface e Estrutura <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Lesson Title & Module Badge */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {currentLesson.module}
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{currentLesson.duration}</span>
                  {isCurrentLessonComplete ? (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% Concluída
                    </span>
                  ) : isCurrentTheoryDone ? (
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      Teoria Concluída
                    </span>
                  ) : null}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Aula {currentLesson.lessonNumber}: {currentLesson.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {currentLesson.summary}
              </p>

              {/* Sequential Steps Notice */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Regra de Progresso:</strong> Conclua a <strong>Aula Teórica</strong> e obtenha nota mínima 7 no <strong>Questionário</strong> desta aula para liberar a Aula {currentLesson.lessonNumber + 1}!
                </span>
              </div>

              {/* Three Mandatory Sections Ordered as Requested: 1. Vídeo, 2. Teoria, 3. Questionário */}
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                    activeTab === 'video'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" /> 1. Vídeo Aula
                </button>

                <button
                  onClick={() => setActiveTab('theory')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                    activeTab === 'theory'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> 2. Aula Teórica
                  {isCurrentTheoryDone && (
                    <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black">
                      Concluído
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                    activeTab === 'quiz'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> 3. Questionário (10 Questões)
                  {currentScoreRecord && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-black ${
                      currentScoreRecord.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {currentScoreRecord.score}/10
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* TAB 1: VÍDEO AULA */}
            {activeTab === 'video' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="relative aspect-video w-full bg-slate-900">
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Explicit Attribution Banner to Prime Cursos do Brasil */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-slate-50 to-emerald-50 border border-red-200/80 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          PC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            Créditos da Videoaula: {PRIME_CURSOS_CHANNEL_NAME}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Vídeo incorporado diretamente da playlist oficial do curso de Excel da Prime Cursos do Brasil.
                          </p>
                        </div>
                      </div>
                      <a
                        href={PRIME_CURSOS_PLAYLIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        Abrir Playlist no YouTube <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" /> Tópicos Abordados no Vídeo
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentLesson.videoHighlights.map((hl, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Assitiu ao vídeo? Avance para a teoria detalhada.</span>
                  <button
                    onClick={() => setActiveTab('theory')}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    2. Ler Aula Teórica <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: AULA TEÓRICA */}
            {activeTab === 'theory' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Introduction */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" /> Introdução & Contextualização
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {currentLesson.theoryContent.introduction}
                    </p>
                  </div>

                  {/* Key Concepts Cards */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-400">
                      Conceitos e Fórmulas Centrais
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {currentLesson.theoryContent.keyConcepts.map((kc, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <h5 className="font-bold text-slate-900 text-sm text-emerald-900">{kc.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed">{kc.description}</p>
                          {kc.formulaOrExample && (
                            <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-emerald-700 font-semibold">
                              {kc.formulaOrExample}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step by step practical guide */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-400">
                      Passo a Passo Prático na Planilha
                    </h4>
                    <ol className="space-y-3">
                      {currentLesson.theoryContent.stepByStep.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed mt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Shortcuts Table */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-emerald-600" /> Atalhos de Teclado Essenciais
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Atalho</th>
                            <th className="p-3">Ação Executada</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentLesson.theoryContent.keyboardShortcuts.map((sc, i) => (
                            <tr key={i} className="hover:bg-slate-50/80">
                              <td className="p-3 font-mono font-bold text-emerald-700 bg-emerald-50/40 w-1/3">
                                {sc.keys}
                              </td>
                              <td className="p-3 text-slate-700">{sc.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pro Tip & Common Errors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" /> Dica de Ouro do Professor
                      </div>
                      <p className="text-xs text-amber-900/80 leading-relaxed">
                        {currentLesson.theoryContent.proTip}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Erro Mais Comum a Evitar
                      </div>
                      <p className="text-xs text-rose-900/80 leading-relaxed">
                        {currentLesson.theoryContent.commonErrors}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transition to Quiz with Explicit Theory Completion Requirement */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isCurrentTheoryDone ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aula Teórica Concluída
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Leitura Pendente de Confirmação
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                          Etapa obrigatória para liberação da próxima aula
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {isCurrentTheoryDone
                          ? 'Excelente! Você já registrou a conclusão teórica. Agora faça o questionário de 10 questões.'
                          : 'Terminou de estudar todo o conteúdo teórico acima? Marque como concluído para salvar seu progresso.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {!isCurrentTheoryDone ? (
                        <button
                          onClick={handleCompleteTheory}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Marcar Teoria como Concluída
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('quiz')}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
                        >
                          Ir para o Questionário (10 Questões) <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: QUESTIONÁRIO (10 QUESTÕES) */}
            {activeTab === 'quiz' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Quiz Header Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600" /> Questionário Oficial: 10 Questões
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Para aprovação na aula é necessário acertar no mínimo 7 questões (70%).
                    </p>
                  </div>

                  {currentScoreRecord && (
                    <div className={`px-4 py-2 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                      currentScoreRecord.passed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      <Award className="w-4 h-4" />
                      <span>Nota Registrada: {currentScoreRecord.score} / 10 ({currentScoreRecord.score * 10}%)</span>
                    </div>
                  )}
                </div>

                {/* Quiz Result View if Submitted */}
                {isQuizSubmitted ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="text-center max-w-md mx-auto py-4">
                      {quizScores[currentLesson.id]?.passed ? (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <CheckCircle2 className="w-9 h-9" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <AlertTriangle className="w-9 h-9" />
                        </div>
                      )}

                      <h4 className="text-2xl font-black text-slate-900">
                        {quizScores[currentLesson.id]?.passed ? 'Parabéns, Você Foi Aprovado!' : 'Nota Abaixo da Média'}
                      </h4>
                      <p className="text-slate-500 text-xs mt-1">
                        Você acertou <strong>{quizScores[currentLesson.id]?.score} de 10 questões</strong> ({quizScores[currentLesson.id]?.score ? quizScores[currentLesson.id]!.score * 10 : 0}%).
                      </p>

                      {/* Unlock Status Alert */}
                      {quizScores[currentLesson.id]?.passed && (
                        <div className="mt-4">
                          {isCurrentTheoryDone ? (
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
                              <p className="font-bold flex items-center justify-center gap-1.5 text-emerald-800">
                                <Unlock className="w-4 h-4 text-emerald-600" />
                                {selectedLessonId < TOTAL_EXCEL_LESSONS
                                  ? `Aula ${selectedLessonId + 1} desbloqueada com sucesso!`
                                  : 'Todas as aulas do curso foram completadas!'}
                              </p>
                              <p className="text-[11px] text-emerald-700">
                                Você cumpriu ambos os requisitos: leitura teórica concluída e nota mínima 7/10 no questionário.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-2">
                              <p className="font-bold flex items-center justify-center gap-1.5 text-amber-800">
                                <Lock className="w-4 h-4 text-amber-600" /> Quase lá! Falta confirmar a Aula Teórica
                              </p>
                              <p className="text-[11px] text-amber-700">
                                Para liberar a Aula {selectedLessonId + 1}, você precisa marcar a Aula Teórica como lida.
                              </p>
                              <button
                                onClick={handleCompleteTheory}
                                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Concluir Aula Teórica Agora
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-center flex-wrap gap-3 mt-6">
                        <button
                          onClick={handleRetakeQuiz}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Refazer Questionário
                        </button>
                        {selectedLessonId < TOTAL_EXCEL_LESSONS && (
                          <button
                            onClick={handleNextLesson}
                            disabled={!isNextUnlocked}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                              isNextUnlocked
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isNextUnlocked ? (
                              <>
                                Avançar para Aula {selectedLessonId + 1} <ChevronRight className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" /> Aula {selectedLessonId + 1} Bloqueada
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detailed Review of All 10 Questions */}
                    <div className="pt-6 border-t border-slate-100 space-y-6">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                        Correção Detalhada das 10 Questões
                      </h4>

                      <div className="space-y-6">
                        {currentLesson.quiz.map((q, idx) => {
                          const userAns = selectedAnswers[q.id];
                          const isCorrect = userAns === q.correctIndex;

                          return (
                            <div
                              key={q.id}
                              className={`p-5 rounded-2xl border transition-all ${
                                isCorrect
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-rose-50/40 border-rose-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                                  <span className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center ${
                                    isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  {q.question}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {isCorrect ? 'Correta' : 'Incorreta'}
                                </span>
                              </div>

                              {/* Options review */}
                              <div className="space-y-1.5 pl-7 mb-3">
                                {q.options.map((opt, optIdx) => {
                                  const isSelectedOpt = userAns === optIdx;
                                  const isCorrectOpt = q.correctIndex === optIdx;

                                  let optStyle = 'bg-white/80 border-slate-200 text-slate-600';
                                  if (isCorrectOpt) optStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                                  else if (isSelectedOpt && !isCorrect) optStyle = 'bg-rose-100 border-rose-300 text-rose-900 line-through';

                                  return (
                                    <div key={optIdx} className={`p-2 rounded-xl text-xs border ${optStyle}`}>
                                      <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                                      {opt}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Explanation */}
                              <div className="pl-7 text-xs text-slate-600 bg-white/60 p-3 rounded-xl border border-slate-200/60">
                                <strong>Explicação:</strong> {q.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Quiz Questions View */
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
                    
                    {/* Progress Bar of Answered Questions */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                        <span>Progresso do Questionário</span>
                        <span>{Object.keys(selectedAnswers).length} de 10 respondidas</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${(Object.keys(selectedAnswers).length / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* List of all 10 Questions */}
                    <div className="space-y-8 divide-y divide-slate-100">
                      {currentLesson.quiz.map((q, qIndex) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;

                        return (
                          <div key={q.id} className={qIndex > 0 ? 'pt-8' : ''}>
                            <div className="flex items-start gap-3 mb-4">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isAnswered
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {qIndex + 1}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm leading-relaxed mt-0.5">
                                {q.question}
                              </h4>
                            </div>

                            {/* 4 Options */}
                            <div className="grid grid-cols-1 gap-2.5 pl-10">
                              {q.options.map((option, optIdx) => {
                                const isSelected = selectedAnswers[q.id] === optIdx;

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSelectAnswer(q.id, optIdx)}
                                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                                      isSelected
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'bg-slate-50 border-slate-300 text-slate-500'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="leading-snug">{option}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs text-slate-500 font-medium">
                        Responda todas as 10 questões antes de enviar para conferir a correção e nota final.
                      </p>
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                      >
                        Enviar Questionário e Ver Nota
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevLesson}
                disabled={selectedLessonId <= 1}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Aula Anterior
              </button>

              <span className="text-xs text-slate-400 font-bold">
                Aula {currentLesson.lessonNumber} de {TOTAL_EXCEL_LESSONS}
              </span>

              {selectedLessonId < TOTAL_EXCEL_LESSONS ? (
                <button
                  onClick={handleNextLesson}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    isNextUnlocked
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300 hover:bg-slate-200/80'
                  }`}
                  title={isNextUnlocked ? 'Avançar para a próxima aula' : 'Aula bloqueada: Conclua a teoria e o questionário'}
                >
                  {isNextUnlocked ? (
                    <>
                      Próxima Aula <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Aula {nextLessonId} Bloqueada
                    </>
                  )}
                </button>
              ) : (
                <div className="px-5 py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Última Aula
                </div>
              )}
            </div>
          </>
        )}
      </main>
        </div>
      </div>
    </div>
  );
}
