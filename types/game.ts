// types/game.ts
export interface IGameData {
    id: string
    game_code: string
    player1_id: string
    player2_id: string | null
    player1_name: string | null
    player2_name: string | null
    player1_ships: IShipsLocation[] | null
    player2_ships: IShipsLocation[] | null
    player1_shots: string[]
    player2_shots: string[]
    player1_ready: boolean
    player2_ready: boolean
    current_turn: string | null
    status: 'setup' | 'waiting' | 'ready' | 'active' | 'finished' | 'abandoned'
    game_type: 'pvp' | 'bot'
    winner: string | null
    turn_started_at: string | null
    created_at: string
    updated_at: string
    player1_last_seen: string | null  // Add these
    player2_last_seen: string | null
    player1_connected: boolean
    player2_connected: boolean
}

interface IShipInfo {
    id: string
    name: string
    length: number
}

export interface IShipsLocation {
    ship_info: IShipInfo
    ship_coordinates: string[]
}