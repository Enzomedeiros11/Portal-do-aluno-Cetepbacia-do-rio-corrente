import { ExcelLesson } from './excelTypes';
import { lessons1to4 } from './excelLessons1to4';
import { lessons5to8 } from './excelLessons5to8';
import { lessons9to12 } from './excelLessons9to12';
import { lessons13to16 } from './excelLessons13to16';
import { lessons17to20 } from './excelLessons17to20';
import { excelIntroData } from './excelIntro';

export * from './excelTypes';
export { excelIntroData };

// Official Channel & Course Information
export const PRIME_CURSOS_CHANNEL_NAME = 'Prime Cursos do Brasil';
export const PRIME_CURSOS_COURSE_TITLE = 'Excel do Básico ao Avançado';
export const PRIME_CURSOS_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLFKhhNd35zq8DJTr8ucZVHIbf64XCObbL';

export const allExcelLessons: ExcelLesson[] = [
  ...lessons1to4,
  ...lessons5to8,
  ...lessons9to12,
  ...lessons13to16,
  ...lessons17to20
];

export const TOTAL_EXCEL_LESSONS = 20;
export const TOTAL_QUESTIONS_PER_LESSON = 10;

// LocalStorage persistence keys for Student progress
const COMPLETED_THEORIES_KEY = 'cetep_excel_completed_theories_v1';
const QUIZ_SCORES_KEY = 'cetep_excel_quiz_scores_v1';
const COMPLETED_LESSONS_KEY = 'cetep_excel_completed_lessons_v1';

// Theory completion tracking
export function getCompletedTheoryIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_THEORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markTheoryAsCompleted(lessonId: number): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCompletedTheoryIds();
    if (!current.includes(lessonId)) {
      const updated = [...current, lessonId];
      localStorage.setItem(COMPLETED_THEORIES_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (err) {
    console.warn('Error marking theory completed:', err);
    return [];
  }
}

export interface QuizScoreRecord {
  lessonId: number;
  score: number; // e.g. 8 out of 10
  total: number; // 10
  passed: boolean;
  date: string;
}

export function getAllQuizScores(): Record<number, QuizScoreRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(QUIZ_SCORES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveQuizScore(lessonId: number, score: number, total = 10): QuizScoreRecord {
  const record: QuizScoreRecord = {
    lessonId,
    score,
    total,
    passed: score >= 7, // 70% passing grade
    date: new Date().toLocaleDateString('pt-BR')
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getAllQuizScores();
      current[lessonId] = record;
      localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(current));
    } catch (err) {
      console.warn('Error saving quiz score:', err);
    }
  }
  return record;
}

/**
 * A lesson is fully completed when BOTH the theoretical lesson has been finished AND the quiz was passed.
 */
export function isLessonFullyCompleted(
  lessonId: number,
  completedTheories: number[],
  quizScores: Record<number, QuizScoreRecord>
): boolean {
  const theoryDone = completedTheories.includes(lessonId);
  const quizDone = quizScores[lessonId]?.passed === true;
  return theoryDone && quizDone;
}

/**
 * Returns all lesson IDs that have both theory completed and quiz passed
 */
export function getCompletedLessonIds(): number[] {
  const theories = getCompletedTheoryIds();
  const scores = getAllQuizScores();
  return allExcelLessons
    .map(l => l.id)
    .filter(id => theories.includes(id) && scores[id]?.passed === true);
}

/**
 * Rule requested by user:
 * "so libera as outras aulas quando aula teorica acaba e questionario ai libera pra parte 2"
 *
 * Lesson 1 is always unlocked.
 * Lesson N (N > 1) is unlocked ONLY when Lesson N-1 has:
 *  1) Theory completed
 *  2) Quiz completed and passed (70% or more)
 */
export function isLessonUnlocked(
  lessonNumber: number,
  completedTheories: number[],
  quizScores: Record<number, QuizScoreRecord>
): boolean {
  if (lessonNumber <= 1) return true;
  const prevLessonNumber = lessonNumber - 1;
  const prevTheoryDone = completedTheories.includes(prevLessonNumber);
  const prevQuizDone = quizScores[prevLessonNumber]?.passed === true;
  return prevTheoryDone && prevQuizDone;
}

