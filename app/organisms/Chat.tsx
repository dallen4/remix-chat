import {
  ChatContainer,
  ConversationHeader,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import { MessageFeed } from './MessageFeed';
import { BasicStorage, Conversation, useChat } from '@chatscope/use-chat';
import { useEffect, useState } from 'react';
import { WSChatService } from '~/services/WSChatService';
// import { WSChatService } from '~/services/WSChatService';

export const Chat = () => {
  const { addConversation, setActiveConversation } = useChat();
  const [] = useState([]);

  useEffect(() => {
    const newConvo = new Conversation({
      id: crypto.randomUUID(),
    });

    addConversation(newConvo);
    setActiveConversation(newConvo.id);
  }, []);

  const test = async () => {
    const session = new WSChatService(
      new BasicStorage({
        groupIdGenerator: () => crypto.randomUUID(),
        messageIdGenerator: () => crypto.randomUUID(),
      }),
      () => {}
    );

    await session.initSession();
  };

  return (
    <ChatContainer>
      <ConversationHeader>
        <ConversationHeader.Content userName={'test user name'} />
      </ConversationHeader>
      <MessageList loadingMorePosition={'bottom'}>
        <MessageList.Content>
          <MessageFeed />
        </MessageList.Content>
      </MessageList>
      <MessageInput sendButton attachButton placeholder={'Type message here'} />
    </ChatContainer>
  );
};
