import { parse } from 'cookie';
import { Session } from './Session';

export interface Env {
  sessions: DurableObjectNamespace;
  WORKER_URI: string;
}

async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  function getId() {
    const cookie = parse(request.headers.get('Cookie') || '');

    const sessionId =
      cookie['session_id'] || request.headers.get('x-session-id');

    return sessionId
      ? env.sessions.idFromString(sessionId)
      : env.sessions.newUniqueId();
  }

  const sessionObjectId = getId();
  console.log(sessionObjectId.toString());
  const session = env.sessions.get(sessionObjectId);

  try {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/':
        return session.fetch(request);
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    return new Response(err.toString());
  }
}

export { Session };

export default { fetch: handleRequest };
