import { querySQL } from "@coin-view/api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
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
        }>;

        if (credentials?.password === found?.Ua_Password) {
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

export default NextAuth({
  ...authOptions,
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
  },
});
