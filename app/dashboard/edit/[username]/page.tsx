import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { db } from '../../../../lib/db'

export default async function DashboardPage({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return redirect('/login')
    }
    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { bio: true },
    })
    if (!user || !user.bio.some((bio) => bio.id === params.username)) {
        return redirect('/dashboard')
    }
    return redirect(`/dashboard/edit/${params.username}/profile`)
}
