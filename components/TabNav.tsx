import Link from 'next/link'

export default function TabNav({
    username,
    activeTab,
}: {
    username: string
    activeTab: string
}) {
    return (
        <div>
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                <Link
                    href={`/dashboard/edit/${username}/profile`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
                    data-state={activeTab === 'profile' ? 'active' : undefined}
                >
                    Profile
                </Link>
                <Link
                    href={`/dashboard/edit/${username}/links`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
                    data-state={activeTab === 'links' ? 'active' : undefined}
                >
                    Links
                </Link>
                <Link
                    href={`/dashboard/edit/${username}/settings`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
                    data-state={activeTab === 'settings' ? 'active' : undefined}
                >
                    Settings
                </Link>
            </div>
        </div>
    )
}
