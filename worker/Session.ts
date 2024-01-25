import { Env } from './index';
import { serialize } from 'cookie';

interface Message {
  timestamp: number;
  body: string;
}

export class Session {
  private _active: boolean;
  private _connections: WebSocket[];
  private _connMap: Map<string, WebSocket>;

  private controller: DurableObjectState;
  private store: DurableObjectStorage;
  private env: Env;

  constructor(controller: DurableObjectState, env: Env) {
    this._active = false;
    this._connections = [];
    this._connMap = new Map<string, WebSocket>();

    this.controller = controller;
    this.store = this.controller.storage;
    this.env = env;
  }

  get isActive() {
    return this._active;
  }

  async fetch(
    request: Request<unknown, CfProperties<unknown>>
  ): Promise<Response> {
    if (!this._active && request.headers.get('Upgrade') !== 'websocket')
      return new Response('Expected websocket', { status: 400 });

    const headers = new Headers();

    const sessionId = this.controller.id.toString();

    headers.set('Set-Cookie', serialize('session_id', sessionId));
    headers.set('x-session-id', sessionId);

    if (request.method === 'PUT') {
      this.broadcast({
        timestamp: Date.now(),
        body: await request.text(),
      });

      return new Response('message sent', { headers });
    }

    const client = await this.initWebsocket();

    return new Response(null, {
      status: 101,
      webSocket: client,
      headers,
    });
  }

  private async initWebsocket() {
    const [client, server] = Object.values(new WebSocketPair());

    server.accept();

    server.addEventListener('message', this.handleMessage);

    server.addEventListener('error', (err) => {
      console.error(err);
      this.broadcast({ timestamp: Date.now(), body: 'error occurred' });
    });

    server.addEventListener('close', (event) => {
      console.log('Connection closed: ', event);
    });

    this._connections.push(server);

    return client;
  }

  private handleMessage({ type, data: rawData }: MessageEvent) {
    const data = JSON.parse(rawData as string);

    console.log(data);

    if (type === 'error') {
    } else if (type === 'message') {
    } else {
    }
  }

  private broadcast(msg: Message) {
    const msgAsString = JSON.stringify(msg);

    for (const conn of this._connections) conn.send(msgAsString);
  }
}
