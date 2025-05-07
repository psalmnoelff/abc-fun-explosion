
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { LetterCase } from "./Settings";

interface MissingLetterPuzzleProps {
  onGameEnd: () => void;
  letterCase: LetterCase;
}

const correctSound = new Howl({
  src: ['/sounds/correct.mp3']
});

const wrongSound = new Howl({
  src: ['/sounds/wrong.mp3']
});

// Create an alphabet based on the letter case
const getAlphabet = (letterCase: LetterCase) => {
  return letterCase === 'upper' 
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    : 'abcdefghijklmnopqrstuvwxyz'.split('');
};

type GridItem = {
  letter: string;
  isMissing: boolean;
  userAnswer: string | null;
  isCorrect: boolean | null;
};

const MissingLetterPuzzle = ({ onGameEnd, letterCase }: MissingLetterPuzzleProps) => {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [currentMissingIndex, setCurrentMissingIndex] = useState<number | null>(null);
  const [showLetterDialog, setShowLetterDialog] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { toast } = useToast();
  
  const generateGame = () => {
    const alphabet = getAlphabet(letterCase);
    const numMissingLetters = Math.floor(Math.random() * 3) + 3; // 3 to 5 missing letters
    
    // Create array with all letters
    const gridItems: GridItem[] = alphabet.map(letter => ({
      letter,
      isMissing: false,
      userAnswer: null,
      isCorrect: null
    }));
    
    // Randomly select indices to be missing, making sure they're not adjacent
    const missingIndices: number[] = [];
    while (missingIndices.length < numMissingLetters) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      // Check if this index or adjacent indices are already selected
      if (
        !missingIndices.includes(randomIndex) && 
        !missingIndices.includes(randomIndex - 1) && 
        !missingIndices.includes(randomIndex + 1)
      ) {
        missingIndices.push(randomIndex);
      }
    }
    
    // Mark selected indices as missing
    missingIndices.forEach(index => {
      gridItems[index].isMissing = true;
    });
    
    setGrid(gridItems);
  };
  
  useEffect(() => {
    generateGame();
  }, [letterCase]);
  
  const handleLetterClick = (index: number) => {
    if (grid[index].isMissing && grid[index].userAnswer === null) {
      setCurrentMissingIndex(index);
      setShowLetterDialog(true);
    }
  };
  
  const handleLetterSelection = (letter: string) => {
    if (currentMissingIndex === null) return;
    
    const isCorrect = letter === grid[currentMissingIndex].letter;
    setShowLetterDialog(false);
    
    const updatedGrid = [...grid];
    updatedGrid[currentMissingIndex].userAnswer = letter;
    updatedGrid[currentMissingIndex].isCorrect = isCorrect;
    
    if (isCorrect) {
      correctSound.play();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      wrongSound.play();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
    
    setGrid(updatedGrid);
    
    // Check if all missing letters have been answered
    const allAnswered = updatedGrid
      .filter(item => item.isMissing)
      .every(item => item.userAnswer !== null);
    
    if (allAnswered) {
      const allCorrect = updatedGrid
        .filter(item => item.isMissing)
        .every(item => item.isCorrect);
      
      if (allCorrect) {
        // All answers are correct
        setTimeout(() => {
          setShowCongratulations(true);
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    }
  };
  
  const handleReset = () => {
    generateGame();
  };
  
  const handleFinish = () => {
    const allAnswered = grid
      .filter(item => item.isMissing)
      .every(item => item.userAnswer !== null);
    
    if (!allAnswered) {
      toast({
        title: "Not Finished Yet",
        description: "Please fill in all missing letters first.",
        variant: "destructive",
      });
      return;
    }
    
    const allCorrect = grid
      .filter(item => item.isMissing)
      .every(item => item.isCorrect);
    
    if (allCorrect) {
      setShowCongratulations(true);
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setShowTryAgain(true);
    }
  };
  
  return (
    <motion.div 
      className={`flex flex-col items-center justify-center min-h-screen gap-8 p-4 ${
        isShaking ? 'animate-shake bg-red-50' : ''
      }`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGameEnd}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Missing Letter Puzzle</h1>
      <p className="text-lg text-muted-foreground">Fill in the missing letters in the alphabet.</p>
      
      <div className="grid grid-cols-5 gap-3 md:gap-4 max-w-md mx-auto">
        {grid.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.01 }}
            onClick={() => handleLetterClick(index)}
            className={`
              w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-md border-2 
              ${item.isMissing && !item.userAnswer 
                ? 'border-dashed border-gray-400 bg-gray-100 cursor-pointer' 
                : 'border-gray-300'
              }
              ${item.userAnswer && item.isCorrect ? 'bg-green-100 border-green-500' : ''}
              ${item.userAnswer && !item.isCorrect ? 'bg-red-100 border-red-500' : ''}
            `}
          >
            {item.isMissing 
              ? (item.userAnswer 
                ? <span className={`text-2xl font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {item.userAnswer}
                  </span>
                : <span className="text-gray-400">?</span>)
              : <span className="text-2xl font-bold">{item.letter}</span>
            }
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </Button>
        <Button 
          onClick={handleFinish}
          className="px-8"
        >
          Finish
        </Button>
      </div>
      
      {/* Letter Selection Dialog */}
      <Dialog open={showLetterDialog} onOpenChange={setShowLetterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose the Missing Letter</DialogTitle>
            <DialogDescription>
              Select the correct letter for this position in the alphabet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-7 gap-2">
            {getAlphabet(letterCase).map((letter) => (
              <Button
                key={letter}
                variant="outline"
                className="h-12 text-lg font-medium"
                onClick={() => handleLetterSelection(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Congratulations Dialog */}
      <AlertDialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">🎉 Congratulations! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              You've successfully completed the Missing Letter Puzzle!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onGameEnd}>Return to Menu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Try Again Dialog */}
      <AlertDialog open={showTryAgain} onOpenChange={setShowTryAgain}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keep Trying!</AlertDialogTitle>
            <AlertDialogDescription>
              Some of the letters are incorrect. Try again!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTryAgain(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MissingLetterPuzzle;
