'use client'
import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Battle({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    const [gameState, setGameState] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log("game code", id)

    useEffect(() => {
        // Fetch initial game state
        const fetchGame = async () => {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('game_code', id)
                .single()

            if (error) {
                console.error('Error fetching game:', error)
            } else {
                setGameState(data)
            }
            setLoading(false)
        }

        fetchGame()

        // Subscribe to changes
        const channel = supabase
            .channel('game-changes')
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
                    setGameState(payload.new)
                }
            )
            .subscribe()

        // Cleanup
        return () => {
            supabase.removeChannel(channel)
        }
    }, [id])

    console.log("GAME STATE", gameState)

    if (loading) return <div>Loading...</div>

    if (!gameState) return <div>Game not found</div>

    return <div>Battle UI: {gameState.game_code}</div>
}