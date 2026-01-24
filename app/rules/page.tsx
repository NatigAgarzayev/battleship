'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Anchor, Ship, Target, Trophy, Grid3x3, Users, ArrowLeft } from "lucide-react";

export default function RulesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f9ff]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #bae6fd 1px, transparent 0)',
            backgroundSize: '40px 40px'
        }}>
            {/* Header */}
            <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Anchor className="text-sky-500 w-8 h-8" />
                    <span className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Battleship</span>
                </div>
                <Button
                    onClick={() => router.push('/')}
                    variant="ghost"
                    className="text-sm font-bold text-slate-500 hover:text-sky-500"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Lobby
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-grow px-6 py-8 max-w-4xl mx-auto w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-2xl bg-sky-50 text-sky-500 mb-4">
                        <Ship className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-3">
                        How to Play
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Master the art of naval warfare and sink your opponent's fleet!
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Game Objective */}
                    <Card className="rounded-3xl shadow-lg border-2 border-sky-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-400 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Game Objective</h2>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <p className="text-slate-700 text-lg leading-relaxed">
                                Be the first to destroy your opponent's entire fleet by strategically attacking their grid.
                                Sink all 5 of their ships before they sink yours to claim victory!
                            </p>
                        </CardContent>
                    </Card>

                    {/* Your Fleet */}
                    <Card className="rounded-3xl shadow-lg border-2 border-sky-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-400 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Ship className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Your Fleet</h2>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <p className="text-slate-700 mb-6">
                                You command a fleet of 5 ships. Each ship occupies a different number of cells:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-10 h-10 flex items-center justify-center text-lg">
                                        5
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Carrier</div>
                                        <div className="text-sm text-slate-600">5 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-10 h-10 flex items-center justify-center text-lg">
                                        4
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Battleship</div>
                                        <div className="text-sm text-slate-600">4 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-10 h-10 flex items-center justify-center text-lg">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Cruiser</div>
                                        <div className="text-sm text-slate-600">3 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-10 h-10 flex items-center justify-center text-lg">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Submarine</div>
                                        <div className="text-sm text-slate-600">3 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-10 h-10 flex items-center justify-center text-lg">
                                        2
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Destroyer</div>
                                        <div className="text-sm text-slate-600">2 cells</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Setup Phase */}
                    <Card className="rounded-3xl shadow-lg border-2 border-sky-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-400 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Grid3x3 className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Setup Phase</h2>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span>
                                    Place Your Ships
                                </h3>
                                <p className="text-slate-700 ml-9">
                                    Drag and drop each ship onto your 10×10 grid. Ships are placed horizontally by default.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span>
                                    Follow Placement Rules
                                </h3>
                                <ul className="text-slate-700 ml-9 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span>Ships must be placed horizontally</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span>Ships cannot overlap</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span>Ships must have at least 1 cell of space between them (including diagonals)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span>Ships must stay within the grid boundaries</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">3</span>
                                    Click "I am Ready"
                                </h3>
                                <p className="text-slate-700 ml-9">
                                    Once all 5 ships are placed, click the "I am Ready" button to lock in your fleet and wait for your opponent.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Battle Phase */}
                    <Card className="rounded-3xl shadow-lg border-2 border-sky-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-400 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Battle Phase</h2>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span>
                                    Take Turns Attacking
                                </h3>
                                <p className="text-slate-700 ml-9">
                                    Players alternate turns. On your turn, click any cell on your opponent's grid to attack.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span>
                                    Read the Results
                                </h3>
                                <div className="ml-9 space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-2 border-red-200">
                                        <div className="text-2xl">💥</div>
                                        <div>
                                            <div className="font-bold text-red-900">Hit!</div>
                                            <div className="text-sm text-red-700">You've damaged an enemy ship</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
                                        <div className="text-2xl">●</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Miss!</div>
                                            <div className="text-sm text-slate-700">No ship at this location</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">3</span>
                                    Sink the Fleet
                                </h3>
                                <p className="text-slate-700 ml-9">
                                    Continue attacking until all cells of an enemy ship are hit. When all 5 enemy ships are sunk, you win!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Game Modes */}
                    <Card className="rounded-3xl shadow-lg border-2 border-sky-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-400 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Game Modes</h2>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-6 h-6 text-sky-500" />
                                        <h3 className="font-black text-lg text-slate-900">vs Player</h3>
                                    </div>
                                    <p className="text-slate-700">
                                        Challenge a friend! Share your game code and battle in real-time. Perfect for competitive play.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Ship className="w-6 h-6 text-sky-500" />
                                        <h3 className="font-black text-lg text-slate-900">vs Bot</h3>
                                    </div>
                                    <p className="text-slate-700">
                                        Practice against an AI opponent. Great for learning strategies and honing your skills.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pro Tips */}
                    <Card className="rounded-3xl shadow-lg border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                        <CardContent className="p-8">
                            <h3 className="font-black text-2xl text-slate-900 mb-4 flex items-center gap-2">
                                <span>💡</span>
                                Pro Tips
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-500 font-bold mt-1">→</span>
                                    <span><strong>Spread your ships:</strong> Don't cluster them together - make them harder to find!</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-500 font-bold mt-1">→</span>
                                    <span><strong>Use corners and edges:</strong> Ships along the edges can be harder to locate</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-500 font-bold mt-1">→</span>
                                    <span><strong>Pattern your attacks:</strong> Try checkerboard or sweeping patterns to find ships efficiently</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-500 font-bold mt-1">→</span>
                                    <span><strong>Finish what you start:</strong> When you hit a ship, keep attacking nearby cells to sink it completely</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Ready to Play */}
                    <div className="text-center py-8">
                        <Button
                            onClick={() => router.push('/')}
                            className="px-8 py-6 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase text-lg shadow-xl shadow-sky-500/25 hover:scale-105 transition-all"
                        >
                            <Ship className="w-6 h-6 mr-2" />
                            Ready to Battle!
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-6 py-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        © 2026 Naval Command Operations
                    </p>
                    <div className="flex gap-8">
                        <a className="text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors" href="#">
                            Privacy
                        </a>
                        <a className="text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors" href="#">
                            Terms
                        </a>
                        <a className="text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors" href="#">
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}