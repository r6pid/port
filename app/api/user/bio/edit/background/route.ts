import { db } from '../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'
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
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { backgroundURL, username } = body
        if (!session || !session.user.email) {
            return NextResponse.json(
                {
                    message: 'Unathorized',
                },
                { status: 401 }
            )
        }
        const bio = await db.bio.update({
            where: { id: username },
            data: {
                background: backgroundURL,
            },
        })
        if (!bio) {
            return NextResponse.json(
                {
                    message: 'Something went wrong',
                },
                { status: 500 }
            )
        }
        return NextResponse.json(
            {
                bio: bio,
                message: 'Success',
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
