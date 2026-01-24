import React, { useState } from 'react'
import GameShips from './GameShips'
import GridCell from './GridCell'
import { useDndMonitor } from '@dnd-kit/core'
import { IGameData, IShipsLocation } from '@/types/game'
import { Button } from '../ui/button'
import { makeAttack, setPlayerReady } from '@/hooks/game'
import { RotateCw } from 'lucide-react'

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

    const showShipPlacement = isYourBoard && !isReady && status === 'setup'
    const showShips = isYourBoard
    const shipsForHitDetection = playerShips || ships

    const handleCellAttack = async (row: number, col: number) => {
        if (status !== 'active' || isYourBoard || !isYourTurn || isAttacking) {
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
                alert('🎉 You won the game!')
            }
        } catch (error: any) {
            console.error('Attack error:', error)
            alert(error.message || 'Failed to make attack')
        } finally {
            setIsAttacking(false)
        }
    }

    const generateShipCells = (startRow: number, startCol: number, length: number): string[] => {
        const cells: string[] = []
        for (let i = 0; i < length; i++) {
            cells.push(`${startRow}-${startCol + i}`)
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
                <div className="flex flex-col pt-12 pr-2">
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
                <div className="lg:col-span-7 flex flex-col items-center">
                    <GridComponent />
                </div>

                {/* Right side - Controls (5 columns) */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bae6fd]">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Orientation
                            </span>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 bg-[#f0f9ff] hover:bg-[#e0f2fe] text-blue-600 px-4 py-2 rounded-lg font-medium transition-all group"
                            >
                                <RotateCw className="w-4 h-4 group-active:rotate-90 transition-transform" />
                                Rotate
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleClear}
                                variant="ghost"
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Ship Selection */}
                    <GameShips
                        isReady={isReady}
                        placedShips={ships}
                        onRemoveShip={handleRemoveShip}
                    />

                    {/* Ready Button */}
                    <Button
                        disabled={ships.length !== 5}
                        onClick={handleSetPlayerReady}
                        className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                    >
                        Start Game
                    </Button>
                    <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
                        {ships.length === 5 ? 'Ready to begin battle' : 'Place all ships to begin battle'}
                    </p>
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