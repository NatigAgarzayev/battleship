import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex flex-col gap-6 min-h-screen justify-center items-center bg-[url('/battleship-background.jpg')] bg-cover bg-center">
      <h1 className="text-6xl text-sky-600 uppercase font-bold">Battleship game</h1>
      <div>
        <Input placeholder="Enter your nickname" className="w-64 bg-white" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="default">Create a Game</Button>
        <span>--- or ---</span>
        <Button variant="outline">Join a Game</Button>
      </div>
    </main>
  );
}
