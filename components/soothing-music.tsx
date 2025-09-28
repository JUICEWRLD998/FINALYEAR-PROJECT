import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

interface SoothingMusicProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgressChange?: (progress: number) => void;
}

const songs = [
  {
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    cover: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    background: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
    borderColor: 'border-blue-200 hover:border-blue-300 dark:border-blue-700 dark:hover:border-blue-600'
  },
  {
    title: 'Gentle Rain',
    artist: 'Calm Atmosphere',
    cover: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    background: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30',
    borderColor: 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
  },
  {
    title: 'Peaceful Piano',
    artist: 'Relaxing Keys',
    cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    background: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
    borderColor: 'border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600'
  },
  {
    title: 'Forest Birds',
    artist: 'Nature Symphony',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    background: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
    borderColor: 'border-green-200 hover:border-green-300 dark:border-green-700 dark:hover:border-green-600'
  },
  {
    title: 'Meditation Bells',
    artist: 'Zen Collection',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    background: 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30',
    borderColor: 'border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600'
  },
  {
    title: 'Soft Guitar',
    artist: 'Acoustic Dreams',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop&crop=center',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    background: 'bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30',
    borderColor: 'border-rose-200 hover:border-rose-300 dark:border-rose-700 dark:hover:border-rose-600'
  },
];

export default function SoothingMusic({ open, onOpenChange, onProgressChange }: SoothingMusicProps) {
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSongs, setCompletedSongs] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soothingMusicCompletedSongs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save to localStorage when completedSongs change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('soothingMusicCompletedSongs', JSON.stringify(Array.from(completedSongs)));
    }
  }, [completedSongs]);

  const handlePlay = (idx: number) => {
    if (currentSong !== null && audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSong(idx);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const handleResume = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleSongEnd = () => {
    setIsPlaying(false);
    if (currentSong !== null) {
      const newCompletedSongs = new Set(completedSongs);
      newCompletedSongs.add(currentSong);
      setCompletedSongs(newCompletedSongs);
      
      // Calculate progress: 50% for 1 song, 100% for 2+ songs
      const progressValue = newCompletedSongs.size === 1 ? 50 : newCompletedSongs.size >= 2 ? 100 : 0;
      onProgressChange?.(progressValue);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline" 
              size="sm"
              className="self-start w-fit"
            >
              ← Back
            </Button>
            {currentSong === null && (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 sm:flex-1 sm:text-center">
                  🎵 Soothing Music
                </h2>
                <div className="hidden sm:block w-16"></div> {/* Spacer for centering */}
              </>
            )}
          </div>
          
          
          {currentSong === null ? (
            <div className="grid gap-3 sm:gap-4">
              <p className="text-muted-foreground mb-8 max-w-2xl animate-fade-in mx-auto text-lg text-center">
                Choose a track to relax and unwind with calming music
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {songs.map((song, idx) => (
                  <div 
                    key={song.title} 
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all duration-200 border shadow-sm hover:shadow-md ${song.background} ${song.borderColor}`}
                  >
                    <img 
                      src={song.cover} 
                      alt={song.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-lg text-gray-800 dark:text-gray-100 truncate">{song.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{song.artist}</div>
                    </div>
                    <Button 
                      onClick={() => handlePlay(idx)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base flex-shrink-0 shadow-sm"
                    >
                      <span className="sm:hidden">▶️</span>
                      <span className="hidden sm:inline">▶️ Play</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-md mx-auto">
              {/* Title when playing a song */}
              <div className="text-center mb-4 sm:mb-6 w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  🎵 Soothing Music
                </h3>
              </div>
              
              <img 
                src={songs[currentSong].cover} 
                alt={songs[currentSong].title}
                className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl object-cover mb-4 sm:mb-6 shadow-lg"
              />
              <div className="text-center mb-4 sm:mb-6 w-full">
                <div className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 px-4">{songs[currentSong].title}</div>
                <div className="text-base sm:text-lg text-gray-600 px-4">{songs[currentSong].artist}</div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full px-4 mb-4 sm:mb-6">
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                  <span>{audioRef.current ? formatTime(audioRef.current.currentTime || 0) : '0:00'}</span>
                  <span>{audioRef.current ? formatTime(audioRef.current.duration || 0) : '0:00'}</span>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={songs[currentSong].src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleSongEnd}
                className="hidden"
              />
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full px-4">
                {isPlaying ? (
                  <Button 
                    onClick={handlePause} 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm sm:text-lg transition-colors duration-200 w-full sm:w-auto"
                  >
                    ⏸️ Pause
                  </Button>
                ) : (
                  <Button 
                    onClick={handleResume} 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm sm:text-lg transition-colors duration-200 w-full sm:w-auto"
                  >
                    ▶️ Play
                  </Button>
                )}
                <Button 
                  onClick={handleBack} 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm sm:text-lg transition-colors duration-200 w-full sm:w-auto"
                >
                  📋 Back to List
                </Button>
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
                🎧 Use headphones for the best experience
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
