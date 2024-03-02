'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loading } from '@/components/Loading'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Bio {
    id: string
    username: string
    bio: string
    avatar: string
    background: string
    displayName: string
    verified: boolean
    rareUsername: boolean
    createdAt: Date
    updatedAt: Date
}

function BioLink({ b }: { b: Bio }) {
    return (
        <div className="w-full p-4 flex flex-row items-center">
            <div className="h-[5.6rem] relative aspect-square">
                {b.avatar ? (
                    <Image
                        src={b.avatar}
                        alt="Avatar"
                        fill
                        className="rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                ) : (
                    <Image
                        src="/avatar.png"
                        alt="Avatar"
                        fill
                        className="rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                )}
            </div>

            <div className="flex items-start justify-center flex-col ml-[1.15rem] w-full">
                <p className="text-lg sm:text-xl break-all line-clamp-1">
                    {b.displayName}
                </p>

                <p className="text-sm text-neutral-400 line-clamp-2 break-all">
                    {b.bio}
                </p>
            </div>
        </div>
    )
}

export default function Biolinks({ userId }: { userId: string }) {
    const queryClient = useQueryClient()
    const [isDeleteLoading, setDeleteLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedBio, setSelectedBio] = useState<Bio | null>(null)
    const handleDelete = async (id: string) => {
        try {
            setDeleteLoading(true)
            const res = await fetch('/api/user/bio/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message)
            } else {
                toast.success('Deleted: @' + id)
                queryClient.invalidateQueries({ queryKey: ['bios'] })
            }
        } catch (error) {
            toast.error('Something went wrong')
            console.error(error)
        } finally {
            setOpen(false)
            setDeleteLoading(false)
        }
    }
    const getBios = async () => {
        const response = await fetch(`/api/user/bios/${userId}`)
        return response.json()
    }
    const { isLoading, data } = useQuery({
        queryKey: ['bios'],
        queryFn: getBios,
    })
    if (isLoading) {
        return <Loading />
    }
    return data.bios.length > 0 ? (
        <div className="space-y-5 mt-6">
            {data.bios
                .sort((a: any, b: any) => a.createdAt - b.createdAt)
                .map((b: any) => (
                    <div className="w-full rounded-lg border" key={b.id}>
                        <BioLink b={b} />
                        <div className="w-full flex items-center justify-center mt-1">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full rounded-t-none rounded-r-none h-10"
                                        onClick={() => setSelectedBio(b)}
                                    >
                                        Delete
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-start justify-start">
                                            Delete Biolink
                                        </DialogTitle>

                                        <DialogDescription>
                                            Are you sure you want to delete @
                                            {selectedBio?.id}?
                                        </DialogDescription>
                                    </DialogHeader>

                                    {isDeleteLoading && open ? (
                                        <Button
                                            disabled
                                            variant="destructive"
                                            className=" w-full"
                                        >
                                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                                            Delete
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() =>
                                                handleDelete(selectedBio!.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant="secondary"
                                className="w-full rounded-t-none rounded-l-none h-10"
                                asChild
                            >
                                <Link href={`/dashboard/edit/${b.id}/profile`}>
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}
        </div>
    ) : (
        <p className="mt-4">Get started by creating a new biolink</p>
    )
}
