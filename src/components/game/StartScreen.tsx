import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
  maxLetters?: number;
}

const StartScreen = ({ onStart, maxLetters = 10 }: StartScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-primary">ABC Learning Game</h1>
      <p className="text-xl text-muted-foreground">Learn letters with fun!</p>
      <Button 
        size="lg"
        onClick={onStart}
        className="text-2xl px-8 py-6 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
      >
        Start Playing!
      </Button>
      <p className="text-sm text-muted-foreground">
        {maxLetters} letters per session
      </p>
    </motion.div>
  );
};

export default StartScreen;