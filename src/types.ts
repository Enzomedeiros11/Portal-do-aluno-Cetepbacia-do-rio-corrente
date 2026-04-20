export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  grade?: string;
  course?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  n1?: string;
  n2?: string;
  n3?: string;
  subjectGrades?: Record<string, { n1: string; n2: string; n3: string }>;
}

export const COURSES = [
  'Regular',
  'Técnico em Informática',
  'Administração',
  'Nutrição',
  'Agropecuária',
  'Enfermagem',
  'Meio Ambiente'
];

export const GRADES = [
  '1º Ano',
  '2º Ano',
  '3º Ano',
  'Docente'
];
