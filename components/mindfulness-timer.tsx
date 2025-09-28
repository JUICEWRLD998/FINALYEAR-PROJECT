import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface MindfulnessTimerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgressChange?: (progress: number) => void;
}

const presetTimes = [
  { label: '1 min', value: 1 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
];

const mindfulnessQuotes = [
  "Focus on the present moment. Let go of what was, and what might be.",
  "Breathe deeply and feel your body relax with each exhale.",
  "Notice your thoughts without judgment, then gently return to your breath.",
  "You are exactly where you need to be in this moment.",
  "Peace comes from within. Find stillness in the space between thoughts.",
  "Let this moment be a gift to yourself. You deserve this peace.",
  "With each breath, you are becoming more centered and calm.",
  "Release tension from your body. Feel yourself melting into relaxation.",
];

export default function MindfulnessTimer({ open, onOpenChange, onProgressChange }: MindfulnessTimerProps) {
  const [selectedTime, setSelectedTime] = useState(5); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(mindfulnessQuotes[0]);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('mindfulnessSessionsCompleted') || '0');
    }
    return 0;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save sessions completed to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindfulnessSessionsCompleted', sessionsCompleted.toString());
      // Update progress: 50% for 1 session, 100% for 2+ sessions
      const progressValue = sessionsCompleted === 1 ? 50 : sessionsCompleted >= 2 ? 100 : 0;
      onProgressChange?.(progressValue);
    }
  }, [sessionsCompleted, onProgressChange]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            // Timer completed
            setIsActive(false);
            setIsPaused(false);
            setSessionsCompleted(prev => prev + 1);
            playCompletionSound();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  // Stop timer when dialog closes
  useEffect(() => {
    if (!open) {
      setIsActive(false);
      setIsPaused(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [open]);

  // Change quote every 30 seconds during active session
  useEffect(() => {
    if (isActive && !isPaused) {
      const quoteInterval = setInterval(() => {
        const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
        setCurrentQuote(randomQuote);
      }, 30000);

      return () => clearInterval(quoteInterval);
    }
  }, [isActive, isPaused]);

  const playCompletionSound = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance("Your mindfulness session is complete. Take a moment to appreciate this peaceful feeling.");
      utterance.volume = 0.6;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (minutes: number) => {
    if (!isActive) {
      setSelectedTime(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    // Set initial quote
    const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedTime * 60);
    setCurrentQuote(mindfulnessQuotes[0]);
  };

  const progressPercentage = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[90vw] sm:w-[85vw] overflow-y-auto">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 sm:flex-1 sm:text-center">
              ⏰ Mindfulness Timer
            </h2>
            <div className="hidden sm:block w-16"></div> {/* Spacer for centering */}
          </div>

          <div className="text-center mb-8">
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Set aside time for mindful reflection and peaceful presence
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Timer Display */}
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className={`text-6xl sm:text-7xl font-mono font-bold mb-4 transition-colors duration-300 ${
                  timeLeft <= 30 && timeLeft > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Mindfulness Quote */}
                {(isActive || timeLeft === 0) && (
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    "{currentQuote}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preset Time Buttons */}
            {!isActive && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Choose Duration
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {presetTimes.map((preset) => (
                    <Button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      variant={selectedTime === preset.value ? "default" : "outline"}
                      className={`py-2 text-sm ${
                        selectedTime === preset.value 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3 justify-center">
              {!isActive ? (
                <Button 
                  onClick={handleStart}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg flex-1 max-w-xs"
                >
                  ▶️ Start
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handlePause}
                    className={`px-6 py-3 rounded-lg text-lg flex-1 max-w-xs ${
                      isPaused 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-yellow-600 hover:bg-yellow-700"
                    } text-white`}
                  >
                    {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-3 rounded-lg text-lg"
                  >
                    🔄 Reset
                  </Button>
                </>
              )}
            </div>

            {/* Sessions Completed */}
            {sessionsCompleted > 0 && (
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sessions completed: <span className="font-semibold text-purple-600">{sessionsCompleted}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
