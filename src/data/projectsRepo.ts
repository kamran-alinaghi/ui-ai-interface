// src/data/projectsRepo.ts
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  limit as qLimit, onSnapshot, orderBy, query, serverTimestamp,
  startAfter, updateDoc, where, Firestore, DocumentData, QueryDocumentSnapshot,
  QueryConstraint,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { CreateProjectInput, ListOpts, Project, ProjectDoc, UpdateProjectPatch } from './dataTypes';


// ---------- Helpers ----------
function fromDoc(snap: QueryDocumentSnapshot<DocumentData>): Project {
  const d = snap.data();
  return {
    id: snap.id,
    ownerId: d.ownerId,
    name: d.name,
    description: d.description,
    archived: d.archived ?? false,
    createdAt: d.createdAt?.toDate?.() ?? new Date(0),
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(0),
  };
}

// ---------- CRUD + Realtime ----------
export function subscribeProjects(
  db: Firestore,
  ownerId: string,
  cb: (projects: Project[]) => void,
  opts: { includeArchived?: boolean } = {}
) {
  const base = collection(db, 'projects');
  const clauses: QueryConstraint[] = [
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  ];
  if (!opts.includeArchived) clauses.push(where('archived', '==', false));

  const q = query(base, ...clauses);
  return onSnapshot(q, (snap) => cb(snap.docs.map(fromDoc)), (err) => console.error("err: ", err));
}

async function getStartAfterSnap(db: Firestore, projectId?: string, startAfterId?: string) {
  if (!startAfterId) return undefined;
  const ref = doc(db, 'projects', startAfterId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap : undefined; // using snapshot is valid as a cursor
}

export async function listProjects(
  db: Firestore,
  ownerId: string,
  opts: ListOpts = {}
) {
  const base = collection(db, 'projects');

  const clauses: QueryConstraint[] = [
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  ];

  if (opts.limit) clauses.push(qLimit(opts.limit));

  const cursor = await getStartAfterSnap(db, undefined, opts.startAfterId);
  const q = cursor ? query(base, ...clauses, startAfter(cursor)) : query(base, ...clauses);

  const snap = await getDocs(q);
  return snap.docs.map(fromDoc);
}


export async function getProject(db: Firestore, projectId: string): Promise<Project | null> {
  const ref = doc(db, 'projects', projectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromDoc(snap as QueryDocumentSnapshot<DocumentData>);
}

export async function createProject(
  db: Firestore,
  ownerId: string,
  input: CreateProjectInput
): Promise<Project> {
  const ref = await addDoc(collection(db, 'projects'), {
    ownerId,
    name: input.name,
    description: input.description ?? '',
    archived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Return the hydrated project
  const snap = await getDoc(ref);
  return fromDoc(snap as QueryDocumentSnapshot<DocumentData>);
}

export async function updateProject(
  db: Firestore,
  projectId: string,
  patch: UpdateProjectPatch
): Promise<void> {
  const ref = doc(db, 'projects', projectId);

  // Start with updatedAt set to a FieldValue
  const updates: Partial<ProjectDoc> = { updatedAt: serverTimestamp() };

  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.archived !== undefined) updates.archived = patch.archived;

  // Cast to UpdateData<ProjectDoc> which updateDoc expects
  await updateDoc(ref, updates as import('firebase/firestore').UpdateData<ProjectDoc>);
}

export async function deleteProject(db: Firestore, projectId: string): Promise<void> {
  // Hard delete. If you prefer soft delete, call updateProject(..., { archived: true })
  await deleteDoc(doc(db, 'projects', projectId));
}
