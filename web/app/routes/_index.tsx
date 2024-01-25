import type { MetaFunction } from '@remix-run/cloudflare';
import { MainContainer } from '@chatscope/chat-ui-kit-react';
import { Sidebar } from '~/atoms/Sidebar';
import { Chat } from '~/organisms/Chat';
import {
  BasicStorage,
  ChatProvider,
  ChatServiceFactory,
  IStorage,
  UpdateState,
} from '@chatscope/use-chat';
import { WSChatService } from '~/services/WSChatService';

export const meta: MetaFunction = () => {
  return [
    { title: 'Chat' },
    { name: 'description', content: 'WS-powered chat' },
  ];
};

const currentUserStorage = new BasicStorage({
  groupIdGenerator: () => crypto.randomUUID(),
  messageIdGenerator: () => crypto.randomUUID(),
});

// Create serviceFactory
const serviceFactory: ChatServiceFactory<WSChatService> = (
  storage: IStorage,
  updateState: UpdateState
) => new WSChatService(storage, updateState);

export default function Index() {
  return (
    <ChatProvider serviceFactory={serviceFactory} storage={currentUserStorage}>
      <MainContainer responsive>
        <Sidebar />
        <Chat />
      </MainContainer>
    </ChatProvider>
  );
}
