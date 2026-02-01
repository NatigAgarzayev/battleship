import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
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
                            <FileText className="w-8 h-8 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">
                                Terms of Service
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
                            Welcome to Battleship! These Terms of Service ("Terms") govern your access to and use of our
                            online multiplayer game. By playing Battleship, you agree to be bound by these Terms.
                            If you do not agree, please do not use our service.
                        </p>
                    </section>

                    {/* Acceptance of Terms */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            1. Acceptance of Terms
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                By accessing or using Battleship, you acknowledge that you have read, understood, and agree
                                to be bound by these Terms and our Privacy Policy. These Terms apply to all users of the game,
                                including players and visitors.
                            </p>
                        </div>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            2. Eligibility
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                You must be at least 13 years old to use Battleship. If you are under 18, you must have
                                permission from a parent or guardian to use the service.
                            </p>
                            <p>
                                By using Battleship, you represent and warrant that you meet these eligibility requirements.
                            </p>
                        </div>
                    </section>

                    {/* Account and Player ID */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            3. Player Accounts
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                When you play Battleship, a unique player ID is generated and stored in your browser.
                                You are responsible for:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Maintaining the security of your browser and device</li>
                                <li>All activities that occur under your player ID</li>
                                <li>Not sharing your device during active games</li>
                            </ul>
                        </div>
                    </section>

                    {/* Game Rules and Conduct */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            4. Game Rules and Conduct
                        </h2>
                        <div className="space-y-4 text-slate-700">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Acceptable Use</h3>
                                <p>You agree to use Battleship only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cheat, exploit bugs, or use unauthorized third-party software</li>
                                    <li>Harass, abuse, or harm other players</li>
                                    <li>Use offensive or inappropriate player names</li>
                                    <li>Attempt to hack, reverse engineer, or compromise the game</li>
                                    <li>Spam, advertise, or send unsolicited messages</li>
                                    <li>Abandon games intentionally to avoid losing</li>
                                    <li>Use automated bots or scripts</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Fair Play</h3>
                                <p>
                                    We expect all players to engage in fair and sportsmanlike conduct. Violations may result
                                    in temporary or permanent suspension from the game.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Game Availability */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            5. Service Availability
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We strive to provide uninterrupted access to Battleship, but we do not guarantee that the
                                service will always be available or error-free. We reserve the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Modify, suspend, or discontinue the game at any time</li>
                                <li>Perform maintenance and updates</li>
                                <li>Remove or reset game data as necessary</li>
                            </ul>
                            <p>
                                We are not liable for any interruption, delay, or loss of data resulting from service unavailability.
                            </p>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            6. Intellectual Property
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                All content, features, and functionality of Battleship, including but not limited to graphics,
                                code, design, and game mechanics, are owned by us or our licensors and are protected by
                                intellectual property laws.
                            </p>
                            <p>
                                You may not copy, modify, distribute, sell, or create derivative works based on Battleship
                                without our express written permission.
                            </p>
                        </div>
                    </section>

                    {/* User Content */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            7. User Content
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                By providing a player name or any other content to Battleship, you grant us a worldwide,
                                non-exclusive, royalty-free license to use, display, and store such content for the purpose
                                of operating the game.
                            </p>
                            <p>
                                You represent and warrant that any content you provide does not violate any third-party rights
                                or applicable laws.
                            </p>
                        </div>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            8. Termination
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We reserve the right to suspend or terminate your access to Battleship at any time, without
                                notice, for any reason, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Violation of these Terms</li>
                                <li>Fraudulent or illegal activity</li>
                                <li>Disruptive behavior</li>
                                <li>Extended inactivity</li>
                            </ul>
                            <p>
                                You may stop using Battleship at any time by clearing your browser data.
                            </p>
                        </div>
                    </section>

                    {/* Disclaimer of Warranties */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            9. Disclaimer of Warranties
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p className="font-bold uppercase">
                                BATTLESHIP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                            </p>
                            <p>
                                We do not warrant that:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>The game will be uninterrupted, secure, or error-free</li>
                                <li>Any defects will be corrected</li>
                                <li>The game will meet your requirements</li>
                                <li>Data will not be lost or corrupted</li>
                            </ul>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            10. Limitation of Liability
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
                            </p>
                        </div>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            11. Indemnification
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                You agree to indemnify and hold harmless Battleship and its affiliates from any claims,
                                damages, losses, or expenses arising from:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Your use of the game</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any rights of another party</li>
                            </ul>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            12. Changes to Terms
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                We reserve the right to modify these Terms at any time. We will notify users of any material
                                changes by updating the "Last updated" date at the top of this page. Your continued use of
                                Battleship after such changes constitutes acceptance of the new Terms.
                            </p>
                        </div>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            13. Governing Law
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                                without regard to its conflict of law provisions.
                            </p>
                        </div>
                    </section>

                    {/* Dispute Resolution */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            14. Dispute Resolution
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                Any disputes arising from or relating to these Terms or the use of Battleship shall be resolved
                                through good faith negotiations. If a resolution cannot be reached, disputes may be submitted
                                to binding arbitration or the appropriate courts.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                            15. Contact Us
                        </h2>
                        <div className="space-y-2 text-slate-700">
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:
                            </p>
                            <div className="bg-sky-50 p-4 rounded-xl border-2 border-sky-200 mt-4">
                                <p className="font-bold text-slate-900">Email:</p>
                                <p className="text-sky-600">natigagharzayev@gmail.com</p>
                            </div>
                        </div>
                    </section>

                    {/* Acknowledgment */}
                    <section className="bg-sky-50 p-6 rounded-xl border-2 border-sky-200">
                        <h3 className="font-bold text-slate-900 mb-2">Acknowledgment</h3>
                        <p className="text-slate-700">
                            BY USING BATTLESHIP, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE
                            BOUND BY THEM.
                        </p>
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