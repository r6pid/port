import { db } from '../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            {
                message: 'Unauthorized',
            },
            { status: 401 }
        )
    }
    const bio = await db.bio.findUnique({ where: { id: params.id } })
    if (!bio) {
        return NextResponse.json(
            {
                message: 'Not found',
            },
            { status: 404 }
        )
    }
    return NextResponse.json(
        {
            bio: bio,
            message: 'Success',
        },
        { status: 200 }
    )
}
