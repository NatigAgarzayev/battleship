'use client'
import { IGameData } from '@/types/game'
import React, { useEffect, useRef, useState } from 'react'
import GameGrid from './GameGrid'
import { DndContext } from '@dnd-kit/core'
import { checkOpponentConnection, executeBotTurn, forfeitGame, makeRandomAttack, markPlayerDisconnected, updatePresence } from '@/hooks/game'
import { TriangleAlert, Undo2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import GameOverBanner from './GameOverBanner'

const TURN_TIME_LIMIT = 60 // 60 seconds
const PRESENCE_INTERVAL = 5000 // Send heartbeat every 5 seconds
const DISCONNECT_THRESHOLD = 30 // Forfeit after 30 seconds of disconnect

export default function GameBoard({ gameState }: { gameState: IGameData }) {
    const [currentPlayerId, setCurrentPlayerId] = useState<string>('')
    const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT)
    const [hasAutoAttacked, setHasAutoAttacked] = useState(false)
    const [opponentDisconnected, setOpponentDisconnected] = useState(false)
    const [disconnectDuration, setDisconnectDuration] = useState(0)

    const router = useRouter()

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

    useEffect(() => {
        // Check if it's bot's turn
        const isBotTurn = gameState.current_turn?.startsWith('bot-')

        if (gameState.status === 'active' && isBotTurn) {
            // Add a small delay to make it feel more natural (0.5-1.5 seconds)
            const delay = 500 + Math.random() * 1000

            const timer = setTimeout(async () => {
                try {
                    console.log('🤖 Bot is thinking...')
                    await executeBotTurn(gameState.game_code)
                } catch (error) {
                    console.error('Bot move error:', error)
                }
            }, delay)

            return () => clearTimeout(timer)
        }
    }, [gameState.status, gameState.current_turn, gameState.game_code])

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

    const handleLeaveGame = async (gameState: IGameData) => {
        try {
            if (gameState.status === 'active') {
                await forfeitGame(gameState.game_code, currentPlayerId)
            }

            router.push('/')
        } catch (error) {
            console.error('Error leaving game:', error)
            alert('Failed to leave game. Please try again.')
        }
    }

    return (
        <DndContext>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="absolute top-6 left-6">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            <Undo2 className="w-5 h-5" />
                            <span className="text-sm font-semibold">Leave</span>
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="rounded-3xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic text-slate-900">
                            Leave Battle?
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 text-base">
                            Are you sure you want to abandon this battle? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        {/* Warning Box */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <TriangleAlert size={20} className="text-red-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-red-900 mb-1">Consequences:</h4>
                                    <ul className="text-sm text-red-800 space-y-1">
                                        <li>• You will automatically lose this game</li>
                                        <li>• Your opponent will be declared the winner</li>
                                        <li>• This game cannot be resumed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 py-6 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={() => handleLeaveGame(gameState)}
                                    className="flex-1 py-6 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all cursor-pointer"
                                >
                                    Leave Battle
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
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
                    <GameOverBanner
                        gameState={gameState}
                        isWinner={(isPlayer1 && gameState.winner === gameState.player1_id) ||
                            (isPlayer2 && gameState.winner === gameState.player2_id)}
                    />
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