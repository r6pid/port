'use client'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useFieldArray, useForm } from 'react-hook-form'
import { Form } from '../../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Loader, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Link } from '@prisma/client'
import { closestCenter, DndContext, MeasuringStrategy } from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cuid from 'cuid'
import { sites } from '@/lib/sites'

const FormSchema = z.object({
    links: z.array(
        z.object({
            id: z.string(),
            title: z
                .string()
                .min(1, 'Title must be at least 1 char')
                .max(48, 'Title length cannot surpass 48 characters'),
            url: z.string().url(),
            image: z.string(),
        })
    ),
})

type UseSortableReturn = Omit<
    ReturnType<typeof useSortable>,
    'setNodeRef' | 'transform' | 'transition'
>

export default function LinksForm({
    username,
    links,
}: {
    username: string
    links: Link[]
}) {
    const [linkData, setLinkData] = useState<Link[]>(links)
    const [formIsLoading, setFormIsLoading] = useState(false)
    const [activeId, setActiveId] = useState<String>('')
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            links: linkData.map((link) => ({
                id: link.id,
                title: link.title,
                url: link.url,
                image: link.image || '/globe.svg',
            })),
        },
    })
    const { control, register, setValue } = form
    const { fields, append, prepend, remove, swap, move, insert, replace } =
        useFieldArray({
            control,
            name: 'links',
        })
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log(values)
    }
    const measuringConfig = {
        droppable: {
            strategy: MeasuringStrategy.Always,
        },
    }
    const SortableItem = (props: {
        id: string
        children: (args: UseSortableReturn) => React.ReactNode
    }) => {
        const { setNodeRef, transform, transition, ...rest } = useSortable({
            id: props.id,
        })

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        }

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={
                    activeId === props.id ? 'z-40 relative' : 'z-10 relative'
                }
            >
                {props.children({ ...rest })}
            </div>
        )
    }
    const newLink = () => {
        append({
            id: cuid(),
            title: 'Link ' + (fields.length + 1),
            url: 'https://port.com',
            image: '/globe.svg',
        })
    }
    const handleLinkURLChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const url = e.target.value
        const new_url = url.replace(/https?:\/\//, '')
        const site = Object.entries(sites).find(([key]) =>
            new_url.includes(key)
        )
        if (site && url.length > 0) {
            const [, [title, imageUrl]] = site
            console.log(links[index].image)
            links[index].image = imageUrl
            console.log(links[index].image)
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
                <DndContext
                    measuring={measuringConfig}
                    collisionDetection={closestCenter}
                    onDragStart={(event) => {
                        setActiveId(event.active.id as string)
                    }}
                    onDragEnd={(event) => {
                        const { active, over } = event
                        if (active.id === over?.id) return
                        if (over && active.id !== over?.id) {
                            const activeIndex =
                                active.data.current?.sortable?.index
                            const overIndex = over.data.current?.sortable?.index
                            if (
                                activeIndex !== undefined &&
                                overIndex !== undefined
                            ) {
                                move(activeIndex, overIndex)
                            }
                        }
                        setActiveId('')
                        console.log(form.getValues())
                    }}
                >
                    <SortableContext
                        items={fields}
                        strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field, index) => (
                            <SortableItem id={field.id} key={index}>
                                {({ attributes, listeners }) => (
                                    <div
                                        className="w-full border p-3 md:p-4 rounded-lg bg-background"
                                        {...attributes}
                                    >
                                        <div className="w-full h-full flex flex-row items-center gap-2 md:gap-4 justify-between">
                                            <div className="flex-col w-full">
                                                <div className="flex-row flex justify-start h-full w-full">
                                                    <div className="bg-neutral-900 rounded-lg p-2 md:p-4 flex items-center justify-center">
                                                        <Image
                                                            alt={`${field.title} Logo`}
                                                            width={120}
                                                            height={120}
                                                            priority
                                                            src={
                                                                field.image ||
                                                                '/globe.svg'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-col flex justify-center md:justify-start ml-2 md:ml-4 gap-1 md:gap-2 w-full">
                                                        <Input
                                                            className="w-full"
                                                            placeholder="Link Title"
                                                            {...field}
                                                            {...register(
                                                                `links.${index}.title`
                                                            )}
                                                        />

                                                        <Input
                                                            className="w-full"
                                                            placeholder="Link URL"
                                                            {...field}
                                                            key={index}
                                                            {...register(
                                                                `links.${index}.url`,
                                                                {
                                                                    onChange: (
                                                                        e: any
                                                                    ) => {
                                                                        handleLinkURLChange(
                                                                            e,
                                                                            index
                                                                        )
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        <div className="hidden md:flex flex-row items-center justify-start w-full">
                                                            <div
                                                                className="p-2 border flex rounded-lg items-center justify-center cursor-pointer hover:bg-neutral-900 transition-all"
                                                                onClick={() =>
                                                                    remove(
                                                                        index
                                                                    )
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
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="px-0 md:px-0.5 py-3 h-full rounded-lg hover:bg-neutral-700 transition-all"
                                                {...listeners}
                                            >
                                                <GripVertical className="w-6 md:w-7 h-6 md:h-7" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SortableItem>
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
