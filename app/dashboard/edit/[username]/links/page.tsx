'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { redirect } from 'next/navigation'
import { db } from '../../../../../lib/db'
import TabNav from '../../../../../components/TabNav'
import { Loading } from '../../../../../components/Loading'
import { Suspense } from 'react'
import LinksForm from '../../../../../components/dashboard/LinksForm'

export default async function LinksTab({
    params,
}: {
    params: { username: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'links'} />
            <Suspense fallback={<Loading />}>
                <LinksForm username={params.username} />
            </Suspense>
        </div>
    )
}
