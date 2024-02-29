'use server'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'

export default async function Home() {
    const session = await getServerSession(authOptions)
    return (
        <div className="min-h-[calc(100dvh-65px)] py-20">
            <p>welcome to port</p>
            <p>a proper homepage is coming soon</p>
            <div className="flex items-center flex-row mt-6 gap-3">
                {session ? (
                    <Link
                        href="/dashboard"
                        className="underline transition-all hover:text-neutral-400"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="underline transition-all hover:text-neutral-400"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="underline transition-all hover:text-neutral-400"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
