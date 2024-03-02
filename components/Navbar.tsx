'use client'

import Link from 'next/link'
import { useSession, signOut, getSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { Montserrat } from 'next/font/google'
import { cn } from '../lib/utils'

const montserrat = Montserrat({ weight: '900', subsets: ['latin'] })

const Navbar = () => {
    const { data: session, status } = useSession()
    return (
        <nav className="sticky top-0 z-50 inset-x-0">
            <div className="border-b bg-neutral-900 w-full">
                <div className="grid h-16 items-center grid-cols-2 md:grid-cols-2 grid-flow-row mx-auto w-full max-w-screen-2xl px-6 md:px-20">
                    <div className="flex lg:ml-0 w-11">
                        <Link
                            href="/"
                            className={cn(
                                'w-11 font-extrabold text-lg tracking-wide',
                                montserrat.className
                            )}
                        >
                            Port.
                        </Link>
                    </div>
                    <div className="z-5 flex justify-end items-center gap-2">
                        {status === 'loading' ? (
                            <p className="text-sm">Loading...</p>
                        ) : session?.user ? (
                            <>
                                <Button asChild variant="link" className="">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => signOut({ redirect: false })}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="default"
                                    onClick={() =>
                                        signIn('google', {
                                            callbackUrl: '/dashboard',
                                        })
                                    }
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        signIn('google', {
                                            callbackUrl: '/dashboard',
                                        })
                                    }
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                        <Button
                            asChild
                            variant="default"
                            onClick={() => signIn('google')}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
