import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addMessage, updateAIResponse } from '../redux/chatSlice';
import { sendMessageToAI, saveMessageToDB } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/message';
import { BottomSection, Button, Container, TextArea } from '../styles/MainInput.style';

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
    if (!text.trim() || !projectId || waiting) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'pm',
      text,
    };
    
    setText('');


    const placeholderMessage: Message = {
      id: uuidv4(),
      role: 'ai',
      text: '...',
    };
    function GetReply(): Promise<Message> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(placeholderMessage);
        }, 50000); // 5000 milliseconds = 5 seconds
      });
    }
    // Show user message immediately
    dispatch(addMessage({ projectId: projectId, message: userMessage }));
    // Show loading placeholder from AI
    dispatch(addMessage({ projectId: projectId, message: await GetReply() }));

    setWaiting(true);

    try {
      // const aiRes = await sendMessageToAI(userMessage);

      // // Replace placeholder message with real AI message
      // dispatch(updateAIResponse({
      //   projectId,
      //   message: aiRes.response,
      //   summary: aiRes.summary,
      //   mosa: aiRes.mosa,
      // }));

      // await saveMessageToDB({
      //   id: userMessage.id,
      //   sentMessage: userMessage,
      //   receivedMessage: aiRes.response,
      //   updatedSummary: aiRes.summary,
      //   updatedMOSA: aiRes.mosa,
      // });
    } catch (err) {
      console.error('Error fetching AI response:', err);
      // Optionally update placeholder with error text
    } finally {
      setWaiting(false);
    }
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
