'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader, Router, Upload, X } from 'lucide-react'
import { UploadButton } from '../lib/utils'
import { toast } from 'sonner'

export default function PageAvatar({
    username,
    defaultURL = '/defav.png',
}: {
    username: string
    defaultURL?: string
}) {
    const [avatarURL, setAvatarURL] = useState<string | null>(defaultURL)
    const [avatarDeleteLoading, setAvatarDeleteLoading] = useState(false)
    const deleteAvatar = () => {
        if (avatarDeleteLoading) return
        setAvatarDeleteLoading(true)
        setTimeout(() => {
            setAvatarDeleteLoading(false)
        }, 1000)
        console.log('delete avatar')
    }
    console.log('avatarURL: ', avatarURL)
    const uploadAvatar = async (URL: string) => {
        try {
            setAvatarDeleteLoading(true)
            const response = await fetch('/api/user/bio/edit/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    avatarURL: URL,
                }),
            })
            const responseJson = await response.json()
            if (response.ok) {
                toast.success('Avatar Saved!')
            } else {
                toast.error('Something went wrong')
                console.error(responseJson.message)
            }
        } catch (error) {
            console.error('Error checking username:', error)
        } finally {
            setAvatarDeleteLoading(true)
        }
    }
    return (
        <>
            {avatarURL ? (
                <div className="w-full h-[160px] relative">
                    {avatarURL}
                    <Image
                        src={avatarURL}
                        fill
                        className="rounded-lg pointer-events-none select-none"
                        alt="Avatar Image"
                    />
                    <div
                        className="bg-[#414141] flex p-1 absolute cursor-pointer z-20 rounded-sm right-[-6px] top-[-6px]"
                        onClick={() => deleteAvatar()}
                    >
                        {avatarDeleteLoading ? (
                            <Loader className="w-3.5 h-3.5 animate-spin pointer-events-none select-none" />
                        ) : (
                            <X className="w-3.5 h-3.5" />
                        )}
                    </div>
                </div>
            ) : (
                <UploadButton
                    appearance={{
                        container: {
                            width: '100%',
                            height: '160px',
                        },
                        button: { width: '100%', height: '100%' },
                        allowedContent: { display: 'none' },
                    }}
                    content={{}}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        setAvatarURL(res[0].url)
                        uploadAvatar(res[0].url)
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`)
                    }}
                />
            )}
        </>
    )
}
