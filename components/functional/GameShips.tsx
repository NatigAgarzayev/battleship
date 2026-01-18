import { SHIP_TYPES } from '@/constants/ships'
import React from 'react'
import Ship from '../ui/ship'
import { Button } from '../ui/button'

interface PlacedShip {
    ship_info: {
        id: string
        name: string
        length: number
    }
    ship_coordinates: string[]
}

export default function GameShips({
    placedShips,
    isReady,
    onRemoveShip
}: {
    placedShips: PlacedShip[],
    isReady: boolean,
    onRemoveShip: (shipId: string) => void
}) {
    return (
        <div className="mb-4">
            <h3 className="font-bold mb-2">Your Fleet</h3>
            {SHIP_TYPES.map(ship => {
                const isPlaced = placedShips.some(s => s.ship_info.id === ship.id)

                return (
                    <div key={ship.id} className="grid grid-cols-3 gap-2 items-center mb-2">
                        <Ship ship={ship} isPlaced={isPlaced} />
                        <span className={isPlaced ? 'opacity-50' : ''}>{ship.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">({ship.length} cells)</span>
                            {isPlaced && (
                                <Button
                                    variant="destructive"
                                    disabled={!isPlaced || isReady}
                                    onClick={() => onRemoveShip(ship.id)}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}