// hooks/useProjectChat.ts
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { initProject, replaceMessages } from '../redux/chatSlice';
import { subscribeToProjectMessages } from '../services/firestoreChat';

export function useProjectChat(projectId?: string | null) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!projectId) return;
    dispatch(initProject(projectId));
    const unsub = subscribeToProjectMessages(projectId, (msgs) => {
      dispatch(replaceMessages({ projectId, messages: msgs }));
    });
    return () => unsub();
  }, [projectId, dispatch]);
}
