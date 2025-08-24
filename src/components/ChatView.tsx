import ChatWindow from './ChatWindow';
import MainInput from './MainInput';
import { useAppSelector } from '../hooks';
import { ChatContainer } from '../styles/ChatView.style';



export default function ChatView() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
      <ChatContainer themeMode={theme}>
        <ChatWindow />
        <MainInput />
      </ChatContainer>
  );
}
