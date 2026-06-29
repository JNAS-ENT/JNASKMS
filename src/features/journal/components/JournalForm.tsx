import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useJournal } from '../hooks/useJournal';
import { journalSchema, JournalInput } from '../validation/schema';
import { Smile, Frown, Meh, AlertCircle, Sparkles, Loader2, Plus } from 'lucide-react';

interface JournalFormProps {
  onSuccess: () => void;
}

export function JournalForm({ onSuccess }: JournalFormProps) {
  const { createEntry, isCreating } = useJournal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<JournalInput>({
    resolver: zodResolver(journalSchema) as any,
    defaultValues: {
      title: '',
      content: '',
      mood: 'neutral',
      productivityRating: 4,
      tags: []
    }
  });

  const activeMood = watch('mood');
  const activeRating = watch('productivityRating');

  const moodsList = [
    { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-500 bg-blue-500/10 border-blue-500' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-slate-500 bg-slate-500/10 border-slate-500' },
    { value: 'anxious', label: 'Anxious', icon: Frown, color: 'text-amber-500 bg-amber-500/10 border-amber-500' },
    { value: 'tired', label: 'Tired', icon: Frown, color: 'text-purple-500 bg-purple-500/10 border-purple-500' }
  ] as const;

  const onSubmit = async (data: JournalInput) => {
    try {
      await createEntry(data);
      reset();
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="journal-title-input">
          Log Entry Title
        </label>
        <input
          id="journal-title-input"
          type="text"
          {...register('title')}
          placeholder="e.g. Completed Core API Ingress Integration"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
        />
        {errors.title && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.title.message}</p>}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="journal-content-input">
          Workstation Reflection
        </label>
        <textarea
          id="journal-content-input"
          rows={4}
          {...register('content')}
          placeholder="Capture major wins, core bottlenecks, or system modifications observed today..."
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed font-medium"
        />
        {errors.content && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.content.message}</p>}
      </div>

      {/* Mood Picker */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Current Focus State Mood
        </label>
        <div className="flex flex-wrap gap-2">
          {moodsList.map((m) => {
            const IconComp = m.icon;
            const isSelected = activeMood === m.value;
            return (
              <button
                key={m.value}
                id={`btn-mood-select-${m.value}`}
                type="button"
                onClick={() => setValue('mood', m.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg transition-all ${
                  isSelected ? m.color : 'bg-transparent text-muted-foreground border-border hover:bg-secondary/40'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Productivity Score */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <span>Productivity & Focus Velocity</span>
          <span className="font-mono text-primary font-bold">{activeRating} / 5</span>
        </div>
        <input
          id="journal-productivity-slider"
          type="range"
          min="1"
          max="5"
          step="1"
          value={activeRating}
          onChange={(e) => setValue('productivityRating', parseInt(e.target.value))}
          className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
          <span>1 (Impeded)</span>
          <span>3 (Moderate)</span>
          <span>5 (Optimal Velocity)</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        id="btn-journal-submit"
        type="submit"
        disabled={isCreating}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-1.5"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Synchronizing Logs...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Append Reflection Log
          </>
        )}
      </button>
    </form>
  );
}
