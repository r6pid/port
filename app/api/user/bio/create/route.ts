import { db } from '../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'
import { usernameSchema } from '@/schemas'

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        if (!session) {
            return NextResponse.json(
                {
                    message: 'Unathorized',
                },
                { status: 401 }
            )
        }
        const body = await req.json()
        const result = usernameSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                {
                    message: 'Invalid username',
                },
                { status: 400 }
            )
        }
        const { username } = result.data
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
        await db.user.update({
            where: { id: session.user?.id },
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
                message: 'Success',
            },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Something went wrong',
            },
            { status: 500 }
        )
    }
}
