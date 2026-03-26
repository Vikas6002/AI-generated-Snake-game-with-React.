import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff00ff] selection:text-black font-mono overflow-hidden relative flex flex-col uppercase">
      {/* Glitch & Static Overlays */}
      <div className="fixed inset-0 scanlines z-50 pointer-events-none" />
      <div className="fixed inset-0 static-noise z-40 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-start border-b-4 border-[#00ffff] bg-black animate-tear">
        <div className="flex flex-col">
          <h1 
            className="text-4xl md:text-5xl font-bold tracking-widest flex items-center gap-4 glitch-text"
            data-text="NEON_SERPENT.EXE"
          >
            <Terminal className="w-8 h-8 text-[#ff00ff]" />
            NEON_SERPENT.EXE
          </h1>
          <p className="text-[#00ffff] text-lg tracking-[0.5em] mt-2">
            STATUS: <span className="text-[#ff00ff] animate-pulse">COMPROMISED</span>
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end border-2 border-[#ff00ff] p-2 bg-black">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ffff]" />
            <span className="text-sm tracking-widest text-[#00ffff]">UPLINK_ESTABLISHED</span>
          </div>
          <span className="text-xs text-[#ff00ff] mt-1">MEM_CORRUPTION: 84%</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 pb-12 pt-8">
        
        {/* Left Side: Game */}
        <div className="flex flex-col items-center border-4 border-[#00ffff] p-2 bg-black relative shadow-[8px_8px_0px_#ff00ff]">
          <div className="absolute -top-3 left-4 bg-black px-2 text-[#00ffff] text-sm">EXECUTE_BIN</div>
          <SnakeGame />
        </div>

        {/* Right Side: Music & Stats */}
        <div className="flex flex-col gap-8 w-full max-w-[400px]">
          <div className="border-4 border-[#ff00ff] p-2 bg-black relative shadow-[8px_8px_0px_#00ffff] animate-tear" style={{ animationDelay: '1s' }}>
            <div className="absolute -top-3 right-4 bg-black px-2 text-[#ff00ff] text-sm">AUDIO_STREAM</div>
            <div className="flex items-center gap-3 text-[#00ffff] border-b-2 border-[#00ffff] pb-2 mb-4">
              <Cpu className="w-6 h-6" />
              <h2 className="text-xl font-bold tracking-widest">AURAL_INTERFACE</h2>
            </div>
            <MusicPlayer />
          </div>

          {/* Cryptic Terminal Output */}
          <div className="p-4 bg-black border-2 border-[#00ffff] text-[#00ffff] text-sm space-y-2 animate-tear" style={{ animationDelay: '2s' }}>
            <p className="text-[#ff00ff]">&gt; INITIATING DIAGNOSTICS...</p>
            <p>&gt; SECTOR 7G: <span className="text-white">OFFLINE</span></p>
            <p>&gt; NEURAL_LINK: <span className="text-white">UNSTABLE</span></p>
            <p>&gt; OVERRIDE_CODE: <span className="bg-[#ff00ff] text-black px-1">0xDEADBEEF</span></p>
            <div className="w-full h-0.5 bg-[#00ffff] my-2" />
            <p className="text-xs leading-relaxed text-white">
              WARNING: UNAUTHORIZED ACCESS DETECTED. TRACE PROGRAM INITIATED. DISCONNECT IMMEDIATELY.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}


