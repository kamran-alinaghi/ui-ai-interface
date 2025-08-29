// Types for messages to/from UI-Gateway
export type GatewayInbound =
    | { type: 'hello'; serverTime?: string }
    | { type: 'pong'; ts: number }
    | { type: 'ai_token'; messageId: string; token: string }
    | { type: 'ai_done'; messageId: string }
    | { type: 'error'; code: string; message: string };

export type GatewayOutbound =
    | { type: 'init'; clientId: string }               // no project yet
    | { type: 'select_project'; projectId: string }    // subscribe/switch
    | { type: 'unselect_project'; projectId: string }  // optional, tidy up
    | { type: 'ping'; ts: number }
    | { type: 'user_message'; projectId: string; messageId: string; text: string };
