import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    response: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const bios = await db.bio.findMany({
        where: { userId: id },
    })
    return NextResponse.json({ bios }, { status: 200 })
}
