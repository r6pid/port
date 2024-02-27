import SignUpForm from '../../components/SignUpForm'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'

export default async function Login() {
    const session = await getServerSession(authOptions)
    if (session) {
        redirect('/dashboard')
    }
    return (
        <>
            <SignUpForm />
        </>
    )
}
