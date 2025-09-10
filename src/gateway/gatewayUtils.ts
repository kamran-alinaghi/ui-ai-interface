import { GatewayOutbound } from './events';
import { v4 as uuidv4 } from 'uuid';
import { pendingResponses } from './GatewayProvider';

export function sendViaGatewayAndReceive(
  send: (msg: GatewayOutbound) => boolean,
  projectId: string,
  text: string
): Promise<[string, string]> {
  const messageId = uuidv4();

  return new Promise((resolve) => {
    pendingResponses.set(messageId, {
      tokens: [],
      resolve: (finalText: string) => resolve([messageId, finalText]),
    });

    send({
      type: 'user_message',
      projectId,
      messageId,
      text,
    });
  });
}
