import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="static-noise"></div>
      <div className="scanline"></div>
      
      <h1 
        className="text-5xl md:text-7xl font-bold mb-8 glitch-text uppercase tracking-widest z-10"
        data-text="SYSTEM.FAILURE // OVERRIDE"
      >
        SYSTEM.FAILURE // OVERRIDE
      </h1>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="md:col-span-2 flex flex-col items-center bg-black p-6 border-2 border-cyan-500 shadow-[6px_6px_0px_#ff00ff] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse"></div>
          <div className="w-full flex justify-between items-center mb-4 border-b-2 border-fuchsia-500 pb-2">
            <h2 className="text-3xl text-cyan-400 font-bold tracking-widest uppercase">OROBOROS_PROTOCOL.EXE</h2>
            <div className="text-3xl font-bold text-fuchsia-500 animate-pulse">
              DATA_HARVESTED: {score}
            </div>
          </div>
          <SnakeGame onScoreChange={setScore} />
          <p className="text-cyan-600 text-xl mt-4 uppercase tracking-widest">INPUT: [W,A,S,D] | INTERRUPT: [SPACE]</p>
        </div>
        
        <div className="md:col-span-1 flex flex-col bg-black p-6 border-2 border-fuchsia-500 shadow-[-6px_6px_0px_#00ffff] relative">
          <div className="absolute top-0 right-0 w-1 h-full bg-fuchsia-500 animate-pulse"></div>
          <h2 className="text-3xl text-fuchsia-400 font-bold tracking-widest mb-6 uppercase border-b-2 border-cyan-500 pb-2">NEURAL_STREAM.DAT</h2>
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
