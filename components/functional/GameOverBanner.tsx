'use client'
import { IGameData } from '@/types/game'
import { Button } from '@/components/ui/button'
import { Trophy, Skull, Home, Target } from 'lucide-react'
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

            {/* Game Over Card */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[#bae6fd] p-8 md:p-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {isWinner ? (
                            <div className="bg-linear-to-br from-sky-400 to-blue-500 p-6 rounded-full shadow-xl border-4 border-sky-300 animate-bounce">
                                <Trophy className="w-16 h-16 text-white" />
                            </div>
                        ) : (
                            <div className="bg-linear-to-br from-slate-700 to-slate-800 p-6 rounded-full shadow-xl border-4 border-slate-600">
                                <Skull className="w-16 h-16 text-slate-200" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className={`text-5xl md:text-6xl font-black mb-4 tracking-tight uppercase italic text-center ${isWinner ? 'text-sky-600' : 'text-slate-700'
                        }`}>
                        {isWinner ? 'Victory!' : 'Defeat'}
                    </h2>

                    {/* Message */}
                    <p className="text-xl md:text-2xl mb-8 text-slate-600 font-semibold text-center">
                        {getMessage()}
                    </p>

                    {/* Stats */}
                    {!isAbandoned && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#f0f9ff] p-5 rounded-2xl border-2 border-[#bae6fd] shadow-sm">
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-2 font-semibold uppercase tracking-wider">
                                    <Target className="w-4 h-4" />
                                    Your Shots
                                </div>
                                <div className="text-4xl font-black text-slate-900 text-center">
                                    {gameState.player1_id === gameState.winner
                                        ? gameState.player1_shots.length
                                        : gameState.player2_shots.length}
                                </div>
                            </div>
                            <div className="bg-[#f0f9ff] p-5 rounded-2xl border-2 border-[#bae6fd] shadow-sm">
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-2 font-semibold uppercase tracking-wider">
                                    <Target className="w-4 h-4" />
                                    Enemy Shots
                                </div>
                                <div className="text-4xl font-black text-slate-900 text-center">
                                    {gameState.player1_id === gameState.winner
                                        ? gameState.player2_shots.length
                                        : gameState.player1_shots.length}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={() => router.push('/')}
                            className="flex gap-3 items-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-7 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:scale-105 transition-all uppercase tracking-tight cursor-pointer"
                        >
                            <Home size={20} />
                            <span>Back to Lobby</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}