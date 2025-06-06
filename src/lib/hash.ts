import { hash } from 'bcryptjs';

export async function hashPassword(password: string) {
  const hashed = await hash(password, 12);
  return hashed;
}
