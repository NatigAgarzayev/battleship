import React from 'react'

// Grid component
export function GameGrid({
    size = 10,
    ships = [],
    shots = [],
    onCellClick,
    isInteractive = true
}) {
    return (
        <div className="inline-block">
            {/* Column labels */}
            <div className="grid grid-cols-11 gap-1 mb-1">
                <div></div>
                {Array.from({ length: size }, (_, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Grid with row labels */}
            {Array.from({ length: size }, (_, row) => (
                <div key={row} className="grid grid-cols-11 gap-1 mb-1">
                    {/* Row label */}
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {String.fromCharCode(65 + row)}
                    </div>

                    {/* Grid cells */}
                    {Array.from({ length: size }, (_, col) => {
                        const hasShip = ships.some(s => s.row === row && s.col === col)
                        const shot = shots.find(s => s.row === row && s.col === col)
                        const isHit = shot && hasShip
                        const isMiss = shot && !hasShip

                        return (
                            <button
                                key={col}
                                onClick={() => isInteractive && onCellClick(row, col)}
                                disabled={!isInteractive || !!shot}
                                className={`
                  w-8 h-8 border-2 border-blue-400 
                  transition-all duration-200
                  ${isInteractive && !shot ? 'hover:bg-blue-200 cursor-pointer' : ''}
                  ${hasShip ? 'bg-gray-700' : 'bg-blue-50'}
                  ${isHit ? 'bg-red-500' : ''}
                  ${isMiss ? 'bg-gray-300' : ''}
                  ${!isInteractive ? 'cursor-not-allowed' : ''}
                `}
                            >
                                {isHit && '💥'}
                                {isMiss && '●'}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}