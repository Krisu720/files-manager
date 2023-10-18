import { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prismaSingleton";
import { compare } from "bcrypt";
import { GetServerSidePropsContext } from "next";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      userId: string;
    };
  }

  interface User extends DefaultUser {
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          placeholder: "example@example.com",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const correctPassword = await compare(
          credentials.password,
          user.password
        );
        if (!correctPassword) return null;
        return {
          id: user.id,
          email: user.email,
          userId: user.id,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return { ...session, user: { userId: token.userId } };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          userId: user.userId,
        };
      }
      return token;
    },
  },
};

export const getServerAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return { session };
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
