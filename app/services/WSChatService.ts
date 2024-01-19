import type {
  ChatEvent,
  ChatEventHandler,
  ChatEventType,
  IChatService,
  IStorage,
  SendMessageServiceParams,
  SendTypingServiceParams,
  UpdateState,
} from '@chatscope/use-chat';
import { EventHandlers } from '~/types/services';

async function websocket(url: string) {
  const ws = new WebSocket(url);
  console.log(ws);
  if (!ws) {
    throw new Error("server didn't accept ws");
  }

  ws.addEventListener('error', (err) => {
    console.error(err);
  });

  ws.addEventListener('open', () => {
    console.log('Opened websocket');
    Promise.resolve(ws);
  });

  ws.addEventListener('message', ({ data }) => {
    const { count, tz, error } = JSON.parse(data);
    console.log(data);
    if (error) {
      console.error(error);
    } else {
      console.error();
    }
  });

  ws.addEventListener('close', () => {
    console.log('Closed websocket');
    Promise.reject('Failed to open ws');
  });

  // return ws;
}

export class WSChatService implements IChatService {
  storage?: IStorage;
  updateState: UpdateState;

  eventHandlers: EventHandlers = {
    onMessage: () => {},
    onConnectionStateChanged: () => {},
    onUserConnected: () => {},
    onUserDisconnected: () => {},
    onUserPresenceChanged: () => {},
    onUserTyping: () => {},
  };

  constructor(storage: IStorage, update: UpdateState) {
    this.storage = storage;
    this.updateState = update;
  }

  async initSession() {
    const wsConn = await websocket('wss://localhost:8788/api/session');
    console.log(wsConn);
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    // TODO send message

    return message.content;
  }

  sendTyping({
    isTyping,
    content,
    conversationId,
    userId,
  }: SendTypingServiceParams) {
    // send typing notification
    return;
  }

  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }

  // The ChatProvider can unregister the callback.
  // In this case remove it from your service to keep it clean.
  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    _eventHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }
}
