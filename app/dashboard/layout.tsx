import DashboardNav from '@/components/DashboardNav'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <DashboardNav />
            <main className="mx-auto md:max-w-screen-md px-6">{children}</main>
        </>
    )
}
