'use client'
import { useRouter } from 'next/navigation'
import TabNav from '@/components/TabNav'
import ProfileWrapper from '@/components/dashboard/profile/ProfileWrapper'
import { Loading } from '@/components/Loading'
import { useSession } from 'next-auth/react'
import Custom404 from '@/app/not-found'
import { useQuery } from '@tanstack/react-query'

export default function ProfileTab({
    params,
}: {
    params: { username: string }
}) {
    const { data: session, status } = useSession()
    const router = useRouter()
    if (status === 'loading') return <Loading />
    if (!session) {
        router.push('/')
        return null
    }
    if (!session.user?.bios.includes(params.username)) return <Custom404 />
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'profile'} />
            <ProfileWrapper username={params.username} />
        </div>
    )
}
