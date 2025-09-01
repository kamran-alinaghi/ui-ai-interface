import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GatewayClient } from './GatewayClient';
import type { GatewayOutbound } from './events';

type Status = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed' | 'error' | 'not-connected';

type Ctx = {
  status: Status;
  clientId: string;
  send: (m: GatewayOutbound) => boolean;
};

const GatewayCtx = createContext<Ctx | null>(null);

// …imports unchanged…
export function GatewayProvider({ projectId, children }: { projectId?: string | null; children: React.ReactNode }) {
  const clientRef = useRef<GatewayClient | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const clientIdRef = useRef<string>(uuidv4());
  const prevProjectRef = useRef<string | null>(null);

  const WS_URL = process.env.REACT_APP_GATEWAY_WS_URL ?? '';

  useEffect(() => {
    // Always connect
    const client = new GatewayClient(WS_URL, {
      onStatus: (s) => setStatus(s),
      onMessage: (msg) => console.debug('[Gateway] inbound', msg),
    });
    clientRef.current = client;
    client.connect();

    // After 'open', send init (no project)
    const handshake = setInterval(() => {
      if (clientRef.current && status === 'open') {
        clientRef.current.send({ type: 'init', clientId: clientIdRef.current });
        // If a project is already chosen, select it
        if (projectId) {
          clientRef.current.send({ type: 'select_project', projectId });
          prevProjectRef.current = projectId;
        }
        clearInterval(handshake);
      }
    }, 100);

    return () => {
      clearInterval(handshake);
      client.close();
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // connect once

  // React to project changes without reconnecting
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

  const ctxValue = useMemo<Ctx>(() => ({
    status,
    clientId: clientIdRef.current,
    send: (m) => clientRef.current?.send(m) ?? false,
  }), [status]);

  return <GatewayCtx.Provider value={ctxValue}>{children}</GatewayCtx.Provider>;
}


export function useGateway() {
  const ctx = useContext(GatewayCtx);
  if (!ctx) throw new Error('useGateway must be used within <GatewayProvider>');
  return ctx;
}
