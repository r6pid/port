import { db } from '../../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../../lib/auth'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.email) {
        return NextResponse.json(
            {
                message: 'Unauthorized',
            },
            { status: 401 }
        )
    }
    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
            bio: true,
        },
    })
    if (!user || !user.bio.some((bio) => bio.id === params.id)) {
        return NextResponse.json(
            {
                message: 'Unauthorized',
            },
            { status: 401 }
        )
    }

    return NextResponse.json(
        {
            bio: user.bio,
            message: 'Success',
        },
        { status: 200 }
    )
}
