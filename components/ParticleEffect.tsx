import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleEffect: React.FC = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 particles
    setParticles(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-50">
      <AnimatePresence>
        {particles.map((i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              x: 0, 
              y: 0, 
              scale: Math.random() * 0.5 + 0.5 
            }}
            animate={{ 
              opacity: 0, 
              x: (Math.random() - 0.5) * window.innerWidth, 
              y: (Math.random() - 0.5) * window.innerHeight,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut" 
            }}
            className="absolute w-3 h-3 bg-heru-gold rounded-full shadow-[0_0_10px_#E6B800]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleEffect;