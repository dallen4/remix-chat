import {
  ChatContainer,
  ConversationHeader,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import { MessageFeed } from './MessageFeed';
import { BasicStorage, Conversation, useChat } from '@chatscope/use-chat';
import { useEffect, useRef, useState } from 'react';
import { WSChatService } from '~/services/WSChatService';

export const Chat = () => {
  const { addConversation, setActiveConversation } = useChat();
  const inputRef = useRef(null);
  const sessionRef = useRef<WSChatService>();
  const [] = useState([]);

  useEffect(() => {
    const newConvo = new Conversation({
      id: crypto.randomUUID(),
    });

    addConversation(newConvo);
    setActiveConversation(newConvo.id);
  }, []);

  const test = async () => {
    sessionRef.current = new WSChatService(
      new BasicStorage({
        groupIdGenerator: () => crypto.randomUUID(),
        messageIdGenerator: () => crypto.randomUUID(),
      }),
      () => {}
    );

    await sessionRef.current.initSession();
  };

  return (
    <ChatContainer>
      <ConversationHeader>
        <ConversationHeader.Content
          userName={'test user name'}
          onClick={test}
        />
      </ConversationHeader>
      <MessageList loadingMorePosition={'bottom'}>
        <MessageList.Content>
          <MessageFeed />
        </MessageList.Content>
      </MessageList>
      <MessageInput
        ref={inputRef}
        sendButton
        attachButton
        placeholder={'Type message here'}
        onSend={(event, content) => {
          console.log('event: ', event);
          console.log('content: ', content);
          console.log(inputRef);
          sessionRef.current?.sendMessage({
            message: { content: 'hello' as any },
            conversationId: '',
          } as any);
        }}
      />
    </ChatContainer>
  );
};
