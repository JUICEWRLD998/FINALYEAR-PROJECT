import React from "react"

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Utils
import { cn } from "@/lib/utils"

// Types
interface SOSGroundingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressChange?: (progress: number) => void
}

interface GroundingSession {
  id: string
  date: string
  time: string
  technique: string
  completed: boolean
  duration: number // seconds
}

const groundingTechniques = [
  {
    title: "5-4-3-2-1 Grounding",
    description: "Use your senses to ground yourself in the present moment",
    steps: [
      { sense: "👀 See", instruction: "Name 5 things you can see around you", count: 5 },
      { sense: "✋ Touch", instruction: "Name 4 things you can touch or feel", count: 4 },
      { sense: "👂 Hear", instruction: "Name 3 things you can hear right now", count: 3 },
      { sense: "👃 Smell", instruction: "Name 2 things you can smell", count: 2 },
      { sense: "👅 Taste", instruction: "Name 1 thing you can taste", count: 1 }
    ],
    color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  {
    title: "Box Breathing",
    description: "Calm your nervous system with structured breathing",
    steps: [
      { sense: "🫁 Inhale", instruction: "Breathe in slowly for 4 counts", count: 4 },
      { sense: "⏸️ Hold", instruction: "Hold your breath for 4 counts", count: 4 },
      { sense: "🌬️ Exhale", instruction: "Breathe out slowly for 4 counts", count: 4 },
      { sense: "⏸️ Hold", instruction: "Hold empty lungs for 4 counts", count: 4 }
    ],
    color: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300"
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Release tension by tensing and relaxing muscle groups",
    steps: [
      { sense: "✊ Hands", instruction: "Clench your fists tight, then relax", count: 1 },
      { sense: "💪 Arms", instruction: "Tense your arm muscles, then let go", count: 1 },
      { sense: "😤 Face", instruction: "Scrunch your face muscles, then release", count: 1 },
      { sense: "🦵 Legs", instruction: "Tense your leg muscles, then relax", count: 1 },
      { sense: "🧘 Whole Body", instruction: "Tense everything, then completely relax", count: 1 }
    ],
    color: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300"
  }
];

export const SOSGrounding: React.FC<SOSGroundingProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [currentTechnique, setCurrentTechnique] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [sessionStartTime, setSessionStartTime] = React.useState<Date | null>(null);
  const [completedItems, setCompletedItems] = React.useState<string[]>([]);
  const [groundingSessions, setGroundingSessions] = React.useState<GroundingSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('groundingSessions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage when sessions change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('groundingSessions', JSON.stringify(groundingSessions));
    }
  }, [groundingSessions]);

  // Calculate progress percentage
  const progressPercentage = Math.min((groundingSessions.length / 5) * 100, 100); // 100% after 5 completed sessions

  // Update parent component with progress changes
  React.useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  const currentTechniqueData = groundingTechniques[currentTechnique];
  const currentStepData = currentTechniqueData.steps[currentStep];

  const startSession = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCompletedItems([]);
    setSessionStartTime(new Date());
  };

  const nextStep = () => {
    if (currentStep < currentTechniqueData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSession = () => {
    if (sessionStartTime) {
      const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      const newSession: GroundingSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        technique: currentTechniqueData.title,
        completed: true,
        duration
      };
      
      setGroundingSessions(prev => [newSession, ...prev.slice(0, 19)]);
    }
    
    setIsActive(false);
    setCurrentStep(0);
    setCompletedItems([]);
    setSessionStartTime(null);
    
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance("Great job! You've completed the grounding exercise. Notice how you feel now.");
      utterance.volume = 0.6;
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentStep(0);
    setCompletedItems([]);
    setSessionStartTime(null);
  };

  const addCompletedItem = (item: string) => {
    if (item.trim() && !completedItems.includes(item.trim())) {
      setCompletedItems(prev => [...prev, item.trim()]);
    }
  };

  const removeCompletedItem = (index: number) => {
    setCompletedItems(prev => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (currentTechniqueData.title === "5-4-3-2-1 Grounding") {
      return completedItems.length >= currentStepData.count;
    }
    return true; // For breathing and muscle relaxation, user can proceed when ready
  };

  const getSessionProgress = () => {
    return ((currentStep + 1) / currentTechniqueData.steps.length) * 100;
  };

  const speakInstruction = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(currentStepData.instruction);
      utterance.volume = 0.7;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getTodaySessions = () => {
    const today = new Date().toLocaleDateString();
    return groundingSessions.filter(session => session.date === today);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
            🛡️ SOS Grounding
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Quick techniques to ground yourself during anxious moments
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-3 md:py-4">
          {!isActive ? (
            /* Technique Selection */
            <div className="space-y-3 xs:space-y-4">
              <div className="text-center mb-3 xs:mb-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                  Choose a Grounding Technique
                </h3>
                <p className="text-xs xs:text-sm text-muted-foreground">
                  Select the technique that feels right for you in this moment
                </p>
              </div>

              {groundingTechniques.map((technique, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br",
                    technique.color,
                    technique.borderColor,
                    currentTechnique === index && "ring-2 ring-primary shadow-lg"
                  )}
                  onClick={() => setCurrentTechnique(index)}
                >
                  <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
                    <CardTitle className={cn("text-sm xs:text-base sm:text-lg", technique.textColor)}>
                      {technique.title}
                    </CardTitle>
                    <CardDescription className={cn("text-xs xs:text-sm", technique.textColor.replace('700', '600').replace('300', '200'))}>
                      {technique.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                    <div className="text-xs text-muted-foreground">
                      {technique.steps.length} steps • Est. 2-5 minutes
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button 
                onClick={startSession}
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-sm sm:text-base py-2 sm:py-2.5"
              >
                Start {currentTechniqueData.title}
              </Button>
            </div>
          ) : (
            /* Active Session */
            <Card className={cn(
              "border-2 shadow-lg bg-gradient-to-br",
              currentTechniqueData.color,
              currentTechniqueData.borderColor
            )}>
              <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className={cn("text-base sm:text-lg", currentTechniqueData.textColor)}>
                    {currentTechniqueData.title}
                  </CardTitle>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Step {currentStep + 1} of {currentTechniqueData.steps.length}
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2 mt-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      currentTechniqueData.textColor.includes('blue') && "bg-blue-500",
                      currentTechniqueData.textColor.includes('green') && "bg-green-500",
                      currentTechniqueData.textColor.includes('purple') && "bg-purple-500"
                    )}
                    style={{ width: `${getSessionProgress()}%` }}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{currentStepData.sense}</div>
                  <div className={cn("text-sm sm:text-lg font-medium mb-3 sm:mb-4", currentTechniqueData.textColor)}>
                    {currentStepData.instruction}
                  </div>
                </div>

                {/* 5-4-3-2-1 Technique Input */}
                {currentTechniqueData.title === "5-4-3-2-1 Grounding" && (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                        List {currentStepData.count} {currentStepData.sense.toLowerCase().includes('see') ? 'things you can see' :
                              currentStepData.sense.toLowerCase().includes('touch') ? 'things you can touch' :
                              currentStepData.sense.toLowerCase().includes('hear') ? 'sounds you can hear' :
                              currentStepData.sense.toLowerCase().includes('smell') ? 'things you can smell' :
                              'things you can taste'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {completedItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                          <span className="flex-1 text-xs sm:text-sm">{index + 1}. {item}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompletedItem(index)}
                            className="w-6 h-6 p-0 text-xs"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      
                      {completedItems.length < currentStepData.count && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`${currentStepData.sense.toLowerCase().includes('see') ? 'I can see...' :
                                         currentStepData.sense.toLowerCase().includes('touch') ? 'I can feel...' :
                                         currentStepData.sense.toLowerCase().includes('hear') ? 'I can hear...' :
                                         currentStepData.sense.toLowerCase().includes('smell') ? 'I can smell...' :
                                         'I can taste...'}`}
                            className="flex-1 p-2 text-xs sm:text-sm border rounded bg-white/50 dark:bg-black/20 border-white/50 dark:border-white/10"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addCompletedItem(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addCompletedItem(input.value);
                              input.value = '';
                            }}
                            className="text-xs px-2 sm:px-3"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Breathing/Muscle Relaxation Instructions */}
                {currentTechniqueData.title !== "5-4-3-2-1 Grounding" && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">Follow along:</div>
                      <div className={cn("text-sm sm:text-base", currentTechniqueData.textColor)}>
                        {currentStepData.instruction}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={speakInstruction}
                      className={cn("text-xs sm:text-sm px-3 sm:px-4", currentTechniqueData.borderColor)}
                    >
                      🔊 Speak Instruction
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-2 pt-3 sm:pt-4">
                  {currentStep > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevStep}
                      className={cn("text-xs sm:text-sm px-3 sm:px-4", currentTechniqueData.borderColor)}
                    >
                      ← Back
                    </Button>
                  )}
                  
                  <Button 
                    onClick={currentStep === currentTechniqueData.steps.length - 1 ? completeSession : nextStep}
                    disabled={!canProceed()}
                    className={cn(
                      "flex-1 text-xs sm:text-sm px-3 sm:px-4",
                      currentTechniqueData.textColor.includes('blue') && "bg-blue-600 hover:bg-blue-700",
                      currentTechniqueData.textColor.includes('green') && "bg-green-600 hover:bg-green-700",
                      currentTechniqueData.textColor.includes('purple') && "bg-purple-600 hover:bg-purple-700"
                    )}
                  >
                    {currentStep === currentTechniqueData.steps.length - 1 ? "Complete" : "Next"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSession}
                    className={cn("text-xs", currentTechniqueData.borderColor)}
                  >
                    Stop
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Sessions */}
          {getTodaySessions().length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-3 text-red-700 dark:text-red-300">Today's Grounding Sessions</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getTodaySessions().slice(0, 3).map((session) => (
                  <div key={session.id} className="text-xs p-2 bg-muted rounded border-l-2 border-red-300">
                    <div className="font-medium text-muted-foreground">
                      {session.time} • {session.technique}
                    </div>
                    <div className="text-muted-foreground">
                      Duration: {Math.floor(session.duration / 60)}m {session.duration % 60}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
