import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { dbUsers } from '../../../database';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'nhan@gmail.com' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '123456',
        },
      },
      async authorize(credentials) {
        // console.log('Credentials', { credentials });
        const user = await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
        return user;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // ...add more providers here
  ],
  //   adapter: MongoDBAdapter(clientPromise),

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  jwt: {},
  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user?.name || ''
            );
            break;
          case 'credentials':
            token.user = user;
            break;
          default:
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
};
export default NextAuth(authOptions);
