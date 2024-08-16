import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongo";

export default NextAuth({
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
    async signIn({ user, account }) {
      if (!account) {
        console.log('---no account')
        return false;
      }

      const { email, name, image } = user;
      const { providerAccountId, provider } = account;

      await dbConnect();

      try {
        let existingUser  = await User.findOne({ email, provider });

        if (!existingUser) {
          existingUser = await User.create({
            name,
            email,
            image,
            providerId: providerAccountId,
            provider,
          });
          console.log(
            `New user created: ${existingUser.name} (${existingUser.email}, ${existingUser.provider})`
          );
        } else {
          existingUser.providerId = providerAccountId;
          await existingUser.save();
          console.log(
            `User updated: ${existingUser.name} (${existingUser.email}, ${existingUser.provider})`
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
    async session({ session }) {
      await dbConnect();
      const existingUser = await User.findOne({
        email: session.user?.email,
        provider: session.user?.provider,
      });
      if (existingUser) {
        session.user.id = existingUser._id;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId; // Google or GitHub user ID
      }
      return token;
    },
  },
});
