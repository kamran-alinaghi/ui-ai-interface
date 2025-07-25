import { useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks';
import ChatMessage from './ChatMessage';

export default function ChatWindow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectId = useAppSelector(s => s.projects.activeProjectId);
  const messages = useAppSelector(s =>
    projectId ? s.chat[projectId]?.messages || [] : []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflowY: 'auto', padding: '10px' }}
    >
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}
