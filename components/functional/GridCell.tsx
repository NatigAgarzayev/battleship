import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import React, { useState } from 'react'

export default function GridCell({ isThereShip, isOver, row, col, isInteractive, handleCellAttack }: { isThereShip: boolean, isOver: boolean, row: number, col: number, isInteractive: boolean, handleCellAttack: (row: number, col: number) => void }) {
    const { setNodeRef } = useDroppable({
        id: `${row}-${col}`,
        data: { row, col }
    })

    return (
        <button
            ref={setNodeRef}
            key={col}
            onClick={() => isInteractive && handleCellAttack(row, col)}
            className={`w-8 h-8 border border-blue-400 transition-all duration-200 ${isOver ? 'bg-red-600' : ''} ${isThereShip ? 'bg-gray-700' : 'bg-blue-300'}`}
        >
        </button>
    )
}
