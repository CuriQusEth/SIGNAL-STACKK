import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../../game/Engine';
import { useGameStore } from '../../store/gameStore';

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const gameState = useGameStore(s => s.gameState);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize exactly once when playing
    if (gameState === 'PLAYING') {
      const engine = new GameEngine();
      engine.mount(canvasRef.current);
      engineRef.current = engine;
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.unmount();
        engineRef.current = null;
      }
    };
  }, [gameState]); // Re-mount if we go from menu -> playing

  const handlePointerDown = () => {
    if (engineRef.current) {
      engineRef.current.drop();
    }
  };

  useEffect(() => {
    const handleDropSignal = () => {
      handlePointerDown();
    };
    window.addEventListener('drop-signal', handleDropSignal);
    return () => window.removeEventListener('drop-signal', handleDropSignal);
  }, []);

  return (
    <div 
      className="absolute inset-0 z-0 touch-none select-none"
      onPointerDown={handlePointerDown}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
    </div>
  );
}
