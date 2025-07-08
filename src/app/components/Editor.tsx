'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: '<p>This is the editor area!!!</p>',
  });

  if (!editor) return null;

  return (
    <div className="max-w-2xl mx-auto text-black">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 border rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 border rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 border rounded ${editor.isActive('underline') ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          Underline
        </button>
        {/* <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 border rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 border rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 border rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : 'bg-white'
            }`}
        >
          H3
        </button> */}
      </div>

      <EditorContent
        editor={editor}
        className="border p-4 rounded bg-white shadow-sm prose prose-sm max-w-none"
      />
    </div>
  );
}
