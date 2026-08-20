import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth";

function getRoleFromToken(token: string): string | undefined {
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return json.role ?? json.user_role ?? json.roles?.[0] ?? json.user?.role;
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
            return {
              id: response.user?.id || "1",
              name: response.user?.name || credentials.email.split("@")[0],
              email: credentials.email,
              role: response.user?.role || getRoleFromToken(response.token),
              token: response.token,
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.message || "Credenciais inválidas.");
        }
      }
    })
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  }
};
