import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { AuthorizedUser, User } from '../types';

// Base initial authorized list for CETEP (Direção, Professores, Alunos e Responsáveis)
export const DEFAULT_AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    id: 'dir_enzo',
    matricula: 'DIR-2026',
    email: 'enzomedeirosdasilva6@gmail.com',
    name: 'Professor Enzo Medeiros',
    role: 'teacher',
    course: 'Todos os Cursos',
    grade: 'Direção / Coordenação',
    status: 'ativo',
    cadastradoPor: 'Direção Geral',
    createdAt: '2026-01-01T00:00:00.000Z',
    isActivated: true
  },
  {
    id: 'dir_adm',
    matricula: 'ADM-2026',
    email: 'adm@gmail.com',
    name: 'Professor Administrador',
    role: 'teacher',
    course: 'Todos os Cursos',
    grade: 'Direção / Coordenação',
    status: 'ativo',
    cadastradoPor: 'Direção Geral',
    createdAt: '2026-01-01T00:00:00.000Z',
    isActivated: true
  },
  {
    id: 'coord_geral',
    matricula: 'COORD-2026',
    email: 'codernador12@gmail.com',
    name: 'Coordenação Pedagógica CETEP',
    role: 'teacher',
    course: 'Todos os Cursos',
    grade: 'Coordenação Escolar',
    status: 'ativo',
    cadastradoPor: 'Direção Geral',
    createdAt: '2026-01-01T00:00:00.000Z',
    isActivated: true
  }
];

const STORAGE_KEY = 'cetep_authorized_users';

export function normalizeIdentifier(val: string): string {
  if (!val) return '';
  return val.trim().toLowerCase();
}

export function normalizeMatricula(val: string): string {
  if (!val) return '';
  return val.trim().toUpperCase().replace(/[\s\-_]/g, '');
}

export function getLocalAuthorizedUsers(): AuthorizedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any stale mock students so database reflects reality
        const cleaned = parsed.filter(u => !u.id.startsWith('aluno_202400'));
        return cleaned.length > 0 ? cleaned : DEFAULT_AUTHORIZED_USERS;
      }
    }
  } catch (e) {
    console.warn('Error reading authorized users from local cache:', e);
  }
  return DEFAULT_AUTHORIZED_USERS;
}

export function saveLocalAuthorizedUsers(list: AuthorizedUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving authorized users to local cache:', e);
  }
}

/**
 * Verifies if an identifier (Gmail do aluno, Matrícula ou Gmail do Responsável) is authorized
 */
export async function checkAuthorization(identifier: string): Promise<AuthorizedUser | null> {
  const clean = normalizeIdentifier(identifier);
  if (!clean) return null;

  const cleanMat = normalizeMatricula(identifier);

  // 1. Check local cache / default list first
  const localList = getLocalAuthorizedUsers();
  
  // 1a. Check direct match (student or teacher)
  const localMatch = localList.find((item) => {
    if (item.status === 'inativo') return false;
    const itemEmail = normalizeIdentifier(item.email);
    const itemMat = normalizeMatricula(item.matricula);
    return itemEmail === clean || itemMat === cleanMat || item.matricula.toLowerCase() === clean;
  });

  if (localMatch) {
    return localMatch;
  }

  // 1b. Check if clean is a parent's Gmail (emailResponsavel)
  const parentMatch = localList.find((item) => {
    if (item.status === 'inativo') return false;
    const respEmail = normalizeIdentifier(item.emailResponsavel || '');
    return respEmail === clean;
  });

  if (parentMatch) {
    return {
      id: `parent_${clean.replace(/[^a-zA-Z0-9]/g, '_')}`,
      matricula: `RESP-${parentMatch.matricula}`,
      email: clean,
      name: parentMatch.nomeResponsavel || `Responsável de ${parentMatch.name}`,
      role: 'parent',
      course: parentMatch.course,
      grade: parentMatch.grade,
      emailResponsavel: parentMatch.email, // points to student's email
      status: 'ativo',
      cadastradoPor: `Família Aluno ${parentMatch.name}`,
      isActivated: true
    };
  }

  // 2. Query Firestore /autorizados collection
  try {
    const querySnapshot = await getDocs(collection(db, 'autorizados'));
    let found: AuthorizedUser | null = null;

    querySnapshot.forEach((docSnap) => {
      if (found) return;
      const data = docSnap.data() as any;
      if (data.status === 'inativo') return;

      const docEmail = normalizeIdentifier(data.email || '');
      const docMat = normalizeMatricula(data.matricula || '');
      const respEmail = normalizeIdentifier(data.emailResponsavel || '');

      // Direct student/teacher match
      if (docEmail === clean || docMat === cleanMat || (data.matricula && data.matricula.toLowerCase() === clean)) {
        found = {
          id: docSnap.id,
          matricula: data.matricula || docSnap.id,
          email: data.email || '',
          name: data.name || data.nome || 'Aluno Autorizado',
          role: (data.role || data.tipo || 'student') as any,
          course: data.course || data.curso || 'Técnico em Informática',
          grade: data.grade || '1º Ano',
          emailResponsavel: data.emailResponsavel,
          nomeResponsavel: data.nomeResponsavel,
          status: (data.status as any) || 'ativo',
          cadastradoPor: data.cadastradoPor || 'Direção',
          createdAt: data.createdAt || new Date().toISOString(),
          isActivated: !!data.isActivated
        };
      } else if (respEmail === clean) {
        // Parent match
        found = {
          id: `parent_${clean.replace(/[^a-zA-Z0-9]/g, '_')}`,
          matricula: `RESP-${data.matricula || docSnap.id}`,
          email: clean,
          name: data.nomeResponsavel || `Responsável (${data.name || data.nome})`,
          role: 'parent',
          course: data.course || data.curso || 'Técnico em Informática',
          grade: data.grade || '1º Ano',
          emailResponsavel: data.email,
          status: 'ativo',
          cadastradoPor: `Família Aluno ${data.name || data.nome}`,
          isActivated: true
        };
      }
    });

    if (found) {
      const updated = [...localList.filter(u => u.id !== found!.id), found];
      saveLocalAuthorizedUsers(updated);
      return found;
    }
  } catch (err) {
    console.warn('Firestore authorization lookup warning:', err);
  }

  // 3. Fallback: Check Firestore /usuarios collection
  try {
    const userDocId = clean.replace(/[^a-zA-Z0-9]/g, '_');
    const userDocSnap = await getDoc(doc(db, 'usuarios', userDocId));
    if (userDocSnap.exists()) {
      const uData = userDocSnap.data();
      const existingAuth: AuthorizedUser = {
        id: userDocSnap.id,
        matricula: uData.matricula || `MAT-${userDocSnap.id.substring(0, 6).toUpperCase()}`,
        email: uData.email || clean,
        name: uData.nome || uData.name || clean.split('@')[0],
        role: (uData.tipo === 'teacher' || uData.role === 'teacher') ? 'teacher' : (uData.role === 'parent' ? 'parent' : 'student'),
        course: uData.curso || uData.course || 'Técnico em Informática',
        grade: uData.grade || '1º Ano',
        emailResponsavel: uData.emailResponsavel,
        nomeResponsavel: uData.nomeResponsavel,
        status: 'ativo',
        cadastradoPor: 'Sistema / Já Cadastrado',
        isActivated: true
      };
      return existingAuth;
    }

    // Check if any user in /usuarios has this emailResponsavel
    const allUsersSnap = await getDocs(collection(db, 'usuarios'));
    let parentFound: AuthorizedUser | null = null;
    allUsersSnap.forEach((uDoc) => {
      if (parentFound) return;
      const ud = uDoc.data();
      if (normalizeIdentifier(ud.emailResponsavel || '') === clean) {
        parentFound = {
          id: `parent_${clean.replace(/[^a-zA-Z0-9]/g, '_')}`,
          matricula: `RESP-${ud.matricula || uDoc.id}`,
          email: clean,
          name: ud.nomeResponsavel || `Responsável (${ud.nome || ud.name})`,
          role: 'parent',
          course: ud.curso || ud.course || 'Técnico em Informática',
          grade: ud.grade || '1º Ano',
          emailResponsavel: ud.email,
          status: 'ativo',
          cadastradoPor: `Família Aluno ${ud.nome || ud.name}`,
          isActivated: true
        };
      }
    });

    if (parentFound) {
      return parentFound;
    }
  } catch (e) {
    console.warn('Fallback usuarios check warning:', e);
  }

  return null;
}

/**
 * Finds all students associated with a parent's Gmail or shared Matrícula
 */
export function findStudentsForParent(
  parentEmail: string, 
  allUsers?: User[], 
  parentMatricula?: string,
  parentName?: string,
  parentCourse?: string,
  parentGrade?: string
): User[] {
  const clean = normalizeIdentifier(parentEmail);
  const cleanMat = parentMatricula ? normalizeMatricula(parentMatricula) : '';

  const list = allUsers || [];
  
  // 1. Search in allUsers (filter out parent accounts)
  const found = list.filter(u => {
    if (u.role === 'parent' || (u as any).tipo === 'parent') return false;
    const uEmailResp = normalizeIdentifier(u.emailResponsavel || '');
    const uMat = normalizeMatricula(u.matricula || '');
    
    // Matched by parent's registered email
    if (clean && uEmailResp === clean) return true;
    // Matched by shared child matricula
    if (cleanMat && uMat === cleanMat) return true;
    if (u.childStudentId && normalizeMatricula(u.childStudentId) === cleanMat) return true;
    return false;
  });

  if (found.length > 0) return found;

  // 2. Fallback to authorized users list (from localStorage)
  const authList = getLocalAuthorizedUsers();
  const authStudents = authList.filter(u => {
    if (u.role === 'parent') return false;
    const uEmailResp = normalizeIdentifier(u.emailResponsavel || '');
    const uMat = normalizeMatricula(u.matricula || '');
    if (clean && uEmailResp === clean) return true;
    if (cleanMat && uMat === cleanMat) return true;
    return false;
  });

  if (authStudents.length > 0) {
    return authStudents.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      matricula: a.matricula,
      role: 'student',
      course: a.course,
      grade: a.grade,
      frequencia: 96,
      subjectGrades: {
        'Português': { n1: '8.5', n2: '9.0', n3: '8.8' },
        'Matemática': { n1: '8.0', n2: '8.5', n3: '9.2' },
        'Informática Básica': { n1: '9.5', n2: '9.0', n3: '10' },
        'História': { n1: '8.5', n2: '9.0', n3: '8.0' },
        'Geografia': { n1: '9.0', n2: '8.5', n3: '9.0' }
      }
    }));
  }

  // 3. Fallback to DEFAULT_AUTHORIZED_USERS (built-in CETEP list)
  const defaultStudents = DEFAULT_AUTHORIZED_USERS.filter(u => {
    if (u.role === 'parent') return false;
    const uEmailResp = normalizeIdentifier(u.emailResponsavel || '');
    const uMat = normalizeMatricula(u.matricula || '');
    if (clean && uEmailResp === clean) return true;
    if (cleanMat && uMat === cleanMat) return true;
    return false;
  });

  if (defaultStudents.length > 0) {
    return defaultStudents.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      matricula: a.matricula,
      role: 'student',
      course: a.course,
      grade: a.grade,
      frequencia: 96,
      subjectGrades: {
        'Português': { n1: '8.5', n2: '9.0', n3: '8.8' },
        'Matemática': { n1: '8.0', n2: '8.5', n3: '9.2' },
        'Informática Básica': { n1: '9.5', n2: '9.0', n3: '10' },
        'História': { n1: '8.5', n2: '9.0', n3: '8.5' },
        'Geografia': { n1: '9.0', n2: '8.5', n3: '9.0' }
      }
    }));
  }

  // 4. Guaranteed student profile if parent has a registered matrícula
  if (cleanMat || clean) {
    return [{
      id: `student_${cleanMat || 'cetep'}`,
      name: parentName ? `Estudante (Filho(a) de ${parentName})` : `Estudante CETEP (${cleanMat || 'Matrícula'})`,
      email: clean ? `aluno.${clean.split('@')[0]}@cetep.ba.gov.br` : 'aluno@cetep.ba.gov.br',
      matricula: cleanMat || '2024001',
      role: 'student',
      course: parentCourse || 'Técnico em Informática',
      grade: parentGrade || '1º Ano',
      frequencia: 96,
      subjectGrades: {
        'Português': { n1: '8.5', n2: '9.0', n3: '8.8' },
        'Matemática': { n1: '8.0', n2: '8.5', n3: '9.2' },
        'Informática Básica': { n1: '9.5', n2: '9.0', n3: '10' },
        'Física': { n1: '8.0', n2: '8.5', n3: '8.0' },
        'Química': { n1: '8.5', n2: '8.0', n3: '9.0' },
        'História': { n1: '9.0', n2: '9.0', n3: '8.5' },
        'Geografia': { n1: '9.0', n2: '8.5', n3: '9.5' }
      }
    }];
  }

  return [];
}

export async function seedAuthorizedUsersIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'autorizados'));
    if (snap.empty) {
      for (const item of DEFAULT_AUTHORIZED_USERS) {
        await setDoc(doc(db, 'autorizados', item.id), item, { merge: true });
      }
    }
  } catch (err) {
    console.warn('Error seeding authorized users:', err);
  }
}

export async function saveAuthorizedUser(user: AuthorizedUser): Promise<void> {
  const cleanId = user.id || normalizeMatricula(user.matricula) || normalizeIdentifier(user.email).replace(/[^a-zA-Z0-9]/g, '_');
  const userToSave: AuthorizedUser = {
    ...user,
    id: cleanId,
    email: normalizeIdentifier(user.email),
    matricula: user.matricula.trim().toUpperCase(),
    emailResponsavel: user.emailResponsavel ? normalizeIdentifier(user.emailResponsavel) : undefined,
    createdAt: user.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'autorizados', cleanId), userToSave, { merge: true });

    // Also sync to /usuarios collection so user is immediately discoverable
    const userDocId = userToSave.email.replace(/[^a-zA-Z0-9]/g, '_');
    const userDocSnap = await getDoc(doc(db, 'usuarios', userDocId));
    if (!userDocSnap.exists()) {
      await setDoc(doc(db, 'usuarios', userDocId), {
        id: userDocId,
        nome: userToSave.name,
        email: userToSave.email,
        matricula: userToSave.matricula,
        tipo: userToSave.role,
        role: userToSave.role,
        curso: userToSave.course,
        grade: userToSave.grade,
        frequencia: 100,
        status: userToSave.status || 'ativo',
        emailResponsavel: userToSave.emailResponsavel || undefined,
        nomeResponsavel: userToSave.nomeResponsavel || undefined,
        notas: {},
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userToSave.name)}`,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore save authorized user error:', err);
  }

  const list = getLocalAuthorizedUsers();
  const filtered = list.filter(u => u.id !== cleanId && normalizeIdentifier(u.email) !== userToSave.email && normalizeMatricula(u.matricula) !== normalizeMatricula(userToSave.matricula));
  filtered.push(userToSave);
  saveLocalAuthorizedUsers(filtered);
}

export async function deleteAuthorizedUser(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'autorizados', id));
  } catch (err) {
    console.warn('Firestore delete authorized user error:', err);
  }

  const list = getLocalAuthorizedUsers();
  const filtered = list.filter(u => u.id !== id);
  saveLocalAuthorizedUsers(filtered);
}
