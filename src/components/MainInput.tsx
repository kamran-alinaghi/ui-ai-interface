import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../hooks';
import { BottomSection, Button, Container, TextArea } from '../styles/MainInput.style';
import { useGateway } from '../gateway/GatewayProvider';
import { addMessage, initProject } from '../redux/chatSlice';
import type { Message } from '../types/message';
import { sendViaGateway } from '../utils/wsTransport';
import { updateDB } from '../utils/chatPersistence';
import { AppDispatch, RootState } from '../redux/store';
import { createProjectWithChat, createUserProject } from '../redux/projectsThunks';
import { auth, db } from './firebase-ui/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function MainInput() {
  const [text, setText] = useState('');
  const [waiting, setWaiting] = useState(false);
  const dispatch = useAppDispatch();
  const projectId = useAppSelector((s) => s.projects.activeProjectId);
  const theme = useAppSelector((s) => s.theme.theme);
  const { send, status: wsStatus } = useGateway();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
    const uid = useAppSelector((s) => s.auth.currentUser?.uid);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const onSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Ensure we have an owner and a project; create one if needed
    let pid = projectId;
    if (!pid) {
      if (!auth.currentUser) {
        await signInAnonymously(auth).catch(() => {});
      }
      try {
        pid = await dispatch(createProjectWithChat(db, auth.currentUser?.uid)).then(
          // dispatch of a thunk returns its Promise
          (res: any) => res as string
        );
      } catch (e) {
        console.error(e);
        alert('Failed to create project');
        return;
      }
    }

    const messageId = uuidv4();
    const userMsg: Message = {
      id: messageId,
      role: 'pm',
      text: trimmed,
      createdAt: Date.now(),
      status: 'complete',
    };

    // Optimistic UI to the *new or existing* project
    dispatch(addMessage({ projectId: pid!, message: userMsg }));
    setText('');
    setWaiting(true);

    try {
      // 1) Persist to Firestore
      await updateDB(pid!, userMsg);
    } catch (err) {
      console.error(err);
      alert('Failed to save to Firestore');
      setWaiting(false);
      return;
    }

    try {
      // 2) Send over WebSocket
      await sendViaGateway(send, { projectId: pid!, messageId, text: trimmed });
      // waiting will flip off when you handle ai_done later
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Send failed');
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
              onSend();
            }
          }}
          themeMode={theme}
          placeholder={projectId ? 'Type a message…' : 'Select a project to start chatting'}
        />
        <Button onClick={onSend}>
          Send
        </Button>
      </BottomSection>
    </Container>
  );
}
