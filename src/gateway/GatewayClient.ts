/* Lightweight WS client with auto-reconnect + heartbeat */
import { GatewayInbound, GatewayOutbound } from './events';

type Status = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed' | 'error';

export class GatewayClient {
  private url: string;
  private ws: WebSocket | null = null;
  private shouldReconnect = true;
  private reconnectAttempt = 0;
  private heartbeatTimer: number | null = null;
  private onStatus: (s: Status) => void;
  private onMessage: (m: GatewayInbound) => void;

  constructor(
    url: string,
    opts: { onStatus: (s: Status) => void; onMessage: (m: GatewayInbound) => void }
  ) {
    this.url = url;
    this.onStatus = opts.onStatus;
    this.onMessage = opts.onMessage;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    this.onStatus(this.reconnectAttempt > 0 ? 'reconnecting' : 'connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.onStatus('open');
      this.reconnectAttempt = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as GatewayInbound;
        this.onMessage(msg);
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onerror = () => {
      this.onStatus('error');
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.onStatus('closed');
      if (this.shouldReconnect) this.scheduleReconnect();
    };
  }

  send(data: GatewayOutbound) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(data));
    return true;
  }

  close() {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
    this.ws = null;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    // ping every 25s
    this.heartbeatTimer = window.setInterval(() => {
      this.send({ type: 'ping', ts: Date.now() });
    }, 25_000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempt += 1;
    const base = Math.min(30_000, 1000 * 2 ** this.reconnectAttempt);
    const jitter = Math.floor(Math.random() * 500);
    const delay = base + jitter;
    this.onStatus('reconnecting');
    setTimeout(() => this.connect(), delay);
  }
}
