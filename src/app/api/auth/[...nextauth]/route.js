import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
const handler = NextAuth ({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks:{
    async session({session, token}){
      session.user.username = session.user.name.split(" ").join('').toLocaleLowerCase();
      session.user.uid = token.sub;
      return session;
    }
  }
});
export { handler as GET, handler as POST };