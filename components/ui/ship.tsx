import { ShipType } from '@/constants/ships'
import React from 'react'

export default function ship({ length }: { length: ShipType['length'] }) {

    const widthClass = {
        2: 'w-8',
        3: 'w-12',
        4: 'w-16',
        5: 'w-20'
    }[length]

    return (
        <div draggable="true" className={`bg-gray-800 h-4 ${widthClass}`}></div>
    )
}
