// GridCell.tsx
import { useDroppable } from '@dnd-kit/core'

interface GridCellProps {
    row: number
    col: number
    isOver: boolean
    isThereShip: boolean
    canAttack?: boolean
    handleCellAttack: (row: number, col: number) => void
}

export default function GridCell({
    row,
    col,
    isOver,
    isThereShip,
    canAttack = false,
    handleCellAttack
}: GridCellProps) {
    const { setNodeRef } = useDroppable({
        id: `${row}-${col}`,
        data: { row, col }
    })

    return (
        <button
            ref={setNodeRef}
            onClick={() => handleCellAttack(row, col)}
            className={`
                w-8 h-8 border border-blue-400 
                transition-all duration-200 
                ${isThereShip ? 'bg-gray-700' : 'bg-blue-50'}
                ${isOver ? 'bg-green-400' : ''}
                ${canAttack ? 'hover:bg-red-200 cursor-crosshair' : ''}
            `}
        >
        </button>
    )
}