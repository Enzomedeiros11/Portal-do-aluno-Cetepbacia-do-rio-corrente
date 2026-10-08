import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
  Code2,
  HelpCircle,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Terminal,
  RotateCcw
} from 'lucide-react';
import {
  allLogicLessons,
  TOTAL_LOGIC_LESSONS,
  getCompletedLogicLessonIds,
  getCompletedLogicTheoryIds,
  getAllLogicQuizScores,
  markLogicTheoryAsCompleted,
  saveLogicQuizScore,
  evaluateAndSyncLogicLessonCompletion,
  isLogicLessonUnlocked,
  LogicLesson
} from '../data/logicCourseData';
import { downloadCertificatePDF } from '../lib/pdfUtils';
import { toast } from 'sonner';

interface LogicCoursePlayerProps {
  onBack: () => void;
  studentName?: string;
}

export default function LogicCoursePlayer({ onBack, studentName = 'Estudante CETEP' }: LogicCoursePlayerProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'theory' | 'quiz'>('video');

  // Persistence States
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [completedTheoryIds, setCompletedTheoryIds] = useState<number[]>([]);
  const [quizScores, setQuizScores] = useState(getAllLogicQuizScores());

  // Interactive Code Playground State
  const [userCode, setUserCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Active Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Sync state from storage
  const syncStorage = () => {
    setCompletedLessonIds(getCompletedLogicLessonIds());
    setCompletedTheoryIds(getCompletedLogicTheoryIds());
    setQuizScores(getAllLogicQuizScores());
  };

  useEffect(() => {
    syncStorage();
  }, []);

  const currentLesson: LogicLesson =
    allLogicLessons.find((l) => l.id === selectedLessonId) || allLogicLessons[0];

  // Set default code when switching lesson
  useEffect(() => {
    setUserCode(currentLesson.theoryContent.defaultCode);
    setConsoleOutput([]);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLastQuizResult(null);
  }, [selectedLessonId]);

  const isCurrentTheoryCompleted = completedTheoryIds.includes(currentLesson.id);
  const currentQuizScoreRecord = quizScores[currentLesson.id];
  const isCurrentQuizPassed = Boolean(currentQuizScoreRecord && currentQuizScoreRecord.passed);
  const isCurrentLessonFullyCompleted = completedLessonIds.includes(currentLesson.id);

  const handleSelectLesson = (lessonId: number) => {
    if (!isLogicLessonUnlocked(lessonId)) {
      toast.error(`A Aula ${lessonId} está bloqueada! Conclua a teoria e tire nota mínima de 7,0 no questionário da aula anterior para desbloquear.`);
      return;
    }
    setSelectedLessonId(lessonId);
    setActiveTab('video');
  };

  const handleCompleteTheory = () => {
    markLogicTheoryAsCompleted(currentLesson.id);
    evaluateAndSyncLogicLessonCompletion(currentLesson.id);
    syncStorage();
    toast.success('Leitura teórica concluída com sucesso!');
    setActiveTab('quiz');
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setConsoleOutput([]);

    setTimeout(() => {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('[ERRO]: ' + args.join(' '));
        },
        warn: (...args: any[]) => {
          logs.push('[AVISO]: ' + args.join(' '));
        }
      };

      try {
        const runFunction = new Function('console', userCode);
        runFunction(customConsole);
        if (logs.length === 0) {
          logs.push('(Código executado com sucesso, nenhuma saída em console.log)');
        }
        setConsoleOutput(logs);
        toast.success('Código executado com sucesso!');
      } catch (err: any) {
        setConsoleOutput(['❌ Erro de Execução: ' + (err?.message || err)]);
        toast.error('Erro na execução do código.');
      } finally {
        setIsRunningCode(false);
      }
    }, 250);
  };

  const handleResetCode = () => {
    setUserCode(currentLesson.theoryContent.defaultCode);
    setConsoleOutput([]);
    toast.info('Código restaurado para o exemplo original.');
  };

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    const unanswered = currentLesson.quiz.filter((q) => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      toast.warning(`Atenção: Você ainda precisa responder ${unanswered.length} das 10 questões antes de enviar.`);
      return;
    }

    let correctCount = 0;
    currentLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const passed = correctCount >= 7;
    saveLogicQuizScore(currentLesson.id, correctCount, currentLesson.quiz.length);
    evaluateAndSyncLogicLessonCompletion(currentLesson.id);
    syncStorage();

    setQuizSubmitted(true);
    setLastQuizResult({ score: correctCount, passed });

    if (passed) {
      toast.success(`Parabéns! Você tirou nota ${correctCount}/10 e foi APROVADO(A) nesta aula!`);
    } else {
      toast.error(`Nota ${correctCount}/10. Mínimo para aprovação é 7,0. Revise a matéria e tente novamente.`);
    }
  };

  const progressPercentage = Math.round((completedLessonIds.length / TOTAL_LOGIC_LESSONS) * 100);
  const isCourseComplete = completedLessonIds.length === TOTAL_LOGIC_LESSONS;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Voltar aos Cursos Extras"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar aos Cursos</span>
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h1 className="text-sm font-black text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
                Lógica de Programação do Zero ao Avançado
              </h1>
            </div>
            <p className="text-[10px] text-slate-400">
              Aula {currentLesson.lessonNumber} de {TOTAL_LOGIC_LESSONS}: {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Course Progress & Certificate */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400">Progresso Geral</span>
              <p className="text-xs font-black text-indigo-400">
                {completedLessonIds.length}/{TOTAL_LOGIC_LESSONS} ({progressPercentage}%)
              </p>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (completedLessonIds.length === 0) {
                toast.info('Comece a concluir as aulas para obter o seu certificado oficial de 30 horas.');
              }
              downloadCertificatePDF(studentName, 'Lógica de Programação do Zero ao Avançado', 30);
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isCourseComplete
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
            title="Baixar Certificado Oficial em PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isCourseComplete ? 'Baixar Certificado Oficial' : 'Certificado'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Lesson Sidebar */}
        <aside className="w-full lg:w-80 bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Grade de Aulas ({TOTAL_LOGIC_LESSONS})
            </span>
            <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              30 Horas/Aula
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-850 p-2 space-y-1 max-h-64 lg:max-h-[calc(100vh-64px)]">
            {allLogicLessons.map((lesson) => {
              const isUnlocked = isLogicLessonUnlocked(lesson.id);
              const isComplete = completedLessonIds.includes(lesson.id);
              const isSelected = lesson.id === selectedLessonId;
              const scoreRecord = quizScores[lesson.id];

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  disabled={!isUnlocked}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : isUnlocked
                      ? 'hover:bg-slate-800/60 text-slate-300'
                      : 'opacity-40 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isComplete
                        ? 'bg-emerald-600 text-white'
                        : isUnlocked
                        ? isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                        : 'bg-slate-800/50 text-slate-600'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isUnlocked ? (
                      lesson.lessonNumber
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{lesson.duration}</span>
                      {scoreRecord && (
                        <span className={`font-bold ${scoreRecord.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          • Nota: {scoreRecord.score}/10
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center / Right Content Panel */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          
          {/* Lesson Header & Tab Switcher */}
          <div className="p-4 sm:p-6 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                {currentLesson.module}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Aula {currentLesson.lessonNumber}: {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{currentLesson.summary}</p>
            </div>

            {/* 3 Step Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>1. Vídeo Aula</span>
              </button>

              <button
                onClick={() => setActiveTab('theory')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'theory'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Teoria & Código</span>
                {isCurrentTheoryCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>3. Questionário (10)</span>
                {isCurrentQuizPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* TAB 1: VIDEO AULA */}
          {activeTab === 'video' && (
            <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.videoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Pontos Centrais desta Aula
                </h3>
                <ul className="space-y-2">
                  {currentLesson.videoHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('theory')}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Avançar para Aula Teórica & Exercício</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TEORIA & SIMULADOR DE CÓDIGO */}
          {activeTab === 'theory' && (
            <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
              
              {/* Introduction */}
              <div className="bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-black text-white">Resumo Teórico do Conceito</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentLesson.theoryContent.introduction}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLesson.theoryContent.keyConcepts.map((kc, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-6 rounded-3xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-indigo-300 text-sm">{kc.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{kc.description}</p>
                    {kc.codeSnippet && (
                      <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto">
                        <code>{kc.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>

              {/* Code Playground / Simulator */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Laboratório Interativo de Código</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCode}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restaurar
                    </button>
                    <button
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isRunningCode ? 'Executando...' : 'Executar Código'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/40 text-xs text-slate-400 border-b border-slate-800/80">
                  <strong className="text-slate-200">Desafio Prático:</strong> {currentLesson.theoryContent.interactiveExercisePrompt}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                  {/* Editor */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-2">
                      <span>CÓDIGO (JavaScript / Lógica)</span>
                      <span>Você pode editar e testar!</span>
                    </div>
                    <textarea
                      rows={10}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full bg-slate-950 p-4 rounded-2xl text-xs font-mono text-emerald-300 outline-none border border-slate-800 focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  {/* Live Console Output */}
                  <div className="p-4 flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-2">
                      <span>CONSOLE / SAÍDA (OUTPUT)</span>
                      <span className="text-indigo-400">{currentLesson.theoryContent.expectedOutputHint}</span>
                    </div>
                    <div className="flex-1 min-h-[160px] bg-black p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-y-auto space-y-1">
                      {consoleOutput.length > 0 ? (
                        consoleOutput.map((line, idx) => (
                          <div key={idx} className="leading-snug">
                            <span className="text-emerald-500 mr-2">&gt;</span>
                            {line}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-600 italic">
                          Clique em &quot;Executar Código&quot; acima para ver a saída deste programa...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Theory Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  {isCurrentTheoryCompleted
                    ? '✅ Teoria concluída! Prossiga para o questionário de 10 questões.'
                    : 'Após ler os conceitos e testar o código, clique no botão ao lado para liberar o questionário.'}
                </p>
                <button
                  onClick={handleCompleteTheory}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{isCurrentTheoryCompleted ? 'Ir para o Questionário' : 'Concluir Teoria e Iniciar Questionário'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: QUESTIONÁRIO (10 QUESTÕES) COM SELEÇÃO NEUTRA */}
          {activeTab === 'quiz' && (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
              
              {/* Notice of Evaluation */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">Avaliação Contínua da Aula {currentLesson.lessonNumber}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    10 questões de múltipla escolha. Acerto mínimo de 7 questões (média 7,0) para liberar a próxima aula.
                  </p>
                </div>
                {lastQuizResult && (
                  <div className={`px-4 py-2 rounded-2xl border text-xs font-black ${
                    lastQuizResult.passed
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                  }`}>
                    Nota: {lastQuizResult.score} / 10 ({lastQuizResult.passed ? 'APROVADO' : 'REVISAR'})
                  </div>
                )}
              </div>

              {/* Feedback notice clarifying neutral highlight */}
              <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-2xl flex items-center gap-3 text-xs text-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                <span>
                  <strong>Orientação de Marcação:</strong> Ao clicar em uma alternativa ela fica destacada em <strong>azul neutro</strong>. O resultado oficial de acertos (verde) e erros (vermelho) será exibido assim que você enviar o questionário.
                </span>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {currentLesson.quiz.map((q, qIndex) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isSubmitted = quizSubmitted;
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-3xl border transition-all ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-950/20 border-emerald-800/80'
                            : 'bg-rose-950/20 border-rose-800/80'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                              : isAnswered
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {qIndex + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm leading-relaxed">{q.question}</h4>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pl-10">
                        {q.options.map((option, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          const isRightOption = q.correctIndex === optIdx;

                          let optionClass =
                            'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300';

                          if (!isSubmitted) {
                            if (isSelected) {
                              // Neutral Blue highlight when answering — avoids green confusion!
                              optionClass =
                                'bg-blue-600/20 border-blue-500 text-blue-100 font-bold shadow-xs';
                            }
                          } else {
                            if (isRightOption) {
                              optionClass = 'bg-emerald-900/40 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isSelected && !isRightOption) {
                              optionClass = 'bg-rose-900/40 border-rose-500 text-rose-200 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectAnswer(q.id, optIdx)}
                              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${optionClass}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                                  !isSubmitted && isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-snug">{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation shown after submit */}
                      {isSubmitted && (
                        <div className="mt-4 ml-10 p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300">
                          <strong className="text-indigo-400">Explicação:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit or Next Lesson */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  {Object.keys(selectedAnswers).length} de 10 questões respondidas.
                </p>

                <div className="flex items-center gap-3">
                  {quizSubmitted ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                          setLastQuizResult(null);
                        }}
                        className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition-all cursor-pointer"
                      >
                        Tentar Novamente
                      </button>

                      {lastQuizResult?.passed && selectedLessonId < TOTAL_LOGIC_LESSONS && (
                        <button
                          onClick={() => handleSelectLesson(selectedLessonId + 1)}
                          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <span>Avançar para Aula {selectedLessonId + 1}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                    >
                      Enviar Questionário e Ver Nota
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
