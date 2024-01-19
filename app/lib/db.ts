import { openDB } from 'idb';
import { ChatDBSchema, UserModel } from '~/types/db';
import { createUser } from './user';
import { SENT_COLOR } from '~/config';

function initDB() {
  return openDB<ChatDBSchema>('chat-db', 1, {
    upgrade(db) {
      db.createObjectStore('current_user', {
        keyPath: 'id',
      });

      const contactStore = db.createObjectStore('contacts', {
        keyPath: 'id',
      });
      contactStore.createIndex('by_username', 'username');

      const conversationStore = db.createObjectStore('conversations', {
        keyPath: 'id',
      });
      conversationStore.createIndex('by_timestamp', 'timestamp');
    },
  });
}

export async function authenticate(username: string) {
  let activeUser = await getCurrentUser();

  if (!activeUser) activeUser = createUser(username, SENT_COLOR);
  else if (activeUser.username !== username) {
    throw new Error('invalid session found');
  }
}

export async function getCurrentUser() {
  const db = await initDB();

  const users = await db.getAll('current_user');

  if (users.length === 0 || users.length > 1) {
    console.warn('Multiple current users found, resetting...');
    await db.clear('current_user');
    return null;
  }

  const [currentUser] = users;

  return currentUser;
}

export async function getUserById(userId: string) {
  const db = await initDB();

  const user = await db.get('contacts', userId);

  return user || null;
}

export async function addUser(newUser: UserModel) {
  const db = await initDB();

  await db.add('contacts', newUser);

  return true;
}

export async function removeUser(userId: string) {
  const db = await initDB();

  await db.delete('contacts', userId);

  return true;
}
