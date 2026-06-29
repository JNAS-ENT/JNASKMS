import { useState } from 'react';
import { YouTubeAnalysis } from '../../../types';
import { Play, FileText, CheckSquare, Clock, Tv, ExternalLink } from 'lucide-react';

interface YoutubeResultsProps {
  analysis: YouTubeAnalysis;
}

export function YoutubeResults({ analysis }: YoutubeResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'transcript'>('summary');

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Thumbnail & Meta */}
      <div className="relative h-44 sm:h-52 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={analysis.thumbnailUrl}
          alt={analysis.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
          <div className="flex gap-2 items-center text-white/80 text-[10px] font-mono font-bold mb-1">
            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded">
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              {analysis.channelName}
            </span>
            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {analysis.duration}
            </span>
          </div>
          <h3 className="text-white text-base sm:text-lg font-bold font-display leading-snug line-clamp-2">
            {analysis.title}
          </h3>
        </div>
        <a
          href={analysis.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          title="Watch on YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-border bg-secondary/30 shrink-0">
        <button
          id="btn-yt-tab-summary"
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'summary' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          Summary Core
        </button>
        <button
          id="btn-yt-tab-insights"
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'insights' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Takeaways & Actions
        </button>
        <button
          id="btn-yt-tab-transcript"
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'transcript' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Play className="w-4 h-4" />
          Transcript
        </button>
      </div>

      {/* Dynamic Tabs Body */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase">Semantic core synopsis</h4>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase">Key Video Insights</h4>
              <ul className="space-y-2">
                {analysis.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="text-xs text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase">Identified Deliverables</h4>
              <ul className="space-y-2">
                {analysis.actionItems.map((item, index) => (
                  <li key={index} className="text-xs text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-emerald-500 font-bold shrink-0">[TODO]</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <div className="space-y-4 font-mono text-[11px] leading-relaxed text-muted-foreground bg-secondary/40 p-4 rounded-lg border border-border">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 font-sans">Indexed timestamps</h4>
            {analysis.transcript ? (
              <p className="whitespace-pre-wrap">{analysis.transcript}</p>
            ) : (
              <span className="italic">Full transcription timeline was not logged for this specific video.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
