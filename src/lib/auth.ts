// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/db';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Adapter, AdapterUser } from 'next-auth/adapters';

const adminEmail = process.env.ADMIN_EMAIL;

const CustomPrismaAdapter = (p: PrismaClient): Adapter => {
  return {
    ...PrismaAdapter(p),
    // Override the createUser method
    createUser: async (data: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
      // If the user's email matches the admin email, assign the ADMIN role upon creation
      if (data.email === adminEmail) {
        data.userType = 'ADMIN';
      }
      const user = await p.user.create({ data });
      return user as any;
    },
  };
};

export const authOptions: NextAuthOptions = {
  // Use our custom adapter here
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('This email is not registered with a password. Try signing in with Google.');
        }

        if (!user.emailVerified) {
          throw new Error('Your email is not verified. Please complete the sign-up process.');
        }

        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          throw new Error('Invalid password.');
        }

        return user;
      },
    }),
  ],
  callbacks: {

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string; 
        session.user.userType = token.userType as 'ADMIN' | 'MODERATOR' | 'USER';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    error: '/error',
  },
};