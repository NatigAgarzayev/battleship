'use client'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export default function GameCode({ gameCode }: { gameCode: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}?invited=${gameCode}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    return (
        <div className="inline-flex items-center gap-3 bg-white rounded-xl shadow-md border-2 border-sky-200 px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider text-sky-600 select-all block">
                    {gameCode}
                </span>
            </div>
            <button
                onClick={handleCopy}
                className="group cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95"
                title="Copy code"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                    </>
                )}
            </button>
        </div>
    )
}