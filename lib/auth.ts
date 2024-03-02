import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from './db'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            name: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
            checks: ['none'],
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id
            }
            return token
        },
        async session({ session, token }) {
            const bios = await db.bio.findMany({
                where: { userId: token?.sub },
            })
            session = {
                ...session,
                user: {
                    ...session.user,
                    id: token?.sub || '',
                    bios: bios.map((bio) => bio.id),
                },
            }
            return session
        },
    },
}
