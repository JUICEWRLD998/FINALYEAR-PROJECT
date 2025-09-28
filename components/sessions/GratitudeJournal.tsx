import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface GratitudeJournalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgressChange?: (progress: number) => void;
}

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({
  open,
  onOpenChange,
  onProgressChange
}) => {
  const [content, setContent] = useState("");
  const [savedEntries, setSavedEntries] = useState<GratitudeEntry[]>([]);
  const [sessionEntries, setSessionEntries] = useState<string[]>([]); // Track current session entries

  // Load saved entries on component mount
  useEffect(() => {
    const saved = localStorage.getItem("gratitudeEntries");
    if (saved) {
      setSavedEntries(JSON.parse(saved));
    }
  }, []);

  // Calculate progress based on current session entries (max 3 entries = 100%)
  const progressPercentage = Math.min((sessionEntries.length / 3) * 100, 100);

  useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  const handleSave = () => {
    if (content.trim()) {
      const newEntry: GratitudeEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        content: content.trim()
      };

      // Add to session entries (for progress tracking)
      const updatedSessionEntries = [...sessionEntries, content.trim()];
      setSessionEntries(updatedSessionEntries);

      // Add to saved entries (for history)
      const updatedEntries = [newEntry, ...savedEntries].slice(0, 10); // Keep last 10 entries
      setSavedEntries(updatedEntries);
      localStorage.setItem("gratitudeEntries", JSON.stringify(updatedEntries));

      // Clear current entry
      setContent("");
    }
  };

  // Reset session when dialog opens
  useEffect(() => {
    if (open) {
      setSessionEntries([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto my-4 sm:my-8 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center pb-3 sm:pb-4">
          <DialogTitle className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
             Gratitude Journal
          </DialogTitle>
          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-2 px-2 xs:px-0">
            Take a moment to reflect on what you're thankful for
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3 xs:space-y-4 sm:space-y-6">
          {/* Current Session Progress */}
          {sessionEntries.length > 0 && (
            <div className="w-full bg-green-50 dark:bg-green-900/20 p-2 xs:p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-xs xs:text-sm font-medium text-green-800 dark:text-green-200 mb-2 text-center">
                Today's gratitude entries:
              </h3>
              <div className="space-y-1 xs:space-y-2">
                {sessionEntries.map((entry, index) => (
                  <div key={index} className="text-xs xs:text-sm text-green-700 dark:text-green-300 flex items-start justify-center">
                    <span className="mr-1 xs:mr-2 flex-shrink-0 text-xs">•</span>
                    <span className="break-words leading-relaxed text-center">{entry}</span>
                  </div>
                ))}
              </div>
              {sessionEntries.length >= 3 && (
                <div className="mt-2 xs:mt-3 text-xs xs:text-sm font-medium text-green-800 dark:text-green-200 p-2 bg-green-100 dark:bg-green-800/30 rounded text-center">
                  ✅ Session complete! Great job reflecting on gratitude today.
                </div>
              )}
            </div>
          )}

          {/* Simple Input */}
          <div className="w-full space-y-2 xs:space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={sessionEntries.length >= 3 ? "You've completed today's session! Feel free to add more..." : "Today I'm grateful for..."}
              className="min-h-[100px] xs:min-h-[120px] sm:min-h-[140px] resize-none border-gray-200 dark:border-gray-700 rounded-lg text-sm xs:text-base leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full p-3 xs:p-4 text-center"
            />
          </div>

          {/* Previous Entries */}
          {savedEntries.length > 0 && (
            <div className="w-full">
              <h3 className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 xs:mb-3 text-center">
                Recent reflections
              </h3>
              <div className="space-y-2 xs:space-y-3 max-h-24 xs:max-h-32 sm:max-h-40 overflow-y-auto">
                {savedEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 xs:mb-2 text-center">
                      {entry.date}
                    </div>
                    <div className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words text-center">
                      {entry.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 mt-4 w-full justify-center">
            <Button 
              onClick={handleSave} 
              className="w-full xs:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 xs:py-2.5 text-sm xs:text-base rounded-lg transition-colors shadow-sm min-h-[44px]"
              disabled={!content.trim()}
            >
              Save Entry
            </Button>
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline"
              className="w-full xs:w-auto xs:px-4 sm:px-6 py-2 xs:py-2.5 text-sm xs:text-base rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GratitudeJournal;
