
import { useState } from "react";
import StartScreen from "@/components/game/StartScreen";
import GameScreen from "@/components/game/GameScreen";
import Settings from "@/components/game/Settings";
import MissingLetterPuzzle from "@/components/game/MissingLetterPuzzle";
import MissingNumberPuzzle from "@/components/game/MissingNumberPuzzle";
import type { GameSettings, GameType } from "@/components/game/Settings";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameType, setGameType] = useState<GameType>('letterIdentifier');
  const [settings, setSettings] = useState<GameSettings>({
    sessionLength: 10,
    letterPosition: 'start',
    letterCase: 'upper',
    startNumber: 1,
    endNumber: 20,
    missingCount: 3
  });

  const handleGameEnd = () => {
    setGameStarted(false);
    setShowSettings(false);
  };

  const handleStartClick = (selectedGameType: string) => {
    setGameType(selectedGameType as GameType);
    setShowSettings(true);
  };

  const handleSettingsSubmit = (newSettings: GameSettings, selectedGameType: GameType) => {
    setSettings(newSettings);
    setGameType(selectedGameType);
    setShowSettings(false);
    setGameStarted(true);
  };
  
  const handleBackToMenu = () => {
    setShowSettings(false);
  };

  if (showSettings) {
    return <Settings onStart={handleSettingsSubmit} onBack={handleBackToMenu} gameType={gameType} />;
  }

  if (!gameStarted) {
    return <StartScreen onStart={handleStartClick} />;
  }

  if (gameType === 'missingLetter') {
    return (
      <MissingLetterPuzzle 
        onGameEnd={handleGameEnd}
        letterCase={settings.letterCase}
      />
    );
  }
  
  if (gameType === 'missingNumber') {
    return (
      <MissingNumberPuzzle 
        onGameEnd={handleGameEnd}
        startNumber={settings.startNumber}
        endNumber={settings.endNumber}
        missingCount={settings.missingCount}
      />
    );
  }

  return (
    <GameScreen 
      maxLetters={settings.sessionLength} 
      onGameEnd={handleGameEnd}
      letterPosition={settings.letterPosition}
      letterCase={settings.letterCase}
    />
  );
};

export default Index;
