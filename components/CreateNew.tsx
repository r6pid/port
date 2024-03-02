'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog'
import { Input } from './ui/input'
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
import { Loader, Router } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const FormSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be more than 3 chars')
        .max(10, 'Username must be less than 10 chars'),
})

const CreateNewButton = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { update, data: session } = useSession()
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/user/bio/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: values.username }),
            })
            const responseJson = await response.json()
            if (response.ok) {
                toast.success('Biolink created!')
                update({
                    ...session,
                    user: {
                        ...session?.user,
                        bios: session?.user?.bios.push(values.username),
                    },
                })
            } else {
                toast.error('Something went wrong')
                console.error(responseJson.message)
            }
        } catch (error) {
            console.error('Error checking username:', error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Dialog>
            <DialogTrigger className="w-full" asChild>
                <Button variant="default" className="w-full">
                    Create New Biolink
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Biolink</DialogTitle>
                    <DialogDescription>
                        What would you like your biolink to be called?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="@your_name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isLoading ? (
                            <Button
                                disabled
                                variant="secondary"
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
                                Create
                            </Button>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewButton
