'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '../../../../../components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Router, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import { Textarea } from '../../../../../components/ui/textarea'
import { UploadButton } from '../../../../../lib/utils'
import PageAvatar from '../../../../../components/PageAvatar'
import PageBackground from '../../../../../components/PageBackground'
import TabNav from '../../../../../components/TabNav'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const FormSchema = z.object({
    avatar: z.string().optional(),
    display_name: z
        .string()
        .max(36, 'Username must be less than 10 chars')
        .optional(),
    bio: z.string().max(256, 'Bio must be less than 256 chars').optional(),
})

export default function ProfileTab({
    params,
}: {
    params: { username: string }
}) {
    const { data: session, status } = useSession()
    if (!session) {
        return redirect('/login')
    }
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            avatar: '',
            display_name: '',
            bio: '',
        },
    })
    // const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {}
    const fetchBio = async () => {
        try {
            const response = await fetch(
                `/api/user/bio/edit/${params.username}`
            )
            const responseJson = await response.json()
            if (!response.ok) {
                console.error(responseJson.message)
                toast.error('Something went wrong')
            }
            return responseJson
        } catch (error) {
            console.error('Error fetching bio: ', error)
        }
    }
    const { isLoading, error, data } = useQuery({
        queryKey: ['bioData'],
        queryFn: fetchBio,
    })
    if (isLoading)
        return (
            <div className="absolute left-0 top-0 z-40 w-screen h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin" />
            </div>
        )
    return (
        <main className="mx-auto md:max-w-screen-md px-10">
            <div className="min-h-[calc(100dvh-65px)] py-12">
                <TabNav username={params.username} activeTab={'profile'} />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full mt-10 space-y-2"
                    >
                        <div className="w-full flex items-center justify-start flex-row gap-4 mb-8">
                            <div className="flex flex-col w-[27%] items-start justify-center">
                                <p className="mb-[8px] text-sm">Avatar</p>
                                <PageAvatar
                                    defaultURL={data.bio.avatar}
                                    username={params.username}
                                />
                            </div>
                            <div className="flex flex-col w-[73%] items-start justify-center">
                                <p className="mb-[8px] text-sm">Background</p>
                                <PageBackground
                                    defaultURL={data.bio.background}
                                    username={params.username}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="display_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="John Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="w-full"
                                            placeholder="I'm a cool person"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            {isLoading ? (
                                <Button
                                    disabled
                                    variant="default"
                                    className="mt-4 disabled w-full"
                                    type="submit"
                                >
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Create
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    className="mt-4 w-full"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}
