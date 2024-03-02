import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const FormSchema = z.object({
    new_username: z
        .string()
        .min(3, 'Username must be more than 3 chars')
        .max(10, 'Username must be less than 10 chars'),
    old_username: z.string(),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const result = FormSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.error,
                },
                { status: 400 }
            )
        }
        const { new_username, old_username } = result.data
        if (!session || !session.user?.bios.includes(old_username)) {
            return NextResponse.json(
                {
                    message: 'Unathorized',
                },
                { status: 401 }
            )
        }
        const existingBio = await db.bio.findUnique({
            where: { id: new_username },
        })
        if (existingBio) {
            return NextResponse.json(
                {
                    message: 'Username already exists',
                },
                { status: 409 }
            )
        }
        await db.user.update({
            where: { id: session.user?.id },
            data: {
                bio: {
                    update: {
                        where: {
                            id: old_username,
                        },
                        data: {
                            id: new_username,
                        },
                    },
                },
            },
        })
        return NextResponse.json(
            {
                new_username: new_username,
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
