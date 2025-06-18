// @ts-expect-error: Extending next-auth types
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: 'ADMIN' | 'MODERATOR' | 'USER';
    } & DefaultSession['user'];
  }

  interface User {
    userType: 'ADMIN' | 'MODERATOR' | 'USER';
  }
}
