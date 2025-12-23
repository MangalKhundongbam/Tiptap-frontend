import React, { useEffect, useState } from 'react'
import { store } from '@/app/store/storene'
import { loadData } from '../utils/indexedDB'

interface DBDataStructure {
    key: string;
    values: { [index: number]: string };
}

const Filenav: React.FC = () => {
    const { filename, setFilename, setIndex } = store()
    const [files, setFiles] = useState<DBDataStructure | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleStore = (value: string, index: number) => {
        setFilename(value)
        setIndex(index)
        setSelectedIndex(index)
    }

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const data = await loadData("uploadedFiles")
                setFiles(data)
            } catch (error) {
                console.error('Error loading files:', error)
            }
        }
        loadFiles()
    }, [])

    return (
        <div className="flex flex-row gap-2">
            {files && Object.values(files.values).map((value, index) => (
                <div
                    onClick={() => handleStore(value, index)}
                    className={`text-black w-1/7 rounded flex items-center overflow-hidden truncate ${selectedIndex === index ? "bg-gray-300" : "bg-gray-100"}`}
                    key={index}
                    title={value}
                >
                    {value.length > 15 ? `${value.substring(0, 15)}...` : value}
                </div>
            ))}
        </div>
    )
}

export default Filenav
