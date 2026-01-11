import { ShipType } from '@/constants/ships'
import { useDraggable } from '@dnd-kit/core';
import React from 'react'

export default function ship({ ship }: { ship: ShipType }) {

    const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
        id: `ship-${ship.id}`,
        data: ship
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    } : undefined

    const widthClass = {
        2: 'w-8',
        3: 'w-12',
        4: 'w-16',
        5: 'w-20'
    }[ship.length]

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style} className={`bg-gray-800 h-4 ${widthClass}`}></div>
    )
}
