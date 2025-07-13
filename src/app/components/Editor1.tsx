// components/Editor.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import api from '../utils/api';

export default function TiptapEditor() {
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '<p>Start editing...</p>',
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      editor?.commands.setContent(res.data.html); // Assuming { html: "<p>Converted</p>" }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.post('/download', { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.html';
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed');
    }
  };

  if(!editor) return null;

  return (
    <div className="p-4 text-black">
      <div className="flex gap-2 mb-4">
        <input type="file" accept="application/pdf" onChange={handleUpload} />
        <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
          Download HTML
        </button>
      </div>
      {loading && <p>Loading PDF...</p>}

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

      {/* <EditorContent editor={editor} className="border p-4 min-h-[300px]" /> */}
    </div>
  );
}
