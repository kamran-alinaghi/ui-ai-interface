import { styled } from 'styled-components';
import ChatWindow from './ChatWindow';
import MainInput from './MainInput';
import { useAppSelector } from '../hooks';

export const ChatContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : 'white')};
`;

export default function ChatView() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
      <ChatContainer themeMode={theme}>
        <ChatWindow />
        <MainInput />
      </ChatContainer>
  );
}
