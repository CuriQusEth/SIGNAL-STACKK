/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameView } from './components/game/GameView';
import { TitleScreen } from './components/ui/TitleScreen';
import { GameOverScreen } from './components/ui/GameOverScreen';
import { HUD } from './components/ui/HUD';
import { useGameStore } from './store/gameStore';
import { AnimatePresence } from 'motion/react';
import { ATTRIBUTION_CODE, BUILDER_CODE } from './lib/erc8021';
import { useAccount, useWriteContract } from 'wagmi';
import { Sun } from 'lucide-react';

export default function App() {
  const gameState = useGameStore(s => s.gameState);
  const { isConnected, address } = useAccount();
  const { writeContract } = useWriteContract();

  const sendGMTransaction = () => {
    writeContract({
      address: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      abi: [{
        inputs: [],
        name: 'sayGM',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      }],
      functionName: 'sayGM',
    } as any);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white flex justify-center items-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f051a_0%,#050505_100%)] z-0" />
      
      {/* App Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 w-full h-full max-w-[1024px] py-4 px-4">
        
        {/* Mobile Top Bar */}
        <div className="flex lg:hidden w-full max-w-[432px] justify-between items-center z-50">
           <h1 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600">SIGNAL STACK</h1>
           {isConnected && (
              <button 
                onClick={sendGMTransaction}
                className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
              >
                <Sun className="w-4 h-4" /> Say GM
              </button>
           )}
        </div>
        
        {/* Left Side Panel (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-5 w-[260px] h-[min(90vh,720px)] p-6">
          <div className="text-[12px] uppercase text-[#555] tracking-[2px] border-b border-[#222] pb-2.5 flex justify-between items-center">
            <span>Active Signals</span>
            {isConnected && (
              <button 
                onClick={sendGMTransaction}
                className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
              >
                <Sun className="w-4 h-4" />
                Say GM
              </button>
            )}
          </div>
          <div className="flex justify-between py-3 border-b border-[#111] text-[13px]">
            <span className="text-[#aaa]">0x7a...4e21</span>
            <span className="text-[#00F5FF] font-mono">842m</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[#111] text-[13px]">
            <span className="text-[#aaa]">vitalik.eth</span>
            <span className="text-[#00F5FF] font-mono">790m</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[#111] text-[13px]">
            <span className="text-[#aaa]">0xf1...a92b</span>
            <span className="text-[#00F5FF] font-mono">654m</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[#111] text-[13px]">
            <span className="text-[#aaa]">bc_xrons...</span>
            <span className="text-[#00F5FF] font-mono">612m</span>
          </div>
          <div className="mt-auto bg-[#00F5FF]/5 p-4 rounded-xl border border-[#00F5FF]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-[1px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Base Denim Mainnet
              </span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30">
                200ms
              </span>
            </div>
            <div className="text-[11px] text-[#00F5FF]/80">Attribution: {ATTRIBUTION_CODE}</div>
            <div className="text-[11px] text-[#00F5FF]/80">Builder: {BUILDER_CODE}</div>
          </div>
        </div>

        {/* Game Frame */}
        <div className="relative w-full max-w-[432px] flex-1 max-h-[calc(100vh-6rem)] md:max-h-[min(90vh,720px)] bg-[#080808] border-2 border-[#1a1a1a] rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col shrink-0">
          
          <GameView />
          <HUD />

          {/* Screen Routing */}
          <AnimatePresence mode="wait">
            {gameState === 'MENU' && <TitleScreen key="title" />}
            {gameState === 'GAME_OVER' && <GameOverScreen key="gameover" />}
          </AnimatePresence>

          {/* Optional Footer inside Game Frame */}
          {gameState === 'PLAYING' && (
             <div className="absolute bottom-2.5 w-full text-center text-[9px] text-[#444] uppercase tracking-[2px] z-10 pointer-events-none">
               Structural Integrity: 94%
             </div>
          )}
        </div>
        
        {/* Right Side Panel (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-5 w-[260px] h-[min(90vh,720px)] p-6">
          <div className="text-[12px] uppercase text-[#555] tracking-[2px] border-b border-[#222] pb-2.5">
            Wallet Status
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-[12px] border border-[#222]">
            <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-[#00FF00] shadow-[0_0_8px_#00FF00]' : 'bg-red-500 shadow-[0_0_8px_red]'} mr-2`} />
            {isConnected ? 'Base Denim (8453)' : 'Not Connected'}
            <br />
            <span className="text-[#666] font-mono block mt-1">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect via Title Screen'}</span>
          </div>

          <div className="text-[12px] uppercase text-[#555] tracking-[2px] border-b border-[#222] pb-2.5 mt-5 flex justify-between items-center">
            <span>Denim Network</span>
            <span className="text-[10px] text-green-400 font-mono">200ms / block</span>
          </div>
          <div className="text-[11px] text-[#666]">
            <div className="mb-2">• 0.0001 ETH Staked - GM Button</div>
            <div className="mb-2">• Height 120m Recorded on-chain</div>
            <div className="mb-2">• Canonical Finality: Active</div>
          </div>
        </div>

      </div>
    </div>
  );
}
