import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePapers } from '../hooks/usePapers';
import { PaperCard } from './PaperCard';
import { paperSchema, PaperInput } from '../validation/schema';
import { Search, Plus, Filter, BookOpen, FileText, Loader2, X } from 'lucide-react';

export function PapersLibrary() {
  const { papers, isLoading, createPaper, updateStatus, isCreating } = usePapers();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'to-read' | 'reading' | 'completed'>('all');
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PaperInput>({
    resolver: zodResolver(paperSchema) as any,
    defaultValues: {
      title: '',
      authors: '',
      abstract: '',
      journal: '',
      publishYear: new Date().getFullYear(),
      doi: '',
      status: 'to-read',
      tags: []
    }
  });

  const onSubmit = async (data: PaperInput) => {
    try {
      await createPaper(data);
      reset();
      setShowAddDrawer(false);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(search.toLowerCase()) ||
                          paper.authors.some(a => a.toLowerCase().includes(search.toLowerCase())) ||
                          paper.abstract.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || paper.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleUpdateStatus = (id: string, status: any) => {
    updateStatus({ id, status });
  };

  return (
    <div id="papers-module-view" className="space-y-6 relative">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Corporate Research Repository
          </h2>
          <p className="text-xs text-muted-foreground">Catalog and analyze technical papers and industry publications</p>
        </div>
        <button
          id="btn-trigger-add-paper"
          onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 transition-all shadow-sm active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          Catalog Research Resource
        </button>
      </div>

      {/* Main Grid / Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 bg-card text-card-foreground border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Filter className="w-4 h-4" />
            Filters & Indexing
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="papers-side-search">
              Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="papers-side-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search authors, abstracts..."
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status Tabs Column */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Readiness Status
            </label>
            {(['all', 'to-read', 'reading', 'completed'] as const).map(tab => (
              <button
                key={tab}
                id={`papers-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-transparent hover:bg-secondary/50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Listing Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="h-[300px] flex flex-col justify-center items-center gap-2 bg-card border border-border rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">Syncing digital library cards...</span>
            </div>
          ) : filteredPapers.length === 0 ? (
            <div className="h-[300px] flex flex-col justify-center items-center gap-3 bg-card border border-border rounded-xl text-center p-6">
              <BookOpen className="w-10 h-10 text-muted-foreground opacity-30" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">No Publications Cataloged</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  We found no papers matching the active criteria in this sandbox. Customize your search or add a new paper.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay for Adding a New Research Paper */}
      {showAddDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h3 className="font-bold text-lg font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Catalog Research Publication
              </h3>
              <button
                id="btn-close-paper-drawer"
                onClick={() => setShowAddDrawer(false)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-title-input">
                  Publication Title
                </label>
                <input
                  id="paper-title-input"
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Attention Is All You Need"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                />
                {errors.title && <p className="text-[10px] text-destructive mt-0.5">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-authors-input">
                  Authors (comma-separated list)
                </label>
                <input
                  id="paper-authors-input"
                  type="text"
                  {...register('authors')}
                  placeholder="e.g. Ashish Vaswani, Noam Shazeer"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.authors && <p className="text-[10px] text-destructive mt-0.5">{errors.authors.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-abstract-input">
                  Publication Abstract Snippet
                </label>
                <textarea
                  id="paper-abstract-input"
                  rows={4}
                  {...register('abstract')}
                  placeholder="Provide research summary, abstract details, or experimental notes..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                />
                {errors.abstract && <p className="text-[10px] text-destructive mt-0.5">{errors.abstract.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-journal-input">
                    Journal / Platform
                  </label>
                  <input
                    id="paper-journal-input"
                    type="text"
                    {...register('journal')}
                    placeholder="e.g. arXiv preprint"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.journal && <p className="text-[10px] text-destructive mt-0.5">{errors.journal.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-year-input">
                    Publish Year
                  </label>
                  <input
                    id="paper-year-input"
                    type="number"
                    {...register('publishYear', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                  {errors.publishYear && <p className="text-[10px] text-destructive mt-0.5">{errors.publishYear.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-doi-input">
                  DOI (Optional)
                </label>
                <input
                  id="paper-doi-input"
                  type="text"
                  {...register('doi')}
                  placeholder="e.g. 10.1145/3065386"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="paper-status-input">
                  Initial Reading Status
                </label>
                <select
                  id="paper-status-input"
                  {...register('status')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                id="btn-save-paper-submit"
                type="submit"
                disabled={isCreating}
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Publication...
                  </>
                ) : (
                  'Confirm & Index Resource'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
