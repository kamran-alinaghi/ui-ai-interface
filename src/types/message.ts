// types/message.ts
export type Role = 'pm' | 'ai';

export interface Message {
  id: string;
  role: Role;
  text: string;
}
