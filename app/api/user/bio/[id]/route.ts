import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    response: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const bio = await db.bio.findUnique({
        where: { id: id },
    })
    return NextResponse.json({ bio }, { status: 200 })
}
