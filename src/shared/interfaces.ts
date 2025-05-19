export interface Project {
  id: string;
  name: string;
  messages: Message[];
  summary: string;
  mosa: any; // replace with your actual MOSAComponentGraph type
}

export interface Message {
  id: string;
  role: 'pm' | 'ai';
  text: string;
}

export interface SidebarProps {
  side: "left" | "right";
  children: React.ReactNode;
}