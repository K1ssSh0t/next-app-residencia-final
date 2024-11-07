import { db } from "@/lib/db";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Provider } from "next-auth/providers";
import { eq } from "drizzle-orm";
import { users } from "@/schema/users";
import { accounts, sessions, verificationTokens } from "@/schema/auth-tables";
import { createId } from "@paralleldrive/cuid2";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Adapter } from "next-auth/adapters";
import { authConfig } from "./auth.config";

const adapter = {
  ...(DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter),
  createUser: async (data: any) => {
    const newUser = {
      id: createId(),
      email: data.email,
      name: data.name,
      image: data.image,
      emailVerified: data.emailVerified,
      role: "user",
    };

    await db.insert(users).values(newUser);
    return newUser;
  },
};

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: { type: "password" },
    },
    authorize: async (credentials) => {
      const email = credentials.email as string;
      const password = credentials.password as string;
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!user) {
        throw new Error("User not found.");
      }
      if (!user.password) {
        throw new Error("Password not found.");
      }
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        throw new Error("Invalid password.");
      }
      return user;
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: adapter,
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
