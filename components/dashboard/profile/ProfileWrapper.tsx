import { Loading } from '@/components/Loading'
import ProfileForm from '@/components/dashboard/profile/ProfileForm'
import { useQuery } from '@tanstack/react-query'

export default function ProfileWrapper({ username }: { username: string }) {
    const getBio = async () => {
        const response = await fetch(`/api/user/bio/${username}`)
        return response.json()
    }
    const { isLoading, data } = useQuery({
        queryKey: ['bio'],
        queryFn: getBio,
    })
    if (isLoading) {
        return <Loading />
    }
    return <ProfileForm username={username} bio={data.bio} />
}
