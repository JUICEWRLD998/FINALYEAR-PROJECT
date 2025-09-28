import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Utils
import { cn } from "@/lib/utils"

// Types
interface AffirmationsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

const affirmationCategories = [
  {
    title: "Self-Love & Confidence",
    description: "Build a positive relationship with yourself",
    color: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-300",
    affirmations: [
      "I am worthy of love and respect exactly as I am",
      "I choose to speak kindly to myself today",
      "My uniqueness is my strength and gift to the world",
      "I trust myself to make good decisions for my life",
      "I am growing stronger and more confident each day",
      "I deserve happiness and all good things in life"
    ]
  },
  {
    title: "Stress & Anxiety Relief",
    description: "Find calm and peace in challenging moments",
    color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    affirmations: [
      "I breathe in peace and breathe out tension",
      "This feeling is temporary, and I will get through this",
      "I have overcome challenges before, and I can do it again",
      "I release what I cannot control and focus on what I can",
      "I am safe, I am calm, and I am in control of my thoughts",
      "Each breath brings me more peace and clarity"
    ]
  },
  {
    title: "Success & Achievement",
    description: "Cultivate a mindset for growth and accomplishment",
    color: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-300",
    affirmations: [
      "I am capable of achieving my goals and dreams",
      "Every challenge is an opportunity for me to grow",
      "I attract positive opportunities into my life",
      "I have all the skills and resources I need to succeed",
      "I am persistent, focused, and committed to my goals",
      "Success flows to me easily and naturally"
    ]
  },
  {
    title: "Gratitude & Joy",
    description: "Appreciate life's blessings and find daily happiness",
    color: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-700 dark:text-amber-300",
    affirmations: [
      "I am grateful for all the abundance in my life",
      "Joy flows through me and radiates to others",
      "I notice and appreciate the small beautiful moments",
      "My heart is open to receiving all the good life offers",
      "I choose to focus on what brings me happiness",
      "Every day brings new reasons to smile and be grateful"
    ]
  }
];

export const Affirmations: React.FC<AffirmationsProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [readingSpeed, setReadingSpeed] = React.useState(3000); // milliseconds
  const [completedCategories, setCompletedCategories] = React.useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedAffirmationCategories');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage when completedCategories change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedAffirmationCategories', JSON.stringify(Array.from(completedCategories)));
    }
  }, [completedCategories]);

  // Calculate progress percentage
  const progressPercentage = Math.min((completedCategories.size / affirmationCategories.length) * 100, 100);

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  const totalSlides = affirmationCategories.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setCurrentAffirmationIndex(0);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setCurrentAffirmationIndex(0);
    setIsPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setCurrentAffirmationIndex(0);
    setIsPlaying(false);
  };

  const currentCategory = affirmationCategories[currentSlide];
  const currentAffirmation = currentCategory.affirmations[currentAffirmationIndex];

  const nextAffirmation = () => {
    setCurrentAffirmationIndex((prev) => {
      const nextIndex = (prev + 1) % currentCategory.affirmations.length;
      // Mark category as completed when we've cycled through all affirmations
      if (nextIndex === 0) {
        setCompletedCategories(prevCompleted => {
          const newCompleted = new Set(prevCompleted);
          newCompleted.add(currentSlide);
          return newCompleted;
        });
      }
      return nextIndex;
    });
  };

  const prevAffirmation = () => {
    setCurrentAffirmationIndex((prev) => 
      prev === 0 ? currentCategory.affirmations.length - 1 : prev - 1
    );
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      nextAffirmation();
    }, readingSpeed);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  // Cleanup interval on unmount or dialog close
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      stopAutoPlay();
    }
  }, [open]);

  // Speak affirmation function
  const speakAffirmation = React.useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 0.8;
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Woman') || 
          voice.name.includes('Samantha') ||
          voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    };
    
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      const voiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.removeEventListener('voiceschanged', voiceschanged);
      };
      window.speechSynthesis.addEventListener('voiceschanged', voiceschanged);
    }
  }, []);

  const handleSpeakAffirmation = () => {
    speakAffirmation(currentAffirmation);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl mx-auto my-2 sm:my-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-lg xs:text-xl sm:text-2xl md:text-3xl flex items-center justify-center gap-2 font-bold">
            ✨ Daily Affirmations
          </DialogTitle>
          <DialogDescription className="text-xs xs:text-sm sm:text-base text-center max-w-2xl mx-auto">
            Empower yourself with positive, uplifting statements for different areas of life
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-3 md:py-4">
          {/* Affirmation Display */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {affirmationCategories.map((category, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <Card className={cn(
                    "border-2 shadow-lg bg-gradient-to-br",
                    category.color,
                    category.borderColor,
                    completedCategories.has(slideIndex) && "ring-2 ring-green-500"
                  )}>
                    <CardHeader className="text-center p-3 xs:p-4 sm:p-6">
                      <div className="flex flex-col xs:flex-row items-center justify-center gap-2 mb-2">
                        <CardTitle className={cn("text-lg xs:text-xl sm:text-2xl", category.textColor)}>
                          {category.title}
                        </CardTitle>
                        {completedCategories.has(slideIndex) && (
                          <div className="w-5 h-5 xs:w-6 xs:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <CardDescription className={cn("text-xs xs:text-sm", category.textColor.replace('700', '600').replace('300', '200'))}>
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 xs:space-y-6 p-3 xs:p-4 sm:p-6">
                      {/* Current Affirmation */}
                      <div className="text-center py-3 xs:py-4 sm:py-6 md:py-8 px-2 xs:px-4">
                        <div className={cn(
                          "text-sm xs:text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-3 xs:mb-4 min-h-[60px] xs:min-h-[80px] sm:min-h-[100px] md:min-h-[120px] flex items-center justify-center transition-all duration-500",
                          category.textColor
                        )}>
                          "{currentAffirmation}"
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 mb-3 xs:mb-4">
                          {category.affirmations.map((_, index) => (
                            <div
                              key={index}
                              className={cn(
                                "w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-colors",
                                index === currentAffirmationIndex 
                                  ? "bg-primary" 
                                  : "bg-muted"
                              )}
                            />
                          ))}
                        </div>

                        <div className="text-xs xs:text-sm text-muted-foreground">
                          {currentAffirmationIndex + 1} of {category.affirmations.length}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap gap-2 xs:gap-3 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={prevAffirmation}
                          className={cn("text-xs xs:text-sm px-2 xs:px-3", category.borderColor)}
                        >
                          ← Previous
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={togglePlayPause}
                          className={cn("text-xs sm:text-sm px-2 sm:px-3", category.borderColor)}
                        >
                          {isPlaying ? "⏸️ Pause" : "▶️ Auto Play"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSpeakAffirmation}
                          className={cn("text-xs sm:text-sm px-2 sm:px-3", category.borderColor)}
                        >
                          🔊 Speak
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={nextAffirmation}
                          className={cn("text-xs sm:text-sm px-2 sm:px-3", category.borderColor)}
                        >
                          Next →
                        </Button>
                      </div>

                      {/* Speed Control */}
                      {isPlaying && (
                        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-3 pt-2">
                          <span className="text-xs text-muted-foreground">Speed:</span>
                          <div className="flex gap-1">
                            {[
                              { label: "Slow", value: 5000 },
                              { label: "Normal", value: 3000 },
                              { label: "Fast", value: 2000 }
                            ].map((speed) => (
                              <Button
                                key={speed.value}
                                variant={readingSpeed === speed.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setReadingSpeed(speed.value);
                                  if (isPlaying) {
                                    stopAutoPlay();
                                    startAutoPlay();
                                  }
                                }}
                                className="text-xs px-2 py-1 h-6"
                              >
                                {speed.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 py-3 sm:py-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevSlide}
            className="w-7 h-7 xs:w-8 xs:h-8 p-0 text-xs xs:text-sm"
          >
            ←
          </Button>
          
          <div className="flex gap-1 xs:gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors",
                  index === currentSlide ? "bg-primary" : "bg-muted",
                  completedCategories.has(index) && "ring-1 ring-green-500"
                )}
                aria-label={`Go to ${affirmationCategories[index].title}`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextSlide}
            className="w-7 h-7 xs:w-8 xs:h-8 p-0 text-xs xs:text-sm"
          >
            →
          </Button>
        </div>

        {/* Tips */}
        <div className="border-t pt-3 xs:pt-4">
          <Card className="border-none shadow-sm bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
            <CardContent className="p-3 xs:p-4">
              <h3 className="font-medium mb-2 text-xs xs:text-sm text-violet-700 dark:text-violet-300">💡 Affirmation Tips</h3>
              <ul className="text-xs xs:text-sm text-violet-600/80 dark:text-violet-200/80 space-y-1">
                <li>• Repeat affirmations with conviction and believe in their truth</li>
                <li>• Practice daily, ideally in the morning or before sleep</li>
                <li>• Visualize yourself embodying these positive qualities</li>
                <li>• Choose affirmations that resonate most with your current needs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-3 xs:pt-4 border-t">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            className="text-xs xs:text-sm px-3 xs:px-4"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
