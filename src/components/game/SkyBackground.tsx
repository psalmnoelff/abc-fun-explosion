
import React from 'react';
import { motion } from 'framer-motion';

const SkyBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-gradient-to-b from-blue-300 to-blue-100">
      {/* First cloud layer - slower */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={`cloud-slow-${index}`}
            className="absolute"
            style={{
              top: `${10 + index * 15}%`,
              left: '-20%',
              width: '15%',
              opacity: 0.7 + (index % 3) * 0.1,
            }}
            animate={{
              x: ['0%', '150%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 60 + index * 10,
                ease: 'linear',
                repeatType: 'loop',
              },
            }}
          >
            <svg
              viewBox="0 0 200 60"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M48.7,11.5c-0.9-4.1-4.6-7.1-9-7.1c-2.6,0-5,1.1-6.8,2.8c-2.1-3.3-5.7-5.5-9.9-5.5c-6.3,0-11.4,5-11.4,11.2 c0,0.4,0,0.7,0.1,1.1C4.7,15.1,0,20.8,0,27.5c0,7.8,6.4,14.2,14.3,14.2h70.2c8.5,0,15.5-6.9,15.5-15.3 C100,17.2,89.8,9.4,77.5,9.4C65.2,9.4,55,17.2,55,26.4c0,0.4,0,0.7,0.1,1.1C55,27.7,48.7,20.6,48.7,11.5z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Second cloud layer - faster */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={`cloud-fast-${index}`}
            className="absolute"
            style={{
              top: `${30 + index * 20}%`,
              left: '-15%',
              width: '10%',
              opacity: 0.5 + (index % 2) * 0.2,
            }}
            animate={{
              x: ['0%', '150%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 30 + index * 8,
                ease: 'linear',
                repeatType: 'loop',
              },
            }}
          >
            <svg
              viewBox="0 0 200 60"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M48.7,11.5c-0.9-4.1-4.6-7.1-9-7.1c-2.6,0-5,1.1-6.8,2.8c-2.1-3.3-5.7-5.5-9.9-5.5c-6.3,0-11.4,5-11.4,11.2 c0,0.4,0,0.7,0.1,1.1C4.7,15.1,0,20.8,0,27.5c0,7.8,6.4,14.2,14.3,14.2h70.2c8.5,0,15.5-6.9,15.5-15.3 C100,17.2,89.8,9.4,77.5,9.4C65.2,9.4,55,17.2,55,26.4c0,0.4,0,0.7,0.1,1.1C55,27.7,48.7,20.6,48.7,11.5z" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkyBackground;
