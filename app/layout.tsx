import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '../lib/utils'
import Navbar from '../components/Navbar'
import NextAuthSessionProvider from '../providers/SessionProvider'
import { Toaster } from 'sonner'
import NextTopLoader from 'nextjs-toploader'
import Providers from './providers'

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
                    <NextTopLoader
                        initialPosition={0.08}
                        crawlSpeed={200}
                        height={3}
                        crawl={true}
                        showSpinner={false}
                        easing="ease"
                        speed={200}
                        template='<div class="bar" role="bar"><div class="peg"></div></div> 
				<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                        zIndex={1600}
                        showAtBottom={false}
                        color="#ffffff"
                    />
                    <main className="mx-auto md:max-w-screen-md px-6">
                        <Providers>{children}</Providers>
                    </main>
                    <Toaster richColors expand duration={2000} />
                </NextAuthSessionProvider>
            </body>
        </html>
    )
}
