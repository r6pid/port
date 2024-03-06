'use client'

import { useSortable } from '@dnd-kit/sortable'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

type DraggableLinkProps = {
    id: string
    children?: React.ReactNode
}

const DraggableLink: React.FC<DraggableLinkProps> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="relative"
        >
            <div className="w-full border p-3 md:p-4 rounded-lg bg-background">
                <div className="w-full h-full flex flex-row items-center gap-2 md:gap-4 justify-between">
                    {children}
                    <div
                        className="px-0 md:px-0.5 py-3 h-full rounded-lg hover:bg-neutral-700 transition-all"
                        {...listeners}
                    >
                        <GripVertical className="w-6 md:w-7 h-6 md:h-7" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DraggableLink
