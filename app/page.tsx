'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card";
import { createGame, joinGame } from "@/hooks/game";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Anchor, Ship, Plus, Users, User, Bot, CirclePlus } from "lucide-react";

export default function Home() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [gameMode, setGameMode] = useState<'pvp' | 'bot'>('pvp')
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = async () => {
    try {
      setCreatingRoom(true);
      const roomData = await createGame(nickname || undefined, gameMode)
      console.log("Room created:", roomData);
      router.push(`/battle/${roomData.game.game_code}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(false);
    }
  }

  const handleJoinRoom = async () => {
    try {
      setJoiningRoom(true);
      const trimmedCode = roomCode.trim().toUpperCase();
      if (trimmedCode.length === 0) {
        alert("Please enter a valid game code.");
        return;
      }
      const joinedRoom = await joinGame(trimmedCode, nickname || undefined);
      if (!joinedRoom) {
        alert("Failed to join the game. Please check the code and try again.");
        return;
      }
      router.push(`/battle/${trimmedCode}`);
    } catch (error: any) {
      console.error("Error joining room:", error);
      alert(error.message || "Failed to join the game. Please check the code and try again.");
    } finally {
      setJoiningRoom(false);
    }
  }

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
        <div className="flex gap-6 items-center">
          <Button variant="ghost" className="text-sm font-bold text-slate-500 hover:text-sky-500 uppercase tracking-widest">
            How to Play
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl shadow-xl shadow-blue-200/50 border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sky-500 to-blue-300"></div>

            <CardContent className="p-8 md:p-10">
              {/* Icon and Title */}
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-sky-50 text-sky-500 mb-4">
                  <Anchor size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-2">
                  Fleet Command
                </h1>
                <p className="text-slate-500 text-sm">
                  Prepare your ships for tactical naval warfare.
                </p>
              </div>

              <div className="space-y-4">
                {/* Nickname Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1" htmlFor="nickname">
                    Enter Nickname
                  </label>
                  <div className="relative mt-1">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="nickname"
                      placeholder="Admiral Nelson"
                      className="w-full pl-12 pr-4 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 font-bold text-slate-700 placeholder:text-slate-300"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                </div>

                {/* Game Mode Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                    Choose Battle Mode
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button
                      onClick={() => setGameMode('pvp')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${gameMode === 'pvp'
                        ? 'bg-white text-sky-600 shadow-md'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      <Users size={24} />
                      <span>vs Player</span>
                    </button>
                    <button
                      onClick={() => setGameMode('bot')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${gameMode === 'bot'
                        ? 'bg-white text-sky-600 shadow-md'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      <Bot size={24} />
                      <span>vs Bot</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={creatingRoom}
                    className="flex flex-col items-center justify-center gap-2 py-6 px-2 cursor-pointer bg-sky-500 text-white rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-sky-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-sky-500/25"
                  >
                    <CirclePlus size={10} />
                    {creatingRoom ? 'Creating...' : 'Create Game'}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex flex-col items-center justify-center gap-2 py-6 px-2 cursor-pointer bg-white border-2 border-sky-500 text-sky-500 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-sky-50 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Ship size={24} />
                        Join Game
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic">Join a Battle</DialogTitle>
                        <DialogDescription>
                          Enter the game code provided by the fleet commander.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter 6-digit code"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="w-full px-4 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 font-bold text-center text-2xl tracking-widest uppercase"
                        />
                        <Button
                          disabled={joiningRoom}
                          className="w-full py-6 bg-sky-500 hover:bg-sky-600 rounded-2xl font-black uppercase shadow-lg shadow-sky-500/25"
                          onClick={handleJoinRoom}
                        >
                          {joiningRoom ? 'Joining Battle...' : 'Join Battle'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
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