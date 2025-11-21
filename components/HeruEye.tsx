import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeruEyeProps {
  onClick?: () => void;
  size?: 'sm' | 'lg';
  pulsing?: boolean;
}

const HeruEye: React.FC<HeruEyeProps> = ({ onClick, size = 'lg', pulsing = true }) => {
  const eyeRef = useRef<HTMLDivElement>(null);

  // Simple tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const { left, top, width, height } = eyeRef.current.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) / 20;
      const y = (e.clientY - (top + height / 2)) / 20;
      eyeRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    if (size === 'lg') {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  const containerSize = size === 'lg' ? 'w-64 h-64' : 'w-12 h-12';
  const innerSize = size === 'lg' ? 'w-48 h-32' : 'w-8 h-6';
  const pupilSize = size === 'lg' ? 'w-16 h-16' : 'w-3 h-3';

  return (
    <div className={`relative flex items-center justify-center ${containerSize} cursor-pointer z-10`} onClick={onClick}>
      {/* Outer Glow Ring */}
      {pulsing && (
        <motion.div 
            className="absolute inset-0 rounded-full border-2 border-heru-gold/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      
      {/* The Eye Shape */}
      <div ref={eyeRef} className="relative transition-transform duration-100 ease-out">
        {/* Sclera (Gold Shape) */}
        <div className={`${innerSize} bg-heru-gold rounded-[100%] relative overflow-hidden shadow-[0_0_30px_rgba(230,184,0,0.6)] border-2 border-white/20`}>
           {/* Iris/Pupil (Black Void) */}
           <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${pupilSize} bg-black rounded-full border border-heru-green shadow-inner flex items-center justify-center`}>
              <div className="w-1/3 h-1/3 bg-white rounded-full opacity-80 blur-[1px]"></div>
           </div>
        </div>
        
        {/* Eye Markings (Heru Style) */}
        {size === 'lg' && (
            <>
            <div className="absolute top-1/2 right-[-20px] w-16 h-2 bg-heru-gold transform rotate-12 rounded-full"></div>
            <div className="absolute bottom-[-20px] left-1/2 w-2 h-16 bg-heru-gold transform -translate-x-1/2 rounded-full"></div>
            </>
        )}
      </div>
    </div>
  );
};

export default HeruEye;