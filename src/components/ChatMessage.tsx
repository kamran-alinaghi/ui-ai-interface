import React from 'react';
import { Message } from '../types/message';
import { MessageBubble, MessageWrapper } from '../styles/ChatMessage.style';

interface Props {
  message: Message;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  return (
    <MessageWrapper role={message.role}>
      <MessageBubble role={message.role}>
        <strong>{message.role.toUpperCase()}:</strong> {message.text}
      </MessageBubble>
    </MessageWrapper>
  );
};

export default ChatMessage;
