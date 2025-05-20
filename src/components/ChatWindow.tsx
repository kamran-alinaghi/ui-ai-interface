import { useAppSelector } from '../hooks';
import ChatMessage from './ChatMessage';

export default function ChatWindow() {
  const projectId = useAppSelector(s => s.projects.activeProjectId);
  const messages = useAppSelector(s => s.chat[projectId!]?.messages || []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}
