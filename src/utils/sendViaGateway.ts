import type { AppDispatch } from '../redux/store';
import { addMessage } from '../redux/chatSlice';
import type { GatewayOutbound } from '../gateway/events';
import type { Message } from '../types/message';
import { saveUserMessage } from '../services/firestoreChat';

type Params = {
  messageId: string;
  text: string;
  projectId: string | null | undefined;
  send: (m: GatewayOutbound) => boolean;
  dispatch: AppDispatch;
  setText: (v: string) => void;
  setWaiting: (v: boolean) => void;
  wsStatus: 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed' | 'error';
};

export async function sendViaGateway({
  messageId,
  text,
  projectId,
  send,
  dispatch,
  setText,
  setWaiting,
  wsStatus,
}: Params) {
  const trimmed = text.trim();
  if (!trimmed) return;

  if (!projectId) {
    alert('no project selected');
    return;
  }
  if (wsStatus !== 'open') {
    alert('websocket not ready yet');
    return;
  }

  const createdAt = Date.now();
  const userMsg: Message = {
    id: messageId,
    role: 'pm',
    text: trimmed,
    createdAt,
    status: 'complete',
  };

  // 1) Optimistic UI
  dispatch(addMessage({ projectId, message: userMsg }));
  setText('');
  setWaiting(true);

  // 2) Fire-and-forget both operations in parallel
  const fireWS = () =>
    send({ type: 'user_message', projectId, messageId, text: trimmed });

  const fireFS = () => saveUserMessage(projectId, userMsg);

  const wsOk = fireWS();
  const fsPromise = fireFS().catch((e) => {
    console.error('Firestore save failed', e);
    alert('Failed to save to Firestore'); // optional
  });

  if (!wsOk) {
    setWaiting(false);
    alert('failed to send over websocket');
  }

  // We don't await fsPromise to keep UI snappy; you may await if you prefer.
  void fsPromise;
}
