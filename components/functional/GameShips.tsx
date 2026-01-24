import { SHIP_TYPES } from '@/constants/ships'
import React from 'react'
import Ship from '../ui/ship'
import { Check, CircleCheck, Undo2 } from 'lucide-react'

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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bae6fd]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
                Your Fleet
            </h3>
            <div className="space-y-4">
                {SHIP_TYPES.map(ship => {
                    const isPlaced = placedShips.some(s => s.ship_info.id === ship.id)

                    return (
                        <div
                            key={ship.id}
                            className={`flex items-center justify-between p-1 group relative`}
                        >
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {ship.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {ship.length} CELLS
                                    </span>
                                </div>
                                <Ship ship={ship} isPlaced={isPlaced} />
                            </div>
                            {isPlaced && !isReady && (
                                <div onClick={() => onRemoveShip(ship.id)} className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl cursor-pointer">
                                    <button
                                        className="flex flex-col items-center gap-1 text-slate-600 group-hover:text-red-600 transition-colors"
                                    >
                                        <Undo2 className="w-6 h-6" />
                                        <span className="text-xs font-semibold">Return</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}