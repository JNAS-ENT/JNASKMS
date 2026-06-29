import { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { JournalForm } from './JournalForm';
import { JournalEntry } from '../../../types';
import { Calendar, PenTool, Smile, Frown, Meh, Star, Sparkles, Filter, Loader2, Plus } from 'lucide-react';

export function JournalLogs() {
  const { entries, isLoading } = useJournal();
  const [moodFilter, setMoodFilter] = useState<'all' | JournalEntry['mood']>('all');
  const [showAddSection, setShowAddSection] = useState(false);

  const filteredEntries = entries.filter(entry => {
    return moodFilter === 'all' || entry.mood === moodFilter;
  });

  const getMoodConfig = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'excellent': return { icon: Smile, color: 'text-emerald-500 bg-emerald-500/10' };
      case 'good': return { icon: Smile, color: 'text-blue-500 bg-blue-500/10' };
      case 'neutral': return { icon: Meh, color: 'text-slate-500 bg-slate-500/10' };
      case 'anxious': return { icon: Frown, color: 'text-amber-500 bg-amber-500/10' };
      case 'tired': return { icon: Frown, color: 'text-purple-500 bg-purple-500/10' };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' @ ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="journal-module-view" className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Developer Reflective Journals
          </h2>
          <p className="text-xs text-muted-foreground">Log mental workload, capture team milestones, and catalog focus speeds</p>
        </div>
        <button
          id="btn-toggle-journal-form"
          onClick={() => setShowAddSection(!showAddSection)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 transition-all shadow-sm active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          {showAddSection ? 'Collapse Console' : 'Add Reflection Entry'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col: Add/Filter controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add form section if active */}
          {showAddSection && (
            <div className="bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-semibold text-sm border-b border-border pb-3">
                <Sparkles className="w-4.5 h-4.5 text-blue-500" />
                Draft Focus Log
              </div>
              <JournalForm onSuccess={() => setShowAddSection(false)} />
            </div>
          )}

          {/* Filters card */}
          <div className="bg-card text-card-foreground border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Categorize Log State
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Filter by Mood state
              </label>
              {(['all', 'excellent', 'good', 'neutral', 'anxious', 'tired'] as const).map(mood => (
                <button
                  key={mood}
                  id={`btn-filter-mood-${mood}`}
                  onClick={() => setMoodFilter(mood)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all border ${
                    moodFilter === mood
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-transparent text-muted-foreground border-transparent hover:bg-secondary/50'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Timeline Cards Feed */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="h-[200px] flex flex-col justify-center items-center gap-2 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">Syncing private journals...</span>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col justify-center items-center text-center text-muted-foreground h-44 gap-2">
              <PenTool className="w-8 h-8 opacity-30 text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">No matching journals found</p>
              <p className="text-[11px] text-muted-foreground">Create a new reflection entry or clear active filters.</p>
            </div>
          ) : (
            filteredEntries.map(entry => {
              const moodConfig = getMoodConfig(entry.mood);
              const MoodIcon = moodConfig?.icon || Meh;
              return (
                <div
                  key={entry.id}
                  id={`journal-log-item-${entry.id}`}
                  className="bg-card text-card-foreground border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all flex flex-col"
                >
                  {/* Title & Metadata */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border pb-3">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-foreground tracking-tight leading-snug">
                        {entry.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>

                    {/* Mood Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 border rounded-full uppercase tracking-wider font-mono ${moodConfig?.color || 'text-slate-500 bg-secondary'}`}>
                        <MoodIcon className="w-3.5 h-3.5 shrink-0" />
                        {entry.mood}
                      </span>
                    </div>
                  </div>

                  {/* Reflection Body text */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {entry.content}
                  </p>

                  {/* Productivity Rating Stars */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Productivity Score:</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < entry.productivityRating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200 dark:text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
