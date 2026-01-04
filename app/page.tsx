import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 min-h-screen justify-center items-center bg-[url('/battleship-background.jpg')] bg-cover bg-center">
      <h1 className="text-6xl text-sky-600 uppercase font-bold">Battleship game</h1>
      <div className="flex items-center gap-2">
        <Button variant="default">Create a Game</Button>
        <span>--- or ---</span>
        <Button variant="outline">Join a Game</Button>
      </div>
    </main>
  );
}
