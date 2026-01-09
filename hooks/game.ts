import { supabase } from "@/lib/supabase"

// fetch game
export const fetchGame = async (gameCode: string) => {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', gameCode)
        .single()
    if (!error) {
        return data
    }
}

// Create game
export const createGame = async () => {
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
        .from('games')
        .insert({
            game_code: gameCode,
            player1_id: 'player-' + Math.random().toString(36).substring(7),
            status: 'waiting'
        })
        .select()
        .single()

    return data
}

// Join game
export const joinGame = async (gameCode: string, playerId: string) => {
    const { data, error } = await supabase
        .from('games')
        .update({
            player2_id: playerId,
            status: 'active'
        })
        .eq('game_code', gameCode)
        .select()
        .single()

    return data
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