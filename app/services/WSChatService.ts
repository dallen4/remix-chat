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
import { websocket } from '~/lib/websocket';
import { EventHandlers } from '~/types/services';

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
    const wsConn = await websocket('wss://remix-chat-worker.nieky.workers.dev');
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
