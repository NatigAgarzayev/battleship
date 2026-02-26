import { battleshipBot, makeBotMove } from '../botAI'
import { IGameData, IShipsLocation } from '../../types/game'

describe('Battleship Bot AI', () => {
    // Helper to create a mock game state
    const createMockGame = (
        botShots: string[] = [],
        playerShips: IShipsLocation[] = []
    ): IGameData => ({
        id: 'test-game',
        game_code: 'TEST01',
        player1_id: 'player1',
        player2_id: 'bot-123',
        player1_name: 'Player',
        player2_name: 'Bot',
        player1_ships: playerShips,
        player2_ships: [],
        player1_shots: [],
        player2_shots: botShots,
        player1_ready: true,
        player2_ready: true,
        status: 'active',
        winner: null,
        current_turn: 'bot-123',
        game_type: 'bot',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        turn_started_at: new Date().toISOString(),
        player1_last_seen: null,
        player2_last_seen: null,
        player1_connected: true,
        player2_connected: true,
    })

    beforeEach(() => {
        // Reset bot state before each test
        battleshipBot.reset()
    })

    describe('Hunt Mode', () => {
        it('should return a valid cell coordinate', () => {
            const game = createMockGame()
            const move = makeBotMove(game)

            expect(move).toMatch(/^\d+-\d+$/)
        })

        it('should prefer checkerboard pattern cells', () => {
            const game = createMockGame()
            const moves: string[] = []

            // Get multiple moves
            for (let i = 0; i < 20; i++) {
                const move = makeBotMove({ ...game, player2_shots: moves })
                moves.push(move)
            }

            // Count checkerboard pattern moves
            const checkerboardMoves = moves.filter(move => {
                const [row, col] = move.split('-').map(Number)
                return (row + col) % 2 === 0
            })

            // Most moves should follow checkerboard pattern
            expect(checkerboardMoves.length).toBeGreaterThan(moves.length * 0.7)
        })

        it('should not repeat previous shots', () => {
            const previousShots = ['0-0', '2-2', '4-4']
            const game = createMockGame(previousShots)
            const move = makeBotMove(game)

            expect(previousShots).not.toContain(move)
        })

        it('should only return cells within 10x10 grid', () => {
            const game = createMockGame()
            const move = makeBotMove(game)
            const [row, col] = move.split('-').map(Number)

            expect(row).toBeGreaterThanOrEqual(0)
            expect(row).toBeLessThan(10)
            expect(col).toBeGreaterThanOrEqual(0)
            expect(col).toBeLessThan(10)
        })
    })

    describe('Target Mode', () => {
        it('should target adjacent cells after a hit', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['5-5', '5-6']
                }
            ]

            const botShots = ['5-5'] // Hit the ship
            const game = createMockGame(botShots, playerShips)

            const move = makeBotMove(game)

            // Should target one of the adjacent cells
            const adjacentCells = ['4-5', '6-5', '5-4', '5-6']
            expect(adjacentCells).toContain(move)
        })

        it('should continue attacking in same direction after multiple hits', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Cruiser', length: 3 },
                    ship_coordinates: ['5-5', '5-6', '5-7']
                }
            ]

            const botShots = ['5-5', '5-6'] // Hit twice horizontally
            const game = createMockGame(botShots, playerShips)

            const move = makeBotMove(game)

            // Should continue in horizontal direction
            expect(['5-4', '5-7']).toContain(move)
        })

        it('should avoid already shot cells', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['5-5', '5-6']
                }
            ]

            const botShots = ['5-5', '4-5', '6-5'] // Hit and tried adjacent cells
            const game = createMockGame(botShots, playerShips)

            const move = makeBotMove(game)

            expect(botShots).not.toContain(move)
        })
    })

    describe('State Management', () => {
        it('should switch from hunt to target mode after a hit', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['5-5', '5-6']
                }
            ]

            // First move in hunt mode
            const game1 = createMockGame([], playerShips)
            const move1 = makeBotMove(game1)

            // Second move after hitting a ship
            const game2 = createMockGame(['5-5'], playerShips)
            const move2 = makeBotMove(game2)

            // Second move should be adjacent to the hit
            const adjacentCells = ['4-5', '6-5', '5-4', '5-6']
            expect(adjacentCells).toContain(move2)
        })

        it('should reset state correctly', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['5-5', '5-6']
                }
            ]

            // Make some moves
            const game = createMockGame(['5-5'], playerShips)
            makeBotMove(game)

            // Reset
            battleshipBot.reset()

            // Should behave like a fresh start
            const freshGame = createMockGame()
            const move = makeBotMove(freshGame)

            expect(move).toMatch(/^\d+-\d+$/)
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty board', () => {
            const game = createMockGame()
            const move = makeBotMove(game)

            expect(move).toMatch(/^\d+-\d+$/)
        })

        it('should handle nearly full board', () => {
            const allCells: string[] = []
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    allCells.push(`${row}-${col}`)
                }
            }

            // Leave only one cell available
            const shotCells = allCells.slice(0, -1)
            const game = createMockGame(shotCells)
            const move = makeBotMove(game)

            expect(move).toBe('9-9') // The only remaining cell
        })

        it('should handle corner hits correctly', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['0-0', '0-1']
                }
            ]

            const botShots = ['0-0']
            const game = createMockGame(botShots, playerShips)
            const move = makeBotMove(game)

            // Should return a valid cell within bounds
            const [row, col] = move.split('-').map(Number)
            expect(row).toBeGreaterThanOrEqual(0)
            expect(row).toBeLessThan(10)
            expect(col).toBeGreaterThanOrEqual(0)
            expect(col).toBeLessThan(10)

            // Should not be already shot
            expect(botShots).not.toContain(move)
        })

        it('should handle edge hits correctly', () => {
            const playerShips: IShipsLocation[] = [
                {
                    ship_info: { id: '1', name: 'Destroyer', length: 2 },
                    ship_coordinates: ['0-5', '0-6']
                }
            ]

            const botShots = ['0-5']
            const game = createMockGame(botShots, playerShips)
            const move = makeBotMove(game)

            // Should return a valid cell within bounds
            const [row, col] = move.split('-').map(Number)
            expect(row).toBeGreaterThanOrEqual(0)
            expect(row).toBeLessThan(10)
            expect(col).toBeGreaterThanOrEqual(0)
            expect(col).toBeLessThan(10)

            // Should not be already shot
            expect(botShots).not.toContain(move)
        })
    })

    describe('Performance', () => {
        it('should make decision quickly', () => {
            const game = createMockGame()

            const startTime = Date.now()
            makeBotMove(game)
            const endTime = Date.now()

            // Should take less than 100ms
            expect(endTime - startTime).toBeLessThan(100)
        })
    })
})