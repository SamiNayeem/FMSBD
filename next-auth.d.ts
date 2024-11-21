import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number; // Use number for integer user IDs
      FirstName?: string;
      LastName?: string;
      email?: string;
      role?: string; // Custom role field
    };
  }

  interface User {
    id: number;
    role: string;
  }
}
