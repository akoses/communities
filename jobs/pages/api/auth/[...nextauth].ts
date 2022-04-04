import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../prisma';
import {Session} from 'next-auth'


interface sessionWithId extends Session {
	id: string
}

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
  ],
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