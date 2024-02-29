'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader, Router, Upload, X } from 'lucide-react'
import { UploadButton } from '../lib/utils'
import { toast } from 'sonner'

export default function PageBackground({
    username,
    defaultURL = '/background.png',
}: {
    username: string
    defaultURL?: string
}) {
    const [backgroundURL, setBackgroundURL] = useState<string | null>(
        defaultURL
    )
    const [backgroundDeleteLoading, setBackgroundDeleteLoading] =
        useState(false)
    const deleteBackground = async () => {
        if (backgroundDeleteLoading) return
        try {
            setBackgroundDeleteLoading(true)
            const response = await fetch('/api/user/bio/edit/background', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    backgroundURL: backgroundURL,
                }),
            })
            const responseJson = await response.json()
            if (!response.ok) {
                toast.error('Something went wrong')
                console.error(responseJson.message)
            } else {
                toast.success('Avatar Deleted')
                setBackgroundURL(null)
            }
        } catch (error) {
            console.error('Error checking username:', error)
        } finally {
            setBackgroundDeleteLoading(false)
        }
    }
    const uploadBackground = async (URL: string) => {
        try {
            setBackgroundDeleteLoading(true)
            const response = await fetch('/api/user/bio/edit/background', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    backgroundURL: URL,
                }),
            })
            const responseJson = await response.json()
            if (response.ok) {
                toast.success('Background Uploaded')
            } else {
                toast.error('Something went wrong')
                console.error(responseJson.message)
            }
        } catch (error) {
            console.error('Error checking username:', error)
        } finally {
            setBackgroundDeleteLoading(false)
        }
    }
    return (
        <>
            {backgroundURL ? (
                <div className="w-full h-[170px] relative">
                    <Image
                        fill
                        src={backgroundURL}
                        className="rounded-lg pointer-events-none select-none border object-cover"
                        alt="Background Image"
                    />
                    <div
                        className="bg-[#414141] flex p-1 absolute cursor-pointer z-20 rounded-sm right-[-6px] top-[-6px]"
                        onClick={() => deleteBackground()}
                    >
                        {backgroundDeleteLoading ? (
                            <Loader className="w-3.5 h-3.5 animate-spin  pointer-events-none select-non" />
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
                            height: '170px',
                        },
                        button: { width: '100%', height: '100%' },
                        allowedContent: { display: 'none' },
                    }}
                    endpoint="imageUploader"
                    onBeforeUploadBegin={(files) => {
                        // Preprocess files before uploading (e.g. rename them)
                        return files.map((f) => {
                            const renamedFile = new File(
                                [f],
                                `background-${username}.${f.name.split('.').pop()}`,
                                {
                                    type: f.type,
                                }
                            )
                            return renamedFile
                        })
                    }}
                    onClientUploadComplete={(res) => {
                        setBackgroundURL(res[0].url)
                        uploadBackground(res[0].url)
                    }}
                    onUploadError={(error: Error) => {
                        toast.error(JSON.stringify(error))
                        console.log(JSON.stringify(error))
                    }}
                />
            )}
        </>
    )
}
