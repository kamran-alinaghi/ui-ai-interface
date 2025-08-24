import { styled } from "styled-components";

export const ChatContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : 'white')};
`;