import { useState } from 'react';
import { Search, FolderOpen, Tag, Plus, FileText, Calendar } from 'lucide-react';
import { Note } from '../../../types';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onNewNote }: NotesListProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(notes.map(n => n.category))).filter(Boolean)];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                          note.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || note.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header and Add Button */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold font-display flex items-center gap-2">
          <FolderOpen className="w-4.5 h-4.5 text-primary" />
          Technical Plans
        </h3>
        <button
          id="btn-new-note-trigger"
          onClick={onNewNote}
          className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-[0.97] transition-all"
          title="New Note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="notes-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes index..."
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories Horizontal scroller */}
      <div className="px-3 py-2 border-b border-border flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map(cat => (
          <button
            key={cat}
            id={`notes-cat-filter-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full capitalize whitespace-nowrap border transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-muted-foreground border-border hover:bg-opacity-80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground font-medium flex flex-col items-center gap-1.5">
            <FileText className="w-8 h-8 opacity-40 text-muted-foreground" />
            No records matched criteria
          </div>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              id={`note-item-${note.id}`}
              onClick={() => onSelectNote(note.id)}
              className={`p-4 text-left cursor-pointer transition-colors relative flex flex-col gap-1.5 ${
                selectedNoteId === note.id ? 'bg-secondary border-l-2 border-l-primary' : 'hover:bg-secondary/40'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="font-semibold text-sm line-clamp-1 text-foreground leading-tight">{note.title}</span>
                <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                  {note.category}
                </span>
              </div>
              
              {/* Note Content preview snippet */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]*>/g, '') }} 
              />

              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(note.updatedAt)}
                </span>
                {note.tags.length > 0 && (
                  <span className="flex items-center gap-0.5 text-primary">
                    <Tag className="w-3 h-3" />
                    {note.tags[0]}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
