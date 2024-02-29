import { redirect } from 'next/navigation'

export default function DashboardPage({
    params,
}: {
    params: { username: string }
}) {
    return redirect(`/dashboard/edit/${params.username}/profile`)
}
