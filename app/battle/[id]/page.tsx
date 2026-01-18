'use client'
import { use, useEffect, useState } from 'react'
import { fetchGame } from '@/hooks/game'
import { IGameData } from '@/types/game'
import GameBoard from '@/components/functional/GameBoard'
import { supabase } from '@/lib/supabase'

export default function Battle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const [gameState, setGameState] = useState<IGameData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        // Initial fetch
        const fetchGameFunction = async () => {
            try {
                const data = await fetchGame(id)
                if (!isMounted) return

                if (!data) {
                    setError('Game not found')
                    setLoading(false)
                    return
                }
                setGameState(data)
                setLoading(false)
            } catch (err) {
                if (!isMounted) return
                console.error('Error fetching game:', err)
                setError('Failed to load game')
                setLoading(false)
            }
        }

        fetchGameFunction()

        // Subscribe to changes
        const channel = supabase
            .channel(`game-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'games',
                    filter: `game_code=eq.${id}`
                },
                (payload) => {
                    console.log('Change received!', payload)
                    if (isMounted && payload.new) {
                        setGameState(payload.new as IGameData)
                    }
                }
            )
            .subscribe()

        // Cleanup
        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading game...</div>
            </div>
        )
    }

    console.log("Rendering game state:", gameState)

    if (error || !gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-red-600 mb-4">{error || 'Game not found'}</div>
                    <a href="/" className="text-blue-600 hover:underline">Return to home</a>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[url('/battleship-background.jpg')] min-h-screen bg-cover flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-800">
                Battleship Game: {gameState.game_code}
            </h1>
            <GameBoard gameState={gameState} />
        </div>
    )
}