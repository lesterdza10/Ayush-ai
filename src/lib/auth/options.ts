import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getUserByEmail, upsertUser } from '@/lib/models/services';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing Google OAuth environment variables');
}

if (!nextAuthSecret) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account && user.email) {
        const storedUser = await upsertUser({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });

        if (storedUser._id) {
          token.userId = storedUser._id.toString();
        }
      } else if (!token.userId && token.email) {
        const existingUser = await getUserByEmail(token.email);
        if (existingUser?._id) {
          token.userId = existingUser._id.toString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }

      return session;
    },
  },
  secret: nextAuthSecret,
};
