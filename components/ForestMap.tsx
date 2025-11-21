import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FOREST_LOCATIONS } from '../constants';

const ForestMap: React.FC = () => {
  // Simple projection logic for a static SVG map of Africa
  // This is a stylized representation, not a precise GIS projection
  // Africa is roughly 30E to 17W, 37N to 34S
  
  const project = (lat: number, lng: number) => {
    // Center roughly on central Africa
    const x = (lng + 20) * 6 + 50; 
    const y = 400 - ((lat + 35) * 5.5);
    return { x, y };
  };

  return (
    <div className="relative w-full h-full bg-heru-void overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/id/10/1000/1000')] opacity-20 mix-blend-overlay bg-cover"></div>
      
      <h2 className="absolute top-20 z-20 text-heru-gold font-royal text-2xl tracking-widest uppercase">Continent Forest</h2>
      
      {/* Stylized Map Container */}
      <div className="relative w-[350px] h-[450px] md:w-[500px] md:h-[600px] border border-heru-gold/20 rounded-3xl p-4 backdrop-blur-sm bg-black/40">
        <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-[0_0_15px_rgba(230,184,0,0.3)]">
            {/* Abstract Africa Shape (Path simplified for demo) */}
            <path 
              d="M 120 50 Q 180 50 220 80 Q 280 90 300 150 Q 320 250 250 350 Q 200 420 150 400 Q 100 350 80 250 Q 40 150 120 50 Z" 
              fill="none" 
              stroke="#E6B800" 
              strokeWidth="1" 
              opacity="0.5"
            />
            <path 
              d="M 120 50 Q 180 50 220 80 Q 280 90 300 150 Q 320 250 250 350 Q 200 420 150 400 Q 100 350 80 250 Q 40 150 120 50 Z" 
              fill="#064E3B" 
              opacity="0.2"
            />

            {/* Render Trees */}
            {FOREST_LOCATIONS.map((loc, i) => {
              const { x, y } = project(loc.lat, loc.lng);
              // Clamp to svg bounds for the simplified shape
              const cx = Math.min(Math.max(x, 50), 350);
              const cy = Math.min(Math.max(y, 50), 400);

              return (
                <motion.g key={loc.id}>
                  <motion.circle 
                    cx={cx} 
                    cy={cy} 
                    r="3" 
                    fill="#E6B800"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                  />
                  <motion.circle 
                    cx={cx} 
                    cy={cy} 
                    r="10" 
                    stroke="#10B981"
                    strokeWidth="1"
                    fill="none"
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                </motion.g>
              );
            })}
        </svg>
      </div>

      <div className="absolute bottom-24 md:bottom-10 w-full px-6">
         <div className="flex justify-between text-xs text-heru-gold/70 font-display uppercase">
            <span>Live Network Activity</span>
            <span>{FOREST_LOCATIONS.length * 1432} Trees Total</span>
         </div>
      </div>
    </div>
  );
};

export default ForestMap;