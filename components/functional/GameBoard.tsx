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

    const isPlayer1 = currentPlayerId === gameState.player1_id
    const isPlayer2 = currentPlayerId === gameState.player2_id

    if (!currentPlayerId) return <div>Loading...</div>

    const yourShots = isPlayer1 ? gameState.player1_shots : gameState.player2_shots
    const opponentShots = isPlayer1 ? gameState.player2_shots : gameState.player1_shots

    return (
        <DndContext>
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {gameState.status === 'setup' ? 'Ship Placement' : 'Battle in Progress'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {gameState.status === 'setup'
                            ? 'Position your fleet on the 10x10 grid'
                            : `Game Code: ${gameState.game_code}`}
                    </p>
                </div>

                {/* Game Over Banner */}
                {gameState.status === 'finished' && (
                    <div className="mb-8 p-6 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-center shadow-xl">
                        <h2 className="text-3xl font-black mb-2">
                            {(isPlayer1 && gameState.winner === gameState.player1_id) ||
                                (isPlayer2 && gameState.winner === gameState.player2_id)
                                ? '🎉 Victory!'
                                : '💔 Defeat'}
                        </h2>
                        <p className="text-lg opacity-90">
                            {(isPlayer1 && gameState.winner === gameState.player1_id) ||
                                (isPlayer2 && gameState.winner === gameState.player2_id)
                                ? 'You have destroyed the enemy fleet!'
                                : 'Your fleet has been destroyed!'}
                        </p>
                    </div>
                )}

                {/* Game Grids */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-start">
                    {/* Your Board */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Your Waters
                        </h2>
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

                    {/* Opponent's Board */}
                    {gameState.status === "active" && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Enemy Waters</h2>
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
            </div>
        </DndContext>
    )
}