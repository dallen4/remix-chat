import { adventurer } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { User } from '~/types/core';

export function createUser(username: string, color: string): User {
  const userId = crypto.randomUUID();

  const avatar = createAvatar(adventurer, {
    seed: username,
    size: 55,
    backgroundColor: [color],
    radius: 50,
  }).toDataUriSync();

  return {
    id: userId,
    username,
    avatar,
  };
}
