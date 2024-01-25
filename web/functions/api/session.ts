import { Env } from '../../app/types/core';

export async function onRequest({
  request,
  ...context
}: EventContext<Env, never, {}>) {
  const base = 'https://remix-chat-worker.nieky.workers.dev';
  const statusCode = 301;

  const url = new URL(request.url);
  const { pathname, search } = url;

  const destinationURL = `${base}${pathname}${search}`;

  return Response.redirect(destinationURL, statusCode);
}
