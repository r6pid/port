'use client'

import Navbar from '@/components/Navbar'

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="mx-auto md:max-w-screen-md px-6">
                <div className="min-h-[calc(100dvh-65px)] py-20">
                    <p>welcome to port</p>
                    <p>a proper homepage is coming soon</p>
                </div>
            </main>
        </>
    )
}
