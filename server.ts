import { type ServerBuild, logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

const serverHandler = build as ServerBuild;

if (process.env.NODE_ENV === 'development') {
  logDevReady(serverHandler);
}

export const onRequest = createPagesFunctionHandler({
  build: serverHandler,
  getLoadContext: (context) => ({ env: context.env }),
  mode: build.mode,
});
