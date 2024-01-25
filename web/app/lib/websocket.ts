export async function websocket(url: string) {
  return new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url);
    console.log(ws);
    if (!ws) {
      throw new Error("server didn't accept ws");
    }

    ws.addEventListener('error', (err) => {
      console.error(err);
    });

    ws.addEventListener('message', ({ data }) => {
      console.log(data);
      // const { count, tz, error } = JSON.parse(data);
      // if (error) {
      //   console.error(error);
      // } else {
      //   console.error();
      // }
    });

    ws.addEventListener('close', () => {
      console.log('Closed websocket');
      reject('Failed to open ws');
    });

    ws.addEventListener('open', () => {
      console.log('Opened websocket');
      resolve(ws);
    });
  });
}
