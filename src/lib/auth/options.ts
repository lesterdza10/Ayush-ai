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
      if (user && account && user.email) {
        try {
          console.log('JWT callback - attempting to save user to MongoDB');
          console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
          
          const storedUser = await upsertUser({
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });

          if (storedUser._id) {
            token.userId = storedUser._id.toString();
            console.log('JWT callback - userId set:', token.userId);
          }
        } catch (error) {
          console.error('JWT callback - MongoDB error:', error);
          console.error('Error details:', error instanceof Error ? error.message : error);
          // Don't throw - allow login to continue without userId
        }
      } else if (!token.userId && token.email) {
        try {
          const existingUser = await getUserByEmail(token.email);
          if (existingUser?._id) {
            token.userId = existingUser._id.toString();
          }
        } catch (error) {
          console.error('JWT callback - getUserByEmail error:', error);
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
