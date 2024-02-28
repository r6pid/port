import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'
import CreateNewButton from '../../components/CreateNew'
import { db } from '../../lib/db'

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }
    const { bio } = await db.user.findUnique({
        where: { email: session.user.email },
        include: { bio: true },
    })
    console.log(bio)
    return (
        <div className="min-h-[calc(100dvh-65px)] py-20">
            <CreateNewButton />
            {bio.length > 0 || !bio ? (
                <p>you have a biolink</p>
            ) : (
                <p>Get started by creating a new biolink</p>
            )}
        </div>
    )
}
