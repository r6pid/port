import { db } from '../../../../../lib/db'
import { NextResponse } from 'next/server'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '60s'),
})

export type config = {
    runtime: 'edge'
}

// Define a schema for input validation
const userSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be 3+ chars')
        .max(10, 'Username must be less than 10 chars'),
})

export async function POST(req: Request, res: Response) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { limit, reset, remaining } = await ratelimit.limit(ip)
    if (remaining === 0) {
        return NextResponse.json(
            {
                message: 'Slow down!',
            },
            { status: 429 }
        )
    }
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { username } = userSchema.parse(body)
        if (!session || !session.user.email) {
            return NextResponse.json(
                {
                    message: 'Login to make an biolink',
                },
                { status: 401 }
            )
        }
        const existingUserbyUsername = await db.bio.findUnique({
            where: { id: username },
        })
        if (existingUserbyUsername) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'Username already exists',
                },
                { status: 409 }
            )
        }
        const new_username = username.toLowerCase().replaceAll(' ', '_')
        const user = await db.user.update({
            where: { email: session.user.email },
            data: {
                bio: {
                    create: [
                        {
                            id: new_username,
                            displayName: username,
                            bio: 'Welcome to my profile!',
                            verified: false,
                            rareUsername: false,
                            avatar: '/avatar.png',
                            background: '/background.png',
                        },
                    ],
                },
            },
        })
        return NextResponse.json(
            {
                user: user,
                message: 'User created successfully',
            },
            { status: 201 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                message: 'Something went wrong',
            },
            { status: 500 }
        )
    }
}
