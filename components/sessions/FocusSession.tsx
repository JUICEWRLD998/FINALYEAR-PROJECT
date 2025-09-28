import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Utils
import { cn } from "@/lib/utils"

// Types
interface FocusSessionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

interface FocusSession {
  id: string
  task: string
  duration: number // in minutes
  startTime: Date
  endTime?: Date
  completed: boolean
  breaks: number
}

const focusPresets = [
  { name: "Quick Focus", duration: 15, description: "Short burst of focused work" },
  { name: "Standard Session", duration: 25, description: "Classic Pomodoro technique" },
  { name: "Deep Work", duration: 45, description: "Extended focus for complex tasks" },
  { name: "Study Session", duration: 60, description: "Longer session for learning" }
];

const focusTips = [
  "Remove distractions from your workspace",
  "Take a few deep breaths before starting",
  "Break large tasks into smaller, manageable pieces",
  "Stay hydrated and maintain good posture",
  "Use the two-minute rule: if it takes less than 2 minutes, do it now"
];

export const FocusSession: React.FC<FocusSessionProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [currentStep, setCurrentStep] = React.useState(0); // 0: setup, 1: active session, 2: break
  const [taskName, setTaskName] = React.useState("");
  const [duration, setDuration] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(1500); // 25 minutes in seconds
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [breakTime, setBreakTime] = React.useState(300); // 5 minutes break
  const [isBreak, setIsBreak] = React.useState(false);
  const [completedSessions, setCompletedSessions] = React.useState<FocusSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusSessions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [currentSessionStart, setCurrentSessionStart] = React.useState<Date | null>(null);
  const [currentTip, setCurrentTip] = React.useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage when sessions change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('focusSessions', JSON.stringify(completedSessions));
    }
  }, [completedSessions]);

  // Calculate progress percentage
  const progressPercentage = Math.min((completedSessions.length / 5) * 100, 100); // 100% after 5 completed sessions

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  // Timer logic
  React.useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (isBreak) {
              // Break finished, ready for next session
              setIsBreak(false);
              setIsActive(false);
              setCurrentStep(0);
              playNotificationSound("Break time is over! Ready for another focus session?");
              return duration * 60;
            } else {
              // Session completed
              if (currentSessionStart) {
                const newSession: FocusSession = {
                  id: Date.now().toString(),
                  task: taskName,
                  duration: duration,
                  startTime: currentSessionStart,
                  endTime: new Date(),
                  completed: true,
                  breaks: 0
                };
                setCompletedSessions(prev => [newSession, ...prev.slice(0, 19)]);
              }
              
              // Start break
              setIsBreak(true);
              setCurrentStep(2);
              playNotificationSound("Great job! Time for a 5-minute break.");
              return 300; // 5 minutes break
            }
          }
          return prevTime - 1;
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
  }, [isActive, isPaused, isBreak, duration, taskName, currentSessionStart]);

  // Rotate tips every 30 seconds during active session
  React.useEffect(() => {
    if (isActive && !isPaused && !isBreak) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % focusTips.length);
      }, 30000);

      return () => clearInterval(tipInterval);
    }
  }, [isActive, isPaused, isBreak]);

  const playNotificationSound = (message: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = 0.6;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSession = () => {
    if (!taskName.trim()) return;
    
    setCurrentStep(1);
    setTimeLeft(duration * 60);
    setIsActive(true);
    setIsPaused(false);
    setIsBreak(false);
    setCurrentSessionStart(new Date());
  };

  const pauseSession = () => {
    setIsPaused(true);
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsPaused(false);
    setIsActive(true);
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTimeLeft(duration * 60);
    setIsBreak(false);
    setCurrentSessionStart(null);
  };

  const skipBreak = () => {
    setIsBreak(false);
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionProgress = () => {
    const totalTime = isBreak ? 300 : duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return completedSessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl mx-auto my-2 sm:my-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-lg xs:text-xl sm:text-2xl md:text-3xl flex items-center justify-center gap-2 font-bold">
            🎯 Focus Session
          </DialogTitle>
          <DialogDescription className="text-xs xs:text-sm sm:text-base text-center max-w-2xl mx-auto">
            Improve productivity with focused work sessions and timed breaks using proven techniques
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-3 md:py-4">
          {/* Session Setup */}
          {currentStep === 0 && (
            <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="p-3 xs:p-4 sm:p-6">
                <CardTitle className="text-base xs:text-lg sm:text-xl text-blue-700 dark:text-blue-300">
                  Set Up Your Focus Session
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm text-blue-600/80 dark:text-blue-200/80">
                  Define your task and choose a duration for focused work
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 xs:space-y-4 p-3 xs:p-4 sm:p-6">
                <div className="space-y-2">
                  <label className="text-xs xs:text-sm font-medium text-blue-700 dark:text-blue-300">
                    What will you focus on?
                  </label>
                  <Input
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g., Write report, Study chapter 5, Code feature..."
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600 text-xs xs:text-sm"
                    maxLength={100}
                  />
                </div>

                  <div className="space-y-3">
                    <label className="text-xs xs:text-sm font-medium text-blue-700 dark:text-blue-300">
                      Duration: {duration} minutes
                    </label>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {focusPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant={duration === preset.duration ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDuration(preset.duration)}
                          className="text-xs p-2 h-auto flex flex-col items-start"
                        >
                          <div className="font-medium text-xs">{preset.name}</div>
                          <div className="text-xs opacity-70">{preset.duration} min</div>
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
                      <Input
                        type="number"
                        min="5"
                        max="120"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
                        className="w-20 xs:w-16 sm:w-20 text-xs xs:text-sm border-blue-200 dark:border-blue-800"
                      />
                      <span className="text-xs xs:text-sm text-muted-foreground">minutes (custom)</span>
                    </div>
                  </div>                <Button 
                  onClick={startSession}
                  disabled={!taskName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-xs xs:text-sm"
                >
                  Start Focus Session
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Session */}
          {currentStep === 1 && (
            <Card className={cn(
              "border-none shadow-sm bg-gradient-to-br",
              isBreak 
                ? "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                : "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
            )}>
              <CardHeader className="text-center p-3 xs:p-4 sm:p-6">
                <CardTitle className={cn(
                  "text-lg xs:text-xl sm:text-2xl",
                  isBreak 
                    ? "text-green-700 dark:text-green-300" 
                    : "text-orange-700 dark:text-orange-300"
                )}>
                  {isBreak ? "🌿 Break Time" : "⚡ Focus Time"}
                </CardTitle>
                <CardDescription className={cn(
                  "text-xs xs:text-sm",
                  isBreak 
                    ? "text-green-600/80 dark:text-green-200/80" 
                    : "text-orange-600/80 dark:text-orange-200/80"
                )}>
                  {isBreak ? "Take a moment to rest and recharge" : `Working on: ${taskName}`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 xs:space-y-6 p-3 xs:p-4 sm:p-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className={cn(
                    "text-2xl xs:text-3xl sm:text-4xl font-mono font-bold mb-3 xs:mb-4",
                    isBreak 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-orange-700 dark:text-orange-300"
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                  
                  {/* Progress Circle */}
                  <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 mx-auto mb-3 xs:mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="377"
                        strokeDashoffset={377 - (getSessionProgress() / 100) * 377}
                        className={cn(
                          "transition-all duration-1000",
                          isBreak 
                            ? "text-green-500" 
                            : "text-orange-500"
                        )}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs xs:text-sm font-medium text-muted-foreground">
                        {Math.round(getSessionProgress())}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Focus Tip */}
                {!isBreak && (
                  <div className="text-center p-2 xs:p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">💡 Focus Tip</div>
                    <div className="text-xs xs:text-sm text-orange-700 dark:text-orange-300">
                      {focusTips[currentTip]}
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-col xs:flex-row gap-2 justify-center">
                  {!isBreak ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={isPaused ? resumeSession : pauseSession}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 text-xs xs:text-sm"
                      >
                        {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={stopSession}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 text-xs xs:text-sm"
                      >
                        ⏹️ Stop
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={skipBreak}
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 text-xs xs:text-sm"
                    >
                      Skip Break
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Break Time */}
          {currentStep === 2 && (
            <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader className="text-center p-3 xs:p-4 sm:p-6">
                <CardTitle className="text-lg xs:text-xl sm:text-2xl text-green-700 dark:text-green-300">
                  🌿 Break Time
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm text-green-600/80 dark:text-green-200/80">
                  Time to rest and recharge
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 xs:space-y-4 text-center p-3 xs:p-4 sm:p-6">
                <div className="text-2xl xs:text-3xl font-mono font-bold text-green-700 dark:text-green-300">
                  {formatTime(timeLeft)}
                </div>
                
                <div className="space-y-1 xs:space-y-2 text-xs xs:text-sm text-green-600 dark:text-green-200">
                  <p>• Stretch your body</p>
                  <p>• Take deep breaths</p>
                  <p>• Hydrate yourself</p>
                  <p>• Rest your eyes</p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={skipBreak}
                  className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 text-xs xs:text-sm"
                >
                  Skip Break
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Today's Sessions */}
          {getTodaySessions().length > 0 && (
            <div className="border-t pt-3 xs:pt-4">
              <h3 className="font-medium mb-2 xs:mb-3 text-xs xs:text-sm text-blue-700 dark:text-blue-300">Today's Sessions</h3>
              <div className="space-y-1 xs:space-y-2 max-h-24 xs:max-h-32 overflow-y-auto">
                {getTodaySessions().slice(0, 3).map((session) => (
                  <div key={session.id} className="text-xs p-2 bg-muted rounded border-l-2 border-blue-300">
                    <div className="font-medium text-muted-foreground">
                      {session.duration} min • {session.task}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
