// types/next-auth.d.ts
import NextAuth from 'next-auth';

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
