import React from "react"

// Components
import { SessionCard } from "./SessionCard"
import { BreathingExercise } from "./BreathingExercise"
import SoothingMusic from "../soothing-music"
import MindfulnessTimer from "../mindfulness-timer"
import GratitudeJournal from "./GratitudeJournal"
import { MoodCheckIn } from "./MoodCheckIn"
import { GuidedMeditation } from "./GuidedMeditation"
import { Affirmations } from "./Affirmations"
import { FocusSession } from "./FocusSession"
import { SOSGrounding } from "./SOSGrounding"

// Types
interface SessionsSectionProps {
  onNavigateToSleepStories?: () => void
  sleepStoriesProgress?: number
}

export const SessionsSection: React.FC<SessionsSectionProps> = ({ onNavigateToSleepStories, sleepStoriesProgress = 0 }) => {
  const [breathingOpen, setBreathingOpen] = React.useState(false);
  const [breathingProgress, setBreathingProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('breathingProgress') || '0');
    }
    return 0;
  });
  const [soothingMusicOpen, setSoothingMusicOpen] = React.useState(false);
  const [soothingMusicProgress, setSoothingMusicProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('soothingMusicProgress') || '0');
    }
    return 0;
  });
  const [mindfulnessTimerOpen, setMindfulnessTimerOpen] = React.useState(false);
  const [mindfulnessTimerProgress, setMindfulnessTimerProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('mindfulnessTimerProgress') || '0');
    }
    return 0;
  });
  const [gratitudeJournalOpen, setGratitudeJournalOpen] = React.useState(false);
  const [gratitudeJournalProgress, setGratitudeJournalProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('gratitudeJournalProgress') || '0');
    }
    return 0;
  });
  const [moodCheckInOpen, setMoodCheckInOpen] = React.useState(false);
  const [moodCheckInProgress, setMoodCheckInProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('moodCheckInProgress') || '0');
    }
    return 0;
  });
  const [guidedMeditationOpen, setGuidedMeditationOpen] = React.useState(false);
  const [guidedMeditationProgress, setGuidedMeditationProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('guidedMeditationProgress') || '0');
    }
    return 0;
  });
  const [affirmationsOpen, setAffirmationsOpen] = React.useState(false);
  const [affirmationsProgress, setAffirmationsProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('affirmationsProgress') || '0');
    }
    return 0;
  });
  const [focusSessionOpen, setFocusSessionOpen] = React.useState(false);
  const [focusSessionProgress, setFocusSessionProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('focusSessionProgress') || '0');
    }
    return 0;
  });
  const [sosGroundingOpen, setSOSGroundingOpen] = React.useState(false);
  const [sosGroundingProgress, setSOSGroundingProgress] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('sosGroundingProgress') || '0');
    }
    return 0;
  });

  // Update localStorage when progress changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('breathingProgress', breathingProgress.toString());
    }
  }, [breathingProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('soothingMusicProgress', soothingMusicProgress.toString());
    }
  }, [soothingMusicProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindfulnessTimerProgress', mindfulnessTimerProgress.toString());
    }
  }, [mindfulnessTimerProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gratitudeJournalProgress', gratitudeJournalProgress.toString());
    }
  }, [gratitudeJournalProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodCheckInProgress', moodCheckInProgress.toString());
    }
  }, [moodCheckInProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guidedMeditationProgress', guidedMeditationProgress.toString());
    }
  }, [guidedMeditationProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('affirmationsProgress', affirmationsProgress.toString());
    }
  }, [affirmationsProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('focusSessionProgress', focusSessionProgress.toString());
    }
  }, [focusSessionProgress]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sosGroundingProgress', sosGroundingProgress.toString());
    }
  }, [sosGroundingProgress]);

  const sessions = [
    {
      title: "Breathing Exercise",
      description: "Guided inhale/exhale to calm your nervous system.",
      emoji: "🌬️",
      onOpen: () => setBreathingOpen(true),
      progress: breathingProgress,
    },
    {
      title: "Sleep Stories",
      description: "Wind down with calming bedtime narratives.",
      emoji: "🌙",
      onOpen: () => onNavigateToSleepStories?.(),
      progress: sleepStoriesProgress,
    },
    {
      title: "Soothing Music",
      description: "Soft tracks to relax your mind.",
      emoji: "🎵",
      onOpen: () => setSoothingMusicOpen(true),
      progress: soothingMusicProgress,
    },
    {
      title: "Mindfulness Timer",
      description: "Set a gentle timer for mindful breaks.",
      emoji: "⏰",
      onOpen: () => setMindfulnessTimerOpen(true),
      progress: mindfulnessTimerProgress,
    },
    {
      title: "Gratitude Journal",
      description: "Capture three good things about today.",
      emoji: "✍️",
      onOpen: () => setGratitudeJournalOpen(true),
      progress: gratitudeJournalProgress,
    },
    {
      title: "Mood Check‑in",
      description: "Quickly log how you feel right now.",
      emoji: "💖",
      onOpen: () => setMoodCheckInOpen(true),
      progress: moodCheckInProgress,
    },
    {
      title: "Guided Meditation",
      description: "Short audio guidance to recentre.",
      emoji: "🎧",
      onOpen: () => setGuidedMeditationOpen(true),
      progress: guidedMeditationProgress,
    },
    {
      title: "Affirmations",
      description: "Positive statements to reframe your day.",
      emoji: "✨",
      onOpen: () => setAffirmationsOpen(true),
      progress: affirmationsProgress,
    },
    {
      title: "Focus Session",
      description: "Stay on task with gentle focus support.",
      emoji: "🎯",
      onOpen: () => setFocusSessionOpen(true),
      progress: focusSessionProgress,
    },
    {
      title: "SOS Grounding",
      description: "5‑4‑3‑2‑1 grounding for anxious moments.",
      emoji: "🛡️",
      onOpen: () => setSOSGroundingOpen(true),
      progress: sosGroundingProgress,
    },
  ];

  return (
    <section aria-labelledby="sessions-title" className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 ambient-bg" aria-hidden />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 
            id="sessions-title" 
            className="text-3xl md:text-4xl font-semibold tracking-wide mb-3 animate-fade-in flex items-center justify-center gap-3 text-purple-700 dark:text-purple-400"
          >
            Mental Health Sessions 🧘‍♀️
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl animate-fade-in mx-auto text-lg">
            Explore a collection of simple, science‑informed practices to support your wellbeing.
          </p>
        </header>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="grid"
          aria-label="Mental health session options"
        >
          {sessions.map((s, index) => (
            <div 
              key={s.title} 
              role="gridcell"
              className="motion-safe:animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SessionCard
                title={s.title}
                description={s.description}
                emoji={s.emoji}
                onOpen={s.onOpen}
                progress={s.progress}
              />
            </div>
          ))}
        </div>
      </div>
      <BreathingExercise 
        open={breathingOpen} 
        onOpenChange={setBreathingOpen}
        onProgressChange={setBreathingProgress}
      />
      <SoothingMusic 
        open={soothingMusicOpen} 
        onOpenChange={setSoothingMusicOpen}
        onProgressChange={setSoothingMusicProgress}
      />
      <MindfulnessTimer 
        open={mindfulnessTimerOpen} 
        onOpenChange={setMindfulnessTimerOpen}
        onProgressChange={setMindfulnessTimerProgress}
      />
      <GratitudeJournal 
        open={gratitudeJournalOpen} 
        onOpenChange={setGratitudeJournalOpen}
        onProgressChange={setGratitudeJournalProgress}
      />
      <MoodCheckIn 
        open={moodCheckInOpen} 
        onOpenChange={setMoodCheckInOpen}
        onProgressChange={setMoodCheckInProgress}
      />
      <GuidedMeditation 
        open={guidedMeditationOpen} 
        onOpenChange={setGuidedMeditationOpen}
        onProgressChange={setGuidedMeditationProgress}
      />
      <Affirmations 
        open={affirmationsOpen} 
        onOpenChange={setAffirmationsOpen}
        onProgressChange={setAffirmationsProgress}
      />
      <FocusSession 
        open={focusSessionOpen} 
        onOpenChange={setFocusSessionOpen}
        onProgressChange={setFocusSessionProgress}
      />
      <SOSGrounding 
        open={sosGroundingOpen} 
        onOpenChange={setSOSGroundingOpen}
        onProgressChange={setSOSGroundingProgress}
      />
    </section>
  );
};
