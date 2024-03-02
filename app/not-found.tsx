import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Loading } from '@/components/Loading'

export const metadata: Metadata = {
    title: '404',
}

export default function Custom404() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-[calc(100dvh-65px)] py-20 flex items-center justify-center flex-col">
                <p className="font-bold text-4xl text-center">
                    404 - Page Not Found
                </p>
                <Button className="mt-6" type="submit" asChild>
                    <Link href="/" className="w-1/2">
                        Go Home
                    </Link>
                </Button>
            </div>
        </Suspense>
    )
}
