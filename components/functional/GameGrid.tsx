import React, { useState } from 'react'
import GameShips from './GameShips'
import GridCell from './GridCell'
import { useDndMonitor } from '@dnd-kit/core'
import { IGameData, IShipsLocation } from '@/types/game'
import { Button } from '../ui/button'
import { makeAttack, setPlayerReady } from '@/hooks/game'
import { Lightbulb, RotateCw } from 'lucide-react'
import { gameToasts, showError, showInfo } from '@/lib/toasts'

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

export default function GameGrid({
    gameCode,
    playerShips,
    playerId,
    playerName,
    isReady,
    isYourBoard,
    status,
    isYourTurn,
    shots
}: GameGridProps) {
    const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set())
    const [ships, setShips] = useState<IShipsLocation[]>(playerShips || [])
    const [isAttacking, setIsAttacking] = useState(false)
    const [shipOrientation, setShipOrientation] = useState<'horizontal' | 'vertical'>('horizontal')

    const showShipPlacement = isYourBoard && !isReady && status === 'setup'
    const showShips = isYourBoard
    const shipsForHitDetection = playerShips || ships

    const handleCellAttack = async (row: number, col: number) => {
        if (status !== 'active' || isYourBoard || !isYourTurn || isAttacking) {
            if (!isYourTurn && status === 'active') {
                gameToasts.notYourTurn()
            }
            return
        }

        const targetCell = `${row}-${col}`

        try {
            setIsAttacking(true)
            const currentPlayerId = localStorage.getItem('currentPlayerId')
            if (!currentPlayerId) {
                throw new Error('Player ID not found')
            }

            const result = await makeAttack(gameCode, currentPlayerId, targetCell)

            if (result.gameWon) {
                gameToasts.victory()
            }
        } catch (error: any) {
            console.error('Attack error:', error)

            if (error.message?.includes('already attacked')) {
                gameToasts.cellAlreadyShot()
            } else if (error.message?.includes('Not your turn')) {
                gameToasts.notYourTurn()
            } else {
                showError('Attack Failed', error.message || 'Failed to make attack')
            }
        } finally {
            setIsAttacking(false)
        }
    }

    const generateShipCells = (startRow: number, startCol: number, length: number, orientation?: 'horizontal' | 'vertical'): string[] => {
        const cells: string[] = []
        const currentOrientation = orientation || shipOrientation

        for (let i = 0; i < length; i++) {
            if (currentOrientation === 'horizontal') {
                cells.push(`${startRow}-${startCol + i}`)
            } else {
                cells.push(`${startRow + i}-${startCol}`)
            }
        }
        return cells
    }

    const isValidPlacement = (cells: string[]): boolean => {
        const hasCollision = cells.some(cell =>
            ships.some(shipLoc => shipLoc.ship_coordinates.includes(cell))
        )

        const lastCell = cells[cells.length - 1]
        const [row, col] = lastCell.split('-').map(Number)
        const outOfBounds = col >= SIZE || row >= SIZE

        const hasBufferViolation = cells.some(cell => {
            const [cellRow, cellCol] = cell.split('-').map(Number)

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const checkRow = cellRow + dr
                    const checkCol = cellCol + dc
                    const checkCell = `${checkRow}-${checkCol}`

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

    const handleRotateShip = (cellId: string) => {
        // Find the ship that contains this cell
        const shipToRotate = ships.find(ship =>
            ship.ship_coordinates.includes(cellId)
        )

        if (!shipToRotate) return

        const coords = shipToRotate.ship_coordinates

        // Determine current orientation
        const firstCell = coords[0]
        const secondCell = coords[1]
        const [row1, col1] = firstCell.split('-').map(Number)
        const [row2, col2] = secondCell.split('-').map(Number)

        const isHorizontal = row1 === row2 // Same row = horizontal

        // Find the starting cell (top-left corner)
        const rows = coords.map(c => Number(c.split('-')[0]))
        const cols = coords.map(c => Number(c.split('-')[1]))
        const minRow = Math.min(...rows)
        const minCol = Math.min(...cols)

        // Generate new coordinates with rotated orientation
        const newCells: string[] = []
        const shipLength = shipToRotate.ship_info.length

        if (isHorizontal) {
            // Rotate to vertical
            for (let i = 0; i < shipLength; i++) {
                newCells.push(`${minRow + i}-${minCol}`)
            }
        } else {
            // Rotate to horizontal
            for (let i = 0; i < shipLength; i++) {
                newCells.push(`${minRow}-${minCol + i}`)
            }
        }

        // Temporarily remove the ship we're rotating for validation
        const otherShips = ships.filter(s => s.ship_info.id !== shipToRotate.ship_info.id)
        const tempShips = ships
        setShips(otherShips)

        // Check if new position is valid
        const isValid = isValidPlacement(newCells)

        if (isValid) {
            // Valid rotation - update ship with new coordinates
            setShips([
                ...otherShips,
                {
                    ...shipToRotate,
                    ship_coordinates: newCells
                }
            ])
            showInfo('Ship Rotated', `${shipToRotate.ship_info.name} rotated`)
        } else {
            // Invalid rotation - restore original
            setShips(tempShips)
            showError('Cannot Rotate', 'Not enough space to rotate this ship')
        }
    }

    const toggleOrientation = () => {
        setShipOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
        showInfo('Orientation Changed', `Ships will be placed ${shipOrientation === 'horizontal' ? 'vertically' : 'horizontally'}`)
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

            const validCells = generateShipCells(overData.row, overData.col, ship.length)

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

            const validCells = generateShipCells(overData.row, overData.col, ship.length)

            if (isValidPlacement(validCells)) {
                setShips([...ships, {
                    ship_info: {
                        id: ship.id,
                        name: ship.name,
                        length: ship.length
                    },
                    ship_coordinates: validCells
                }])
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
            await setPlayerReady(gameCode, playerId, ships)
        } catch (error) {
            console.error("Error setting player ready:", error)
        }
    }

    const handleClear = () => {
        setShips([])
    }

    // Grid component to reuse
    const GridComponent = () => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bae6fd]">
            <div className="flex">
                {/* Row labels */}
                <div className="flex flex-col pt-6 pr-2">
                    {Array.from({ length: SIZE }, (_, i) => (
                        <div key={i} className="h-12 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                </div>

                {/* Grid and column labels */}
                <div>
                    {/* Column labels */}
                    <div className="flex pb-2">
                        {Array.from({ length: SIZE }, (_, i) => (
                            <div key={i} className="w-12 text-center text-[10px] font-bold text-slate-400">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="bg-[#e0f2fe] rounded-sm overflow-hidden border border-[#bae6fd]">
                        <div className="grid grid-cols-10">
                            {Array.from({ length: SIZE }, (_, row) => (
                                Array.from({ length: SIZE }, (_, col) => {
                                    const cellId = `${row}-${col}`
                                    const hasShip = shipsForHitDetection.some(shipLoc =>
                                        shipLoc.ship_coordinates.includes(cellId)
                                    )
                                    const wasShot = shots.includes(cellId)
                                    const isHit = wasShot && hasShip

                                    return (
                                        <GridCell
                                            key={cellId}
                                            isThereShip={showShips && hasShip}
                                            isOver={hoveredCells.has(cellId)}
                                            canAttack={status === 'active' && !isYourBoard && isYourTurn && !isAttacking}
                                            wasShot={wasShot}
                                            isHit={isHit}
                                            col={col}
                                            row={row}
                                            handleCellAttack={handleCellAttack}
                                            onShipDoubleClick={showShipPlacement && hasShip ? () => handleRotateShip(cellId) : undefined}
                                        />
                                    )
                                })
                            )).flat()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Setup phase layout - grid on left, controls on right
    if (status === 'setup' && showShipPlacement) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left side - Grid (7 columns) */}
                <div className="lg:col-span-7 space-y-6 flex flex-col items-center">
                    {/* Orientation Toggle */}
                    <div className="bg-white h-14 px-4 flex items-center rounded-2xl shadow-sm border border-[#bae6fd]">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Orientation: {shipOrientation}
                            </span>
                            <Button
                                onClick={toggleOrientation}
                                variant="ghost"
                                className="flex items-center gap-2 bg-[#f0f9ff] hover:bg-[#e0f2fe] text-blue-600 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer"
                            >
                                <RotateCw className="w-4 h-4" />
                                Toggle
                            </Button>
                        </div>
                    </div>
                    <GridComponent />
                </div>

                {/* Right side - Controls (5 columns) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Ready Button */}
                    <Button
                        disabled={ships.length !== 5}
                        onClick={handleSetPlayerReady}
                        className="w-full py-7 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 cursor-pointer"
                    >
                        I'm Ready!
                    </Button>

                    {/* Ship Selection */}
                    <GameShips
                        isReady={isReady}
                        placedShips={ships}
                        onRemoveShip={handleRemoveShip}
                    />

                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl shadow-sm border-2 border-sky-200">
                        <h3 className="text-sm font-bold text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Lightbulb size={20} />
                            Quick Tips
                        </h3>
                        <div className="space-y-3 text-sm text-slate-700">
                            <div className="flex items-start gap-2">
                                <span className="text-sky-500 font-bold">•</span>
                                <span>Drag ships to place them on the grid</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sky-500 font-bold">•</span>
                                <span><strong>Double-click</strong> a ship on the grid to rotate it</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sky-500 font-bold">•</span>
                                <span>Ships must have 1 cell spacing between them</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sky-500 font-bold">•</span>
                                <span>Click "Return" to remove a ship from grid</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-sky-200">
                            <Button
                                onClick={handleClear}
                                variant="outline"
                                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-2 border-sky-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                            >
                                Clear All Ships
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Active/Finished phase layout - just the grid centered
    return (
        <div className="flex flex-col items-center">
            {/* Turn Indicator for active game */}
            {status === 'active' && (
                <div className={`mb-6 w-full max-w-2xl p-4 rounded-xl text-center font-bold ${isYourTurn && !isYourBoard
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-slate-100 text-slate-600'
                    }`}>
                    {isYourTurn && !isYourBoard ? '🎯 Your Turn - Select a target!' : '⏳ Opponent\'s Turn'}
                </div>
            )}

            <GridComponent />
        </div>
    )
}