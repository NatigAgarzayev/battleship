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
import { createGame, joinGame } from "@/hooks/game";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <main className="flex flex-col gap-6 min-h-screen justify-center items-center bg-[url('/battleship-background.jpg')] bg-cover bg-center">
      <h1 className="text-6xl text-sky-600 uppercase font-bold">Battleship game</h1>

      <div>
        <Input
          placeholder="Enter your nickname (optional)"
          className="w-64 bg-white"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col gap-3 w-64">
        <h2 className="text-xl font-semibold text-sky-700 text-center">Choose Game Mode</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setGameMode('pvp')}
            variant={gameMode === 'pvp' ? 'default' : 'link'}
            className="flex-1"
          >
            vs Player
          </Button>
          <Button
            onClick={() => setGameMode('bot')}
            variant={gameMode === 'bot' ? 'default' : 'link'}
            className="flex-1"
          >
            vs Bot
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={creatingRoom}
          onClick={handleCreateRoom}
          variant="default"
          size="lg"
        >
          {creatingRoom ? 'Creating...' : 'Create Room'}
        </Button>

        <span className="text-sky-700 font-semibold">--- or ---</span>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg">Join a Game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a game</DialogTitle>
              <DialogDescription>
                Enter the game code provided by the host to join an existing game.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Enter the invitation code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <Button
              disabled={joiningRoom}
              className="w-full"
              onClick={handleJoinRoom}
            >
              {joiningRoom ? 'Joining...' : 'Join Game'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {gameMode === 'pvp' && (
        <p className="text-sm text-sky-700 bg-white/80 px-4 py-2 rounded">
          Share the game code with a friend to play together
        </p>
      )}
    </main>
  );
}