import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { PreRegistrationRequest, User, AuthorizedUser } from '../types';
import { saveAuthorizedUser, normalizeIdentifier, normalizeMatricula } from './authorizedService';

const STORAGE_KEY = 'cetep_pre_registrations';

export function getLocalPreRegistrations(): PreRegistrationRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Local pre-registrations parse error:', e);
  }
  return [];
}

export function saveLocalPreRegistrations(list: PreRegistrationRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

/**
 * Submits a new pre-registration request (Aluno ou Responsável)
 * Initial status: 'aguardando_aprovacao'
 */
export async function submitPreRegistration(
  data: Omit<PreRegistrationRequest, 'id' | 'status' | 'createdAt'>
): Promise<PreRegistrationRequest> {
  const cleanEmail = normalizeIdentifier(data.email);
  const cleanMat = normalizeMatricula(data.matricula);
  const cleanId = `${data.role}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const request: PreRegistrationRequest = {
    ...data,
    id: cleanId,
    email: cleanEmail,
    matricula: cleanMat,
    status: 'aguardando_aprovacao',
    createdAt: new Date().toISOString()
  };

  // 1. Save to Firebase collection 'solicitacoes_cadastro'
  try {
    await setDoc(doc(db, 'solicitacoes_cadastro', cleanId), request, { merge: true });
  } catch (err) {
    console.warn('Firestore submitPreRegistration warning:', err);
  }

  // 2. Also register a placeholder in /usuarios with status 'aguardando_aprovacao'
  // (Prevents unauthorized login while pending approval)
  try {
    const userDocId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    await setDoc(doc(db, 'usuarios', userDocId), {
      id: userDocId,
      nome: request.name,
      email: cleanEmail,
      matricula: cleanMat,
      senha: request.password,
      tipo: request.role,
      role: request.role,
      curso: request.course,
      grade: request.grade,
      status: 'aguardando_aprovacao',
      createdAt: request.createdAt,
      updatedAt: request.createdAt
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore usuarios placeholder warning:', e);
  }

  // 3. Update local cache
  const list = getLocalPreRegistrations();
  const updated = [request, ...list.filter(r => r.id !== cleanId)];
  saveLocalPreRegistrations(updated);

  return request;
}

/**
 * Checks if an identifier (Gmail or Matrícula) has a pending pre-registration
 */
export async function checkPendingPreRegistration(identifier: string): Promise<PreRegistrationRequest | null> {
  const clean = normalizeIdentifier(identifier);
  const cleanMat = normalizeMatricula(identifier);

  // Check local cache first
  const localList = getLocalPreRegistrations();
  const localFound = localList.find(r => 
    r.status === 'aguardando_aprovacao' && 
    (normalizeIdentifier(r.email) === clean || normalizeMatricula(r.matricula) === cleanMat)
  );
  if (localFound) return localFound;

  // Query Firestore /solicitacoes_cadastro
  try {
    const snap = await getDocs(collection(db, 'solicitacoes_cadastro'));
    let found: PreRegistrationRequest | null = null;
    snap.forEach((docSnap) => {
      if (found) return;
      const d = docSnap.data() as PreRegistrationRequest;
      if (
        d.status === 'aguardando_aprovacao' && 
        (normalizeIdentifier(d.email) === clean || normalizeMatricula(d.matricula) === cleanMat)
      ) {
        found = { ...d, id: docSnap.id };
      }
    });
    if (found) return found;
  } catch (e) {
    console.warn('Error checking pending status in Firestore:', e);
  }

  return null;
}

/**
 * Approves a pre-registration request (Executed by Professor Enzo / Teacher)
 */
export async function approvePreRegistration(
  request: PreRegistrationRequest, 
  approvedBy: string = 'Professor Enzo Medeiros'
): Promise<void> {
  const cleanEmail = normalizeIdentifier(request.email);
  const userDocId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const now = new Date().toISOString();

  // 1. Mark request as approved
  const updatedRequest: PreRegistrationRequest = {
    ...request,
    status: 'aprovado',
    evaluatedBy: approvedBy,
    evaluatedAt: now
  };

  try {
    await setDoc(doc(db, 'solicitacoes_cadastro', request.id), updatedRequest, { merge: true });
  } catch (e) {
    console.warn('Error updating solicitacao in Firestore:', e);
  }

  // 2. Activate user in /usuarios
  const isParent = request.role === 'parent';
  const userPayload: any = {
    id: userDocId,
    nome: request.name,
    email: cleanEmail,
    matricula: request.matricula,
    senha: request.password,
    tipo: request.role,
    role: request.role,
    curso: request.course,
    grade: request.grade,
    frequencia: 100,
    notas: {},
    status: 'ativo',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(request.name)}`,
    updatedAt: now
  };

  if (isParent) {
    userPayload.nomeResponsavel = request.name;
    userPayload.emailResponsavel = cleanEmail;
    userPayload.childMatricula = request.matricula;
  }

  try {
    await setDoc(doc(db, 'usuarios', userDocId), userPayload, { merge: true });
    
    // If it's a parent, find any student with this same matricula in /usuarios and attach parent info
    if (isParent && request.matricula) {
      try {
        const usersSnap = await getDocs(collection(db, 'usuarios'));
        let studentFound = false;
        for (const uDoc of usersSnap.docs) {
          const ud = uDoc.data();
          if (ud.tipo !== 'parent' && ud.role !== 'parent' && normalizeMatricula(ud.matricula || '') === normalizeMatricula(request.matricula)) {
            studentFound = true;
            await setDoc(doc(db, 'usuarios', uDoc.id), {
              emailResponsavel: cleanEmail,
              nomeResponsavel: request.name
            }, { merge: true });
          }
        }

        // If no student exists in /usuarios yet with this matricula, create the student profile
        if (!studentFound) {
          const studentDocId = `student_${request.matricula.replace(/[^a-zA-Z0-9]/g, '_')}`;
          const defaultStudent: any = {
            id: studentDocId,
            nome: `Estudante (${request.matricula})`,
            email: `aluno.${request.matricula.toLowerCase()}@cetep.ba.gov.br`,
            matricula: request.matricula,
            tipo: 'student',
            role: 'student',
            curso: request.course || 'Técnico em Informática',
            grade: request.grade || '1º Ano',
            frequencia: 96,
            status: 'ativo',
            emailResponsavel: cleanEmail,
            nomeResponsavel: request.name,
            notas: {
              'Português': { n1: '8.5', n2: '9.0', n3: '8.8' },
              'Matemática': { n1: '8.0', n2: '8.5', n3: '9.2' },
              'Informática Básica': { n1: '9.5', n2: '9.0', n3: '10' }
            },
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student_${request.matricula}`,
            updatedAt: now
          };
          await setDoc(doc(db, 'usuarios', studentDocId), defaultStudent, { merge: true });
        }
      } catch (linkErr) {
        console.warn('Parent student linking warning:', linkErr);
      }
    } else if (!isParent && request.matricula) {
      // If it's a student, see if any parent is already registered with this childMatricula or matricula
      try {
        const usersSnap = await getDocs(collection(db, 'usuarios'));
        for (const uDoc of usersSnap.docs) {
          const ud = uDoc.data();
          if ((ud.tipo === 'parent' || ud.role === 'parent') && normalizeMatricula(ud.matricula || ud.childMatricula || '') === normalizeMatricula(request.matricula)) {
            await setDoc(doc(db, 'usuarios', userDocId), {
              emailResponsavel: ud.email,
              nomeResponsavel: ud.nome || ud.name
            }, { merge: true });
            break;
          }
        }
      } catch (linkErr) {
        console.warn('Student parent linking warning:', linkErr);
      }
    }
  } catch (e) {
    console.warn('Error activating user in Firestore:', e);
  }

  // 3. Register in /autorizados so they pass strict authentication checks
  try {
    const authRecord: AuthorizedUser = {
      id: userDocId,
      matricula: request.matricula,
      email: cleanEmail,
      name: request.name,
      role: request.role,
      course: request.course,
      grade: request.grade,
      status: 'ativo',
      emailResponsavel: isParent ? cleanEmail : undefined,
      nomeResponsavel: isParent ? request.name : undefined,
      cadastradoPor: `Aprovado por ${approvedBy}`,
      createdAt: now,
      isActivated: true
    };
    await saveAuthorizedUser(authRecord);
  } catch (e) {
    console.warn('Error saving to autorizados:', e);
  }

  // 4. Update local cache
  const list = getLocalPreRegistrations();
  const updatedList = list.map(r => r.id === request.id ? updatedRequest : r);
  saveLocalPreRegistrations(updatedList);
}

/**
 * Rejects a pre-registration request
 */
export async function rejectPreRegistration(
  requestId: string, 
  reason: string = 'Dados não conferem com o cadastro escolar'
): Promise<void> {
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'solicitacoes_cadastro', requestId), {
      status: 'recusado',
      rejectionReason: reason,
      evaluatedAt: now
    }, { merge: true });
  } catch (e) {
    console.warn('Error rejecting solicitacao in Firestore:', e);
  }

  const list = getLocalPreRegistrations();
  const updatedList = list.map(r => r.id === requestId ? { ...r, status: 'recusado' as const, rejectionReason: reason } : r);
  saveLocalPreRegistrations(updatedList);
}
