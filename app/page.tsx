import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-[calc(100dvh-65px)] py-20">
            <p>welcome to port</p>
            <p>a proper homepage is coming soon</p>
            <div className="flex items-center flex-row mt-4 gap-2">
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
            </div>
        </div>
    )
}
