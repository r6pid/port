import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 inset-x-0">
            <div className="border-b bg-neutral-900 w-full">
                <div className="grid h-[3.25rem] items-center grid-cols-2 md:grid-cols-3 grid-flow-row mx-auto w-full max-w-screen-2xl px-4 md:px-20">
                    <div className="flex lg:ml-0 w-11">
                        <Link href="/" className="w-11">
                            Port.
                        </Link>
                    </div>
                    <div className="hidden z-5 md:flex justify-center items-center gap-6"></div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
