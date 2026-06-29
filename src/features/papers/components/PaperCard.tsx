import { BookOpen, User, Calendar, ExternalLink, Hash, Check } from 'lucide-react';
import { ResearchPaper } from '../../../types';

interface PaperCardProps {
  paper: ResearchPaper;
  onUpdateStatus: (id: string, status: ResearchPaper['status']) => void;
}

export function PaperCard({ paper, onUpdateStatus }: PaperCardProps) {
  const getStatusStyle = (status: ResearchPaper['status']) => {
    switch (status) {
      case 'to-read': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
      case 'reading': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200';
    }
  };

  return (
    <div
      id={`paper-card-${paper.id}`}
      className="p-6 bg-card text-card-foreground border border-border rounded-xl flex flex-col gap-4 hover:shadow-lg transition-all"
    >
      {/* Title & Status */}
      <div className="flex justify-between items-start gap-4">
        <h4 className="font-bold text-base font-display text-foreground tracking-tight leading-snug line-clamp-2">
          {paper.title}
        </h4>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border shrink-0 uppercase tracking-wider font-mono ${getStatusStyle(paper.status)}`}>
          {paper.status.replace('-', ' ')}
        </span>
      </div>

      {/* Authors list */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="w-3.5 h-3.5 shrink-0" />
        <span className="line-clamp-1">{paper.authors.join(', ')}</span>
      </div>

      {/* Abstract excerpt */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Abstract Snippet</span>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {paper.abstract}
        </p>
      </div>

      {/* DOI & PDF link placeholders if specified */}
      <div className="grid grid-cols-2 gap-4 pt-1 text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {paper.journal} ({paper.publishYear})
        </span>
        {paper.doi ? (
          <span className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-primary">
            <Hash className="w-3.5 h-3.5 shrink-0" />
            DOI: {paper.doi}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Verified Source
          </span>
        )}
      </div>

      {/* Tags */}
      {paper.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {paper.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-secondary text-[10px] font-semibold text-muted-foreground border border-border rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Controls / Status updates */}
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Added {new Date(paper.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-1">
          <select
            id={`paper-status-select-${paper.id}`}
            value={paper.status}
            onChange={(e) => onUpdateStatus(paper.id, e.target.value as ResearchPaper['status'])}
            className="px-2.5 py-1 text-[11px] font-semibold bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-secondary border border-border text-foreground rounded-md hover:bg-opacity-80 transition-all"
              title="Open External Resource"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
