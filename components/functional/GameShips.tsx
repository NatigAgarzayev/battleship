import { SHIP_TYPES } from '@/constants/ships'
import React from 'react'
import Ship from '../ui/ship'

export default function GameShips() {
    const [ships, setShips] = React.useState(SHIP_TYPES)
    return (
        <div>
            {ships.map(ship => (
                <div key={ship.id} className="grid grid-cols-3 gap-2 items-center mb-2">
                    <span>{ship.name}</span>
                    <Ship length={ship.length} />
                    <span className="text-sm text-gray-500">({ship.length} cells)</span>
                </div>
            ))}
        </div>
    )
}