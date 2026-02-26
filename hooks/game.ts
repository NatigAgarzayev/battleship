import { makeBotMove } from "@/lib/botAI"
import generateBotShips from "@/lib/generateShips"
import { getShipBorderCells } from "@/lib/getShipBorderCells"
import { supabase } from "@/lib/supabase"
import { IShipsLocation } from "@/types/game"

// fetch game
export const fetchGame = async (gameCode: string) => {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    return data
}

// Create game
export const createGame = async (playerName: string | undefined, gameType: 'pvp' | 'bot') => {
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const playerId = 'player-' + Math.random().toString(36).substring(2, 15)

    localStorage.setItem('currentPlayerId', playerId)

    const gameData: any = {
        game_code: gameCode,
        player1_id: playerId,
        player1_name: playerName || null,
        status: 'setup',
        game_type: gameType,
        player1_ready: false,
        player2_ready: false
    }

    // If bot mode, create bot player immediately
    if (gameType === 'bot') {
        const botId = 'bot-' + Math.random().toString(36).substring(2, 15)
        gameData.player2_id = botId
        gameData.player2_name = 'Bot'
        gameData.player2_ships = generateBotShips()
        gameData.player2_ready = true
    }

    const { data, error } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

    if (error) throw error
    return { game: data, playerId }
}

// Join game
export const joinGame = async (gameCode: string, playerName?: string) => {
    const playerId = 'player-' + Math.random().toString(36).substring(2, 15)

    localStorage.setItem('currentPlayerId', playerId)

    // Check if game exists and is joinable
    const { data: existingGame, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (fetchError || !existingGame) {
        throw new Error('Game not found')
    }

    if (existingGame.game_type !== 'pvp') {
        throw new Error('Cannot join a bot game')
    }

    if (existingGame.player2_id) {
        throw new Error('Game is already full')
    }

    // Join the game
    const { data, error } = await supabase
        .from('games')
        .update({
            player2_id: playerId,
            player2_name: playerName || null,
            player2_ready: false
        })
        .eq('game_code', gameCode)
        .is('player2_id', null)
        .select()
        .single()

    if (error) throw error
    return { game: data, playerId }
}

// Update game (make a move)
export const makeMove = async (gameCode: string, updates: any) => {
    const { data, error } = await supabase
        .from('games')
        .update(updates)
        .eq('game_code', gameCode)
        .select()
        .single()

    return data
}

export const setPlayerReady = async (gameCode: string, playerId: string, ships: IShipsLocation[]) => {
    const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (!game) throw new Error('Game not found')

    const isPlayer1 = game.player1_id === playerId

    const updates: any = {
        updated_at: new Date().toISOString()
    }

    if (isPlayer1) {
        updates.player1_ships = ships
        updates.player1_ready = true

        // If both ready, start game
        if (game.player2_ready) {
            updates.status = 'active'
            updates.current_turn = game.player1_id
            updates.turn_started_at = new Date().toISOString() // Add turn start time
        }
    } else {
        updates.player2_ships = ships
        updates.player2_ready = true

        // If both ready, start game
        if (game.player1_ready) {
            updates.status = 'active'
            updates.current_turn = game.player1_id
            updates.turn_started_at = new Date().toISOString() // Add turn start time
        }
    }

    const { data, error } = await supabase
        .from('games')
        .update(updates)
        .eq('game_code', gameCode)
        .select()
        .single()

    if (error) throw error
    return data
}

export const chooseGameMode = async (gameCode: string, gameType: 'pvp' | 'bot') => {
    const updates: any = {
        game_type: gameType,
        updated_at: new Date().toISOString()
    }

    if (gameType === 'bot') {
        const botId = 'bot-' + Math.random().toString(36).substring(2, 15)
        updates.player2_id = botId
        updates.player2_name = 'Bot'
        updates.player2_ready = true
        updates.status = 'active'
        updates.current_turn = updates.player1_id || (await supabase.from('games').select('player1_id').eq('game_code', gameCode).single()).data?.player1_id
        updates.player2_ships = generateBotShips()
    } else {
        updates.status = 'waiting'
    }

    const { data, error } = await supabase
        .from('games')
        .update(updates)
        .eq('game_code', gameCode)
        .select()
        .single()

    if (error) throw error
    return data
}

export const makeAttack = async (
    gameCode: string,
    playerId: string,
    targetCell: string
): Promise<{ isHit: boolean; shipSunk: boolean; gameWon: boolean }> => {
    const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (fetchError || !game) {
        throw new Error('Game not found')
    }

    // Determine which player is attacking
    const isPlayer1 = playerId === game.player1_id
    const attackerShots = isPlayer1 ? game.player1_shots : game.player2_shots
    const defenderShips = isPlayer1 ? game.player2_ships : game.player1_ships

    // Check if cell was already attacked
    if (attackerShots.includes(targetCell)) {
        throw new Error('Cell already attacked')
    }

    // Check if it's a hit
    const isHit = defenderShips.some((ship: IShipsLocation) =>
        ship.ship_coordinates.includes(targetCell)
    )

    // Add the shot
    const updatedShots = [...attackerShots, targetCell]

    // Check if a ship was sunk
    let shipSunk = false
    let borderCells: string[] = []

    if (isHit) {
        const hitShip = defenderShips.find((ship: IShipsLocation) =>
            ship.ship_coordinates.includes(targetCell)
        )

        if (hitShip) {
            const allHit = hitShip.ship_coordinates.every((coord: string) =>
                updatedShots.includes(coord)
            )

            if (allHit) {
                shipSunk = true
                // Get border cells for the sunk ship
                borderCells = getShipBorderCells(hitShip.ship_coordinates)

                // Add border cells to shots (filter out already shot cells)
                borderCells.forEach(cell => {
                    if (!updatedShots.includes(cell)) {
                        updatedShots.push(cell)
                    }
                })

                console.log(`🚢 Ship sunk! Marking ${borderCells.length} border cells`)
            }
        }
    }

    // Check if all ships are sunk (game won)
    const allShipsSunk = defenderShips.every((ship: IShipsLocation) =>
        ship.ship_coordinates.every((coord: string) => updatedShots.includes(coord))
    )

    // Update the game
    const updateData = isPlayer1
        ? {
            player1_shots: updatedShots,
            current_turn: allShipsSunk ? null : game.player2_id,
            status: allShipsSunk ? 'finished' : 'active',
            winner: allShipsSunk ? game.player1_id : null,
            turn_started_at: allShipsSunk ? null : new Date().toISOString()
        }
        : {
            player2_shots: updatedShots,
            current_turn: allShipsSunk ? null : game.player1_id,
            status: allShipsSunk ? 'finished' : 'active',
            winner: allShipsSunk ? game.player2_id : null,
            turn_started_at: allShipsSunk ? null : new Date().toISOString()
        }

    const { error: updateError } = await supabase
        .from('games')
        .update(updateData)
        .eq('game_code', gameCode)

    if (updateError) {
        throw new Error('Failed to update game')
    }

    return {
        isHit,
        shipSunk,
        gameWon: allShipsSunk
    }
}

export const makeRandomAttack = async (gameCode: string, attackingPlayerId: string) => {
    // Get current game state
    const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (fetchError || !game) {
        throw new Error('Game not found')
    }

    // Verify it's the attacker's turn
    if (game.current_turn !== attackingPlayerId) {
        throw new Error('Not your turn!')
    }

    const isPlayer1 = game.player1_id === attackingPlayerId
    const shotsKey = isPlayer1 ? 'player1_shots' : 'player2_shots'
    const currentShots = game[shotsKey] || []

    // Generate list of all cells
    const allCells: string[] = []
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            allCells.push(`${row}-${col}`)
        }
    }

    // Filter out already attacked cells
    const availableCells = allCells.filter(cell => !currentShots.includes(cell))

    if (availableCells.length === 0) {
        throw new Error('No cells left to attack')
    }

    // Pick a random cell
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)]

    console.log(`⏰ Time expired! Auto-attacking random cell: ${randomCell}`)

    // Use the existing makeAttack function
    return await makeAttack(gameCode, attackingPlayerId, randomCell)
}

export const updatePresence = async (gameCode: string, playerId: string) => {
    const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (!game) return

    const isPlayer1 = game.player1_id === playerId
    const updates: any = {
        updated_at: new Date().toISOString()
    }

    if (isPlayer1) {
        updates.player1_last_seen = new Date().toISOString()
        updates.player1_connected = true
    } else {
        updates.player2_last_seen = new Date().toISOString()
        updates.player2_connected = true
    }

    await supabase
        .from('games')
        .update(updates)
        .eq('game_code', gameCode)
}

// Mark player as disconnected
export const markPlayerDisconnected = async (gameCode: string, playerId: string) => {
    const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (!game) return

    const isPlayer1 = game.player1_id === playerId
    const updates: any = {
        updated_at: new Date().toISOString()
    }

    if (isPlayer1) {
        updates.player1_connected = false
    } else {
        updates.player2_connected = false
    }

    await supabase
        .from('games')
        .update(updates)
        .eq('game_code', gameCode)
}

// Check if opponent is disconnected (hasn't sent heartbeat in 15 seconds)
export const checkOpponentConnection = async (gameCode: string, currentPlayerId: string) => {
    const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (!game) return { isConnected: true, disconnectedFor: 0 }

    const isPlayer1 = game.player1_id === currentPlayerId
    const opponentLastSeen = isPlayer1 ? game.player2_last_seen : game.player1_last_seen
    const opponentConnected = isPlayer1 ? game.player2_connected : game.player1_connected

    if (!opponentLastSeen || !opponentConnected) {
        return { isConnected: false, disconnectedFor: 0 }
    }

    const lastSeenTime = new Date(opponentLastSeen).getTime()
    const currentTime = new Date().getTime()
    const disconnectedFor = Math.floor((currentTime - lastSeenTime) / 1000)

    // Consider disconnected if no heartbeat for 15 seconds
    const isConnected = disconnectedFor < 15

    return { isConnected, disconnectedFor }
}

// Forfeit game due to abandonment
export const forfeitGame = async (gameCode: string, disconnectedPlayerId: string) => {
    const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (!game) return

    const winnerId = game.player1_id === disconnectedPlayerId
        ? game.player2_id
        : game.player1_id

    await supabase
        .from('games')
        .update({
            status: 'abandoned',
            winner: winnerId,
            current_turn: null,
            turn_started_at: null,
            updated_at: new Date().toISOString()
        })
        .eq('game_code', gameCode)
}

export const executeBotTurn = async (gameCode: string) => {
    // Get current game state
    const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()

    if (fetchError || !game) {
        throw new Error('Game not found')
    }

    // Verify it's bot's turn
    if (!game.current_turn?.startsWith('bot-')) {
        throw new Error('Not bot\'s turn!')
    }

    // Verify game is active
    if (game.status !== 'active') {
        throw new Error('Game is not active')
    }

    // Get bot's next move using AI
    const targetCell = makeBotMove(game)

    console.log(`🤖 Bot attacking cell: ${targetCell}`)

    // Execute the attack
    return await makeAttack(gameCode, game.player2_id!, targetCell)
}
