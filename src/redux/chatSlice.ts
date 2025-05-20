// redux/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types/message';
import { MOSAComponentGraph } from '../types/MOSA';

interface ChatState {
  [projectId: string]: {
    messages: Message[];
    summary: string;
    mosa: MOSAComponentGraph | null;
  };
}

const initialState: ChatState = {};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initProject(state, action: PayloadAction<string>) {
      state[action.payload] = { messages: [], summary: '', mosa: null };
    },
    addMessage(state, action: PayloadAction<{ projectId: string; message: Message }>) {
      state[action.payload.projectId]?.messages.push(action.payload.message);
    },
    updateAIResponse(state, action: PayloadAction<{
      projectId: string;
      message: Message;
      summary: string;
      mosa: MOSAComponentGraph;
    }>) {
      const p = state[action.payload.projectId];
      if (p) {
        p.messages.push(action.payload.message);
        p.summary = action.payload.summary;
        p.mosa = action.payload.mosa;
      }
    },
  },
});

export const { initProject, addMessage, updateAIResponse } = chatSlice.actions;
export default chatSlice.reducer;
