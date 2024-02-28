import { db } from '../../../../../../lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'
import { UTApi } from 'uploadthing/server'

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { avatarURL, username } = body
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
                avatar: avatarURL,
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

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    try {
        const body = await request.json()
        const { avatarURL, username } = body
        const newURL = avatarURL.substring(avatarURL.lastIndexOf('/') + 1)
        const utapi = new UTApi()
        await utapi.deleteFiles(newURL)
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
                avatar: null,
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
