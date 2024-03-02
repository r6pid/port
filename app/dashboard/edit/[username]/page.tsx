'use client'

import { Loading } from '@/components/Loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default async function DashboardPage({
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
    } else router.push(`/dashboard/edit/${params.username}/profile`)
}
