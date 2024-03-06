import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { Link } from '@prisma/client'

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { links, username } = body
        if (!session) {
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
                links: {
                    deleteMany: {},
                    createMany: {
                        data: links.map((link: Link) => ({
                            id: link.id,
                            title: link.title,
                            url: link.url,
                        })),
                    },
                },
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
