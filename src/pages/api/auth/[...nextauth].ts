import NextAuth, { getServerSession, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {

      const { email, name, image } = user;

      await dbConnect();

      try {
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          existingUser = await User.create({
            name,
            email,
            image,
          });
          console.log(
            `New user created: ${existingUser.name} (${existingUser.email})`
          );
        } else {
          await existingUser.save();
          console.log(
            `User updated: ${existingUser.name} (${existingUser.email})`
          );
        }
        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false; // Return false if there's an error
      }
    },
    async redirect() {
      return "/dash";
    },
    async session({ session }: any) {
      if (typeof session.user?.email === "undefined") {
        return session;
      }
      await dbConnect();
      const existingUser = await User.findOne({
        email: session.user?.email,
      });
      if (existingUser) {
        session.user.oid = existingUser._id;
      }
      return session;
    },
    async jwt({ token }: any) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export async function getAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  const session: Session | null = await getServerSession(
    req,
    res,
    authOptions as any
  );
  return session;
}
export default NextAuth(authOptions as any);
