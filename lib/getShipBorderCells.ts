export const getShipBorderCells = (shipCoordinates: string[]): string[] => {
    const borderCells = new Set<string>()

    shipCoordinates.forEach(coord => {
        const [row, col] = coord.split('-').map(Number)

        // Check all 8 surrounding cells
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                // Skip the ship cell itself
                if (dr === 0 && dc === 0) continue

                const newRow = row + dr
                const newCol = col + dc
                const borderCell = `${newRow}-${newCol}`

                // Only add if it's within bounds and not part of the ship
                if (
                    newRow >= 0 && newRow < 10 &&
                    newCol >= 0 && newCol < 10 &&
                    !shipCoordinates.includes(borderCell)
                ) {
                    borderCells.add(borderCell)
                }
            }
        }
    })

    return Array.from(borderCells)
}