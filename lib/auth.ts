// ==============================================================================
// File: lib/auth.ts
// ==============================================================================
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
// import your database connection and user model

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // أضف providers أخرى حسب الحاجة
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        // يمكنك إضافة معلومات إضافية للجلسة هنا
      }
      return session
    },
    async jwt({ user, token }) {
      return token
    },
  },
}
