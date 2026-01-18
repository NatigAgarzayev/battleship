import generateBotShips from "@/lib/generateShips"
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
        status: 'setup', // Both players setting up
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
        gameData.player2_ready = true // Bot is always ready
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
        .is('player2_id', null) // Ensure no one else joined
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
        }
    } else {
        updates.player2_ships = ships
        updates.player2_ready = true

        // If both ready, start game
        if (game.player1_ready) {
            updates.status = 'active'
            updates.current_turn = game.player1_id
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
        // Create bot player and start immediately
        const botId = 'bot-' + Math.random().toString(36).substring(2, 15)
        updates.player2_id = botId
        updates.player2_name = 'Bot'
        updates.player2_ready = true
        updates.status = 'active'
        updates.current_turn = updates.player1_id || (await supabase.from('games').select('player1_id').eq('game_code', gameCode).single()).data?.player1_id

        // TODO: Generate random bot ship positions
        updates.player2_ships = generateBotShips()
    } else {
        // PvP - wait for player to join
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