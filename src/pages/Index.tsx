import { useState } from "react";
import StartScreen from "@/components/game/StartScreen";
import GameScreen from "@/components/game/GameScreen";
import Settings from "@/components/game/Settings";
import type { GameSettings } from "@/components/game/Settings";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    sessionLength: 10,
    letterPosition: 'start'
  });

  const handleGameEnd = () => {
    setGameStarted(false);
    setShowSettings(false);
  };

  const handleStartClick = () => {
    setShowSettings(true);
  };

  const handleSettingsSubmit = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    setGameStarted(true);
  };

  if (showSettings) {
    return <Settings onStart={handleSettingsSubmit} />;
  }

  if (!gameStarted) {
    return <StartScreen onStart={handleStartClick} maxLetters={settings.sessionLength} />;
  }

  return (
    <GameScreen 
      maxLetters={settings.sessionLength} 
      onGameEnd={handleGameEnd}
      letterPosition={settings.letterPosition}
    />
  );
};

export default Index;