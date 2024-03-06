'use client'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useFieldArray, useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '../../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Router, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@prisma/client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import cuid from 'cuid'
import DraggableLink from '@/components/dashboard/links/DraggableLink'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    links: z.array(
        z.object({
            id: z.string(),
            title: z
                .string()
                .min(1, 'Title must be at least 1 char')
                .max(48, 'Title length cannot surpass 48 characters'),
            url: z.string().url(),
        })
    ),
})

export default function LinksForm({
    username,
    links,
}: {
    username: string
    links: Link[]
}) {
    const [formIsLoading, setFormIsLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            links: links.map((link) => ({
                id: link.id,
                title: link.title,
                url: link.url,
            })),
        },
    })
    const { control, register } = form
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'links',
    })
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            setFormIsLoading(true)
            const response = await fetch('/api/user/bio/edit/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    links: values.links,
                }),
            })
            const responseJson = await response.json()
            if (response.ok) {
                toast.success('Links Updated')
                router.refresh()
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
    const newLink = () => {
        append({
            title: 'Link ' + (fields.length + 1),
            url: '',
            id: cuid(),
        })
    }
    const handleDragDrop = async (e: DragEndEvent) => {
        const { active, over } = e
        if (over && active.id !== over?.id) {
            const activeIndex = active.data.current?.sortable?.index
            const overIndex = over.data.current?.sortable?.index
            console.log({ activeIndex, overIndex })
            if (activeIndex !== undefined && overIndex !== undefined) {
                move(activeIndex, overIndex)
            }
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full mt-10 space-y-4"
            >
                <Button
                    variant="secondary"
                    className="w-full"
                    type="button"
                    onClick={() => newLink()}
                >
                    Add Link
                </Button>
                {fields.length < 1 && (
                    <p>No Links, create one to get started!</p>
                )}
                <DndContext onDragEnd={handleDragDrop}>
                    <SortableContext
                        items={fields}
                        strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field, index) => (
                            <DraggableLink id={field.id} key={field.id}>
                                <div className="flex-col w-full">
                                    <div className="flex-row flex justify-start h-full w-full">
                                        <div className="flex-col flex justify-center md:justify-start gap-1 md:gap-2 w-full">
                                            <FormField
                                                control={form.control}
                                                name={`links.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Link Title"
                                                                {...field}
                                                                {...register(
                                                                    `links.${index}.title`
                                                                )}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                key={index}
                                                name={`links.${index}.url`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Link URL"
                                                                {...field}
                                                                {...register(
                                                                    `links.${index}.url`
                                                                )}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="hidden md:flex flex-row items-center justify-start w-full">
                                                <div
                                                    className="p-2 border flex rounded-lg items-center justify-center cursor-pointer hover:bg-neutral-900 transition-all"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex md:hidden flex-row items-center justify-start mt-2 w-full">
                                        <div
                                            className="p-2 border flex rounded-lg items-center justify-center cursor-pointer hover:bg-neutral-900 transition-all"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </DraggableLink>
                        ))}
                    </SortableContext>
                </DndContext>
                {formIsLoading ? (
                    <Button
                        disabled
                        variant="default"
                        className="mt-6 disabled w-full"
                        type="submit"
                    >
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Save
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        className="mt-6 w-full"
                        type="submit"
                    >
                        Save
                    </Button>
                )}
            </form>
        </Form>
    )
}
