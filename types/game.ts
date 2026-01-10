export interface IGameData {
    id: string
    game_code: string
    player1_id: string
    player2_id: string | null
    player1_name: string | null
    player2_name: string | null
    player1_board: null
    player2_board: null
    player1_shots: []
    player2_shots: []
    current_turn: null
    status: string
    winner: string | null
    created_at: string
    updated_at: string
}