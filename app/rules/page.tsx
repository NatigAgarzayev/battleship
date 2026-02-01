import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Anchor, Ship, Target, Trophy, Grid3x3, Users, ArrowLeft, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-[#f0f9ff] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="mb-6 text-slate-600 hover:text-slate-900 hover:bg-white cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Lobby
                        </Button>
                    </Link>

                    <div className="text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-sky-100 mb-4">
                            <Ship className="w-12 h-12 text-sky-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic mb-3">
                            How to Play
                        </h1>
                        <p className="text-slate-600 text-lg font-medium">
                            Master the art of naval warfare and sink your opponent's fleet!
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Game Objective */}
                    <Card className="rounded-2xl shadow-lg border-2 border-[#bae6fd] overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
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
                    <Card className="rounded-2xl shadow-lg border-2 border-[#bae6fd] overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Ship className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Your Fleet</h2>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <p className="text-slate-700 mb-6 font-medium">
                                You command a fleet of 5 ships. Each ship occupies a different number of cells:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-12 h-12 flex items-center justify-center text-xl">
                                        5
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Carrier</div>
                                        <div className="text-sm text-slate-600">5 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-12 h-12 flex items-center justify-center text-xl">
                                        4
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Battleship</div>
                                        <div className="text-sm text-slate-600">4 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-12 h-12 flex items-center justify-center text-xl">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Cruiser</div>
                                        <div className="text-sm text-slate-600">3 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-12 h-12 flex items-center justify-center text-xl">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Submarine</div>
                                        <div className="text-sm text-slate-600">3 cells</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="bg-sky-500 text-white font-black rounded-lg w-12 h-12 flex items-center justify-center text-xl">
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
                    <Card className="rounded-2xl shadow-lg border-2 border-[#bae6fd] overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Grid3x3 className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Setup Phase</h2>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                                    Place Your Ships
                                </h3>
                                <p className="text-slate-700 ml-10">
                                    Drag and drop each ship onto your 10×10 grid. Ships can be placed horizontally or vertically.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                                    Rotate Ships
                                </h3>
                                <p className="text-slate-700 ml-10">
                                    Double-click a placed ship to rotate it 90 degrees. Use the orientation toggle to change the default placement direction.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                                    Follow Placement Rules
                                </h3>
                                <ul className="text-slate-700 ml-10 space-y-2">
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
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                                    Ready Up
                                </h3>
                                <p className="text-slate-700 ml-10">
                                    Once all 5 ships are placed, click "I'm Ready!" to lock in your fleet and wait for your opponent.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Battle Phase */}
                    <Card className="rounded-2xl shadow-lg border-2 border-[#bae6fd] overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Battle Phase</h2>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                                    Take Turns Attacking
                                </h3>
                                <p className="text-slate-700 ml-10">
                                    Players alternate turns. On your turn, you have 60 seconds to click any cell on your opponent's grid to attack. If time runs out, a random cell will be attacked automatically.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                                    Read the Results
                                </h3>
                                <div className="ml-10 space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                                        <div className="text-2xl">✕</div>
                                        <div>
                                            <div className="font-bold text-red-900">Hit!</div>
                                            <div className="text-sm text-red-700">You've damaged an enemy ship (red cell)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                                        <div className="text-2xl">○</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Miss!</div>
                                            <div className="text-sm text-slate-700">No ship at this location (gray cell)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                                    Sink Ships
                                </h3>
                                <p className="text-slate-700 ml-10">
                                    When all cells of an enemy ship are hit, the ship is sunk and the surrounding cells are automatically marked. Continue until all 5 enemy ships are destroyed!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Game Modes */}
                    <Card className="rounded-2xl shadow-lg border-2 border-[#bae6fd] overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8" />
                                <h2 className="text-2xl font-black uppercase italic">Game Modes</h2>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3 p-6 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-6 h-6 text-sky-500" />
                                        <h3 className="font-black text-lg text-slate-900">vs Player</h3>
                                    </div>
                                    <p className="text-slate-700">
                                        Challenge a friend! Share your game code and battle in real-time. Perfect for competitive play.
                                    </p>
                                </div>
                                <div className="space-y-3 p-6 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                                    <div className="flex items-center gap-2">
                                        <Ship className="w-6 h-6 text-sky-500" />
                                        <h3 className="font-black text-lg text-slate-900">vs Bot</h3>
                                    </div>
                                    <p className="text-slate-700">
                                        Practice against an AI opponent that uses smart strategies. Great for learning and honing your skills.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pro Tips */}
                    <Card className="rounded-2xl shadow-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                        <CardContent className="p-8">
                            <h3 className="font-black text-2xl text-slate-900 mb-6 flex items-center gap-2">
                                <Lightbulb className="w-8 h-8 text-amber-600" />
                                <span>Pro Tips</span>
                            </h3>
                            <ul className="space-y-4 text-slate-700">
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
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-500 font-bold mt-1">→</span>
                                    <span><strong>Watch the timer:</strong> You have 60 seconds per turn - plan your move quickly!</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Ready to Play */}
                    <div className="text-center py-8">
                        <Link href="/">
                            <Button className="px-10 py-7 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black uppercase text-lg shadow-lg shadow-blue-200 hover:scale-105 transition-all cursor-pointer">
                                <Ship size={24} />
                                <span>
                                    Ready to Battle!
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer Links */}
                <footer className="mt-16 text-center border-t-2 border-[#bae6fd] pt-8">
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-4">
                        <Link href="/terms" className="hover:text-sky-600 transition-colors font-medium">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="hover:text-sky-600 transition-colors font-medium">
                            Privacy Policy
                        </Link>
                    </div>
                    <p className="text-xs text-slate-400">
                        © 2026 Battleship Game. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    )
}