'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import TabNav from '@/components/TabNav'
import SettingsForm from '@/components/dashboard/settings/SettingsForm'
import Custom404 from '@/app/not-found'

export default async function AccountTab({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/')
    if (!session.user?.bios.includes(params.username)) return <Custom404 />
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'settings'} />
            <SettingsForm username={params.username} />
        </div>
    )
}
