import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }
    return (
        <div className="min-h-[calc(100dvh-65px)] py-20">
            <h1>Dashboard</h1>
        </div>
    )
}
