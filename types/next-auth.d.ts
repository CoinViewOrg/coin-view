import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      cryptoalerts: number;
      newsletters: number;
      productupdate: number;
    } & DefaultSession["user"];
  }
}
