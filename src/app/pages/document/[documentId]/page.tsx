'use client'

import React from 'react'
import { TiptapEditor1} from '@/app/components/Editor1'
import { useEffect, useState } from 'react'
import Filenav from '@/app/components/filenav'
import { useParams } from 'next/navigation'
import { store } from '@/app/store/storene'
import { loadData } from '@/app/utils/indexedDB'

type Storing = {
    [index: number]: string;
}

const DocumentPage = () => {
    const params = useParams();
    const documentId = params.documentId;
    const [content, setContent] = useState<string | null>(null)
    const {editor1, editor2, index, filename} = store()
    const docId = Array.isArray(documentId) ? documentId[0] : documentId;

    return (
        <main className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl text-black font-bold mb-6 text-center">Tiptap Editor</h1>
            <Filenav></Filenav>
            <section className="p-10 bg-gray-50 min-h-screen border-2-gray flex flex-row gap-6 justify-evenly">
                <TiptapEditor1 index={index} filename={(docId ? docId : filename)}/>
            </section>
        </main>
    )
}

export default DocumentPage
