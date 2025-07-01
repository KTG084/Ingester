import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as z from "zod";
import { prisma } from "./db/prisma";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";


const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },

      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid input");
        }

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("No user found");
        }

        if (
          !user.password ||
          !(await bcrypt.compare(password, user.password))
        ) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
