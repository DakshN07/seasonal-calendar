import React from 'react';
import { motion } from 'framer-motion';

export const AmbientParticles: React.FC = () => {
  // Generate a fixed number of particles to float around
  const particles = Array.from({ length: 35 });
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        // Randomize size, start points, and speeds for organic feel
        const size = Math.random() * 3 + 1.5; 
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const duration = Math.random() * 15 + 15; // Slow ambient drift
        const delay = Math.random() * 10;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20 shadow-[0_0_12px_3px_rgba(255,255,255,0.5)]"
            style={{ width: size, height: size, left, top }}
            initial={{ y: 0, x: 0, opacity: 0 }}
            animate={{ 
              y: [0, -40, -80, -120], 
              x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20, 0],
              opacity: [0, 0.4, 0.6, 0] 
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};
