import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

export default function page() {
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

                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-sky-100 p-4 rounded-2xl">
                            <Shield className="w-8 h-8 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">
                                Privacy Policy
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Last updated: February 1, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[#bae6fd] p-8 md:p-12 space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-slate-700 leading-relaxed">
                            Welcome to Battleship! We respect your privacy and are committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your data when you play our game.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            1. Information We Collect
                        </h2>
                        <div className="space-y-4 text-slate-700">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Game Data</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Player names (optional, provided by you)</li>
                                    <li>Game codes and match history</li>
                                    <li>Ship placements and game moves</li>
                                    <li>Game results and statistics</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Technical Data</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Browser type and version</li>
                                    <li>Device information</li>
                                    <li>IP address (for security purposes)</li>
                                    <li>Session data stored locally in your browser</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            2. How We Use Your Information
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>We use the collected information to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Provide and maintain the game functionality</li>
                                <li>Enable multiplayer gameplay between users</li>
                                <li>Detect and prevent cheating or abuse</li>
                                <li>Improve game performance and user experience</li>
                                <li>Troubleshoot technical issues</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Storage */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            3. Data Storage
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                Your game data is stored securely using Supabase, a trusted database provider.
                                We implement industry-standard security measures to protect your information.
                            </p>
                            <p>
                                Local storage in your browser is used to maintain your session and remember your player ID.
                                This data remains on your device and is not shared with third parties.
                            </p>
                        </div>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            4. Data Sharing
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p className="font-bold">We do not sell, trade, or rent your personal information to third parties.</p>
                            <p>Your data is only shared in the following circumstances:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>With your opponent during gameplay (game moves and results only)</li>
                                <li>When required by law or to protect our rights</li>
                                <li>With service providers who help us operate the game (under strict confidentiality agreements)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Cookies and Tracking */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            5. Cookies and Tracking
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We use local storage (similar to cookies) to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Remember your player ID across sessions</li>
                                <li>Maintain your active game state</li>
                                <li>Store game preferences</li>
                            </ul>
                            <p>
                                You can clear this data anytime by clearing your browser's local storage or cache.
                            </p>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            6. Your Rights
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>You have the right to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Access your game data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt out of data collection (though this may limit game functionality)</li>
                                <li>Update or correct your information</li>
                            </ul>
                        </div>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            7. Children's Privacy
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                Our game is suitable for all ages. We do not knowingly collect personal information from children
                                under 13 without parental consent. If you believe a child has provided us with personal information,
                                please contact us to have it removed.
                            </p>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            8. Data Retention
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We retain game data for as long as necessary to provide the service. Inactive games may be
                                automatically deleted after a certain period. You can request immediate deletion of your data
                                at any time.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            9. Changes to This Policy
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by
                                updating the "Last updated" date at the top of this policy. Continued use of the game after
                                changes constitutes acceptance of the updated policy.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            10. Contact Us
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
                            </p>
                            <div className="bg-sky-50 p-4 rounded-xl border-2 border-sky-200 mt-4">
                                <p className="font-bold text-slate-900">Email:</p>
                                <p className="text-sky-600">natigagharzayev@gmail.com</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Back Button at Bottom */}
                <div className="mt-8 text-center">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="mb-6 text-slate-600 hover:text-slate-900 hover:bg-white cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Lobby
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}