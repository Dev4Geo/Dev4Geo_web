import { mongo } from "mongoose";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      oid: mongoose.Types.ObjectId;
    } & DefaultSession["user"];
  }
}
