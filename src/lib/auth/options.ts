import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getUserByEmail, upsertUser } from '@/lib/models/services';

const googleClientId = process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'placeholder-client-secret';
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'placeholder-secret';

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
      // Skip database operations during build time
      if (typeof window === 'undefined' && !process.env.MONGODB_URI) {
        return token;
      }

      try {
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
      } catch (error) {
        console.error('JWT callback error:', error);
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
