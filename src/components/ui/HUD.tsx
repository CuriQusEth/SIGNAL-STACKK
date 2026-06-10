import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';

export function HUD() {
  const { score, height, combo, multiplier, gameState } = useGameStore();

  if (gameState !== 'PLAYING') return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 right-6 flex justify-between z-20 pointer-events-none"
      >
        <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 px-4 py-3 rounded-xl min-w-[100px]">
          <div className="text-[10px] uppercase text-[#888] tracking-[1px] mb-[2px]">Height</div>
          <div className="text-[20px] font-bold text-[#00F5FF] drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">
            {height}<span className="text-[12px] ml-0.5">m</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 px-4 py-3 rounded-xl min-w-[100px] text-right">
          <div className="text-[10px] uppercase text-[#888] tracking-[1px] mb-[2px]">Signal Score</div>
          <div className="text-[20px] font-bold text-[#00F5FF] drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">
            {score}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {combo > 1 && (
          <motion.div 
            key={combo}
            initial={{ scale: 1.5, opacity: 0, rotate: 12, y: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 12, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute right-5 top-72 bg-[#FF00E5] text-white px-3 py-1 rounded-full font-bold text-[14px] shadow-[0_0_20px_rgba(255,0,229,0.6)] z-20 pointer-events-none"
          >
            X{combo} RESONANCE
          </motion.div>
        )}
      </AnimatePresence>

      {/* On-chain Footer */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-30 pointer-events-auto">
        <button 
          onPointerDown={(e) => {
             // Let the GameView handle the drop via global pointer, or trigger event
             // To trigger directly, we can dispatch a custom event
             window.dispatchEvent(new CustomEvent('drop-signal'));
             e.stopPropagation();
          }}
          className="bg-[linear-gradient(135deg,#00F5FF,#0055FF)] border-none shadow-[0_4px_15px_rgba(0,245,255,0.3)] px-10 py-4 rounded-xl font-black text-[16px] text-white flex items-center justify-center tracking-widest gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          DROP BLOCK
        </button>
      </div>
    </>
  );
}
