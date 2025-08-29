// services/firestoreChat.ts
import {
  collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc
} from 'firebase/firestore';
import type { Message } from '../types/message';
import { db } from '../components/firebase-ui/firebase';

const messagesCol = (projectId: string) =>
  collection(db, 'projects', projectId, 'messages');

export function subscribeToProjectMessages(
  projectId: string,
  onChange: (msgs: Message[]) => void
) {
  const q = query(messagesCol(projectId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const msgs: Message[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      msgs.push({
        id: data.id ?? d.id,
        role: data.role,
        text: data.text ?? '',
        createdAt: typeof data.createdAt === 'number'
          ? data.createdAt
          : (data.createdAt?.toMillis?.() ?? Date.now()),
        status: data.status ?? 'complete',
        replyToId: data.replyToId,
      });
    });
    onChange(msgs);
  });
}

export async function saveUserMessage(projectId: string, msg: Message) {
  const ref = doc(messagesCol(projectId), msg.id);
  await setDoc(ref, {
    ...msg,
    // Use Firestore server time if missing; keep a numeric mirror for easy sort
    createdAt: msg.createdAt ? msg.createdAt : serverTimestamp(),
  }, { merge: true });
}
