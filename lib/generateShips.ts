import { SHIP_TYPES } from "@/constants/ships"
import { IShipsLocation } from "@/types/game"

const generateBotShips = (): IShipsLocation[] => {
    const SIZE = 10
    const ships: IShipsLocation[] = []
    const occupiedCells = new Set<string>()

    // Helper to check if position is valid
    const isValidPosition = (cells: string[]): boolean => {
        for (const cell of cells) {
            const [row, col] = cell.split('-').map(Number)

            // Check bounds
            if (row >= SIZE || col >= SIZE) return false

            // Check if cell is occupied or adjacent
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const checkCell = `${row + dr}-${col + dc}`
                    if (occupiedCells.has(checkCell)) return false
                }
            }
        }
        return true
    }

    // Place each ship
    for (const shipType of SHIP_TYPES) {
        let placed = false
        let attempts = 0

        while (!placed && attempts < 100) {
            attempts++

            const isHorizontal = Math.random() > 0.5
            const row = Math.floor(Math.random() * SIZE)
            const col = Math.floor(Math.random() * SIZE)

            const cells: string[] = []
            for (let i = 0; i < shipType.length; i++) {
                if (isHorizontal) {
                    cells.push(`${row}-${col + i}`)
                } else {
                    cells.push(`${row + i}-${col}`)
                }
            }

            if (isValidPosition(cells)) {
                ships.push({
                    ship_info: {
                        id: shipType.id,
                        name: shipType.name,
                        length: shipType.length
                    },
                    ship_coordinates: cells
                })

                // Mark cells as occupied
                cells.forEach(cell => occupiedCells.add(cell))
                placed = true
            }
        }
    }

    return ships
}

export default generateBotShips