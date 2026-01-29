import { IGameData, IShipsLocation } from '@/types/game'

interface BotState {
    mode: 'hunt' | 'target'
    lastHit: string | null
    targetQueue: string[]
    hitShips: string[]
}

class BattleshipBot {
    private state: BotState = {
        mode: 'hunt',
        lastHit: null,
        targetQueue: [],
        hitShips: []
    }

    /**
     * Main function to decide bot's next move
     */
    public getNextMove(game: IGameData): string {
        const botShots = game.player2_shots || []
        const playerShips = game.player1_ships || []

        // Update state based on previous shots
        this.updateState(botShots, playerShips)

        // If we're in target mode and have targets in queue, attack them
        if (this.state.mode === 'target' && this.state.targetQueue.length > 0) {
            return this.targetMode(botShots)
        }

        // Otherwise, hunt for new ships
        return this.huntMode(botShots)
    }

    /**
     * Update bot state based on previous shots
     */
    private updateState(botShots: string[], playerShips: IShipsLocation[]) {
        // Find all hits
        const allPlayerCells = playerShips.flatMap(ship => ship.ship_coordinates)
        this.state.hitShips = botShots.filter(shot => allPlayerCells.includes(shot))

        // If we have hits but no targets queued, we need to find adjacent cells
        if (this.state.hitShips.length > 0 && this.state.targetQueue.length === 0) {
            // Check if last hit is part of unsunk ship
            const lastShot = botShots[botShots.length - 1]
            if (lastShot && allPlayerCells.includes(lastShot)) {
                this.state.mode = 'target'
                this.state.lastHit = lastShot
                this.queueAdjacentCells(lastShot, botShots)
            }
        }

        // If target queue is empty, switch back to hunt mode
        if (this.state.targetQueue.length === 0) {
            this.state.mode = 'hunt'
            this.state.lastHit = null
        }
    }

    /**
     * Hunt mode - use probability to find ships
     */
    private huntMode(botShots: string[]): string {
        const availableCells = this.getAvailableCells(botShots)

        // Use checkerboard pattern for efficiency (most likely to hit ships)
        const checkerboardCells = availableCells.filter(cell => {
            const [row, col] = cell.split('-').map(Number)
            return (row + col) % 2 === 0
        })

        if (checkerboardCells.length > 0) {
            // Pick random from checkerboard pattern
            return checkerboardCells[Math.floor(Math.random() * checkerboardCells.length)]
        }

        // Fallback to any available cell
        return availableCells[Math.floor(Math.random() * availableCells.length)]
    }

    /**
     * Target mode - finish off a ship we've hit
     */
    private targetMode(botShots: string[]): string {
        // Get next target from queue
        while (this.state.targetQueue.length > 0) {
            const target = this.state.targetQueue.shift()!

            // Make sure it's valid and not already shot
            if (this.isValidCell(target) && !botShots.includes(target)) {
                return target
            }
        }

        // Queue is empty or all invalid, switch to hunt mode
        this.state.mode = 'hunt'
        return this.huntMode(botShots)
    }

    /**
     * Queue adjacent cells when we hit a ship
     */
    private queueAdjacentCells(cell: string, botShots: string[]) {
        const [row, col] = cell.split('-').map(Number)

        // Check if we have multiple hits in a row (ship orientation known)
        const adjacentHits = this.getAdjacentHits(cell, botShots)

        if (adjacentHits.length > 0) {
            // We know the orientation, prioritize that direction
            const direction = this.getDirection(cell, adjacentHits[0])
            this.queueDirectionalCells(cell, direction, botShots)
        } else {
            // Try all 4 directions
            const adjacent = [
                `${row - 1}-${col}`, // Up
                `${row + 1}-${col}`, // Down
                `${row}-${col - 1}`, // Left
                `${row}-${col + 1}`  // Right
            ]

            // Add valid, unshot cells to queue
            adjacent.forEach(adjCell => {
                if (this.isValidCell(adjCell) && !botShots.includes(adjCell)) {
                    this.state.targetQueue.push(adjCell)
                }
            })
        }
    }

    /**
     * Queue cells in a specific direction
     */
    private queueDirectionalCells(cell: string, direction: 'horizontal' | 'vertical', botShots: string[]) {
        const [row, col] = cell.split('-').map(Number)

        if (direction === 'horizontal') {
            // Add left and right
            const left = `${row}-${col - 1}`
            const right = `${row}-${col + 1}`

            if (this.isValidCell(left) && !botShots.includes(left)) {
                this.state.targetQueue.unshift(left) // Add to front
            }
            if (this.isValidCell(right) && !botShots.includes(right)) {
                this.state.targetQueue.unshift(right)
            }
        } else {
            // Add up and down
            const up = `${row - 1}-${col}`
            const down = `${row + 1}-${col}`

            if (this.isValidCell(up) && !botShots.includes(up)) {
                this.state.targetQueue.unshift(up)
            }
            if (this.isValidCell(down) && !botShots.includes(down)) {
                this.state.targetQueue.unshift(down)
            }
        }
    }

    /**
     * Get adjacent cells that were also hits
     */
    private getAdjacentHits(cell: string, botShots: string[]): string[] {
        const [row, col] = cell.split('-').map(Number)
        const adjacent = [
            `${row - 1}-${col}`,
            `${row + 1}-${col}`,
            `${row}-${col - 1}`,
            `${row}-${col + 1}`
        ]

        return adjacent.filter(adjCell => this.state.hitShips.includes(adjCell))
    }

    /**
     * Determine if two cells are horizontal or vertical neighbors
     */
    private getDirection(cell1: string, cell2: string): 'horizontal' | 'vertical' {
        const [row1, col1] = cell1.split('-').map(Number)
        const [row2, col2] = cell2.split('-').map(Number)

        if (row1 === row2) return 'horizontal'
        return 'vertical'
    }

    /**
     * Get all cells that haven't been shot yet
     */
    private getAvailableCells(botShots: string[]): string[] {
        const allCells: string[] = []
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = `${row}-${col}`
                if (!botShots.includes(cell)) {
                    allCells.push(cell)
                }
            }
        }
        return allCells
    }

    /**
     * Check if a cell is within the 10x10 grid
     */
    private isValidCell(cell: string): boolean {
        const [row, col] = cell.split('-').map(Number)
        return row >= 0 && row < 10 && col >= 0 && col < 10
    }

    /**
     * Reset bot state (for new game)
     */
    public reset() {
        this.state = {
            mode: 'hunt',
            lastHit: null,
            targetQueue: [],
            hitShips: []
        }
    }
}

// Export singleton instance
export const battleshipBot = new BattleshipBot()

// Helper function to make bot move
export const makeBotMove = (game: IGameData): string => {
    return battleshipBot.getNextMove(game)
}