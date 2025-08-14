import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/message';
import { addMessage, updateAIResponse } from '../redux/chatSlice';
import { saveMessageToDB } from './api';
import { getDatabase, ref, set } from 'firebase/database';

export async function handleSendMessage({
  text,
  projectId,
  dispatch,
  setText,
  setWaiting,
}: {
  text: string;
  projectId: string | null;
  dispatch: any;
  setText: (val: string) => void;
  setWaiting: (val: boolean) => void;
}) {
  if (!text.trim() || !projectId) return;

  const userMessage: Message = {
    id: uuidv4(),
    role: 'pm',
    text,
  };

  const placeholderMessage: Message = {
    id: uuidv4(),
    role: 'ai',
    text: '...',
  };

  setText('');
  setWaiting(true);
  dispatch(addMessage({ projectId, message: userMessage }));
  dispatch(addMessage({ projectId, message: placeholderMessage }));

  try {
    const db = getDatabase();
    await set(ref(db, `projects/${projectId}/messages/${userMessage.id}`), {
      request: userMessage,
    });
    // AI response will come through Firebase listener (set up elsewhere)
  } catch (error) {
    console.error('Error sending message to backend:', error);
  }
}
