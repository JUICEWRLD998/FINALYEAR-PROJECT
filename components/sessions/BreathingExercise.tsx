import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Utils
import { cn } from "@/lib/utils"

// Types
interface BreathingExerciseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [phase, setPhase] = React.useState<"Inhale" | "Exhale">("Inhale");
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [completedSections, setCompletedSections] = React.useState<boolean[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breathingCompletedSections');
      return saved ? JSON.parse(saved) : [false, false, false];
    }
    return [false, false, false];
  });
  const [breathingCycles, setBreathingCycles] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('breathingCycles') || '0');
    }
    return 0;
  });

  // Save to localStorage when completedSections change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('breathingCompletedSections', JSON.stringify(completedSections));
    }
  }, [completedSections]);

  // Save to localStorage when breathingCycles change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('breathingCycles', breathingCycles.toString());
    }
  }, [breathingCycles]);

  // YouTube videos for breathing exercises
  const breathingVideos = [
    {
      title: "4-7-8 Breathing Technique",
      description: "Deep relaxation breathing method for stress relief",
      videoId: "odADwWzHR24",
      thumbnail: `https://img.youtube.com/vi/odADwWzHR24/maxresdefault.jpg`,
      duration: "4:32"
    },
    {
      title: "Box Breathing Exercise",
      description: "Navy SEAL breathing technique for focus and calm",
      videoId: "tEmt1Znux58", 
      thumbnail: `https://img.youtube.com/vi/tEmt1Znux58/maxresdefault.jpg`,
      duration: "8:15"
    }
  ];

  // Total slides: 1 breathing guide + 2 video slides
  const totalSlides = 1 + breathingVideos.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Mark video as completed when clicked
  const handleVideoClick = (videoIndex: number) => {
    const newCompleted = [...completedSections];
    newCompleted[videoIndex + 1] = true; // +1 because index 0 is breathing guide
    setCompletedSections(newCompleted);
    window.open(`https://www.youtube.com/watch?v=${breathingVideos[videoIndex].videoId}`, '_blank');
  };

  // Calculate progress percentage
  const completedCount = completedSections.filter(Boolean).length;
  const progressPercentage = (completedCount / totalSlides) * 100;

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  // Speech synthesis function
  const speak = React.useCallback((text: string) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 0.8;
    utterance.rate = 0.7;
    utterance.pitch = 1.0;
    
    // Wait for voices to be loaded
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        // Use a calming voice if available
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Woman') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Google UK English Female') ||
          voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      console.log(`Speaking: "${text}"`); // Debug log
      window.speechSynthesis.speak(utterance);
    };
    
    // Check if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      // Wait for voices to load
      const voiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.removeEventListener('voiceschanged', voiceschanged);
      };
      window.speechSynthesis.addEventListener('voiceschanged', voiceschanged);
    }
  }, [audioEnabled]);

  React.useEffect(() => {
    if (!isPlaying) return;
    
    let mounted = true;
    
    const runCycle = () => {
      if (!mounted) return;
      
      setPhase("Inhale");
      speak("Inhale");
      
      const inhaleTimeout = setTimeout(() => {
        if (mounted) {
          setPhase("Exhale");
          speak("Exhale");
        }
      }, 4000);
      
      const exhaleTimeout = setTimeout(() => {
        if (mounted) {
          setBreathingCycles(prev => {
            const newCount = prev + 1;
            // Mark breathing guide as completed after 3 cycles
            if (newCount >= 3) {
              setCompletedSections(prevCompleted => {
                const newCompleted = [...prevCompleted];
                newCompleted[0] = true;
                return newCompleted;
              });
            }
            return newCount;
          });
          runCycle();
        }
      }, 10000);
      
      return () => {
        clearTimeout(inhaleTimeout);
        clearTimeout(exhaleTimeout);
      };
    };
    
    // Start immediately when isPlaying becomes true
    const cleanup = runCycle();
    
    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [isPlaying, speak]);

  const handleStartPause = () => {
    if (!isPlaying) {
      // When starting, immediately set phase and speak after a brief delay
      setPhase("Inhale");
      setTimeout(() => {
        speak("Inhale");
      }, 200); // Small delay to ensure everything is ready
    }
    setIsPlaying((p) => !p);
  };

  const handleRestart = () => {
    // Reset all breathing-related state
    setIsPlaying(false);
    setBreathingCycles(0);
    setPhase("Inhale");
    
    // Reset completion for breathing guide only (keep video completions)
    setCompletedSections(prev => {
      const newCompleted = [...prev];
      newCompleted[0] = false;
      return newCompleted;
    });
    
    // After a brief pause, start the breathing exercise
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  // Cleanup speech synthesis when dialog closes and reset state when it opens
  React.useEffect(() => {
    if (!open && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Reset state when dialog opens
    if (open) {
      setIsPlaying(false);
      setPhase("Inhale");
      setBreathingCycles(0);
    }
  }, [open]);

  // Get colors based on phase
  const getPhaseColors = () => {
    if (phase === "Inhale") {
      return {
        background: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-600",
        text: "text-blue-700 dark:text-blue-300"
      };
    } else {
      return {
        background: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-300 dark:border-green-600",
        text: "text-green-700 dark:text-green-300"
      };
    }
  };

  const colors = getPhaseColors();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-lg sm:text-xl">Guided Breathing Exercise</DialogTitle>
          <DialogDescription className="text-sm">
            Swipe through breathing guides and video tutorials
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative overflow-hidden py-3 sm:py-4">
          {/* Slider Container */}
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Slide 1: Interactive Breathing Guide */}
            <div className="w-full flex-shrink-0 flex flex-col items-center gap-3 sm:gap-4 px-2">
              <div className="flex items-center gap-2 justify-center">
                <h3 className="text-base sm:text-lg font-semibold text-center">Interactive Breathing Guide</h3>
                {completedSections[0] && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div
                aria-label="Breathing guide"
                className={cn(
                  "relative grid place-items-center rounded-full border-2 transition-all duration-1000",
                  colors.background,
                  colors.border,
                  isPlaying ? "motion-safe:animate-breathe" : "",
                  "animate-scale-in shadow-lg mx-auto"
                )}
                style={{ 
                  width: "min(180px, 45vw)", 
                  height: "min(180px, 45vw)", 
                  minWidth: "140px", 
                  minHeight: "140px" 
                }}
              >
                <div className={cn("text-base sm:text-lg font-semibold transition-colors duration-500 text-center", colors.text)}>
                  {phase}
                </div>
                <div className={cn("text-xs mt-1 opacity-70 text-center", colors.text)}>
                  {phase === "Inhale" ? "4 seconds" : "6 seconds"}
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center w-full">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleStartPause}
                  className="text-xs sm:text-sm"
                >
                  {isPlaying ? "Pause" : "Start"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRestart}
                  className="text-xs sm:text-sm"
                >
                  Restart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAudioEnabled((a) => !a)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="text-sm">🔊</span>
                  {audioEnabled ? "Mute" : "Unmute"}
                </Button>
              </div>
            </div>

            {/* Video Slides */}
            {breathingVideos.map((video, index) => (
              <div key={video.videoId} className="w-full flex-shrink-0 flex flex-col items-center gap-3 sm:gap-4 px-2">
                <div className="flex items-center gap-2 justify-center">
                  <h3 className="text-base sm:text-lg font-semibold text-center">Video Guide {index + 1}</h3>
                  {completedSections[index + 1] && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                <Card 
                  className="w-full max-w-[280px] cursor-pointer hover:shadow-lg transition-shadow duration-200 mx-auto"
                  onClick={() => handleVideoClick(index)}
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img 
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 sm:h-40 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-t-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-white border-t-[4px] sm:border-t-[6px] border-t-transparent border-b-[4px] sm:border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      {completedSections[index + 1] && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base font-semibold mb-2 line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-3">
                      {video.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevSlide}
            className="w-8 h-8 p-0 text-sm"
          >
            ←
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors",
                  index === currentSlide ? "bg-primary" : "bg-muted"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextSlide}
            className="w-8 h-8 p-0 text-sm"
          >
            →
          </Button>
        </div>

        <div className="flex justify-center pt-3 sm:pt-4 border-t">
          <Button 
            variant="soft" 
            onClick={() => onOpenChange(false)}
            className="text-sm"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
