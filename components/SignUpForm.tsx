'use client'

import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '../components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

const FormSchema = z
    .object({
        username: z.string().min(1, 'Username is required').max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must have than 8 characters'),
        confirmPassword: z.string().min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password do not match',
    })

export default function SignUpForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            })
            const responseJson = await response.json()
            if (!response.ok) {
                toast.error(responseJson.message)
                return setIsLoading(false)
            }
            const signInData = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            })
            if (signInData?.error) {
                toast.error(signInData.error)
                console.log(signInData.error)
                setIsLoading(false)
            }
            toast.success('Welcome to Port!')
            if (signInData?.ok) {
                router.push('/dashboard')
                setIsLoading(false)
            }
        } catch (error) {
            toast.error(JSON.stringify(error))
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100dvh-65px)] py-20 flex justify-center flex-col">
            <p className="text-4xl font-semibold mb-2">Sign Up</p>
            <p className="text-sm font-semibold text-neutral-400 mb-8">
                Enter your sign up details below
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {isLoading ? (
                        <Button
                            disabled
                            variant="default"
                            className="disabled mt-8 w-full"
                            type="submit"
                        >
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Sign Up
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="mt-8 w-full"
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    )}
                    <p className="text-sm text-neutral-400 mt-4">
                        Already have an account?
                        <Link
                            href="/login"
                            className="ml-1.5 text-white hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </Form>
        </div>
    )
}
