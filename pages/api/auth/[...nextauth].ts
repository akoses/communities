import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../prisma';


  

export default NextAuth({
  providers: [

    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || ''
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || ''
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID || '',
      clientSecret: process.env.LINKEDIN_SECRET || ''
    })
  ],
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    }
  },
  adapter: PrismaAdapter(prisma),
  callbacks:{
	  session: async ({ session}) => {
      if (session?.user) {
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email || '',
			}
		})
		//@ts-ignore
        session.user.id = user?.id;
      }
      return session;
  }
}
})