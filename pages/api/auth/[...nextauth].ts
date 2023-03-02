import {
  getExistingSSOUser,
  getExistingUser,
  getUserById,
  querySQL,
  registerSSOUser,
} from "@coin-view/api";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Please provide google auth credentials!");
}

export const authOptions = {
  callbacks: {
    jwt: async ({ token, user }: any) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const sql = `select Ua_Id, Ua_login, Ua_Email, Ua_Password from UsrAccount where Ua_login = '${credentials?.username}'`;

        const [found] = (await querySQL(sql)) as Array<{
          Ua_Password: string;
          Ua_Id: string;
          Ua_Email: string;
          Ua_login: string;
          CryptoAlerts: number;
          Newsletters: number;
          ProductUpdate: number;
        }>;

        const match = await bcrypt.compare(
          credentials?.password,
          found?.Ua_Password
        );

        if (match) {
          // Any object returned will be saved in `user` property of the JWT

          return {
            id: String(found.Ua_Id),
            name: found.Ua_login,
            email: found.Ua_Email,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
};

const createOptions = (req: NextApiRequest): NextAuthOptions => ({
  ...authOptions,
  callbacks: {
    jwt: async ({ token, user }) => {
      if ((!user || req.url === "/api/auth/session?update") && token.sub) {
        const updatedUser = await getUserById(token.sub);
        if (!updatedUser) {
          return token;
        }
        const user = {
          id: updatedUser.Ua_Id,
          name: updatedUser.Ua_login,
          email: updatedUser.Ua_Email,
          cryptoalerts: updatedUser.CryptoAlerts,
          newsletters: updatedUser.Newsletters,
          productupdate: updatedUser.ProductUpdate,
        };

        token = {
          ...token,
          ...user,
          user,
        };
      } else {
        user && (token.user = user);
      }

      return token;
    },
    session: async ({ session, token }) => {
      console.log({ session, token });
      session.user = token.user as any;
      return session;
    },
    signIn: async ({ account, profile }: any) => {
      console.log({ account, profile });
      if (account.provider === "google") {
        const id = profile.sub;
        const existingSSOUser = await getUserById(id);

        if (existingSSOUser) {
          return true;
        }

        const existing = await getExistingSSOUser(profile.email);
        if (existing.length) {
          return "/login?error=1";
        }

        await registerSSOUser(
          id,
          profile.name,
          profile.email,
          account.access_token
        );
      }
      return true;
    },
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, createOptions(req));
};
