import {
  BasicStorageParams,
  ChatMessage,
  ChatState,
  Conversation,
  ConversationId,
  GroupIdGenerator,
  GroupedMessages,
  IStorage,
  MessageContentType,
  MessageIdGenerator,
  Participant,
  Presence,
  User,
  UserId,
} from '@chatscope/use-chat';
import { getCurrentUser } from '~/lib/db';

// TODO implement `idb`
export class BrowserStorage<Convo = any> implements IStorage<Convo> {
  private readonly _groupIdGenerator: GroupIdGenerator;
  private readonly _messageIdGenerator?: MessageIdGenerator;

  private _currentUser?: User;

  private users: Array<User> = [];

  private conversations: Array<Conversation<Convo>> = [];
  private activeConversationId?: ConversationId;
  private messages: GroupedMessages = {};
  private currentMessage = '';

  constructor({ groupIdGenerator, messageIdGenerator }: BasicStorageParams) {
    this._groupIdGenerator = groupIdGenerator;
    this._messageIdGenerator = messageIdGenerator;
  }

  public get groupIdGenerator() {
    return this._groupIdGenerator;
  }

  public get messageIdGenerator() {
    return this._messageIdGenerator;
  }

  public async init() {
    const userData = await getCurrentUser();

    if (userData)
      this._currentUser = new User({
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
      });
  }

  public setCurrentUser(user: User<any>) {
    this._currentUser = user;
  }

  public get currentUser() {
    return this._currentUser;
  }

  private userExists(userId: UserId): boolean {
    return this.users.findIndex((u) => u.id === userId) !== -1;
  }

  public addUser(user: User<any>) {
    const exists = this.userExists(user.id);

    if (exists) return false;

    this.users.push(user);

    return true;
  }

  public getUser(userId: string): [undefined, undefined] | [User<any>, number] {
    return [undefined, undefined];
  }

  public removeUser(userId: string) {
    const userIndex = this.users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      this.users = this.users
        .slice(0, userIndex)
        .concat(this.users.slice(userIndex + 1));

      return true;
    }

    return false;
  }

  getState(): ChatState {
    return {
      currentUser: this.currentUser,
      users: this.users,
      conversations: this.conversations,
      activeConversation: this.activeConversationId
        ? this.conversations.find((c) => c.id === this.activeConversationId)
        : undefined,
      currentMessages:
        this.activeConversationId && this.activeConversationId in this.messages
          ? this.messages[this.activeConversationId]
          : [],
      messages: this.messages,
      currentMessage: this.currentMessage,
    };
  }

  setActiveConversation: (
    conversationId?: string | undefined,
    resetUnreadCounter?: boolean | undefined
  ) => void;
  addMessage: (
    message: ChatMessage<MessageContentType>,
    conversationId: string,
    generateId: boolean
  ) => ChatMessage<MessageContentType>;
  addConversation: (conversation: Conversation<Convo>) => boolean;
  setUnread: (conversationId: string, count: number) => void;
  removeConversation: (
    conversationId: string,
    removeMessages: boolean
  ) => boolean;
  updateConversation: (conversation: Conversation<any>) => void;
  getConversation: (
    conversationId: string
  ) => [undefined, undefined] | [Conversation<Convo>, number];
  addParticipant: (conversationId: string, participant: Participant) => void;
  removeParticipant: (conversationId: string, participantId: string) => boolean;
  setPresence: (userId: string, presence: Presence) => void;
  setDraft: (draft: string) => void;
  updateMessage: (message: ChatMessage<MessageContentType>) => void;

  setCurrentMessage = (message: string) => (this.currentMessage = message);

  removeMessagesFromConversation: (conversationId: string) => void;

  resetState(): void {
    this._currentUser = undefined;
    this.users = [];
    this.conversations = [];
    this.activeConversationId = undefined;
    this.messages = {};
  }

  clearState(): void {
    this.resetState();
  }
}
