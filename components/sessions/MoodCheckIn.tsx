import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Utils
import { cn } from "@/lib/utils"

// Types
interface MoodCheckInProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

interface MoodEntry {
  id: string
  date: string
  time: string
  mood: string
  intensity: number
  note: string
}

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300" },
  { emoji: "😌", label: "Calm", color: "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300" },
  { emoji: "😔", label: "Sad", color: "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-900/30 dark:border-gray-600 dark:text-gray-300" },
  { emoji: "😠", label: "Angry", color: "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300" },
  { emoji: "😰", label: "Anxious", color: "bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900/30 dark:border-orange-600 dark:text-orange-300" },
  { emoji: "😴", label: "Tired", color: "bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300" },
  { emoji: "🤗", label: "Grateful", color: "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300" },
  { emoji: "😕", label: "Stressed", color: "bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-900/30 dark:border-pink-600 dark:text-pink-300" }
];

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [selectedMood, setSelectedMood] = React.useState<string>("");
  const [intensity, setIntensity] = React.useState(5);
  const [note, setNote] = React.useState("");
  const [currentStep, setCurrentStep] = React.useState(0); // 0: mood, 1: intensity, 2: note
  const [moodEntries, setMoodEntries] = React.useState<MoodEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moodEntries');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage when entries change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  // Calculate progress percentage
  const progressPercentage = Math.min((moodEntries.length / 5) * 100, 100); // 100% after 5 check-ins

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  const steps = [
    {
      title: "How are you feeling?",
      description: "Select the emotion that best describes your current mood"
    },
    {
      title: "How intense is this feeling?",
      description: "Rate the intensity of your emotion from 1 (very mild) to 10 (very intense)"
    },
    {
      title: "Add a note (optional)",
      description: "Share what's on your mind or what might be influencing your mood"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveMoodEntry = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: selectedMood,
        intensity,
        note: note.trim()
      };

      setMoodEntries(prev => [newEntry, ...prev.slice(0, 19)]); // Keep only last 20 entries
      
      // Reset form
      setSelectedMood("");
      setIntensity(5);
      setNote("");
      setCurrentStep(0);
    }
  };

  const resetForm = () => {
    setSelectedMood("");
    setIntensity(5);
    setNote("");
    setCurrentStep(0);
  };

  const getSelectedMoodData = () => {
    return moods.find(mood => mood.label === selectedMood);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedMood !== "";
      case 1: return true;
      case 2: return true;
      default: return false;
    }
  };

  const getTodayEntries = () => {
    const today = new Date().toLocaleDateString();
    return moodEntries.filter(entry => entry.date === today);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
            💖 Mood Check-in
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Take a moment to acknowledge and track how you're feeling
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-3 md:py-4">
          {/* Step Progress */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div 
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors",
                    index <= currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "w-8 sm:w-12 h-0.5 transition-colors",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Current Step Content */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-base sm:text-lg text-purple-700 dark:text-purple-300">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-purple-600/80 dark:text-purple-200/80">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
              {/* Step 0: Mood Selection */}
              {currentStep === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        selectedMood === mood.label 
                          ? mood.color + " shadow-md" 
                          : "border-muted bg-background hover:bg-muted/50"
                      )}
                    >
                      <div className="text-xl sm:text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs sm:text-sm font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Intensity */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getSelectedMoodData()?.emoji}</div>
                    <div className="text-lg font-medium text-pink-700 dark:text-pink-300">
                      {selectedMood}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Intensity: {intensity}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very mild</span>
                      <span>Very intense</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Note */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getSelectedMoodData()?.emoji}</div>
                    <div className="text-lg font-medium text-pink-700 dark:text-pink-300">
                      {selectedMood} - {intensity}/10
                    </div>
                  </div>
                  
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's on your mind? (optional)"
                    className="min-h-[80px] resize-none border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600 bg-white/50 dark:bg-black/20"
                    maxLength={300}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {note.length}/300
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-4">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-950/30"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={saveMoodEntry}
                    disabled={!canProceed()}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700"
                  >
                    Save Check-in
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-950/30"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Entries */}
        {getTodayEntries().length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-pink-700 dark:text-pink-300">Today's Check-ins</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {getTodayEntries().slice(0, 3).map((entry) => (
                <div key={entry.id} className="text-xs p-2 bg-muted rounded border-l-2 border-pink-300 flex items-center gap-2">
                  <span className="text-lg">{moods.find(m => m.label === entry.mood)?.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-muted-foreground">
                      {entry.time} - {entry.mood} ({entry.intensity}/10)
                    </div>
                    {entry.note && (
                      <div className="text-muted-foreground truncate">
                        {entry.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
