import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "SECTOR_01_BREACH",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-fuchsia-500"
  },
  {
    id: 2,
    title: "MEMORY_LEAK_DETECTED",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-fuchsia-500 to-cyan-500"
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "ROOT_ACCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-cyan-400 to-blue-600"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full flex flex-col items-center font-mono">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        loop={false}
      />
      
      {/* Visualizer Mock */}
      <div className="w-full h-32 mb-6 bg-black border-2 border-cyan-500 relative overflow-hidden flex items-end justify-center gap-1 p-2 shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]">
        {Array.from({ length: 24 }).map((_, i) => (
          <div 
            key={i}
            className={`w-full bg-gradient-to-t ${currentTrack.color} transition-all duration-75`}
            style={{ 
              height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '10%',
              opacity: isPlaying ? 0.9 : 0.3,
              filter: isPlaying && Math.random() > 0.8 ? 'invert(1)' : 'none'
            }}
          />
        ))}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-fuchsia-900/30 pointer-events-none mix-blend-screen" />
        )}
        {/* Glitch overlay line */}
        {isPlaying && (
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/50 mix-blend-overlay animate-pulse" style={{ transform: `translateY(${Math.random() * 20 - 10}px)` }} />
        )}
      </div>

      {/* Track Info */}
      <div className="w-full text-center mb-6 border-2 border-fuchsia-500 p-4 bg-fuchsia-950/20 relative">
        <div className="absolute top-0 left-0 w-2 h-2 bg-fuchsia-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-fuchsia-500"></div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Terminal className={`w-5 h-5 ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-gray-600'}`} />
          <h3 className="text-2xl font-bold text-white truncate uppercase tracking-wider">{currentTrack.title}</h3>
        </div>
        <p className="text-lg text-cyan-400/80 uppercase tracking-widest">[{currentTrack.artist}]</p>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-4 bg-gray-900 border border-cyan-500/50 mb-6 cursor-pointer relative overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className={`absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button 
          onClick={toggleMute}
          className="p-3 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors shadow-[2px_2px_0px_#ff00ff] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={prevTrack}
          className="p-3 bg-black border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black transition-colors shadow-[2px_2px_0px_#00ffff] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors shadow-[4px_4px_0px_#ff00ff] active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="p-3 bg-black border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black transition-colors shadow-[2px_2px_0px_#00ffff] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
