import { DBSchema } from 'idb';

export interface UserModel {
  id: string;
  username: string;
  avatar: string;
}

export interface MessageModel {
  timestamp: number;
  content: string;
  senderId: string;
}

export interface ConversationModel {
  id: string;
  name: string;
  messages: MessageModel[];
  members: UserModel[];
}

export interface ChatDBSchema extends DBSchema {
  current_user: {
    key: string;
    value: UserModel;
  };
  contacts: {
    key: string;
    value: UserModel;
    indexes: { by_username: number };
  };
  conversations: {
    key: string;
    value: ConversationModel;
    indexes: { by_timestamp: number };
  };
}
