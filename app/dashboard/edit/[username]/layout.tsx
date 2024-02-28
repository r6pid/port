import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../components/ui/tabs'

export default function Layout({
    children,
    profile,
    links,
    account,
}: {
    children: React.ReactNode
    profile: React.ReactNode
    links: React.ReactNode
    account: React.ReactNode
}) {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger className="w-full" value="profile">
                    Profile
                </TabsTrigger>
                <TabsTrigger className="w-full" value="links">
                    Links
                </TabsTrigger>
                <TabsTrigger className="w-full" value="account">
                    Account
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">{profile}</TabsContent>
            <TabsContent value="links">{links}</TabsContent>
            <TabsContent value="account">{account}</TabsContent>
        </Tabs>
    )
}
