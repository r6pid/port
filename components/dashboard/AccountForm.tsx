'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Router, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import { Textarea } from '../ui/textarea'
import PageAvatar from '../PageAvatar'
import PageBackground from '../PageBackground'
import TabNav from '../TabNav'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const FormSchema = z.object({
    avatar: z.string().optional(),
    display_name: z
        .string()
        .max(36, 'Display name  must be less than 36 chars')
        .optional(),
    bio: z.string().max(255, 'Bio must be less than 255 chars').optional(),
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
    // const [formIsLoading, setFormIsLoading] = useState(false)
    // const form = useForm<z.infer<typeof FormSchema>>({
    //     resolver: zodResolver(FormSchema),
    //     defaultValues: {
    //         display_name: '',
    //         bio: '',
    //     },
    // })
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {}
    return <p>Account Form</p>
    // return (
    //     <Form {...form}>
    //         <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="w-full mt-10 space-y-2"
    //         >
    //             <div className="w-full flex md:items-center items-start md:justify-start justify-center flex-col md:flex-row gap-4 mb-8">
    //                 <div className="flex flex-col w-full md:w-[27%] items-start justify-center">
    //                     <p className="mb-[8px] text-sm">Avatar</p>
    //                     <PageAvatar
    //                         defaultURL={bio.avatar || '/avatar.png'}
    //                         username={username}
    //                     />
    //                 </div>
    //                 <div className="flex flex-col w-full md:w-[73%] items-start justify-center">
    //                     <p className="mb-[8px] text-sm">Background</p>
    //                     <PageBackground
    //                         defaultURL={bio.background || '/background.png'}
    //                         username={username}
    //                     />
    //                 </div>
    //             </div>
    //             <FormField
    //                 control={form.control}
    //                 name="display_name"
    //                 render={({ field }) => (
    //                     <FormItem>
    //                         <FormLabel>Display Name</FormLabel>
    //                         <FormControl>
    //                             <Input
    //                                 className="w-full"
    //                                 placeholder="John Doe"
    //                                 {...field}
    //                             />
    //                         </FormControl>
    //                         <FormMessage />
    //                     </FormItem>
    //                 )}
    //             />
    //             <FormField
    //                 control={form.control}
    //                 name="bio"
    //                 render={({ field }) => (
    //                     <FormItem>
    //                         <FormLabel>Bio</FormLabel>
    //                         <FormControl>
    //                             <Textarea
    //                                 className="w-full"
    //                                 placeholder="I'm a cool person"
    //                                 {...field}
    //                             />
    //                         </FormControl>
    //                         <FormMessage />
    //                     </FormItem>
    //                 )}
    //             />
    //             <div>
    //                 {formIsLoading ? (
    //                     <Button
    //                         disabled
    //                         variant="secondary"
    //                         className="mt-4 disabled w-full"
    //                         type="submit"
    //                     >
    //                         <Loader className="h-4 w-4 mr-2 animate-spin" />
    //                         Save
    //                     </Button>
    //                 ) : (
    //                     <Button
    //                         variant="secondary"
    //                         className="mt-4 w-full"
    //                         type="submit"
    //                     >
    //                         Save
    //                     </Button>
    //                 )}
    //             </div>
    //         </form>
    //     </Form>
    // )
}
