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
    let bgColor = 'bg-[#e0f2fe]' // Ocean soft color
    let borderColor = 'border-[#bae6fd]' // Ocean border

    if (isHit) {
        bgColor = 'bg-red-500' // Hit
        borderColor = 'border-red-600'
    } else if (wasShot) {
        bgColor = 'bg-slate-300' // Miss
        borderColor = 'border-slate-400'
    } else if (isThereShip) {
        bgColor = 'bg-[#2563eb]' // Ship blue
        borderColor = 'border-[#1d4ed8]'
    }

    if (isOver) {
        bgColor = 'bg-blue-200' // Hover preview
        borderColor = 'border-blue-400'
    }

    return (
        <button
            ref={setNodeRef}
            onClick={() => handleCellAttack(row, col)}
            disabled={wasShot}
            className={`
                w-12 h-12 border
                transition-colors duration-200
                flex items-center justify-center
                ${bgColor}
                ${borderColor}
                ${canAttack && !wasShot ? 'hover:bg-blue-100 cursor-pointer' : ''}
                ${wasShot ? 'cursor-not-allowed' : ''}
            `}
        >
            {/* Show hit/miss indicators */}
            {isHit && <span className="text-white text-xl">✕</span>}
            {wasShot && !isHit && <span className="text-slate-600 text-xl">○</span>}
        </button>
    )
}