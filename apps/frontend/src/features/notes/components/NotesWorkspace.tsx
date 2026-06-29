import { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NotesList } from './NotesList';
import { TipTapEditor } from './TipTapEditor';
import { Save, Trash2, Calendar, Folder, Tag, AlertCircle, RefreshCw } from 'lucide-react';
import { Note } from '../../../types';

export function NotesWorkspace() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Buffer state for active editing
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteTagsText, setNoteTagsText] = useState('');
  const [noteContentHtml, setNoteContentHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Selected note lookup
  const activeNote = notes.find(n => n.id === selectedNoteId) || null;

  // Sync edit buffer with currently selected note
  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteCategory(activeNote.category);
      setNoteTagsText(activeNote.tags.join(', '));
      setNoteContentHtml(activeNote.content);
    } else if (notes.length > 0 && selectedNoteId === null) {
      setSelectedNoteId(notes[0].id);
    } else {
      resetBuffer();
    }
  }, [activeNote, notes, selectedNoteId]);

  const resetBuffer = () => {
    setNoteTitle('');
    setNoteCategory('General');
    setNoteTagsText('');
    setNoteContentHtml('<p>Start typing your thoughts here...</p>');
  };

  const handleCreateNew = async () => {
    try {
      const newNote = await createNote({
        title: 'Draft Technical Proposal',
        category: 'General',
        tags: ['Draft'],
        content: '<h1>New Technical Document</h1><p>Define details here.</p>'
      });
      setSelectedNoteId(newNote.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!selectedNoteId) return;
    setIsSaving(true);
    try {
      const parsedTags = noteTagsText
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await updateNote({
        id: selectedNoteId,
        data: {
          title: noteTitle,
          category: noteCategory || 'General',
          tags: parsedTags,
          content: noteContentHtml
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId) return;
    if (confirm('Are you sure you want to retire this note asset from the corporate index?')) {
      try {
        await deleteNote(selectedNoteId);
        setSelectedNoteId(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[450px] flex flex-col justify-center items-center gap-2">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-mono">Caching workspace index...</span>
      </div>
    );
  }

  return (
    <div id="notes-module-view" className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] items-stretch">
      {/* List Panel */}
      <div className="md:col-span-1 h-full">
        <NotesList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onNewNote={handleCreateNew}
        />
      </div>

      {/* Editor Panel */}
      <div className="md:col-span-2 h-full flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {selectedNoteId ? (
          <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* Header / Meta Inputs */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <input
                  id="editor-note-title"
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title"
                  className="bg-transparent border-none text-xl font-bold font-display text-foreground focus:outline-none w-full"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id="btn-save-note"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 transition-all text-xs flex items-center gap-1.5 font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    id="btn-delete-note"
                    onClick={handleDelete}
                    className="p-2 border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white rounded-lg transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Categorization Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5" htmlFor="note-meta-category">
                    <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                    System Category
                  </label>
                  <input
                    id="note-meta-category"
                    type="text"
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    placeholder="e.g. Architecture, Research"
                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5" htmlFor="note-meta-tags">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    Tags (comma-separated)
                  </label>
                  <input
                    id="note-meta-tags"
                    type="text"
                    value={noteTagsText}
                    onChange={(e) => setNoteTagsText(e.target.value)}
                    placeholder="e.g. Strategy, Roadmap"
                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* TipTap Component Wrapper */}
            <div className="flex-1 min-h-0 flex flex-col pt-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Document Body Content
              </label>
              <TipTapEditor value={noteContentHtml} onChange={setNoteContentHtml} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-muted-foreground gap-3">
            <AlertCircle className="w-10 h-10 opacity-30 text-muted-foreground" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">No Document Selected</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Select a document from the lateral index or create a new draft workstation technical plan.
              </p>
            </div>
            <button
              id="btn-editor-init-note"
              onClick={handleCreateNew}
              className="mt-2 px-4 py-2 bg-secondary hover:bg-opacity-80 text-foreground text-xs font-semibold rounded-lg transition-colors border border-border"
            >
              Initialize New Draft Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
