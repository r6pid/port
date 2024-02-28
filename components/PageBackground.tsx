'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader, Router, Upload, X } from 'lucide-react'
import { UploadButton } from '../lib/utils'

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
    const deleteBackground = () => {
        if (backgroundDeleteLoading) return
        setBackgroundDeleteLoading(true)
        setTimeout(() => {
            setBackgroundDeleteLoading(false)
        }, 1000)
    }
    return (
        <>
            {backgroundURL ? (
                <div className="w-full h-[160px] relative">
                    <Image
                        fill
                        src={backgroundURL}
                        className="rounded-lg pointer-events-none select-none"
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
                            height: '160px',
                        },
                        button: { width: '100%', height: '100%' },
                        allowedContent: { display: 'none' },
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        console.log('Files: ', res)
                        setBackgroundURL(res[0].url)
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`)
                    }}
                />
            )}
        </>
    )
}
