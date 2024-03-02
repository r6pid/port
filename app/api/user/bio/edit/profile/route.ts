import { db } from '../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'
import { z } from 'zod'

const FormSchema = z.object({
    username: z.string(),
    display_name: z
        .string()
        .max(36, 'Display name  must be less than 36 chars')
        .optional(),
    bio: z.string().max(255, 'Bio must be less than 255 chars').optional(),
})

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const result = FormSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                {
                    message: 'Invalid data',
                },
                { status: 400 }
            )
        }
        const { username, display_name, bio } = result.data
        if (!session || !session.user?.bios.includes(username)) {
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
                updatedAt: new Date(),
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
