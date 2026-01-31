'use client'
import { IGameData } from '@/types/game'
import { Button } from '@/components/ui/button'
import { Trophy, Skull, Home, RotateCcw, PartyPopper, Frown, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface GameOverBannerProps {
    gameState: IGameData
    isWinner: boolean
}

export default function GameOverBanner({ gameState, isWinner }: GameOverBannerProps) {
    const router = useRouter()
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(false)

    const isAbandoned = gameState.status === 'abandoned'

    useEffect(() => {
        if (isWinner) {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
            setShowConfetti(true)

            // Stop confetti after 5 seconds
            const timer = setTimeout(() => setShowConfetti(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [isWinner])

    const getMessage = () => {
        if (isAbandoned) {
            return isWinner
                ? 'Opponent abandoned the game!'
                : 'You abandoned the game!'
        }
        return isWinner
            ? 'You have destroyed the enemy fleet!'
            : 'Your fleet has been destroyed!'
    }

    return (
        <>
            {/* Confetti Effect for Winner */}
            {isWinner && showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#fbbf24']}
                />
            )}

            {/* Game Over Banner */}
            <div className="mb-8">
                <div className={`rounded-3xl overflow-hidden shadow-2xl border-2 ${isWinner
                    ? 'bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 border-sky-300'
                    : 'bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 border-red-300'
                    }`}>
                    {/* Decorative Top Bar */}
                    <div className={`h-1 ${isWinner
                        ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300'
                        : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600'
                        }`} />

                    <div className="p-8 md:p-12 text-center text-white relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                backgroundSize: '40px 40px'
                            }} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="mb-6 inline-block">
                                {isWinner ? (
                                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border-4 border-yellow-300 animate-bounce shadow-xl">
                                        <Trophy className="w-16 h-16 text-yellow-300" />
                                    </div>
                                ) : (
                                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border-4 border-white/40 shadow-xl">
                                        <Skull className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight uppercase italic flex items-center justify-center gap-4">
                                {isWinner ? (
                                    <>
                                        <PartyPopper className="w-12 h-12 animate-pulse" />
                                        Victory!
                                        <PartyPopper className="w-12 h-12 animate-pulse" />
                                    </>
                                ) : (
                                    <>
                                        <Frown className="w-12 h-12" />
                                        Defeat
                                        <Frown className="w-12 h-12" />
                                    </>
                                )}
                            </h2>

                            {/* Message */}
                            <p className="text-xl md:text-2xl mb-8 opacity-95 font-semibold">
                                {getMessage()}
                            </p>

                            {/* Stats */}
                            {!isAbandoned && (
                                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                                    <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/30 shadow-lg">
                                        <div className="flex items-center justify-center gap-2 text-sm opacity-90 mb-2 font-semibold uppercase tracking-wider">
                                            <Target className="w-4 h-4" />
                                            Your Shots
                                        </div>
                                        <div className="text-4xl font-black">
                                            {gameState.player1_id === gameState.winner
                                                ? gameState.player1_shots.length
                                                : gameState.player2_shots.length}
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/30 shadow-lg">
                                        <div className="flex items-center justify-center gap-2 text-sm opacity-90 mb-2 font-semibold uppercase tracking-wider">
                                            <Target className="w-4 h-4" />
                                            Enemy Shots
                                        </div>
                                        <div className="text-4xl font-black">
                                            {gameState.player1_id === gameState.winner
                                                ? gameState.player2_shots.length
                                                : gameState.player1_shots.length}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button
                                    onClick={() => router.push('/')}
                                    className="flex gap-3 items-center bg-white text-sky-600 hover:bg-slate-100 px-8 py-7 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all uppercase tracking-tight cursor-pointer"
                                >
                                    <Home size={20} />
                                    <span>
                                        Back to Lobby
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}