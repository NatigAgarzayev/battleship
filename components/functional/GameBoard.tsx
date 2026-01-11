import { IGameData } from '@/types/game'
import React from 'react'
import GameGrid from './GameGrid'
import { DndContext } from '@dnd-kit/core'

export default function GameBoard({ gameState }: { gameState: IGameData }) {

    return (
        <DndContext>
            <div>
                {gameState.player1_id &&
                    <GameGrid playerId={gameState.player1_id} playerName={gameState.player1_name} />
                }
                {gameState.player2_id &&
                    <GameGrid playerId={gameState.player2_id} playerName={gameState.player2_name} />
                }
            </div>
        </DndContext>
    )
}
