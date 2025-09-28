"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Smile, Calendar, BookOpen } from 'lucide-react';

// Types
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Mood emojis
const MOODS = ['😊', '😭', '😔'];

// Custom hook for journal state management
const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      const entriesWithDates = parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      }));
      setEntries(entriesWithDates);
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const createEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: 'New Entry',
      content: '',
      mood: '😊',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    setEntries(prev => [newEntry, ...prev]);
    setSelectedEntry(newEntry);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    ));
    if (selectedEntry?.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    entries: filteredEntries,
    selectedEntry,
    searchTerm,
    setSearchTerm,
    setSelectedEntry,
    createEntry,
    updateEntry,
    deleteEntry
  };
};

// Mood Selector Component with Popover
const MoodSelector: React.FC<{
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ selectedMood, onMoodSelect, isOpen, onToggle }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
      >
        <span className="text-lg">{selectedMood}</span>
        <Smile className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
      
      {/* Simple popover next to the button */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-0 right-full mr-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[99999]"
        >
          <div className="flex gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMoodSelect(mood);
                  onToggle();
                }}
                className="text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-gray-50 dark:bg-gray-700 min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Journal Sidebar Component
const JournalSidebar: React.FC<{
  entries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEntrySelect: (entry: JournalEntry) => void;
  onCreateEntry: () => void;
  onDeleteEntry: (id: string) => void;
}> = ({
  entries,
  selectedEntry,
  searchTerm,
  onSearchChange,
  onEntrySelect,
  onCreateEntry,
  onDeleteEntry
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col h-full lg:h-screen shadow-2xl order-2 lg:order-2">
      {/* Header - Compact on mobile */}
      <div className="p-2 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2 lg:mb-4">
          <h1 className="text-sm lg:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 lg:gap-2">
            <div className="p-1 lg:p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <BookOpen className="w-3 h-3 lg:w-6 lg:h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="hidden sm:inline lg:inline">Journal</span>
            <span className="sm:hidden lg:hidden">Entries</span>
          </h1>
          <button
            onClick={onCreateEntry}
            className="group p-1.5 lg:p-2 text-white bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-lg hover:from-amber-600 hover:to-amber-700 dark:hover:from-amber-500 dark:hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-3 h-3 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Search - Smaller on mobile */}
        <div className="relative group">
          <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-7 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:shadow-md focus:shadow-lg text-xs lg:text-base"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-3 lg:p-6 text-center text-gray-500 dark:text-gray-400">
            <BookOpen className="w-6 h-6 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm lg:text-lg font-medium mb-1 lg:mb-2">No entries yet</p>
            <p className="text-xs lg:text-sm">Start your first entry!</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden overflow-x-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
              <div className="flex gap-3 p-3 pb-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onEntrySelect(entry)}
                    className={`group relative flex-shrink-0 w-40 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      selectedEntry?.id === entry.id
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 shadow-lg'
                        : 'bg-white dark:bg-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-650 border border-gray-200 dark:border-gray-600 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg p-1 bg-gray-50 dark:bg-gray-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {entry.mood}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEntry(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm mb-2">
                      {entry.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                      {entry.content || 'No content yet...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(entry.createdAt)}</span>
                      </div>
                      {selectedEntry?.id === entry.id && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Vertical scroll */}
            <div className="hidden lg:block overflow-y-auto p-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => onEntrySelect(entry)}
                  className={`group relative p-4 m-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedEntry?.id === entry.id
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 shadow-lg'
                      : 'bg-white dark:bg-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-650 border border-gray-200 dark:border-gray-600 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl p-1 bg-gray-50 dark:bg-gray-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {entry.mood}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                        {entry.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                    {entry.content || 'No content yet...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(entry.createdAt)}
                    </div>
                    {selectedEntry?.id === entry.id && (
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Journal Editor Component
const JournalEditor: React.FC<{
  entry: JournalEntry | null;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
}> = ({ entry, onUpdateEntry }) => {
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);
  
  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4 lg:p-6">
          <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="text-xl lg:text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">Welcome to your Journal</h2>
          <p className="text-base lg:text-lg">Select an entry from the sidebar or create a new one to start writing.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Editor Header */}
      <div className="relative p-3 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 lg:hidden">
          {/* Title and Mood Selector Row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={entry.title}
              onChange={(e) => onUpdateEntry(entry.id, { title: e.target.value })}
              className="text-lg font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0 placeholder-gray-500 dark:placeholder-gray-400 font-serif tracking-wide text-center"
              placeholder="Give your thoughts a title..."
            />
            
            <div className="flex-shrink-0">
              <MoodSelector
                selectedMood={entry.mood}
                onMoodSelect={(mood) => onUpdateEntry(entry.id, { mood })}
                isOpen={isMoodSelectorOpen}
                onToggle={() => setIsMoodSelectorOpen(!isMoodSelectorOpen)}
              />
            </div>
          </div>
          
          {/* Date Row - Centered */}
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Created {formatDateShort(entry.createdAt)}</span>
            {entry.updatedAt.getTime() !== entry.updatedAt.getTime() && (
              <span className="ml-2">
                • Updated {formatDateShort(entry.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Layout - Original Design */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={entry.title}
              onChange={(e) => onUpdateEntry(entry.id, { title: e.target.value })}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none focus:ring-0 p-0 w-full placeholder-gray-500 dark:placeholder-gray-400 font-serif tracking-wide"
              placeholder="Give your thoughts a title..."
            />
            
            <MoodSelector
              selectedMood={entry.mood}
              onMoodSelect={(mood) => onUpdateEntry(entry.id, { mood })}
              isOpen={isMoodSelectorOpen}
              onToggle={() => setIsMoodSelectorOpen(!isMoodSelectorOpen)}
            />
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            Created {formatDate(entry.createdAt)}
            {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
              <span className="ml-4">
                • Updated {formatDate(entry.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative flex-1 p-3 lg:p-6 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-800/30 overflow-hidden">
        <div className="h-full bg-white/50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-inner relative overflow-hidden">
          {/* Paper lines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="border-b border-blue-200 dark:border-blue-800"
                style={{ marginTop: '2.25rem' }}
              ></div>
            ))}
          </div>
          
          <textarea
            value={entry.content}
            onChange={(e) => onUpdateEntry(entry.id, { content: e.target.value })}
            placeholder="Start writing your thoughts... Let your mind flow freely onto the page."
            className="relative z-10 w-full h-full resize-none border-none outline-none text-sm sm:text-base lg:text-lg leading-relaxed text-gray-800 dark:text-gray-200 bg-transparent placeholder-gray-500 dark:placeholder-gray-400 p-3 sm:p-4 lg:p-6 font-serif tracking-wide overflow-y-auto custom-scrollbar"
            style={{
              lineHeight: '2.25rem',
              fontFamily: '"Georgia", "Times New Roman", serif',
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Main Journal App Component
export default function Journal() {
  const {
    entries,
    selectedEntry,
    searchTerm,
    setSearchTerm,
    setSelectedEntry,
    createEntry,
    updateEntry,
    deleteEntry
  } = useJournal();

  // Add scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-track {
      background: #374151;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #6b7280;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="absolute inset-0 flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 font-sans">
        {/* Mobile: Editor takes most space at top, sidebar compressed below */}
        <div className="flex-1 flex flex-col lg:hidden">
          <JournalEditor
            entry={selectedEntry}
            onUpdateEntry={updateEntry}
          />
        </div>
        
        <div className="h-64 flex-shrink-0 lg:hidden">
          <JournalSidebar
            entries={entries}
            selectedEntry={selectedEntry}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEntrySelect={setSelectedEntry}
            onCreateEntry={createEntry}
            onDeleteEntry={deleteEntry}
          />
        </div>

        {/* Desktop: Original full-space layout */}
        <div className="hidden lg:flex lg:flex-row lg:h-full lg:w-full">
          <JournalEditor
            entry={selectedEntry}
            onUpdateEntry={updateEntry}
          />
          
          <JournalSidebar
            entries={entries}
            selectedEntry={selectedEntry}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEntrySelect={setSelectedEntry}
            onCreateEntry={createEntry}
            onDeleteEntry={deleteEntry}
          />
        </div>
      </div>
    </>
  );
}
