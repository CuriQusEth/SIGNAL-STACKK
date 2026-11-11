import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { Zap, Play, Trophy } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function TitleScreen() {
  const setGameState = useGameStore(s => s.setGameState);
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          filter: ['drop-shadow(0px 0px 10px #00f3ff)', 'drop-shadow(0px 0px 30px #bd00ff)', 'drop-shadow(0px 0px 10px #00f3ff)']
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
          SIGNAL<br/>STACK
        </h1>
      </motion.div>
      
      <p className="text-gray-400 mt-6 max-w-sm mb-12 font-mono text-[11px] leading-relaxed px-4">
        Build the tallest signal tower in the universe. Balance, timing, and precision.
      </p>

      <button 
        onClick={() => setGameState('PLAYING')}
        className="group relative px-8 py-4 bg-transparent outline-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
        <div className="relative flex items-center gap-3 bg-black border border-cyan-500/50 rounded-lg px-8 py-4 text-cyan-50 font-bold uppercase tracking-widest hover:bg-cyan-900/20 transition-colors">
          <Play className="w-5 h-5 fill-cyan-400 stroke-cyan-400" />
          Initiate Sequence
        </div>
      </button>

      <div className="mt-12 flex flex-col gap-4 items-center">
        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: injected() })}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 rounded-lg hover:bg-cyan-500/20"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            Connect Base Denim Mainnet
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-green-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Base Denim: {address?.slice(0,6)}...{address?.slice(-4)}
            </span>
            <span className="text-[10px] text-cyan-400/70 font-mono">
              200ms Canonical Blocks
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
