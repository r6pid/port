'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import PageAvatar from '@/components/PageAvatar'
import PageBackground from '@/components/PageBackground'
import { useState } from 'react'
import { Bio } from '@prisma/client'

const FormSchema = z.object({
    display_name: z
        .string()
        .max(36, 'Display name  must be less than 36 chars')
        .optional(),
    bio: z.string().max(255, 'Bio must be less than 255 chars').optional(),
})

export default function ProfileForm({
    username,
    bio,
}: {
    username: string
    bio: Bio
}) {
    const [formIsLoading, setFormIsLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            display_name: bio.displayName || '',
            bio: bio.bio || '',
        },
    })
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            setFormIsLoading(true)
            const response = await fetch('/api/user/bio/edit/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    display_name: values.display_name,
                    bio: values.bio,
                }),
            })
            const responseJson = await response.json()
            if (response.ok) {
                toast.success('Profile Updated')
            } else {
                toast.error('Something went wrong')
                console.error(responseJson.message)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setFormIsLoading(false)
            return
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full mt-16 space-y-2"
            >
                <div className="w-full flex md:items-center items-start md:justify-start justify-center flex-col md:flex-row gap-4 mb-8">
                    <div className="flex flex-col w-full md:w-[27%] items-start justify-center">
                        <p className="mb-[8px] text-sm">Avatar</p>
                        <PageAvatar
                            defaultURL={bio.avatar || '/avatar.png'}
                            username={username}
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-[73%] items-start justify-center">
                        <p className="mb-[8px] text-sm">Background</p>
                        <PageBackground
                            defaultURL={bio.background || '/background.png'}
                            username={username}
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
                    {formIsLoading ? (
                        <Button
                            disabled
                            variant="default"
                            className="mt-4 disabled w-full"
                            type="submit"
                        >
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Save
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
    )
}
