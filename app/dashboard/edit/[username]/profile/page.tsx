'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { redirect } from 'next/navigation'
import { db } from '../../../../../lib/db'
import { Loader } from 'lucide-react'
import TabNav from '../../../../../components/TabNav'
import ProfileForm from '../../../../../components/ProfileForm'
import { Loading } from '../../../../../components/Loading'
import { Suspense } from 'react'

export default async function ProfileTab({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }
    const user = session.user.email
        ? await db.user.findUnique({
              where: { email: session.user.email },
              include: { bio: true },
          })
        : null
    const bio = user?.bio.find((b) => b.id === params.username)

    if (!bio || bio.userId !== user?.id || !user || !session) {
        redirect('/dashboard')
    }
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'profile'} />
            <Suspense fallback={<Loading />}>
                <ProfileForm username={params.username} bio={bio} />
            </Suspense>
        </div>
    )
}
