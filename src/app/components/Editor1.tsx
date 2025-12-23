// components/Editor.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import api from '../utils/api';
import { store } from "@/app/store/storene"
import { loadData, storeData } from '../utils/indexedDB';

type EditorProps = {
    index: number
    filename: string | null
}

export const TiptapEditor1 = ({ index, filename }: EditorProps) => {
  const [loading, setLoading] = useState(false);
  const { setEditor1 } = store()

  const editor = useEditor({
    onCreate({ editor }) { setEditor1(editor) },
    async onUpdate({ editor }) {
      const html = editor.getHTML()
      const value = {
        [index]: html,
      }
      await storeData({ key: "uploadedHtmls", values: value })
    },
    extensions: [StarterKit, Underline],
    content: '<p>Start editing 1...</p>',
  });


  const loadedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const loadContentForIndex = async () => {
      if (editor && index !== loadedIndexRef.current) {
        setLoading(true);
        
        const res = await loadData("uploadedHtmls");
        if (res && res.values && res.values[index] !== undefined) {
          editor.commands.setContent(res.values[index], false);
        } else {
          // Set default content if nothing is loaded for the new index
          editor.commands.setContent('<p>Start editing 1...</p>', false);
        }
        
        loadedIndexRef.current = index; // Update the ref to the current index
        setLoading(false);
      }
    };

    loadContentForIndex();
    console.log("INDEX: ",index)
    console.log("FILENAME: ",filename)
  }, [editor, index]);

  if (!editor) return null;

  return (
    <div className="p-4 text-black">
      {loading && <p>Loading PDF...</p>}
      <div className="max-w-2xl mx-auto text-black">
        <EditorContent
          editor={editor}
          className="border p-4 rounded bg-white shadow-sm prose prose-sm max-w-none"
        />
      </div>

    </div>
  );
}

// export const TiptapEditor2 = () => {
//   const [loading, setLoading] = useState(false);
//   const { setEditor2, index } = store()

//   const editor = useEditor({
//     onCreate({ editor }) { setEditor2(editor) },
//     async onUpdate({ editor }) {
//       const translatedHtml = editor.getHTML()
//       const value = {
//         [index]: translatedHtml,
//       }
//       await storeData({ key: "translatedHtmls", values: value })
//     },
//     extensions: [StarterKit, Underline],
//     content: '<p>Start editing 2...</p>',
//   });

//   useEffect(() => {
//     setLoading(true)
//     const loadInitial = async () => {
//       const res = await loadData("translatedHtmls")
//       if (res && res.values && res.values[index] !== undefined) {
//         editor?.commands.setContent(res.values[index], false)
//       }
//     }
//     loadInitial()
//     return () => (
//       setLoading(false)
//     )
//   }, [index, editor])

//   if (!editor) return null;

//   return (
//     <div className="p-4 text-black">
//       {loading && <p>Loading PDF...</p>}
//       <div className="max-w-2xl mx-auto text-black">
//         <EditorContent
//           editor={editor}
//           className="border p-4 rounded bg-white shadow-sm prose prose-sm max-w-none"
//         />
//       </div>

//     </div>
//   );
// }
