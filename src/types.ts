export type UserRole = 'student' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  matricula?: string;
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
  frequencia?: number;
  emailResponsavel?: string;
  nomeResponsavel?: string;
  telefoneResponsavel?: string;
  childStudentId?: string; // If this user is a parent, references their child's id/email
  status?: 'ativo' | 'aguardando_aprovacao' | 'recusado' | 'inativo';
}

export interface PreRegistrationRequest {
  id: string;
  name: string;
  email: string;
  matricula: string;
  role: 'student' | 'parent';
  course: string;
  grade: string;
  password?: string;
  nomeAlunoVinculado?: string; // Para quando um pai/mãe se cadastra com a matrícula do filho
  status: 'aguardando_aprovacao' | 'aprovado' | 'recusado';
  createdAt: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
  rejectionReason?: string;
}

export interface AuthorizedUser {
  id: string;
  matricula: string;
  email: string;
  name: string;
  role: UserRole;
  course: string;
  grade: string;
  status: 'ativo' | 'inativo';
  emailResponsavel?: string;
  nomeResponsavel?: string;
  telefoneResponsavel?: string;
  cadastradoPor?: string;
  createdAt?: string;
  isActivated?: boolean; // if student/user already created an account / logged in
}

export interface DailyClass {
  id: string;
  professor: string;
  professorEmail: string;
  disciplina: string;
  curso: string;
  turma: string;
  tema: string;
  conteudo: string;
  atividades?: string;
  data: string; // YYYY-MM-DD or ISO
  horario?: string;
  createdAt: string;
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
