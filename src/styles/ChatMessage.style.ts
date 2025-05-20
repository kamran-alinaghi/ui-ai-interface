import { styled } from "styled-components";

export const MessageWrapper = styled.div<{ role: 'pm' | 'ai' }>`
  display: flex;
  justify-content: ${({ role }) => (role === 'pm' ? 'flex-end' : 'flex-start')};
  margin-bottom: 6px;
`;

export const MessageBubble = styled.div<{ role: 'pm' | 'ai' }>`
  display: inline-block;
  background-color: ${({ role }) => (role === 'pm' ? '#cceeff' : '#e0e0e0')};
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 60%;
  color: #333;
  word-wrap: break-word;
`;