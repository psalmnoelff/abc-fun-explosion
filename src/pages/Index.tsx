import { useState } from "react";
import StartScreen from "@/components/game/StartScreen";
import GameScreen from "@/components/game/GameScreen";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [maxLetters] = useState(10);

  const handleGameEnd = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} maxLetters={maxLetters} />
      ) : (
        <GameScreen maxLetters={maxLetters} onGameEnd={handleGameEnd} />
      )}
    </div>
  );
};

export default Index;