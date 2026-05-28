"use client";

import { motion } from 'framer-motion';
import { AppleLogo } from './AppleLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-16"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <AppleLogo size={72} color="white" />
      </motion.div>

      {/* Progress bar track */}
      <motion.div
        className="relative w-48 h-[3px] rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.25 }}
      >
        {/*
          scaleX animates from 0 → 1 using originX: 0 so the bar grows
          left-to-right.  Using a transform (not width) keeps this on the
          GPU compositor thread — no layout recalculations during the fill.
        */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 1.05,
            duration: 1.9,
            ease: [0.25, 0.1, 0.15, 1.0],
          }}
          onAnimationComplete={() => {
            // Brief hold after the bar fills so it feels intentional before fade-out
            setTimeout(onComplete, 380);
          }}
        />
      </motion.div>
    </motion.div>
  );
}
