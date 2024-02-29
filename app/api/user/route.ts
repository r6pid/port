import { db } from '../../../lib/db'
import { NextResponse } from 'next/server'

import { hash } from 'bcrypt'
import * as z from 'zod'

// Define a schema for input validation
const userSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must have more than 8 characters'),
})

import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '60s'),
})

export type config = {
    runtime: 'edge'
}

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
    try {
        const body = await req.json()
        const { email, username, password } = userSchema.parse(body)

        const existingUserbyUsername = await db.user.findUnique({
            where: { username: username },
        })
        const existingBiobyUsername = await db.bio.findUnique({
            where: { id: username },
        })
        if (existingUserbyUsername || existingBiobyUsername) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'Username already exists',
                },
                { status: 409 }
            )
        }

        // check if email aready exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email },
        })
        if (existingUserByEmail) {
            console.log('email already exists')
            return NextResponse.json(
                {
                    user: null,
                    message: 'Email already exists',
                },
                { status: 409 }
            )
        }
        const hashed_password = await hash(password, 10)
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashed_password,
                bio: {
                    create: {
                        id: username,
                        displayName: username,
                        bio: 'Welcome to my biolink!',
                        verified: false,
                        rareUsername: false,
                        avatar: '/avatar.png',
                        background: '/background.png',
                    },
                },
            },
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json(
            {
                user: rest,
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
