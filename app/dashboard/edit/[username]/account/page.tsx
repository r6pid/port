import TabNav from '../../../../../components/TabNav'

export default function AccountTab({
    params,
}: {
    params: { username: string }
}) {
    return (
        <main className="mx-auto md:max-w-screen-md px-10">
            <div className="min-h-[calc(100dvh-65px)] py-12">
                <TabNav username={params.username} activeTab={'account'} />
            </div>
        </main>
    )
}
