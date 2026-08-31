import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { login, loginWithGoogle } from "@/services/auth";

function getFieldFromToken(token: string, field: string): any {
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return field ? json[field] : json;
  } catch {
    return undefined;
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response && response.token) {
            const tokenPayload = getFieldFromToken(response.token, "") || {};
            const role = response.user?.role
              ?? tokenPayload.role ?? tokenPayload.user_role ?? tokenPayload.roles?.[0] ?? tokenPayload.user?.role;
            const onboardingCompleted = response.user?.onboardingCompleted
              ?? tokenPayload.onboardingCompleted ?? tokenPayload.onboarding_completed ?? false;

            return {
              id: response.user?.id || "1",
              name: response.user?.name || credentials.email.split("@")[0],
              email: credentials.email,
              role,
              token: response.token,
              onboardingCompleted,
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.message || "Credenciais inválidas.");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account?.provider === "google" && !token.accessToken) {
        const response = await loginWithGoogle({
          idToken: account.id_token ?? '',
        });

        if (response?.token) {
          const tokenPayload = getFieldFromToken(response.token, "") || {};
          token.id = response.user?.id ?? tokenPayload.sub;
          token.role = response.user?.role
            ?? tokenPayload.role ?? tokenPayload.user_role ?? tokenPayload.roles?.[0] ?? tokenPayload.user?.role;
          token.accessToken = response.token;
          token.onboardingCompleted = response.user?.onboardingCompleted
            ?? tokenPayload.onboardingCompleted ?? tokenPayload.onboarding_completed ?? false;
        }
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      if (trigger === "update" && session?.onboardingCompleted !== undefined) {
        token.onboardingCompleted = session.onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    }
  }
};
