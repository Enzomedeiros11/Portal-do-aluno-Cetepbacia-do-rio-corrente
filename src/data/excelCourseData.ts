import { ExcelLesson } from './excelTypes';
import { lessons1to4 } from './excelLessons1to4';
import { lessons5to8 } from './excelLessons5to8';
import { lessons9to12 } from './excelLessons9to12';
import { lessons13to16 } from './excelLessons13to16';

export * from './excelTypes';

export const allExcelLessons: ExcelLesson[] = [
  ...lessons1to4,
  ...lessons5to8,
  ...lessons9to12,
  ...lessons13to16
];

export const TOTAL_EXCEL_LESSONS = 16;
export const TOTAL_QUESTIONS_PER_LESSON = 10;

// LocalStorage persistence helpers for Student progress
const COMPLETED_LESSONS_KEY = 'cetep_excel_completed_lessons_v1';
const QUIZ_SCORES_KEY = 'cetep_excel_quiz_scores_v1';

export function getCompletedLessonIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonAsCompleted(lessonId: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCompletedLessonIds();
    if (!current.includes(lessonId)) {
      const updated = [...current, lessonId];
      localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Error marking lesson completed:', err);
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
      
      // If passed quiz, also mark lesson as completed
      if (record.passed) {
        markLessonAsCompleted(lessonId);
      }
    } catch (err) {
      console.warn('Error saving quiz score:', err);
    }
  }
  return record;
}
