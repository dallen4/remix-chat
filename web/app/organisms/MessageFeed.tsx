import {
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageGroup,
  MessageStatus,
  TextContent,
  User,
  useChat,
} from '@chatscope/use-chat';
import { useMemo } from 'react';
import { RECEIVED_COLOR, SENT_COLOR } from '~/config';
import { createUser } from '~/lib/user';
import { MessageBatch } from '~/molecules/MessageBatch';

const createMessage = (body: string) => ({
  body,
  sentTime: new Date().toTimeString().split(' ')[0],
});

export const MessageFeed = () => {
  const { activeConversation, messages } = useChat();

  const me = useMemo(() => createUser('me', SENT_COLOR), []);

  const messageBatches = useMemo<MessageGroup[]>(() => {
    if (activeConversation) {
      const desiredMessages = messages[activeConversation.id];

      return desiredMessages || [];
    }

    const senderId = crypto.randomUUID();

    const defaultGroup = new MessageGroup({
      id: crypto.randomUUID(),
      senderId,
      direction: MessageDirection.Incoming,
    });

    defaultGroup.addMessage(
      new ChatMessage({
        id: crypto.randomUUID(),
        content: { content: 'hello' },
        senderId,
        status: MessageStatus.Sent,
        contentType: MessageContentType.TextPlain,
        direction: MessageDirection.Incoming,
      })
    );

    return [defaultGroup];
  }, [messages]);

  return (
    <>
      {messageBatches.map((group) => {
        const user = new User({ id: group.senderId });

        const messages = group.messages.map(
          (msg: ChatMessage<MessageContentType.TextPlain>) => {
            const msgContent = msg.content as TextContent;

            return {
              body: msgContent.content,
              sentTime: msg.createdTime.toTimeString().split(' ')[0],
            };
          }
        );

        const batchProps = {
          user,
          messages,
        };

        return <MessageBatch key={group.id} {...batchProps} />;
      })}

      <MessageBatch
        user={me}
        messages={[
          createMessage('hello 1'),
          createMessage('hello 2'),
          createMessage('hello 3'),
          createMessage('hello 4'),
        ]}
      />
      <MessageBatch
        user={createUser('you', RECEIVED_COLOR)}
        messages={[createMessage('hey back')]}
        received
      />
      <MessageBatch
        user={me}
        messages={[createMessage('hello 1'), createMessage('blah blah blah')]}
      />
    </>
  );
};
