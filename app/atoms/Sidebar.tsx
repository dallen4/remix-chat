import {
  ConversationList,
  Conversation,
  Sidebar as BaseSidebar,
  ConversationHeader,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import { useChat } from '@chatscope/use-chat';
import { adventurer } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export const Sidebar = () => {
  const avatar = createAvatar(adventurer, {
    seed: 'blah',
    size: 55,
    backgroundColor: ['ED6953'],
    radius: 50,
  }).toDataUriSync();
  const { conversations } = useChat();

  return (
    <BaseSidebar position="left" scrollable>
      <ConversationHeader>
        <Avatar src={avatar} />
        <ConversationHeader.Content>Nieky</ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList>
        {conversations.map((convo) => (
          <Conversation name={convo.id} lastSenderName={''} />
        ))}
      </ConversationList>
    </BaseSidebar>
  );
};
