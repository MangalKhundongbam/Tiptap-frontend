'use client'

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// import { TiptapEditor1, TiptapEditor2 } from './components/Editor1';
import api from './utils/api';
import { useState, useEffect } from 'react';
import { removeData, storeData } from './utils/indexedDB';
import { store } from '@/app/store/storene'

type Storing = {
  [index: number]: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { editor1, editor2, setIndex } = store()
  const router = useRouter()

  useEffect(() => {
    // Clear IndexedDB data on component mount (client-side only)
    removeData("uploadedHtmls")
    removeData("uploadedFiles")
  }, [])

  const handleUploadMultiple = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    const formData = new FormData()

    selectedFiles.forEach((file) => {
      if (file.type !== 'application/pdf') {
        console.log(`${file.name} is not a valid PDF file.`)
      } else {
        formData.append('files', file)
      }
    })

    setLoading(true);
    try {

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { htmls, filenames } = res.data

      // Store all filenames in IndexedDB
      if (filenames && filenames.length > 0) {
        const fileO: Storing = {};
        filenames.forEach((file: string, index: number) => {
          fileO[index] = file;
        });

        const fileData = {
          key: "uploadedFiles",
          values: fileO
        };

        await storeData(fileData);
      }

      if (htmls && htmls.length > 0) {
        const htmlO: Storing = {};
        htmls.forEach((html: string, index: number) => {
          htmlO[index] = html;
        });

        const htmlData = {
          key: "uploadedHtmls",
          values: htmlO
        };

        await storeData(htmlData);
      }

      // Navigate to document page after successful upload 1st one
      setIndex(0)
      router.push(`/pages/document/${filenames[0]}`)

    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToDocument = () => {
    router.push('/pages/document')
  };

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-black font-bold mb-6 text-center">Tiptap Editor Upload</h1>
      <div className="flex gap-2 mb-4 text-black">
        <input type="file" accept="application/pdf" onChange={handleUploadMultiple} multiple />
        {/* <button onClick={handleNavigateToDocument} className="bg-green-500 text-white px-4 py-2 rounded">
          Go to Document
        </button> */}
      </div>
    </main>
  );
}
