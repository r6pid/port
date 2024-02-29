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
import { Loader } from 'lucide-react'

interface Bio {
    id: string
    username: string
    bio: string
    avatar: string
    background: string
    displayName: string
}

export default function BioLink({ b }: { b: Bio }) {
    const [Loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedBio, setSelectedBio] = useState<Bio | null>(null)
    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
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
                setLoading(false)
                setOpen(false)
            } else {
                toast.success('Deleted: @' + id)
                setLoading(false)
                setOpen(false)
                location.reload()
            }
        } catch (error) {
            toast.error(JSON.stringify(error))
            console.log(error)
            setLoading(false)
            return
        }
    }
    return (
        <div className="w-full rounded-lg border" key={b.id}>
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
                <div className="flex items-start justify-center flex-col ml-4">
                    <p className="text-lg ">{b.displayName}</p>
                    <p className="text-sm text-neutral-400 line-clamp-2">
                        {b.bio}
                    </p>
                </div>
            </div>
            <div className="w-full flex items-center justify-center">
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
                        {Loading && open ? (
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
                                onClick={() => handleDelete(selectedBio!.id)}
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
                    <Link href={`/dashboard/edit/${b.id}/profile`}>Edit</Link>
                </Button>
            </div>
        </div>
    )
}
