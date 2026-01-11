import React, { useState } from 'react'
import GameShips from './GameShips'
import GridCell from './GridCell'
import { useDndMonitor } from '@dnd-kit/core'

const SIZE = 10

interface GameGridProps {
    playerId: string
    playerName: string | null
    ships?: any[]
    shots?: any[]
    isInteractive?: boolean
}
// Game Grid component
export default function GameGrid({ ships = [], shots = [], isInteractive = true, playerId, playerName }: GameGridProps) {
    const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set())
    const handleCellAttack = (row: number, col: number) => {
        console.log(`Attacking cell at row ${row}, col ${col}`)
        // Implement attack logic here
    }

    useDndMonitor({
        onDragOver(event) {
            const { collisions } = event

            if (collisions && collisions.length > 0) {
                const cellIds = new Set(collisions.map(c => c.id as string))
                setHoveredCells(cellIds)
            } else {
                setHoveredCells(new Set())
            }
        },
        onDragEnd() {
            setHoveredCells(new Set())
        },
        onDragCancel() {
            setHoveredCells(new Set())
        }
    })


    return (
        <div className="inline-block">
            Player: {playerName ? playerName : "Unknown"} (ID: {playerId})
            {/* Game Ships list */}
            <GameShips />
            {/* Column labels */}
            <div className="grid grid-cols-11 gap-1 mb-1">
                <div></div>
                {Array.from({ length: SIZE }, (_, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Grid with row labels */}
            {Array.from({ length: SIZE }, (_, row) => (
                <div key={row} className="grid grid-cols-11 gap-1 mb-1">
                    {/* Row label */}
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {String.fromCharCode(65 + row)}
                    </div>


                    {/* Grid cells */}
                    {Array.from({ length: SIZE }, (_, col) => (
                        <GridCell isOver={hoveredCells.has(`${row}-${col}`)} key={col} col={col} row={row} isInteractive={isInteractive} handleCellAttack={handleCellAttack} />
                    ))}
                </div>
            ))}
        </div>
    )
}