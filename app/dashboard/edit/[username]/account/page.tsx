'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { redirect } from 'next/navigation'
import { db } from '../../../../../lib/db'
import { Loader } from 'lucide-react'
import TabNav from '../../../../../components/TabNav'
import { Loading } from '../../../../../components/Loading'
import { Suspense } from 'react'
import AccountForm from '../../../../../components/dashboard/AccountForm'

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
            <TabNav username={params.username} activeTab={'account'} />
            <Suspense fallback={<Loading />}>
                <AccountForm username={params.username} />
            </Suspense>
        </div>
    )
}
