import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc3 } from 'lucide-react';
import { DUMMY_SONGS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = DUMMY_SONGS[currentIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    const handleEnded = () => {
      skipForward();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Fake visualizer bars
  const bars = Array.from({ length: 16 });

  return (
    <div className="w-full">
      <audio ref={audioRef} src={currentSong.url} />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="relative w-24 h-24 border-2 border-[#00ffff] bg-black p-1 shadow-[4px_4px_0px_#ff00ff]">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : 'grayscale'}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#ff00ff]/20 mix-blend-overlay flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="text-[#00ffff]"
              >
                <Disc3 className="w-10 h-10" />
              </motion.div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-white font-bold text-xl truncate tracking-widest glitch-text" data-text={currentSong.title}>
                {currentSong.title}
              </h3>
              <p className="text-[#ff00ff] text-sm tracking-widest mt-1 bg-black inline-block">
                {currentSong.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Visualizer */}
          <div className="flex items-end gap-1 h-8 mt-4">
            {bars.map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-[#00ffff]"
                animate={{
                  height: isPlaying ? ['20%', `${Math.random() * 80 + 20}%`, '20%'] : '10%',
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.2 + Math.random() * 0.3,
                  ease: "steps(3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10 border-2 border-[#ff00ff] p-1 bg-black">
        <div className="h-2 w-full bg-black overflow-hidden relative">
          <motion.div 
            className="h-full bg-[#00ffff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between relative z-10 bg-black border-2 border-[#00ffff] p-2 shadow-[4px_4px_0px_#ff00ff]">
        <div className="flex items-center gap-4">
          <button 
            onClick={skipBackward}
            className="text-[#ff00ff] hover:text-white transition-colors hover:bg-[#ff00ff] p-1"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-[#00ffff] flex items-center justify-center text-black hover:bg-white transition-colors border-2 border-black"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="text-[#ff00ff] hover:text-white transition-colors hover:bg-[#ff00ff] p-1"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#00ffff]">
          <Volume2 className="w-5 h-5" />
          <div className="w-16 h-2 border border-[#00ffff] bg-black overflow-hidden">
            <div className="w-2/3 h-full bg-[#ff00ff]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;


