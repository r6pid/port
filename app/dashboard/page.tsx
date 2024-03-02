'use client'
import CreateNewButton from '@/components/CreateNew'
import BioLinks from '@/components/Bios'
import { Loading } from '@/components/Loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    if (status === 'loading') return <Loading />
    if (!session) {
        router.push('/')
        return null
    }

    return (
        <div className="min-h-[calc(100dvh-65px)] py-20">
            <CreateNewButton />
            <BioLinks userId={session.user?.id!} />
        </div>
    )
}
