import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addMessage, updateAIResponse } from '../redux/chatSlice';
import { sendMessageToAI, saveMessageToDB } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/message';
import { BottomSection, Button, Container, TextArea } from '../styles/MainInput.style';
import { handleSendMessage } from '../utils/handleSendMessage';

export default function MainInput() {
  const [text, setText] = useState('');
  const [waiting, setWaiting] = useState(false);
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(s => s.projects.activeProjectId);
  const theme = useAppSelector((state) => state.theme.theme);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSend = async () => {
    await handleSendMessage({ text, projectId, dispatch, setText, setWaiting });
  };

  return (
    <Container themeMode={theme}>
      <BottomSection>
        <TextArea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          themeMode={theme}
        />
        <Button onClick={handleSend} disabled={waiting}>
          Send
        </Button>
      </BottomSection>
    </Container>
  );
}
