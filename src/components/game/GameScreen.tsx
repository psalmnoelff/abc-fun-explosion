
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import { ArrowLeft } from "lucide-react";
import type { LetterPosition, LetterCase } from "./Settings";

interface GameScreenProps {
  maxLetters: number;
  onGameEnd: () => void;
  letterPosition: LetterPosition;
  letterCase: LetterCase;
}

const correctSound = new Howl({
  src: ['/sounds/correct.mp3']
});

const wrongSound = new Howl({
  src: ['/sounds/wrong.mp3']
});

const words = [
  'Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Frog', 'Goat', 'Hat', 'Igloo', 'Jug',
  'Kite', 'Lion', 'Monkey', 'Nest', 'Orange', 'Pig', 'Queen', 'Rabbit', 'Sun', 'Tree',
  'Umbrella', 'Van', 'Whale', 'Xylophone', 'Yak', 'Zebra', 'Airplane', 'Banana', 'Car',
  'Dinosaur', 'Flower', 'Giraffe', 'House', 'Ice cream', 'Jellyfish', 'Kangaroo', 'Ladybug',
  'Mushroom', 'Octopus', 'Penguin', 'Rocket', 'Star', 'Tiger', 'Unicorn', 'Violin',
  'Watermelon', 'Yo-yo', 'Zipper', 'Ant', 'Bear', 'Clock', 'Dragon', 'Fish', 'Glasses',
  'Helicopter', 'Insect', 'Jacket', 'Key', 'Lamp', 'Magnet', 'Needle', 'Owl', 'Parrot',
  'Quilt', 'Rainbow', 'Snail', 'Train', 'Umbrella', 'Volcano', 'Watch', 'X-ray', 'Yarn',
  'Book', 'Cake', 'Doll', 'Egg', 'Fan', 'Glove', 'Hammer', 'Island', 'Jar', 'Leaf',
  'Map', 'Nut', 'Paint', 'Ring', 'Sock', 'Table', 'Vase', 'Wagon', 'Acorn', 'Box',
  'Cup', 'Dice', 'Door', 'Eye', 'Flag', 'Gate', 'Hand', 'Ice', 'Jump', 'King'
];

const GameScreen = ({ maxLetters, onGameEnd, letterPosition, letterCase }: GameScreenProps) => {
  const [currentWord, setCurrentWord] = useState('');
  const [targetLetter, setTargetLetter] = useState('');
  const [targetLetterIndex, setTargetLetterIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const { toast } = useToast();

  const getTargetLetterInfo = (word: string) => {
    let index = 0;
    switch (letterPosition) {
      case 'end':
        index = word.length - 1;
        break;
      case 'random':
        // Ensure we don't pick first or last letter for random
        if (word.length > 2) {
          index = Math.floor(Math.random() * (word.length - 2)) + 1;
        }
        break;
      default: // 'start'
        index = 0;
    }
    let letter = word[index];
    letter = letterCase === 'upper' ? letter.toUpperCase() : letter.toLowerCase();
    
    return {
      letter,
      index
    };
  };

  const generateLetters = (correctLetter: string) => {
    const alphabet = letterCase === 'upper' 
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      : 'abcdefghijklmnopqrstuvwxyz'.split('');
    
    const otherLetters = alphabet
      .filter(l => l !== correctLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [...otherLetters, correctLetter].sort(() => Math.random() - 0.5);
  };

  const selectNewWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    const { letter, index } = getTargetLetterInfo(newWord);
    setCurrentWord(newWord);
    setTargetLetter(letter);
    setTargetLetterIndex(index);
    setLetters(generateLetters(letter));
  };

  useEffect(() => {
    selectNewWord();
  }, []);

  const handleLetterClick = (letter: string) => {
    const isCorrect = letter === targetLetter;
    
    if (isCorrect) {
      correctSound.play();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: `'${letter}' is correct!`,
        duration: 1500,
      });
    } else {
      wrongSound.play();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast({
        title: "Try Again!",
        description: "That's not the right letter",
        variant: "destructive",
        duration: 1500,
      });
    }

    const newProgress = ((score + (isCorrect ? 1 : 0)) / maxLetters) * 100;
    setProgress(newProgress);

    if (newProgress >= 100) {
      onGameEnd();
      return;
    }

    selectNewWord();
  };

  // Get position description based on letterPosition
  const getPositionDescription = () => {
    switch (letterPosition) {
      case 'start': return 'first';
      case 'end': return 'last';
      case 'random': return 'highlighted';
      default: return 'highlighted';
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

      <div className="w-full max-w-md">
        <Progress value={progress} className="h-3" />
        <p className="text-right mt-2 text-muted-foreground">
          Score: {score}/{maxLetters}
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground mb-6">
          Select the {getPositionDescription()} letter of the word shown below
        </p>
      </div>

      <div className="flex gap-4 my-8">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              size="lg"
              onClick={() => handleLetterClick(letter)}
              className="w-20 h-20 text-4xl font-bold"
            >
              {letter}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <motion.p
          key={currentWord}
          className="text-6xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {currentWord.split('').map((letter, index) => {
            // Format letter according to settings
            const displayLetter = letterCase === 'upper' ? letter.toUpperCase() : letter.toLowerCase();
            return (
              <span
                key={index}
                className={index === targetLetterIndex ? "border-b-4 border-primary" : ""}
              >
                {displayLetter}
              </span>
            );
          })}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default GameScreen;
