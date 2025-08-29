// redux/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types/message';
import { MOSAComponentGraph } from '../types/MOSA';

interface ProjectChat {
  messages: Message[];
  summary: string;
  mosa: MOSAComponentGraph | null;
}
interface ChatState {
  [projectId: string]: ProjectChat | undefined;
}
const indexById = (arr: { id: string }[]) =>
  Object.fromEntries(arr.map((m) => [m.id, true as const]));
const initialState: ChatState = {};

const findMsgIndex = (list: Message[], id: string) =>
  list.findIndex((m) => m.id === id);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initProject(state, action: PayloadAction<string>) {
      const pid = action.payload;
      if (!state[pid]) state[pid] = { messages: [], summary: '', mosa: null };
    },

    addMessage(
      state,
      action: PayloadAction<{ projectId: string; message: Message }>
    ) {
      const { projectId, message } = action.payload;
      const proj = state[projectId];
      if (!proj) return;
      proj.messages.push(message);
    },

    startAIMessage(
      state,
      action: PayloadAction<{
        projectId: string;
        messageId: string;
        replyToId?: string;
        initialText?: string;
        createdAt?: number;
      }>
    ) {
      const { projectId, messageId, replyToId, initialText = '', createdAt } =
        action.payload;
      const proj = state[projectId];
      if (!proj) return;

      const existingIdx = findMsgIndex(proj.messages, messageId);
      if (existingIdx >= 0) return;

      const msg: Message = {
        id: messageId,
        role: 'ai',
        text: initialText,
        replyToId,
        createdAt: createdAt ?? Date.now(),
        status: 'streaming',
      };
      proj.messages.push(msg);
    },

    appendAIMessageToken(
      state,
      action: PayloadAction<{ projectId: string; messageId: string; token: string }>
    ) {
      const { projectId, messageId, token } = action.payload;
      const proj = state[projectId];
      if (!proj) return;

      const idx = findMsgIndex(proj.messages, messageId);
      if (idx < 0) return;

      const current = proj.messages[idx];
      proj.messages[idx] = {
        ...current,
        text: (current.text || '') + token,
        status: 'streaming',
      };
    },

    finishAIMessage(
      state,
      action: PayloadAction<{
        projectId: string;
        messageId: string;
        summary?: string;
        mosa?: MOSAComponentGraph | null;
        error?: boolean;
      }>
    ) {
      const { projectId, messageId, summary, mosa, error } = action.payload;
      const proj = state[projectId];
      if (!proj) return;

      const idx = findMsgIndex(proj.messages, messageId);
      if (idx >= 0) {
        const cur = proj.messages[idx];
        proj.messages[idx] = { ...cur, status: error ? 'error' : 'complete' };
      }
      if (typeof summary === 'string') proj.summary = summary;
      if (typeof mosa !== 'undefined') proj.mosa = mosa;
    },

    // keep for non-streaming HTTP path if you use it
    updateAIResponse(
      state,
      action: PayloadAction<{
        projectId: string;
        message: Message;
        summary: string;
        mosa: MOSAComponentGraph;
      }>
    ) {
      const p = state[action.payload.projectId];
      if (p) {
        p.messages.push({ ...action.payload.message, status: 'complete' });
        p.summary = action.payload.summary;
        p.mosa = action.payload.mosa;
      }
    },replaceMessages(
      state,
      action: PayloadAction<{ projectId: string; messages: Message[] }>
    ) {
      const { projectId, messages } = action.payload;
      const proj = state[projectId];
      if (!proj) return;
      // De-dup against any optimistic items already in state by id
      const seen = indexById(messages);
      const optimistic = proj.messages.filter(m => !seen[m.id]);
      proj.messages = [...messages, ...optimistic].sort(
        (a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)
      );
    },
  },
});

export const {
  initProject,
  addMessage,
  startAIMessage,
  appendAIMessageToken,
  finishAIMessage,
  updateAIResponse,
  replaceMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
