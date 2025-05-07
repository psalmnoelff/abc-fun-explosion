
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Grid3X3, CaseLower, CaseUpper } from "lucide-react";

interface StartScreenProps {
  onStart: (gameType: string) => void;
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
      
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-lg max-w-xs"
        >
          <div className="flex justify-center mb-4">
            <CaseLower className="h-16 w-16 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Letter Identifier</h2>
          <p className="text-muted-foreground text-center mb-4">
            Identify letters from words and improve your reading skills!
          </p>
          <Button 
            onClick={() => onStart('letterIdentifier')}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Play Now
          </Button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-lg max-w-xs"
        >
          <div className="flex justify-center mb-4">
            <Grid3X3 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Missing Letter Puzzle</h2>
          <p className="text-muted-foreground text-center mb-4">
            Fill in the missing letters in the alphabet grid!
          </p>
          <Button 
            onClick={() => onStart('missingLetter')}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Play Now
          </Button>
        </motion.div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4">
        {maxLetters} letters per session
      </p>
    </motion.div>
  );
};

export default StartScreen;
