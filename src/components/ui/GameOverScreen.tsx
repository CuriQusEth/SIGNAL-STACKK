import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useSignMessage } from 'wagmi';
import { getAttributionPayload } from '../../lib/erc8021';
import { ExternalLink, RefreshCw, Save } from 'lucide-react';
import { useState } from 'react';

export function GameOverScreen() {
  const { score, height, setGameState, resetStats } = useGameStore();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRetry = () => {
    resetStats();
    setGameState('PLAYING');
  };

  const handleRecord = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet on the title screen first.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = getAttributionPayload();
      const message = `SIGNAL STACK - Record Score\n\nHeight: ${height}m\nScore: ${score}\n\nAttribution Code: ${payload.attributionCode}\nBuilder: ${payload.builderCode}`;
      
      // Request SIWE Signature
      const signature = await signMessageAsync({ account: address, message });
      
      console.log('Submitted Score:', { height, score, signature, payload });
      // Simulate backend save delay
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
    } catch (e) {
      console.error('Failed to submit score', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
    >
      <h2 className="text-red-500 font-black text-5xl uppercase tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
        Tower Collapsed
      </h2>
      <p className="text-gray-400 font-mono mb-12">Total structural failure.</p>

      <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl w-full max-w-sm mb-12">
         <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-4">
            <span className="text-gray-400 font-mono text-sm uppercase">Final Height</span>
            <span className="text-cyan-400 font-black text-4xl">{height}m</span>
         </div>
         <div className="flex justify-between items-end">
            <span className="text-gray-400 font-mono text-sm uppercase">Total Signal Score</span>
            <span className="text-magenta-400 font-black text-3xl">{score}</span>
         </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button 
          onClick={handleRecord}
          disabled={isSubmitting || submitted}
          className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-4 rounded-lg uppercase tracking-wide disabled:opacity-50 hover:from-blue-500 hover:to-purple-500 transition-all border border-blue-400/30"
        >
          {isSubmitting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : submitted ? (
             <>
               <ExternalLink className="w-5 h-5" /> Recorded on Base
             </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Record Signal on-chain
            </>
          )}
        </button>

        <button 
          onClick={handleRetry}
          className="flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 font-bold px-6 py-4 rounded-lg uppercase tracking-wide transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> Rebuild Tower
        </button>
      </div>
    </motion.div>
  );
}
