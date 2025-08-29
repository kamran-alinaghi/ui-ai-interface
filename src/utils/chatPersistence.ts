import { saveUserMessage } from '../services/firestoreChat';
import type { Message } from '../types/message';

export async function updateDB(projectId: string, message: Message): Promise<void> {
  await saveUserMessage(projectId, message);
}
