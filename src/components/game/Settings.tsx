
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type LetterPosition = 'start' | 'end' | 'random';
export type LetterCase = 'upper' | 'lower';
export type GameType = 'letterIdentifier' | 'missingLetter';

interface SettingsProps {
  onStart: (settings: GameSettings, gameType: GameType) => void;
  gameType: GameType;
}

export interface GameSettings {
  sessionLength: number;
  letterPosition: LetterPosition;
  letterCase: LetterCase;
}

const Settings = ({ onStart, gameType }: SettingsProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sessionLength = parseInt(formData.get('sessionLength') as string) || 10;
    const letterPosition = formData.get('letterPosition') as LetterPosition || 'start';
    const letterCase = formData.get('letterCase') as LetterCase || 'upper';
    
    onStart({
      sessionLength: Math.max(1, Math.min(100, sessionLength)),
      letterPosition,
      letterCase,
    }, gameType);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-primary">
        {gameType === 'letterIdentifier' ? 'Letter Identifier Settings' : 'Missing Letter Puzzle Settings'}
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sessionLength">Session Length</Label>
          <Input
            id="sessionLength"
            name="sessionLength"
            type="number"
            defaultValue={10}
            min={1}
            max={100}
          />
        </div>

        {gameType === 'letterIdentifier' && (
          <div className="space-y-2">
            <Label htmlFor="letterPosition">Letter to Identify</Label>
            <Select name="letterPosition" defaultValue="start">
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start of Word</SelectItem>
                <SelectItem value="end">End of Word</SelectItem>
                <SelectItem value="random">Random Position</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Letter Case</Label>
          <RadioGroup defaultValue="upper" name="letterCase" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upper" id="upper" />
              <Label htmlFor="upper">UPPERCASE</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lower" id="lower" />
              <Label htmlFor="lower">lowercase</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">
          Start Game
        </Button>
      </form>
    </motion.div>
  );
};

export default Settings;
