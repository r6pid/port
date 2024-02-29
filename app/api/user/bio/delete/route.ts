import { db } from '../../../../../lib/db'
import { NextResponse } from 'next/server'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'

export async function DELETE(req: Request, res: Response) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }
        const { id } = await req.json()
        const user = await db.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                bio: {
                    delete: {
                        id: id,
                    },
                },
            },
        })
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            {
                user: user,
                message: 'User deleted successfully',
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
