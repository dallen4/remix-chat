import { Message as BaseMessage } from '@chatscope/chat-ui-kit-react';
import { MessageDirection } from '@chatscope/use-chat';

export type MessageProps = {
  body: string;
  position: 'single' | 'first' | 'normal' | 'last';
  sentTime: string;
  direction: MessageDirection;
};

export const Message = ({
  position,
  body,
  sentTime,
  direction,
}: MessageProps) => {
  const className =
    direction === MessageDirection.Outgoing
      ? 'sent-message'
      : 'received-message';

  return (
    <BaseMessage
      model={{
        sentTime,
        direction,
        position,
      }}
      type={'text'}
      className={className}
      style={{
        justifyContent:
          direction === MessageDirection.Outgoing ? 'flex-end' : 'flex-start',
      }}
    >
      <BaseMessage.TextContent text={body} />
    </BaseMessage>
  );
};
