'use client'
import { redirect } from 'next/navigation'
import { Loader } from 'lucide-react'
import TabNav from '../../../../../components/TabNav'
import ProfileForm from '../../../../../components/forms/ProfileForm'
import { Loading } from '../../../../../components/Loading'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BioData {
    id: string
    createdAt: Date
    updatedAt: Date
    displayName: string | null
    bio: string | null
    verified: boolean | null
    rareUsername: boolean
    avatar: string | null
    background: string | null
    userId: string
}

export default function ProfileTab({
    params,
}: {
    params: { username: string }
}) {
    const [bio, setBio] = useState<BioData | null>(null)
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        const fetchBio = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `/api/user/bio/edit/profile/${params.username}`
                )
                const responseJSON = await response.json()
                if (!response.ok) {
                    console.error(responseJSON.message)
                    toast.error('Something went wrong')
                    setLoading(false)
                    return
                } else {
                    setBio(responseJSON.bio[0])
                }
            } catch (error) {
                console.error(error)
                toast.error('Something went wrong')
            } finally {
                setLoading(false)
            }
        }
        fetchBio()
    }, [])
    return (
        <div className="min-h-[calc(100dvh-65px)] py-12">
            <TabNav username={params.username} activeTab={'profile'} />
            {isLoading && !bio ? (
                <Loading />
            ) : (
                <ProfileForm username={params.username} bio={bio} />
            )}
        </div>
    )
}
