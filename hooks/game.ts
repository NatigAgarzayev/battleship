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
export const createGame = async (playerName?: string) => {
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const playerId = 'player-' + Math.random().toString(36).substring(2, 15)

    localStorage.setItem('currentPlayerId', playerId)

    const { data, error } = await supabase
        .from('games')
        .insert({
            game_code: gameCode,
            player1_id: playerId,
            player1_name: playerName || null,
            status: 'setup', // Player 1 positioning ships
            player1_ready: false,
            player2_ready: false
        })
        .select()
        .single()

    if (error) throw error
    return { game: data, playerId }
}

// Join game
export const joinGame = async (gameCode: string, playerName?: string) => {
    const playerId = 'player-' + Math.random().toString(36).substring(2, 15)

    localStorage.setItem('currentPlayerId', playerId)

    const { data, error } = await supabase
        .from('games')
        .update({
            player2_id: playerId,
            player2_name: playerName || null,
            status: 'ready', // Both players now in game, but P2 needs to set up
            player2_ready: false // Explicitly set P2 as not ready
        })
        .eq('game_code', gameCode)
        .eq('status', 'waiting') // Only join if waiting
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
        // Don't change status yet - wait for PvP/Bot choice
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