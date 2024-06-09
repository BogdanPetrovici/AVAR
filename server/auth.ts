import NextAuth from 'next-auth';
import Cognito from 'next-auth/providers/cognito';
import type { Provider } from 'next-auth/providers';
import { authConfig } from './auth.config';

const providers: Provider[] = [Cognito];
export const providerMap = [{ id: 'cognito', name: 'Cognito' }];
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: providers,
});
