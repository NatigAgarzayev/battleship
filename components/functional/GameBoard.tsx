'use client'
import { IGameData } from '@/types/game'
import React, { useEffect, useState } from 'react'
import GameGrid from './GameGrid'
import { DndContext } from '@dnd-kit/core'

export default function GameBoard({ gameState }: { gameState: IGameData }) {
    const [currentPlayerId, setCurrentPlayerId] = useState<string>('')

    useEffect(() => {
        const playerId = localStorage.getItem('currentPlayerId')
        if (playerId) {
            setCurrentPlayerId(playerId)
        }
    }, [])

    const handleDragStart = (event: any) => {
        console.log("Drag started", event)
    }

    const handleDragEnd = (event: any) => {
        console.log("Drag ended", event)
    }

    const isPlayer1 = currentPlayerId === gameState.player1_id
    const isPlayer2 = currentPlayerId === gameState.player2_id

    if (!currentPlayerId) return <div>Loading...</div>

    const yourShots = isPlayer1 ? gameState.player1_shots : gameState.player2_shots
    const opponentShots = isPlayer1 ? gameState.player2_shots : gameState.player1_shots

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-8">
                {/* Your board - render ONLY for the current player */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">Your Board</h2>
                    {isPlayer1 ? (
                        <GameGrid
                            gameCode={gameState.game_code}
                            playerId={gameState.player1_id}
                            playerShips={gameState.player1_ships}
                            playerName={gameState.player1_name}
                            isReady={gameState.player1_ready}
                            isYourBoard={true}
                            status={gameState.status}
                            isYourTurn={gameState.current_turn === currentPlayerId}
                            shots={opponentShots}
                        />
                    ) : (
                        <GameGrid
                            gameCode={gameState.game_code}
                            playerId={gameState.player2_id!}
                            playerShips={gameState.player2_ships}
                            playerName={gameState.player2_name}
                            isReady={gameState.player2_ready}
                            isYourBoard={true}
                            status={gameState.status}
                            isYourTurn={gameState.current_turn === currentPlayerId}
                            shots={opponentShots}
                        />
                    )}
                </div>

                {/* Opponent's board - only during active game */}
                {gameState.status === "active" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Opponent's Board</h2>
                        {isPlayer1 ? (
                            <GameGrid
                                gameCode={gameState.game_code}
                                playerId={gameState.player2_id!}
                                playerShips={gameState.player2_ships}
                                playerName={gameState.player2_name}
                                isReady={gameState.player2_ready}
                                isYourBoard={false}
                                status={gameState.status}
                                isYourTurn={gameState.current_turn === currentPlayerId}
                                shots={yourShots}
                            />
                        ) : (
                            <GameGrid
                                gameCode={gameState.game_code}
                                playerId={gameState.player1_id}
                                playerShips={gameState.player1_ships}
                                playerName={gameState.player1_name}
                                isReady={gameState.player1_ready}
                                isYourBoard={false}
                                status={gameState.status}
                                isYourTurn={gameState.current_turn === currentPlayerId}
                                shots={yourShots}
                            />
                        )}
                    </div>
                )}
            </div>
        </DndContext>
    )
}