import { SESSION_COOKIE, SESSION_HEADER } from './config';
import { Env } from './index';
import { serialize } from 'cookie';

interface Message {
  timestamp: number;
  body: string;
}

export class Session {
  private _connMap: Map<string, WebSocket>;

  private controller: DurableObjectState;
  private env: Env;

  constructor(controller: DurableObjectState, env: Env) {
    this._connMap = new Map<string, WebSocket>();

    this.controller = controller;
    this.env = env;
  }

  get active() {
    return this._connMap.size > 0;
  }

  get members() {
    return this._connMap
  }

  get headers() {
    const headers = new Headers();

    const sessionId = this.controller.id.toString();

    headers.set(
      'Set-Cookie',
      serialize(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax' })
    );
    headers.set(SESSION_HEADER, sessionId);

    return headers;
  }

  async fetch(
    request: Request<unknown, CfProperties<unknown>>
  ): Promise<Response> {
    if (request.method === 'GET') {
      if (request.headers.get('Upgrade') === 'websocket') {
        const client = await this.initWebsocket();

        return new Response(null, {
          status: 101,
          webSocket: client,
          headers: this.headers,
        });
      } else return new Response('Expected websocket', { status: 400 });
    } else if (request.method === 'PUT') {
      this.broadcast({
        timestamp: Date.now(),
        body: await request.text(),
      });

      return new Response('message sent', { headers: this.headers });
    }
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

    const connectionId = crypto.randomUUID();

    this._connMap.set(connectionId, server);

    return client;
  }

  private handleMessage({ type, data: rawData }: MessageEvent) {
    const data: Message = JSON.parse(rawData as string);

    console.log(data);

    this.broadcast(data);
  }

  private broadcast(msg: Message) {
    const msgAsString = JSON.stringify(msg);
    console.log(this._connMap);
    this._connMap.forEach((conn, id) => {
      conn.send(msgAsString);
      console.log(`Message sent to: ${id}...`);
    });
  }
}
