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
import { createGame } from "@/hooks/game";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [creatingRoom, setCreatingRoom] = useState(false)

  const handleCreateRoom = async () => {
    try {
      setCreatingRoom(true);
      const roomData = await createGame()
      console.log("Room created:", roomData);
      router.push(`/battle/${roomData.game_code}`);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setCreatingRoom(false);
    }
  }

  return (
    <main className="flex flex-col gap-6 min-h-screen justify-center items-center bg-[url('/battleship-background.jpg')] bg-cover bg-center">
      <h1 className="text-6xl text-sky-600 uppercase font-bold">Battleship game</h1>
      <div>
        <Input placeholder="Enter your nickname" className="w-64 bg-white" />
      </div>
      <div className="flex items-center gap-2">
        <Button disabled={creatingRoom} onClick={handleCreateRoom} variant="default">
          {creatingRoom ? 'Creating...' : 'Create Room'}
        </Button>
        <span>--- or ---</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Join a Game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a game</DialogTitle>
              <DialogDescription>
                Enter the game code provided by the host to join an existing game.
              </DialogDescription>
            </DialogHeader>
            <Input placeholder="Enter the invitation code" />
            <Button className="w-full">Join Game</Button>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
