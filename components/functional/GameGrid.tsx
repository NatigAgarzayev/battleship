import React, { useState } from 'react'
import GameShips from './GameShips'
import GridCell from './GridCell'
import { useDndMonitor } from '@dnd-kit/core'
import { IShipsLocation } from '@/types/game'

const SIZE = 10

interface GameGridProps {
    playerId: string
    playerName: string | null
    isInteractive?: boolean
}
// Game Grid component
export default function GameGrid({ isInteractive = true, playerId, playerName }: GameGridProps) {
    const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set())
    const [ships, setShips] = useState<IShipsLocation[]>([])

    const handleCellAttack = (row: number, col: number) => {
        console.log(`Attacking cell at row ${row}, col ${col}`)
        // Implement attack logic here
    }

    useDndMonitor({
        onDragOver(event) {
            const { active, over } = event

            if (!over || !active) {
                setHoveredCells(new Set())
                return
            }

            const ship = active.data.current
            const overData = over.data.current

            if (!ship || !overData) {
                setHoveredCells(new Set())
                return
            }

            // Generate horizontal ship positions from the hovered cell
            const validCells: string[] = []
            for (let i = 0; i < ship.length; i++) {
                validCells.push(`${overData.row}-${overData.col + i}`)
            }

            setHoveredCells(new Set(validCells))
        },
        onDragEnd(event) {
            const { active, over } = event

            if (!over || !active) {
                setHoveredCells(new Set())
                return
            }

            const ship = active.data.current
            const overData = over.data.current

            if (!ship || !overData) {
                setHoveredCells(new Set())
                return
            }

            // Generate horizontal ship positions from the hovered cell
            const validCells: string[] = []
            for (let i = 0; i < ship.length; i++) {
                validCells.push(`${overData.row}-${overData.col + i}`)
            }

            setShips([...ships, {
                ship_info: {
                    id: ship.id,
                    name: ship.name,
                    length: ship.length
                },
                ship_coordinates: validCells
            }])

            setHoveredCells(new Set())
        },
        onDragCancel() {
            setHoveredCells(new Set())
        }
    })

    const handleRemoveShip = (shipId: string) => {
        setShips(ships.filter(shipLoc => shipLoc.ship_info.id !== shipId))
    }

    return (
        <div className="inline-block">
            Player: {playerName ? playerName : "Unknown"} (ID: {playerId})
            {/* Game Ships list */}
            <GameShips placedShips={ships} onRemoveShip={handleRemoveShip} />

            <div className="flex">
                {/* Left side - row labels */}
                <div className="flex flex-col">
                    {/* Empty space for column labels */}
                    <div className="w-8 h-8"></div>
                    {/* Row labels */}
                    {Array.from({ length: SIZE }, (_, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                </div>

                {/* Right side - grid */}
                <div>
                    {/* Column labels */}
                    <div className="grid grid-cols-10">
                        {Array.from({ length: SIZE }, (_, i) => (
                            <div key={i} className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Grid cells */}
                    {Array.from({ length: SIZE }, (_, row) => (
                        <div key={row} className="grid grid-cols-10">
                            {Array.from({ length: SIZE }, (_, col) => (
                                <GridCell
                                    isThereShip={ships.some(shipLoc => shipLoc.ship_coordinates.includes(`${row}-${col}`))}
                                    isOver={hoveredCells.has(`${row}-${col}`)}
                                    key={col}
                                    col={col}
                                    row={row}
                                    isInteractive={isInteractive}
                                    handleCellAttack={handleCellAttack}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}