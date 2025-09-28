"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface StoryItem {
  id: string
  title: string
  category: string
  duration: string
  narrator: string
  cover: string
  description: string
  fullStory: string
}

interface SleepStoriesProps {
  onProgressChange?: (progress: number) => void
  onBack?: () => void
}

interface StoryCardProps {
  story: StoryItem
  active?: boolean
  completed?: boolean
  onPlay: () => void
}

interface PlayerBarProps {
  current: StoryItem | null
  isPlaying: boolean
  progress: number
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (value: number) => void
}

// Story Card Component
const StoryCard: React.FC<StoryCardProps> = ({ story, active, completed, onPlay }) => {
  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-200 hover:shadow-md animate-fade-in",
      active && "ring-2 ring-primary",
      completed && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
    )}>
      <CardHeader className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={story.cover}
              alt={story.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg';
              }}
            />
            {completed && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }}
                className="w-8 h-8 p-0"
              >
                {active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-base font-semibold line-clamp-1">
                  {story.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {story.narrator} • {story.duration}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {story.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {story.description}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

// Player Bar Component
const PlayerBar: React.FC<PlayerBarProps> = ({
  current,
  isPlaying,
  progress,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek
}) => {
  if (!current) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Current Story Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={current.cover}
              alt={current.title}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm line-clamp-1">{current.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{current.narrator}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onPrev}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" onClick={onTogglePlay}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onNext}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
            <Slider
              value={[progress]}
              onValueChange={(value) => onSeek(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <Button variant="ghost" size="sm">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mt-2">
          <Slider
            value={[progress]}
            onValueChange={(value) => onSeek(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Main Sleep Stories Component
export const SleepStories: React.FC<SleepStoriesProps> = ({ onProgressChange, onBack }) => {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [currentUtterance, setCurrentUtterance] = React.useState<SpeechSynthesisUtterance | null>(null);
  const [completedStories, setCompletedStories] = React.useState<boolean[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sleepStoriesCompleted');
      return saved ? JSON.parse(saved) : [false, false, false, false];
    }
    return [false, false, false, false];
  });

  // Save to localStorage when completedStories change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sleepStoriesCompleted', JSON.stringify(completedStories));
    }
  }, [completedStories]);

  // Sample stories data
  const stories: StoryItem[] = [
    {
      id: "1",
      title: "Twilight Meadow",
      category: "Night",
      duration: "12 min",
      narrator: "Emma Thompson",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
      description: "A peaceful journey through a moonlit meadow where gentle breezes carry the scent of lavender.",
      fullStory: "Welcome to Twilight Meadow. Close your eyes and imagine yourself walking slowly through a peaceful meadow under the soft glow of moonlight. The grass beneath your feet is cool and damp with evening dew. Gentle breezes carry the sweet scent of lavender and wildflowers. You can hear the distant sound of a babbling brook and the soft chirping of crickets. Take a deep breath and feel all your worries melting away as you continue your peaceful journey through this magical meadow. The night air is fresh and clean, filling your lungs with tranquility. Let yourself drift deeper into relaxation with each step you take."
    },
    {
      id: "2", 
      title: "Ocean Waves",
      category: "Ocean",
      duration: "15 min",
      narrator: "David Attenborough",
      cover: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop&crop=center",
      description: "Drift away to the rhythmic sounds of gentle waves lapping against a secluded shore.",
      fullStory: "Find yourself on a beautiful secluded beach as the sun sets on the horizon. The warm sand cradles your body as you lie down and listen to the rhythmic sounds of gentle waves lapping against the shore. Each wave brings a sense of calm and peace, washing away all stress and tension. The ocean breeze is warm and soothing, carrying the fresh scent of salt water. Seagulls call softly in the distance as the sky transforms into brilliant shades of orange and pink. Feel your breathing naturally synchronize with the rhythm of the waves. Let the peaceful sounds of the ocean carry you into a deep, restful sleep."
    },
    {
      id: "3",
      title: "Enchanted Forest",
      category: "Forest",
      duration: "10 min",
      narrator: "Helen Mirren",
      cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center",
      description: "Walk through an ancient forest where soft whispers of wind through leaves create perfect harmony.",
      fullStory: "Step into an enchanted forest where ancient trees stretch toward the starlit sky. Soft whispers of wind move through the leaves, creating a natural symphony of peace and tranquility. Shafts of moonlight filter through the canopy, creating magical patterns on the forest floor. The air is fresh and pure, filled with the earthy scent of moss and pine. You can hear the gentle rustling of small woodland creatures going about their nightly activities. As you walk deeper into this magical place, feel your body becoming lighter and more relaxed. The wisdom of the ancient trees surrounds you, offering protection and comfort as you prepare for peaceful sleep."
    },
    {
      id: "4",
      title: "Gentle Rain",
      category: "Rain",
      duration: "8 min",
      narrator: "Morgan Freeman",
      cover: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop&crop=center",
      description: "The soothing patter of raindrops on leaves creates a natural lullaby for deep relaxation.",
      fullStory: "You're safe and warm inside a cozy cabin as gentle rain begins to fall outside. Listen to the soothing patter of raindrops on the roof and against the windows. Each drop creates a peaceful rhythm that naturally calms your mind and body. The air is fresh and clean, washed by the gentle rain. You can smell the pleasant scent of rain on earth drifting through the slightly open window. The sound of rain on leaves creates nature's perfect lullaby. Feel your muscles relaxing as you sink deeper into comfort, surrounded by the protective embrace of this peaceful rainy evening. Let the gentle rhythm of the rain guide you into tranquil sleep."
    }
  ];

  const categories = ["All", "Night", "Ocean", "Forest", "Rain"];

  const filteredStories = activeCategory === "All" 
    ? stories 
    : stories.filter(story => story.category === activeCategory);

  const currentStory = currentIndex !== null ? stories[currentIndex] : null;

  // Calculate overall progress (each story = 25%)
  const overallProgress = React.useMemo(() => {
    const completedCount = completedStories.filter(Boolean).length;
    return (completedCount / stories.length) * 100;
  }, [completedStories]);

  // Report progress changes
  React.useEffect(() => {
    onProgressChange?.(overallProgress);
  }, [overallProgress, onProgressChange]);

  // Simple progress simulation for speech synthesis
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStory) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            handleNext();
            return 100;
          }
          return prev + 1; // Increment by 1% every second
        });
      }, 1000); // Update every second
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentStory]);

  const handlePlay = (index: number) => {
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (currentIndex === index) {
      if (isPlaying) {
        // Pause
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        // Resume or start
        if (currentUtterance) {
          window.speechSynthesis.resume();
        } else {
          startStory(index);
        }
        setIsPlaying(true);
      }
    } else {
      setCurrentIndex(index);
      setProgress(0);
      startStory(index);
      setIsPlaying(true);
    }
  };

  const startStory = (index: number) => {
    const story = stories[index];
    const utterance = new SpeechSynthesisUtterance(story.fullStory);
    
    // Configure speech settings for relaxation
    utterance.rate = 0.6; // Slower speech for relaxation
    utterance.pitch = 0.8; // Slightly lower pitch
    utterance.volume = 0.8;
    
    // Try to use a more soothing voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('susan')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      
      // Mark current story as completed
      setCompletedStories(prev => {
        const newCompleted = [...prev];
        newCompleted[index] = true;
        return newCompleted;
      });
      
      handleNext();
    };

    utterance.onpause = () => {
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
    };

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (currentIndex !== null) {
      handlePlay(currentIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      window.speechSynthesis.cancel();
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsPlaying(true);
      startStory(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < stories.length - 1) {
      window.speechSynthesis.cancel();
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setIsPlaying(true);
      startStory(currentIndex + 1);
    } else {
      // End of playlist
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentIndex(null);
      setProgress(0);
    }
  };

  const handleSeek = (value: number) => {
    setProgress(value);
    // For speech synthesis, we can't really seek, so just update progress
  };

  // Cleanup speech synthesis on unmount
  React.useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen pb-24">
      <div className="absolute inset-0 -z-10 ambient-bg" aria-hidden />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-10 h-10 rounded-full hover:bg-accent/50 transition-colors"
              aria-label="Back to Sessions"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide mb-3 animate-fade-in flex items-center justify-center gap-3 text-purple-700 dark:text-purple-400">
              Sleep Stories 🌙
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl animate-fade-in mx-auto text-lg">
              Drift into peaceful sleep with our collection of soothing bedtime stories, narrated by calming voices.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="animate-fade-in"
              >
                {category}
              </Button>
            ))}
          </div>
        </header>

        {/* Stories List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredStories.map((story, index) => {
            const originalIndex = stories.findIndex(s => s.id === story.id);
            return (
              <div
                key={story.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlay(originalIndex)}
              >
                <StoryCard
                  story={story}
                  active={currentIndex === originalIndex && isPlaying}
                  completed={completedStories[originalIndex]}
                  onPlay={() => handlePlay(originalIndex)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBar
        current={currentStory}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
      />
    </section>
  );
};
