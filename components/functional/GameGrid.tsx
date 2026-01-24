import React, { useState } from 'react'
import GameShips from './GameShips'
import GridCell from './GridCell'
import { useDndMonitor } from '@dnd-kit/core'
import { IGameData, IShipsLocation } from '@/types/game'
import { Button } from '../ui/button'
import { makeAttack, setPlayerReady } from '@/hooks/game'

const SIZE = 10

interface GameGridProps {
    gameCode: string
    playerId: string
    playerShips: IShipsLocation[] | null
    playerName: string | null
    isReady: boolean
    isYourBoard: boolean
    status: IGameData['status']
    isYourTurn: boolean
    shots: IGameData['player1_shots'] | IGameData['player2_shots']
}

// Game Grid component
export default function GameGrid({ gameCode, playerShips, playerId, playerName, isReady, isYourBoard, status, isYourTurn, shots }: GameGridProps) {
    const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set())
    const [ships, setShips] = useState<IShipsLocation[]>(playerShips || [])
    const [isAttacking, setIsAttacking] = useState(false)

    const showShipPlacement = isYourBoard && !isReady && status === 'setup'
    const showShips = isYourBoard

    const shipsForHitDetection = playerShips || ships

    const handleCellAttack = async (row: number, col: number) => {
        // Only allow attacks on opponent's board during your turn
        if (status !== 'active' || isYourBoard || !isYourTurn || isAttacking) {
            return
        }

        const targetCell = `${row}-${col}`

        try {
            setIsAttacking(true)

            // Get current player ID from localStorage
            const currentPlayerId = localStorage.getItem('currentPlayerId')
            if (!currentPlayerId) {
                throw new Error('Player ID not found')
            }

            const result = await makeAttack(gameCode, currentPlayerId, targetCell)

            console.log('Attack result:', result)

            if (result.isHit) {
                console.log('🎯 HIT!')
            } else {
                console.log('💧 MISS!')
            }

            if (result.gameWon) {
                alert('🎉 You won the game!')
            }
        } catch (error: any) {
            console.error('Attack error:', error)
            alert(error.message || 'Failed to make attack')
        } finally {
            setIsAttacking(false)
        }
    }

    // Helper function to generate ship coordinates
    const generateShipCells = (startRow: number, startCol: number, length: number): string[] => {
        const cells: string[] = []
        for (let i = 0; i < length; i++) {
            cells.push(`${startRow}-${startCol + i}`)
        }
        return cells
    }

    // Helper function to validate ship placement
    const isValidPlacement = (cells: string[]): boolean => {
        // Check collision with existing ships
        const hasCollision = cells.some(cell =>
            ships.some(shipLoc => shipLoc.ship_coordinates.includes(cell))
        )

        // Check if ship goes out of bounds
        const lastCell = cells[cells.length - 1]
        const [row, col] = lastCell.split('-').map(Number)
        const outOfBounds = col >= SIZE || row >= SIZE

        // Check if there's a 1-cell buffer around the ship
        const hasBufferViolation = cells.some(cell => {
            const [cellRow, cellCol] = cell.split('-').map(Number)

            // Check all 8 surrounding cells (and the cell itself)
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const checkRow = cellRow + dr
                    const checkCol = cellCol + dc
                    const checkCell = `${checkRow}-${checkCol}`

                    // If any surrounding cell has a ship, it's too close
                    const hasSurroundingShip = ships.some(shipLoc =>
                        shipLoc.ship_coordinates.includes(checkCell)
                    )

                    if (hasSurroundingShip) return true
                }
            }
            return false
        })

        return !hasCollision && !outOfBounds && !hasBufferViolation
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

            // Generate ship cells
            const validCells = generateShipCells(overData.row, overData.col, ship.length)

            // Only highlight if valid placement
            if (isValidPlacement(validCells)) {
                setHoveredCells(new Set(validCells))
            } else {
                setHoveredCells(new Set())
            }
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

            // Generate ship cells
            const validCells = generateShipCells(overData.row, overData.col, ship.length)

            // Only place ship if valid
            if (isValidPlacement(validCells)) {
                setShips([...ships, {
                    ship_info: {
                        id: ship.id,
                        name: ship.name,
                        length: ship.length
                    },
                    ship_coordinates: validCells
                }])
            } else {
                console.log('Invalid placement: collision or out of bounds')
            }

            setHoveredCells(new Set())
        },
        onDragCancel() {
            setHoveredCells(new Set())
        }
    })

    const handleRemoveShip = (shipId: string) => {
        setShips(ships.filter(shipLoc => shipLoc.ship_info.id !== shipId))
    }

    const handleSetPlayerReady = async () => {
        try {
            const res = await setPlayerReady(gameCode, playerId, ships)
            console.log("Player set to ready:", res)
        } catch (error) {
            console.error("Error setting player ready:", error)
        }
    }


    console.log("SDA", status)

    return (
        <div className="inline-block">
            Player: {playerName ? playerName : "Unknown"} (ID: {playerId}) <br />
            {/* Only show ship placement controls on your board during setup */}
            {showShipPlacement && (
                <>
                    <Button disabled={ships.length !== 5} onClick={handleSetPlayerReady}>
                        I am ready
                    </Button>
                    <GameShips isReady={isReady} placedShips={ships} onRemoveShip={handleRemoveShip} />
                </>
            )}
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
                            {Array.from({ length: SIZE }, (_, col) => {
                                const cellId = `${row}-${col}`

                                // Use shipsForHitDetection instead of ships
                                const hasShip = shipsForHitDetection.some(shipLoc =>
                                    shipLoc.ship_coordinates.includes(cellId)
                                )
                                const wasShot = shots.includes(cellId)
                                const isHit = wasShot && hasShip

                                return (
                                    <GridCell
                                        key={col}
                                        isThereShip={showShips && hasShip}
                                        isOver={hoveredCells.has(cellId)}
                                        canAttack={status === 'active' && !isYourBoard && isYourTurn && !isAttacking}
                                        wasShot={wasShot}
                                        isHit={isHit}
                                        col={col}
                                        row={row}
                                        handleCellAttack={handleCellAttack}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}