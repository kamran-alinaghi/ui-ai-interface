// components/MainInput.tsx
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addMessage, updateAIResponse } from '../redux/chatSlice';
import { sendMessageToAI, saveMessageToDB } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/message';

export default function MainInput() {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(s => s.projects.activeProjectId);

  const handleSend = async () => {
    if (!text.trim() || !projectId) return;
    const msg = { id: uuidv4(), role: 'pm', text } as Message;
    dispatch(addMessage({ projectId, message: msg }));
    setText('');

    const aiRes = await sendMessageToAI(msg);
    dispatch(updateAIResponse({
      projectId,
      message: aiRes.response,
      summary: aiRes.summary,
      mosa: aiRes.mosa,
    }));

    await saveMessageToDB({
      id: msg.id,
      sentMessage: msg,
      receivedMessage: aiRes.response,
      updatedSummary: aiRes.summary,
      updatedMOSA: aiRes.mosa,
    });
  };

  return (
    <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
      <input value={text} onChange={e => setText(e.target.value)} style={{ width: '80%' }} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
