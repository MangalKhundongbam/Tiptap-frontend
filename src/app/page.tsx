'use client'

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./components/Editor1'), { ssr: false });

export default function Home() {
  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-black font-bold mb-6 text-center">Tiptap Editor</h1>
      <Editor />
    </main>
  );
}
