'use server'
import { redirect } from 'next/navigation'
import TabNav from '@/components/TabNav'
import Custom404 from '@/app/not-found'
import LinksForm from '@/components/dashboard/links/LinksForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function LinksTab({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/')
    if (!session.user?.bios.includes(params.username)) return <Custom404 />
    const links = await db.link.findMany({
        where: { bioId: params.username },
    })
    console.log(links)
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'links'} />
            <LinksForm username={params.username} links={links} />
        </div>
    )
}
