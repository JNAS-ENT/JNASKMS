import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearch } from '../hooks/useSearch';
import { searchSchema, SearchInput } from '../validation/schema';
import { Search, FileText, BookOpen, Youtube, PenTool, Loader2, ArrowRight, CornerDownRight } from 'lucide-react';
import { useEnterpriseStore } from '../../../store';

export function SearchConsole() {
  const [activeQuery, setActiveQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchInput['filterType']>('all');
  const { results, isLoading } = useSearch(activeQuery, activeFilter);
  const { navigateTo } = useEnterpriseStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SearchInput>({
    resolver: zodResolver(searchSchema) as any,
    defaultValues: { query: '', filterType: 'all' }
  });

  const onSubmit = (data: SearchInput) => {
    setActiveQuery(data.query);
    setActiveFilter(data.filterType);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="w-4 h-4 text-sky-500" />;
      case 'paper': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'journal': return <PenTool className="w-4 h-4 text-amber-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getScreenName = (type: string) => {
    switch (type) {
      case 'note': return 'notes';
      case 'paper': return 'papers';
      case 'youtube': return 'youtube';
      case 'journal': return 'journal';
      default: return 'dashboard';
    }
  };

  return (
    <div id="search-module-view" className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Enterprise Indexed Query Node
        </h2>
        <p className="text-xs text-muted-foreground">Perform global vector-simulated searches across your publications, files, video notes, and logs</p>
      </div>

      {/* Main search bar form */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            {/* Input query */}
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="search-node-input">
                Query Keyphrase
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-node-input"
                  type="text"
                  {...register('query')}
                  placeholder="e.g. attention, microservices, token..."
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>
            </div>

            {/* Scope Filter dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="search-scope-select">
                Index Scope
              </label>
              <select
                id="search-scope-select"
                {...register('filterType')}
                className="w-full sm:w-44 px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
              >
                <option value="all">Universal Index</option>
                <option value="note">Notes Only</option>
                <option value="paper">Papers Only</option>
                <option value="youtube">Videos Only</option>
                <option value="journal">Journals Only</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              id="btn-search-node-submit"
              type="submit"
              disabled={isLoading}
              className="py-2.5 px-6 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Querying Index...
                </>
              ) : (
                'Execute Query'
              )}
            </button>
          </div>
          {errors.query && (
            <p className="text-[10px] text-destructive font-semibold mt-1">{errors.query.message}</p>
          )}
        </form>
      </div>

      {/* Results grid */}
      <div className="bg-card border border-border rounded-xl p-6 min-h-[300px]">
        {isLoading ? (
          <div className="h-[200px] flex flex-col justify-center items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">Searching indexed database layers...</span>
          </div>
        ) : activeQuery === '' ? (
          <div className="py-12 text-center text-xs text-muted-foreground max-w-xs mx-auto space-y-1">
            <Search className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-2" />
            <p className="font-semibold text-foreground text-sm">Enter Index query terms</p>
            <p>Define keyword phrases to query notes, journals, technical reports, and video takeaways.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground max-w-xs mx-auto space-y-1">
            <Search className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-2" />
            <p className="font-semibold text-foreground text-sm">No indexing matches found</p>
            <p>Your query did not return any matches in the cached database layers. Adjust keywords and try again.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase">
              Query returned {results.length} record matches
            </h3>
            <div className="divide-y divide-border">
              {results.map((result) => (
                <div
                  key={result.id}
                  id={`search-result-${result.id}`}
                  onClick={() => navigateTo(getScreenName(result.type))}
                  className="py-4 hover:bg-secondary/25 transition-colors cursor-pointer group flex justify-between items-center gap-6"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="p-1.5 rounded bg-secondary block">
                        {getIcon(result.type)}
                      </span>
                      <h4 className="font-semibold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                        {result.title}
                      </h4>
                      <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                        {result.categoryOrChannel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pl-8">
                      {result.snippet}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold group-hover:text-primary whitespace-nowrap shrink-0">
                    <span className="hidden sm:inline">Launch Workstation</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
