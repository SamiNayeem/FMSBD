import NextAuth, { SessionStrategy } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const user = await prisma.users.findUnique({
          where: { Email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.Password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.Id,
          email: user.Email,
          role: user.Role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Use JWT for session handling
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: true, // Enable debug mode for troubleshooting
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
