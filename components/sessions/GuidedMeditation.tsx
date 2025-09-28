import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Utils
import { cn } from "@/lib/utils"

// Types
interface GuidedMeditationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

const meditations = [
  {
    title: "Beginner Meditation",
    duration: "10 minutes",
    description: "Perfect introduction to meditation for beginners",
    difficulty: "Beginner",
    videoId: "inpok4MKVLM",
    thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg"
  },
  {
    title: "Intermediate Meditation",
    duration: "15 minutes", 
    description: "Deepen your practice with intermediate techniques",
    difficulty: "Intermediate",
    videoId: "thcEuMDWxoI",
    thumbnail: "https://img.youtube.com/vi/thcEuMDWxoI/maxresdefault.jpg"
  },
  {
    title: "Expert Meditation",
    duration: "20 minutes",
    description: "Advanced meditation for experienced practitioners",
    difficulty: "Expert",
    videoId: "vj0JDwQLof4",
    thumbnail: "https://img.youtube.com/vi/vj0JDwQLof4/maxresdefault.jpg"
  }
];

export const GuidedMeditation: React.FC<GuidedMeditationProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [completedMeditations, setCompletedMeditations] = React.useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedMeditations');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Save to localStorage when completedMeditations change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedMeditations', JSON.stringify(Array.from(completedMeditations)));
    }
  }, [completedMeditations]);

  // Calculate progress percentage
  const progressPercentage = Math.min((completedMeditations.size / 3) * 100, 100); // 100% after 3 completed meditations

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  const itemsPerSlide = 1; // Show one video per slide
  const totalSlides = meditations.length; // Each meditation gets its own slide

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMeditationClick = (index: number) => {
    const newCompleted = new Set(completedMeditations);
    newCompleted.add(index);
    setCompletedMeditations(newCompleted);
    window.open(`https://www.youtube.com/watch?v=${meditations[index].videoId}`, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Expert": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return meditations.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl mx-auto max-h-[90vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
            🎧 Guided Meditation
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Choose from a variety of guided meditation practices
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-3 md:py-4">
          {/* Meditation Grid */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="flex justify-center">
                    {meditations
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((meditation, index) => {
                        const globalIndex = slideIndex * itemsPerSlide + index;
                        const isCompleted = completedMeditations.has(globalIndex);
                        
                        return (
                          <Card 
                            key={globalIndex}
                            className={cn(
                              "cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800 max-w-md w-full",
                              isCompleted && "ring-2 ring-green-500"
                            )}
                            onClick={() => handleMeditationClick(globalIndex)}
                          >
                            <CardHeader className="p-0">
                              <div className="relative">
                                <img 
                                  src={meditation.thumbnail}
                                  alt={meditation.title}
                                  className="w-full h-28 sm:h-32 md:h-40 object-cover rounded-t-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.jpg';
                                  }}
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                  {meditation.duration}
                                </div>
                                <div className="absolute top-2 left-2">
                                  <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    getDifficultyColor(meditation.difficulty)
                                  )}>
                                    {meditation.difficulty}
                                  </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-t-lg">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-white border-t-[4px] sm:border-t-[6px] border-t-transparent border-b-[4px] sm:border-b-[6px] border-b-transparent ml-1"></div>
                                  </div>
                                </div>
                                {isCompleted && (
                                  <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4">
                              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold mb-2 line-clamp-2 text-indigo-700 dark:text-indigo-300">
                                {meditation.title}
                              </CardTitle>
                              <CardDescription className="text-xs sm:text-sm line-clamp-3 text-indigo-600/80 dark:text-indigo-200/80">
                                {meditation.description}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                <span className="text-xs text-muted-foreground">🕒 {meditation.duration}</span>
                                {isCompleted && (
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    ✓ Completed
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 border-t">
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
                aria-label={`Go to ${meditations[index].difficulty} meditation`}
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
        
        {/* Current slide indicator */}
        <div className="text-center text-sm text-muted-foreground pb-2">
          {meditations[currentSlide].difficulty} Level ({currentSlide + 1} of {totalSlides})
        </div>

        {/* Tips Section */}
        <div className="border-t pt-4">
          <Card className="border-none shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">💡 Meditation Tips</h3>
              <ul className="text-sm text-indigo-600/80 dark:text-indigo-200/80 space-y-1">
                <li>• Find a quiet, comfortable space where you won't be disturbed</li>
                <li>• Use headphones for the best audio experience</li>
                <li>• Start with shorter sessions and gradually increase duration</li>
                <li>• Don't worry if your mind wanders - that's normal and part of the practice</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-3 sm:pt-4 border-t">
          <Button 
            variant="secondary" 
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
