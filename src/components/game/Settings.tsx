
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
import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export type LetterPosition = 'start' | 'end' | 'random';
export type LetterCase = 'upper' | 'lower';
export type GameType = 'letterIdentifier' | 'missingLetter' | 'missingNumber';

interface SettingsProps {
  onStart: (settings: GameSettings, gameType: GameType) => void;
  onBack: () => void;
  gameType: GameType;
}

export interface GameSettings {
  sessionLength: number;
  letterPosition: LetterPosition;
  letterCase: LetterCase;
  startNumber: number;
  endNumber: number;
  missingCount: number;
}

const Settings = ({ onStart, onBack, gameType }: SettingsProps) => {
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(20);
  const [missingCount, setMissingCount] = useState(3);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Update missing count when start/end numbers change
  useEffect(() => {
    const diff = endNumber - startNumber;
    const maxMissingCount = Math.max(1, diff - 8);
    
    if (missingCount > maxMissingCount) {
      setMissingCount(maxMissingCount);
    }
  }, [startNumber, endNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sessionLength = parseInt(formData.get('sessionLength') as string) || 10;
    const letterPosition = formData.get('letterPosition') as LetterPosition || 'start';
    const letterCase = formData.get('letterCase') as LetterCase || 'upper';
    
    // For number puzzle
    let startNum = startNumber;
    let endNum = endNumber;
    let missingNum = missingCount;
    
    if (gameType === 'missingNumber') {
      const newErrors: Record<string, string> = {};
      
      // Validate start and end numbers
      if (endNum - startNum < 9) {
        newErrors.range = "The difference between start and end must be at least 9";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: Object.values(newErrors)[0],
          variant: "destructive",
        });
        return;
      }
      
      // Clear errors if valid
      setErrors({});
    }
    
    onStart({
      sessionLength: Math.max(1, Math.min(100, sessionLength)),
      letterPosition,
      letterCase,
      startNumber: startNum,
      endNumber: endNum,
      missingCount: missingNum
    }, gameType);
  };

  const getGameTitle = () => {
    switch (gameType) {
      case 'letterIdentifier':
        return 'Letter Identifier Settings';
      case 'missingLetter':
        return 'Missing Letter Puzzle Settings';
      case 'missingNumber':
        return 'Missing Number Puzzle Settings';
      default:
        return 'Game Settings';
    }
  };

  const getMaxMissingCount = () => {
    const diff = endNumber - startNumber;
    return Math.max(1, diff - 8);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-primary">
        {getGameTitle()}
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {gameType === 'letterIdentifier' && (
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
        )}

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

        {(gameType === 'letterIdentifier' || gameType === 'missingLetter') && (
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
        )}

        {gameType === 'missingNumber' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="startNumber">Start Number</Label>
              <Input
                id="startNumber"
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                min={1}
                max={endNumber - 9}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endNumber">End Number</Label>
              <Input
                id="endNumber"
                type="number"
                value={endNumber}
                onChange={(e) => setEndNumber(parseInt(e.target.value) || startNumber + 9)}
                min={startNumber + 9}
                max={startNumber + 100}
              />
              {errors.range && <p className="text-sm text-red-500">{errors.range}</p>}
              <p className="text-xs text-muted-foreground">Must be at least 9 more than Start Number</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="missingCount">Missing Numbers</Label>
              <Input
                id="missingCount"
                type="number"
                value={missingCount}
                onChange={(e) => setMissingCount(Math.min(getMaxMissingCount(), Math.max(1, parseInt(e.target.value) || 3)))}
                min={1}
                max={getMaxMissingCount()}
              />
              <p className="text-xs text-muted-foreground">
                Maximum allowed: {getMaxMissingCount()} (depends on number range)
              </p>
            </div>
          </>
        )}

        <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="w-1/2"
          >
            Main Menu
          </Button>
          <Button type="submit" className="w-1/2">
            Start Game
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;
