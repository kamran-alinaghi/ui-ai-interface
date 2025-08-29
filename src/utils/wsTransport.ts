import type { GatewayOutbound } from '../gateway/events';

export async function sendViaGateway(
  send: (m: GatewayOutbound) => boolean,
  params: { projectId: string; messageId: string; text: string }
): Promise<void> {
  const { projectId, messageId, text } = params;
  const ok = send({ type: 'user_message', projectId, messageId, text });
  if (!ok) throw new Error('WebSocket not ready');
}
