import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      accessToken?: string;
      onboardingCompleted?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
    token?: string;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    onboardingCompleted?: boolean;
  }
}