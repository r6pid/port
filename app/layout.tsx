import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '../lib/utils'
import Navbar from '../components/Navbar'
import NextAuthSessionProvider from '../providers/SessionProvider'
import { Toaster } from 'sonner'

const inter = Inter({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Create Next Appp',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    'relative h-full font-sans antialiased dark',
                    inter.className
                )}
            >
                <NextAuthSessionProvider>
                    <Navbar />
                    <main className="mx-auto md:max-w-screen-md px-10">
                        {children}
                    </main>
                    <Toaster richColors expand duration={2000} />
                </NextAuthSessionProvider>
            </body>
        </html>
    )
}
