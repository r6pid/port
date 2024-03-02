'use server'
import { redirect, useRouter } from 'next/navigation'
import TabNav from '@/components/TabNav'
import { Loading } from '@/components/Loading'
import { useSession } from 'next-auth/react'
import Custom404 from '@/app/not-found'
import { useQuery } from '@tanstack/react-query'
import ProfileForm from '@/components/dashboard/profile/ProfileForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Bio } from '@prisma/client'

export default async function ProfileTab({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/')
    if (!session.user?.bios.includes(params.username)) return <Custom404 />
    const bio = await db.bio.findUnique({
        where: { id: params.username },
    })
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'profile'} />
            <ProfileForm username={params.username} bio={bio as Bio} />
        </div>
    )
}
