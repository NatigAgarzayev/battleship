'use client'
import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchGame } from '@/hooks/game'
import { IGameData } from '@/types/game'
import { GameGrid } from '@/components/functional/GameGrid'

export default function Battle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const [gameState, setGameState] = useState<IGameData | null>(null)
    const [loading, setLoading] = useState(true)

    console.log("game code", id)

    useEffect(() => {
        // initial fetch
        const fetchGameFunction = async () => {
            const data = await fetchGame(id)
            if (!data) {
                setLoading(false)
                return
            }
            setGameState(data)
            setLoading(false)
        }

        fetchGameFunction()

    }, [id])

    // useEffect(() => {
    //     // Subscribe to changes
    //     const channel = supabase
    //         .channel('game-changes')
    //         .on(
    //             'postgres_changes',
    //             {
    //                 event: '*',
    //                 schema: 'public',
    //                 table: 'games',
    //                 filter: `game_code=eq.${id}`
    //             },
    //             (payload) => {
    //                 console.log('Change received!', payload)
    //                 setGameState(payload.new)
    //             }
    //         )
    //         .subscribe()

    //     // Cleanup
    //     return () => {
    //         supabase.removeChannel(channel)
    //     }
    // }, [id])

    console.log("GAME STATE", gameState)

    if (loading) return <div>Loading...</div>

    if (!gameState) return <div>Game not found</div>

    const handleCellAttack = (row: number, col: number) => {
        console.log(`Attacking cell at row ${row}, col ${col}`)
        // Implement attack logic here
    }

    return (
        <div className="bg-[url('/battleship-background.jpg')] min-h-screen bg-cover flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-800">Battleship Game: {gameState.game_code}</h1>
            <GameGrid onCellClick={handleCellAttack} />
        </div>
    )
}