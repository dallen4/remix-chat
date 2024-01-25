import { Avatar, MessageGroup } from '@chatscope/chat-ui-kit-react';
import { AvatarPosition } from '@chatscope/chat-ui-kit-react/src/types/unions';
import { MessageDirection } from '@chatscope/use-chat';
import { Message } from '~/atoms/Message';
import { User } from '~/types/core';

export type MessageBatchProps = {
  messages: { body: string; sentTime: string }[];
  received?: boolean;
  user: User;
};

export const MessageBatch = ({
  messages,
  received,
  user,
}: MessageBatchProps) => {
  const direction = received
    ? MessageDirection.Incoming
    : MessageDirection.Outgoing;

  const avatarPositionMap: Record<MessageDirection, AvatarPosition> = {
    [MessageDirection.Incoming]: 'cl',
    [MessageDirection.Outgoing]: 'cr',
  };

  return (
    <MessageGroup
      avatarPosition={avatarPositionMap[direction]}
      sender={user.username}
      direction={direction}
    >
      <Avatar src={user.avatar} size={'fluid'} />
      <MessageGroup.Header
        style={{ justifyContent: received ? 'flex-start' : 'flex-end' }}
      >
        {messages[0].sentTime}
      </MessageGroup.Header>
      <MessageGroup.Messages>
        {messages.map((message, index) => {
          const position =
            messages.length === 1
              ? 'single'
              : index === 0
              ? 'first'
              : index === messages.length - 1
              ? 'last'
              : 'normal';

          return (
            <Message
              key={message.sentTime}
              body={message.body}
              sentTime={message.sentTime}
              direction={direction}
              position={position}
            />
          );
        })}
      </MessageGroup.Messages>
    </MessageGroup>
  );
};
