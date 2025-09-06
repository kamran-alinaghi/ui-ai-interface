// types/message.ts
export type Role = 'pm' | 'ai';

export type MessageStatus = 'complete' | 'streaming' | 'error';

export interface Message {
  id: string;
  role: Role;                 // 'pm' (you) or 'ai'
  text: string;               // streaming appends mutate this
  // Optional metadata (safe defaults keep old code working)
  replyToId?: string;
  createdAt: number;         // Date.now()
  status?: MessageStatus;     // for UI spinners, etc.
}
