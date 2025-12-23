import { create } from "zustand";

interface storeProps {
    editor1: any | null
    editor2: any | null
    filename: string | null
    index: number
    setEditor1: (editor1: any | null) => void
    setEditor2: (editor2: any | null) => void
    setFilename: (filename: string | null) => void
    setIndex: (index: number) => void
}

export const store = create<storeProps>((set, get) => ({
    editor1: null,
    editor2: null,
    filename: "",
    index: 0,
    setEditor1: (editor1) => set({ editor1 }),
    setEditor2: (editor2) => set({ editor2 }),
    setFilename: (filename) => set({ filename }),
    setIndex: (index) => set({index}),
}))