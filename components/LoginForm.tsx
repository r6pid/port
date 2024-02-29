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
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '../components/ui/checkbox'
import Link from 'next/link'

const FormSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must have than 8 characters'),
})

export default function LoginForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            setIsLoading(true)
            const signInData = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            })
            if (signInData?.error) {
                toast.error(signInData.error)
                setIsLoading(false)
            }
            if (signInData?.ok) {
                toast.success('Welcome back!')
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
            <p className="text-4xl font-semibold mb-2">Login</p>
            <p className="text-sm font-semibold text-neutral-400 mb-8">
                Enter your login in details below
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
                    </div>
                    <div className="flex flex-row items-center justify-between mt-4 w-full">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember Me
                            </label>
                        </div>
                        <Link
                            className="text-primary font-semibold text-sm hover:underline"
                            href="/forgot-password"
                        >
                            Forgot Password
                        </Link>
                    </div>
                    {isLoading ? (
                        <Button
                            disabled
                            variant="default"
                            className="disabled mt-8 w-full"
                            type="submit"
                        >
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Sign In
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="mt-8 w-full"
                            type="submit"
                        >
                            Sign In
                        </Button>
                    )}
                    <p className="text-sm font-semibold text-neutral-400 mt-4">
                        Don't have an account?
                        <Link
                            href="/signup"
                            className="ml-1.5 text-primary font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </Form>
        </div>
    )
}
