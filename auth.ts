import NextAuth from 'next-auth';
import Cognito from 'next-auth/providers/cognito';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { authConfig } from './auth.config';

const providers: Provider[] = [Cognito];
export const providerMap = [{ id: 'cognito', name: 'Cognito' }];

if (process.env.NODE_ENV === 'development') {
  providers.push(
    Credentials({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, request) => {
        if (credentials.password === 'password') {
          return {
            email: 'bob@alice.com',
            name: 'Bob Alice',
            image: 'https://avatars.githubusercontent.com/u/67470890?s=200&v=4',
          };
        }

        return null;
      },
    }),
  );
  providerMap.push({ id: 'credentials', name: 'Credentials' });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: providers,
});
