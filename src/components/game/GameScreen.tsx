import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

interface GameScreenProps {
  maxLetters: number;
  onGameEnd: () => void;
}

const correctSound = new Howl({
  src: ['/sounds/correct.mp3']
});

const wrongSound = new Howl({
  src: ['/sounds/wrong.mp3']
});

const words = [
  { word: 'Apple', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' },
  { word: 'Ball', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1' },
  { word: 'Cat', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901' },
  { word: 'Dog', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027' },
];

const GameScreen = ({ maxLetters, onGameEnd }: GameScreenProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [letters, setLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const { toast } = useToast();

  const generateLetters = (correctLetter: string) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const otherLetters = alphabet
      .filter(l => l !== correctLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [...otherLetters, correctLetter].sort(() => Math.random() - 0.5);
  };

  const selectNewWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setLetters(generateLetters(newWord.word[0].toUpperCase()));
  };

  useEffect(() => {
    selectNewWord();
  }, []);

  const handleLetterClick = (letter: string) => {
    const isCorrect = letter === currentWord.word[0].toUpperCase();
    
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

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center min-h-screen gap-8 p-4 ${
        isShaking ? 'animate-shake bg-red-50' : ''
      }`}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-3" />
        <p className="text-right mt-2 text-muted-foreground">
          Score: {score}/{maxLetters}
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground mb-6">
          Select the first letter of the word shown below
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
        <motion.img
          key={currentWord.image}
          src={currentWord.image}
          alt={currentWord.word}
          className="w-48 h-48 object-cover rounded-lg mx-auto mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        />
        <motion.p
          key={currentWord.word}
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="border-b-4 border-primary">{currentWord.word[0]}</span>
          {currentWord.word.slice(1)}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default GameScreen;