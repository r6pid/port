import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'username',
                    placeholder: 'john@mail.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }
                const existingUser = await db.user.findUnique({
                    where: { username: credentials?.username },
                })
                if (!existingUser) {
                    throw new Error('User not found')
                }
                if (existingUser.password) {
                    const passwordMatch = await compare(
                        credentials.password,
                        existingUser.password
                    )
                    if (!passwordMatch) {
                        throw new Error('Incorrect password')
                    }
                }
                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                    email: existingUser.email,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                },
            }
        },
    },
}
