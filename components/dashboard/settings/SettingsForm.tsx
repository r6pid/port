'use client'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Router, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import { Textarea } from '../../ui/textarea'
import PageAvatar from '../../PageAvatar'
import PageBackground from '../../PageBackground'
import TabNav from '../../TabNav'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const FormSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be more than 3 chars')
        .max(10, 'Username must be less than 10 chars'),
})

// interface BioData {
//     id: string
//     createdAt: Date
//     updatedAt: Date
//     displayName: string | null
//     bio: string | null
//     verified: boolean | null
//     rareUsername: boolean
//     avatar: string | null
//     background: string | null
//     userId: string
// }

export default function AccountForm({
    username,
    // bio,
}: {
    username: string
    // bio: BioData
}) {
    const [formIsLoading, setFormIsLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: username || '',
        },
    })
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            setFormIsLoading(true)
            const response = await fetch('/api/user/bio/edit/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_username: username,
                    new_username: values.username,
                }),
            })
            const responseJSON = await response.json()
            if (response.ok) {
                toast.success('Username Updated')
                router.push(
                    `/dashboard/edit/${responseJSON.new_username}/settings`
                )
            } else {
                toast.error(responseJSON.message)
                console.error(responseJSON.message)
            }
        } catch (error) {
            console.error('Error updating username: ' + error)
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
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Change Username</FormLabel>
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
