import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GatewayClient } from './GatewayClient';
import type { GatewayOutbound } from './events';
import { useAppDispatch } from '../hooks';
import {
  appendAIMessageToken,
  finishAIMessage,
  startAIMessage,
} from '../redux/chatSlice';

type Status =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'reconnecting'
  | 'closed'
  | 'error'
  | 'not-connected';

type Ctx = {
  status: Status;
  clientId: string;
  send: (m: GatewayOutbound) => boolean;
};

export const pendingResponses = new Map<
  string,
  { tokens: string[]; resolve: (response: string) => void }
>();

const GatewayCtx = createContext<Ctx | null>(null);

// ✅ NEW: Set to prevent duplicate startAIMessage dispatches
const startedMessages = new Set<string>();

export function GatewayProvider({
  projectId,
  children,
}: {
  projectId?: string | null;
  children: React.ReactNode;
}) {
  const clientRef = useRef<GatewayClient | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const clientIdRef = useRef<string>(uuidv4());
  const prevProjectRef = useRef<string | null>(null);

  const WS_URL = process.env.REACT_APP_GATEWAY_WS_URL ?? '';
  const dispatch = useAppDispatch();

  useEffect(() => {
    const client = new GatewayClient(WS_URL, {
      onStatus: (s) => setStatus(s),
      onMessage: (msg) => {
        console.debug('[Gateway] inbound', msg);

        if (!projectId) return;

        if (msg.type === 'ai_token') {
          if (!startedMessages.has(msg.messageId)) {
            startedMessages.add(msg.messageId);
            dispatch(
              startAIMessage({
                projectId,
                messageId: msg.messageId,
              })
            );
          }

          dispatch(
            appendAIMessageToken({
              projectId,
              messageId: msg.messageId,
              token: msg.token,
            })
          );

          const pending = pendingResponses.get(msg.messageId);
          if (pending) {
            pending.tokens.push(msg.token);
          }
        }

        if (msg.type === 'ai_done') {
          dispatch(
            finishAIMessage({
              projectId,
              messageId: msg.messageId,
            })
          );

          const pending = pendingResponses.get(msg.messageId);
          if (pending) {
            const finalText = pending.tokens.join('');
            pending.resolve(finalText);
            pendingResponses.delete(msg.messageId); // clean up
          }
        }
      },
    });

    clientRef.current = client;
    client.connect();

    return () => {
      client.close();
      clientRef.current = null;
      startedMessages.clear(); // ✅ Clear when provider unmounts
    };
  }, [dispatch, WS_URL, projectId]);

  useEffect(() => {
    if (status !== 'open' || !clientRef.current) return;

    console.log('🔗 Sending handshake with clientId:', clientIdRef.current);
    clientRef.current.send({
      type: 'init',
      clientId: clientIdRef.current,
    });

    if (projectId) {
      clientRef.current.send({
        type: 'select_project',
        projectId,
      });
      prevProjectRef.current = projectId;
    }
  }, [status, projectId]);

  useEffect(() => {
    const client = clientRef.current;
    if (!client || status !== 'open') return;

    const prev = prevProjectRef.current;
    if (prev && prev !== projectId) {
      client.send({ type: 'unselect_project', projectId: prev });
    }
    if (projectId) {
      client.send({ type: 'select_project', projectId });
    }

    prevProjectRef.current = projectId ?? null;
  }, [projectId, status]);

  const ctxValue = useMemo<Ctx>(
    () => ({
      status,
      clientId: clientIdRef.current,
      send: (m) => clientRef.current?.send(m) ?? false,
    }),
    [status]
  );

  return <GatewayCtx.Provider value={ctxValue}>{children}</GatewayCtx.Provider>;
}

export function useGateway() {
  const ctx = useContext(GatewayCtx);
  if (!ctx)
    throw new Error('useGateway must be used within <GatewayProvider>');
  return ctx;
}
