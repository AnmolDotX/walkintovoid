// @ts-expect-error: Extending next-auth types
import type { DefaultSession } from 'next-auth';

type UserRole = 'ADMIN' | 'MODERATOR' | 'USER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: UserRole
    } & DefaultSession['user'];
  }

  interface User {
    userType: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    userType: UserRole;
  }
}
