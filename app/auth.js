import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import { User } from "./lib/models";
import bcrypt from "bcrypt";

// Function to handle login and check user credentials
const login = async (credentials) => {
  try {
    await connectToDB();  // Ensure connection is awaited
    const user = await User.findOne({ username: credentials.username });

    if (!user || !user.isAdmin) throw new Error("Wrong credentials!");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong credentials!");

    return user;
  } catch (err) {
    console.error("Login failed:", err);  // Improved error logging
    throw new Error("Failed to login!");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;  // Return the user on successful login
        } catch (err) {
          console.error("Authorization failed:", err);  // Improved error handling
          return null;  // Return null on failure, signaling authentication failure
        }
      },
    }),
  ],
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    // JWT callback to store additional user data in token
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.img = user.img;
      }
      return token;
    },
    // Session callback to pass token data to session
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};  // Ensure session.user exists
        session.user.username = token.username;
        session.user.img = token.img;
      }
      return session;
    },
  },
});
