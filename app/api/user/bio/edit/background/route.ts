import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { UTApi } from 'uploadthing/server'

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions)
    try {
        const body = await req.json()
        const { backgroundURL, username } = body
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

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    try {
        const body = await request.json()
        const { backgroundURL, username } = body
        const newURL = backgroundURL.substring(
            backgroundURL.lastIndexOf('/') + 1
        )
        const utapi = new UTApi()
        await utapi.deleteFiles(newURL)
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
                updatedAt: new Date(),
                background: null,
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
