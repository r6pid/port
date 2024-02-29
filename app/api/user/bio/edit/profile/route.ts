import { db } from '../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'
import { z } from 'zod'

const FormSchema = z.object({
    username: z.string(),
    avatar: z.string().optional(),
    display_name: z
        .string()
        .max(36, 'Username must be less than 10 chars')
        .optional(),
    bio: z.string().max(256, 'Bio must be less than 256 chars').optional(),
})

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { username, display_name, bio } = FormSchema.parse(body)
        if (!session || !session.user.email) {
            return NextResponse.json(
                {
                    message: 'Unathorized',
                },
                { status: 401 }
            )
        }
        const biolink = await db.bio.update({
            where: { id: username },
            data: {
                displayName: display_name,
                bio: bio,
            },
        })
        if (!biolink) {
            return NextResponse.json(
                {
                    message: 'Something went wrong',
                },
                { status: 500 }
            )
        }
        return NextResponse.json(
            {
                bio: biolink,
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
