import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Quote, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export function TipTapEditor({ value, onChange, editable = true }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when selected note changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="p-4 border border-border rounded-lg bg-background flex justify-center items-center h-48">
        <span className="text-xs text-muted-foreground animate-pulse font-mono">Initializing editor engine...</span>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
      {/* Visual Menu Bar */}
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 bg-secondary border-b border-border items-center">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('bold') ? 'bg-background font-bold text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('italic') ? 'bg-background font-bold text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('bulletList') ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('orderedList') ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('code') ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded hover:bg-background transition-colors ${editor.isActive('blockquote') ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-background text-muted-foreground transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-background text-muted-foreground transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="p-4 flex-1 overflow-y-auto min-h-[250px] bg-background">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground" />
      </div>
    </div>
  );
}
