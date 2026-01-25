'use client'
import { IGameData } from '@/types/game'
import React, { useEffect, useRef, useState } from 'react'
import GameGrid from './GameGrid'
import { DndContext } from '@dnd-kit/core'
import { checkOpponentConnection, forfeitGame, makeRandomAttack, markPlayerDisconnected, updatePresence } from '@/hooks/game'

const TURN_TIME_LIMIT = 60 // 60 seconds
const PRESENCE_INTERVAL = 5000 // Send heartbeat every 5 seconds
const DISCONNECT_THRESHOLD = 30 // Forfeit after 30 seconds of disconnect

export default function GameBoard({ gameState }: { gameState: IGameData }) {
    const [currentPlayerId, setCurrentPlayerId] = useState<string>('')
    const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT)
    const [hasAutoAttacked, setHasAutoAttacked] = useState(false)
    const [opponentDisconnected, setOpponentDisconnected] = useState(false)
    const [disconnectDuration, setDisconnectDuration] = useState(0)

    const presenceIntervalRef = useRef<NodeJS.Timeout>()
    const disconnectCheckRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        const playerId = localStorage.getItem('currentPlayerId')
        if (playerId) {
            setCurrentPlayerId(playerId)
        }
    }, [])

    const isPlayer1 = currentPlayerId === gameState.player1_id
    const isPlayer2 = currentPlayerId === gameState.player2_id
    const isMyTurn = gameState.current_turn === currentPlayerId

    useEffect(() => {
        if (!currentPlayerId || gameState.status === 'finished' || gameState.status === 'abandoned') {
            return
        }

        // Send initial presence
        updatePresence(gameState.game_code, currentPlayerId)

        // Set up heartbeat interval
        presenceIntervalRef.current = setInterval(() => {
            updatePresence(gameState.game_code, currentPlayerId)
        }, PRESENCE_INTERVAL)

        // Cleanup on unmount or visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Tab is hidden, but keep sending heartbeat
            } else {
                // Tab is visible, send immediate heartbeat
                updatePresence(gameState.game_code, currentPlayerId)
            }
        }

        const handleBeforeUnload = () => {
            markPlayerDisconnected(gameState.game_code, currentPlayerId)
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            if (presenceIntervalRef.current) {
                clearInterval(presenceIntervalRef.current)
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('beforeunload', handleBeforeUnload)

            // Mark as disconnected when component unmounts
            markPlayerDisconnected(gameState.game_code, currentPlayerId)
        }
    }, [currentPlayerId, gameState.game_code, gameState.status])

    // Check opponent connection status
    useEffect(() => {
        if (!currentPlayerId || gameState.status !== 'active') {
            setOpponentDisconnected(false)
            setDisconnectDuration(0)
            return
        }

        const checkConnection = async () => {
            const { isConnected, disconnectedFor } = await checkOpponentConnection(
                gameState.game_code,
                currentPlayerId
            )

            setOpponentDisconnected(!isConnected)
            setDisconnectDuration(disconnectedFor)

            // Auto-forfeit if opponent disconnected for 30+ seconds
            if (!isConnected && disconnectedFor >= DISCONNECT_THRESHOLD) {
                const opponentId = isPlayer1 ? gameState.player2_id : gameState.player1_id
                if (opponentId) {
                    await forfeitGame(gameState.game_code, opponentId)
                }
            }
        }

        // Check immediately
        checkConnection()

        // Check every 5 seconds
        disconnectCheckRef.current = setInterval(checkConnection, 5000)

        return () => {
            if (disconnectCheckRef.current) {
                clearInterval(disconnectCheckRef.current)
            }
        }
    }, [currentPlayerId, gameState.game_code, gameState.status, isPlayer1])

    // Calculate time left based on database timestamp
    useEffect(() => {
        if (gameState.status !== 'active' || !gameState.turn_started_at) {
            setTimeLeft(TURN_TIME_LIMIT)
            setHasAutoAttacked(false)
            return
        }

        const calculateTimeLeft = () => {
            const turnStartTime = new Date(gameState.turn_started_at!).getTime()
            const currentTime = new Date().getTime()
            const elapsedSeconds = Math.floor((currentTime - turnStartTime) / 1000)
            const remaining = Math.max(0, TURN_TIME_LIMIT - elapsedSeconds)

            setTimeLeft(remaining)
            return remaining
        }

        // Calculate immediately
        const remaining = calculateTimeLeft()

        // If time already expired and it's my turn and haven't auto-attacked yet
        if (remaining === 0 && isMyTurn && !hasAutoAttacked) {
            handleTimeExpired()
            return
        }

        // Update every second
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft()

            // If time expires and it's my turn and haven't auto-attacked yet
            if (remaining === 0 && isMyTurn && !hasAutoAttacked) {
                handleTimeExpired()
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [gameState.status, gameState.turn_started_at, gameState.current_turn, isMyTurn, hasAutoAttacked])

    // Reset auto-attack flag when turn changes
    useEffect(() => {
        setHasAutoAttacked(false)
    }, [gameState.current_turn])

    const handleTimeExpired = async () => {
        if (!isMyTurn || gameState.status !== 'active' || hasAutoAttacked) return

        setHasAutoAttacked(true)

        try {
            console.log('⏰ Time expired! Making random attack...')
            await makeRandomAttack(gameState.game_code, currentPlayerId)
        } catch (error) {
            console.error('Error making random attack:', error)
            setHasAutoAttacked(false) // Reset on error
        }
    }

    if (!currentPlayerId) return <div>Loading...</div>

    const yourShots = isPlayer1 ? gameState.player1_shots : gameState.player2_shots
    const opponentShots = isPlayer1 ? gameState.player2_shots : gameState.player1_shots

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getTimerColor = () => {
        if (timeLeft <= 10) return 'text-red-600 animate-pulse'
        if (timeLeft <= 30) return 'text-orange-600'
        return 'text-green-600'
    }

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

                {/* Timer Display */}
                {gameState.status === 'active' && isMyTurn && (
                    <div className="mb-8 flex justify-center">
                        <div className={`px-8 py-4 bg-white rounded-2xl shadow-lg border-2 transition-all ${timeLeft <= 10 ? 'border-red-300 shake' : timeLeft <= 30 ? 'border-orange-300' : 'border-green-300'
                            }`}>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    Time Remaining
                                </div>
                                <div className={`text-5xl font-black ${getTimerColor()}`}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {timeLeft <= 10 ? '⚠️ Hurry up!' : 'Make your move'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Game Over Banner */}
                {(gameState.status === 'finished' || gameState.status === 'abandoned') && (
                    <div className={`mb-8 p-6 bg-linear-to-r text-white rounded-2xl text-center shadow-xl ${(isPlayer1 && gameState.winner === gameState.player1_id) ||
                        (isPlayer2 && gameState.winner === gameState.player2_id)
                        ? 'from-green-500 to-emerald-500'
                        : 'from-red-500 to-rose-500'
                        }`}>
                        <h2 className="text-3xl font-black mb-2">
                            {(isPlayer1 && gameState.winner === gameState.player1_id) ||
                                (isPlayer2 && gameState.winner === gameState.player2_id)
                                ? '🎉 Victory!'
                                : '💔 Defeat'}
                        </h2>
                        <p className="text-lg opacity-90">
                            {gameState.status === 'abandoned'
                                ? (isPlayer1 && gameState.winner === gameState.player1_id) ||
                                    (isPlayer2 && gameState.winner === gameState.player2_id)
                                    ? 'Opponent abandoned the game!'
                                    : 'You abandoned the game!'
                                : (isPlayer1 && gameState.winner === gameState.player1_id) ||
                                    (isPlayer2 && gameState.winner === gameState.player2_id)
                                    ? 'You have destroyed the enemy fleet!'
                                    : 'Your fleet has been destroyed!'}
                        </p>
                    </div>
                )}

                {/* Setup Phase - Single Board Centered */}
                {gameState.status === 'setup' && (
                    <div>
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
                )}

                {/* Active Phase - Two Boards Side by Side */}
                {gameState.status === 'active' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Your Board - Left */}
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

                        {/* Opponent's Board - Right */}
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
                    </div>
                )}
            </div>
        </DndContext>
    )
}