import ChatWindow from './ChatWindow';
import MainInput from './MainInput';
import { useAppSelector } from '../hooks';
import { ChatContainer } from '../styles/ChatView.style';
import { GatewayProvider, useGateway } from '../gateway/GatewayProvider';
import { useProjectChat } from '../hooks/useProjectChat';

function GatewayStatusBadge() {
  const { status } = useGateway();
  const color =
    status === 'open' ? '#16a34a' :
    status === 'reconnecting' ? '#eab308' :
    status === 'error' ? '#ef4444' :
    '#6b7280';
  return (
    <div style={{ position: 'absolute', top: 8, right: 50, fontSize: 12, color }}>
      WS: {status}
    </div>
  );
}

export default function ChatView() {
  const theme = useAppSelector((s) => s.theme.theme);
  const projectId = useAppSelector((s) => s.projects.activeProjectId);

  useProjectChat(projectId);

  return (
    <GatewayProvider projectId={projectId}>
      <ChatContainer themeMode={theme} style={{ position: 'relative' }}>
        <GatewayStatusBadge />
        <ChatWindow />
        <MainInput />
      </ChatContainer>
    </GatewayProvider>
  );
}
