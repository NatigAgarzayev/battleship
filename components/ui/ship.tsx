import { ShipType } from '@/constants/ships'
import { useDraggable } from '@dnd-kit/core';
import React from 'react'

export default function ship({ ship, isPlaced }: { ship: ShipType, isPlaced: boolean }) {

    const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
        id: `ship-${ship.id}`,
        data: ship,
        disabled: isPlaced
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    } : undefined

    const widthClass = {
        2: 'w-16',
        3: 'w-24',
        4: 'w-32',
        5: 'w-40'
    }[ship.length]

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style} className={`bg-gray-800 h-4 ${widthClass} ${isPlaced ? 'cursor-not-allowed' : 'cursor-grab'}`}></div>
    )
}
