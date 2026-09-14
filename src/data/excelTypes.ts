export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface KeyConcept {
  title: string;
  description: string;
  formulaOrExample?: string;
}

export interface KeyboardShortcut {
  keys: string;
  action: string;
}

export interface TheoryContent {
  introduction: string;
  keyConcepts: KeyConcept[];
  stepByStep: string[];
  keyboardShortcuts: KeyboardShortcut[];
  proTip: string;
  commonErrors: string;
}

export interface ExcelLesson {
  id: number;
  lessonNumber: number;
  title: string;
  module: string;
  duration: string;
  summary: string;
  videoUrl: string;
  videoTitle: string;
  videoHighlights: string[];
  theoryContent: TheoryContent;
  quiz: QuizQuestion[]; // Strictly 10 questions per lesson
}
