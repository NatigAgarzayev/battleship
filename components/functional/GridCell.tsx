import { useDroppable } from "@dnd-kit/core"

interface GridCellProps {
    row: number
    col: number
    isOver: boolean
    isThereShip: boolean
    canAttack?: boolean
    wasShot?: boolean
    isHit?: boolean
    handleCellAttack: (row: number, col: number) => void
}

export default function GridCell({
    row,
    col,
    isOver,
    isThereShip,
    canAttack = false,
    wasShot = false,
    isHit = false,
    handleCellAttack
}: GridCellProps) {
    const { setNodeRef } = useDroppable({
        id: `${row}-${col}`,
        data: { row, col }
    })

    // Determine background color based on state priority
    let bgColor = 'bg-blue-50' // Default ocean color

    if (isHit) {
        bgColor = 'bg-red-600' // Hit - highest priority
    } else if (wasShot) {
        bgColor = 'bg-gray-400' // Miss
    } else if (isThereShip) {
        bgColor = 'bg-gray-700' // Your ship (only visible on your board)
    }

    if (isOver) {
        bgColor = 'bg-green-400' // Drag over preview
    }

    // Debug logging for shot cells
    if (wasShot) {
        console.log(`Cell ${row}-${col}:`, {
            wasShot,
            isHit,
            isThereShip,
            bgColor
        })
    }

    return (
        <button
            ref={setNodeRef}
            onClick={() => handleCellAttack(row, col)}
            disabled={wasShot}
            className={`
                w-8 h-8 border border-blue-400 
                transition-all duration-200 
                relative flex items-center justify-center
                ${bgColor}
                ${canAttack && !wasShot ? 'hover:bg-red-200 cursor-crosshair' : ''}
                ${wasShot ? 'cursor-not-allowed' : ''}
            `}
        >
            {/* Show hit/miss indicators */}
            {isHit && <span className="text-2xl">💥</span>}
            {wasShot && !isHit && <span className="text-xl">●</span>}
        </button>
    )
}