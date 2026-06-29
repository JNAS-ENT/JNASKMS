import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useYoutube } from '../hooks/useYoutube';
import { YoutubeResults } from './YoutubeResults';
import { youtubeUrlSchema, YoutubeUrlInput } from '../validation/schema';
import { Youtube, Search, ArrowRight, Loader2, PlayCircle, History, Info } from 'lucide-react';

export function YoutubeAnalyzer() {
  const { analyses, isLoading, analyzeVideo, isAnalyzing } = useYoutube();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeAnalysis = analyses.find(a => a.id === selectedId) || null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<YoutubeUrlInput>({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: { videoUrl: '' }
  });

  useEffect(() => {
    if (analyses.length > 0 && selectedId === null) {
      setSelectedId(analyses[0].id);
    }
  }, [analyses, selectedId]);

  const onSubmit = async (data: YoutubeUrlInput) => {
    try {
      const res = await analyzeVideo(data.videoUrl);
      setSelectedId(res.id);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="youtube-analyzer-view" className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
          <Youtube className="w-5 h-5 text-rose-500" />
          Lecture Transcript Core Extractor
        </h2>
        <p className="text-xs text-muted-foreground">Submit educational or technical videos to generate semantic summaries and clear deliverables</p>
      </div>

      {/* Analyzer Submission Bar */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1" htmlFor="youtube-video-url">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              Specify YouTube Video Asset Location
            </label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                id="youtube-video-url"
                type="text"
                {...register('videoUrl')}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <button
                id="btn-youtube-submit"
                type="submit"
                disabled={isAnalyzing}
                className="py-2 px-5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    Begin Extraction
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            {errors.videoUrl && (
              <p className="text-[10px] text-destructive font-semibold mt-1">{errors.videoUrl.message}</p>
            )}
          </div>
        </form>
      </div>

      {/* Bottom dual columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] items-stretch">
        {/* Left Side: History List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-border flex items-center gap-2 text-sm font-semibold">
            <History className="w-4 h-4 text-muted-foreground" />
            Previous Extractions
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Retrieving previous extractions...
              </div>
            ) : analyses.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No videos processed yet.
              </div>
            ) : (
              analyses.map(item => (
                <div
                  key={item.id}
                  id={`yt-history-item-${item.id}`}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 text-left cursor-pointer transition-colors flex gap-3 items-center ${
                    selectedId === item.id ? 'bg-secondary' : 'hover:bg-secondary/40'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-rose-500 shrink-0">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="font-semibold text-xs text-foreground block truncate leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      {item.channelName} • {item.duration}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Active Analysis Result Display */}
        <div className="lg:col-span-2 h-full">
          {activeAnalysis ? (
            <YoutubeResults analysis={activeAnalysis} />
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col justify-center items-center text-center h-full text-muted-foreground gap-3">
              <Youtube className="w-10 h-10 opacity-35" />
              <div>
                <h4 className="font-semibold text-sm">No analysis selected</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Enter a YouTube link or select an archived extraction from the historical sidebar log.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
