import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { DailyClass } from '../types';

export const DEFAULT_DAILY_CLASSES: DailyClass[] = [];

const STORAGE_KEY = 'cetep_daily_classes';

export function getLocalDailyClasses(): DailyClass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out old fake mock items
        const cleaned = parsed.filter(a => !['aula_enf_01', 'aula_adm_01', 'aula_agro_01'].includes(a.id));
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Local daily classes parse error:', e);
  }
  return [];
}

export function saveLocalDailyClasses(list: DailyClass[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

export async function publishDailyClass(item: Omit<DailyClass, 'id' | 'createdAt'>): Promise<DailyClass> {
  const newId = `aula_${Date.now()}`;
  const record: DailyClass = {
    ...item,
    id: newId,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'aulas_hoje', newId), record);
  } catch (e) {
    console.warn('Firestore publishDailyClass error:', e);
  }

  const list = [record, ...getLocalDailyClasses().filter(a => a.id !== newId)];
  saveLocalDailyClasses(list);
  return record;
}

export async function deleteDailyClass(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'aulas_hoje', id));
  } catch (e) {
    console.warn('Firestore deleteDailyClass error:', e);
  }

  const list = getLocalDailyClasses().filter(a => a.id !== id);
  saveLocalDailyClasses(list);
}

export async function seedDailyClassesIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'aulas_hoje'));
    if (snap.empty) {
      for (const aula of DEFAULT_DAILY_CLASSES) {
        await setDoc(doc(db, 'aulas_hoje', aula.id), aula, { merge: true });
      }
    }
  } catch (e) {
    console.warn('Error seeding daily classes:', e);
  }
}
