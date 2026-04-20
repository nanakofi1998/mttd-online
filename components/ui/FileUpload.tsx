'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image, Film } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  label?: string
  accept?: string
  multiple?: boolean
  files: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  className?: string
}

export function FileUpload({
  label,
  accept = 'image/*,video/*',
  multiple = true,
  files,
  onChange,
  maxFiles = 5,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const arr = Array.from(incoming)
    const merged = [...files, ...arr].slice(0, maxFiles)
    onChange(merged)
  }

  function remove(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="label">{label}</p>}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors duration-150',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-surface-700 hover:border-surface-500 bg-surface-900/50'
        )}
      >
        <div className="w-10 h-10 bg-surface-800 rounded-xl flex items-center justify-center">
          <Upload className="w-5 h-5 text-surface-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-surface-200">
            Tap to upload or drag &amp; drop
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            Photos and videos · max {maxFiles} files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => {
            const isVideo = file.type.startsWith('video/')
            return (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 bg-surface-900 border border-surface-800 rounded-lg px-3 py-2"
              >
                <div className="w-7 h-7 bg-surface-800 rounded flex items-center justify-center flex-shrink-0">
                  {isVideo ? (
                    <Film className="w-3.5 h-3.5 text-surface-400" />
                  ) : (
                    <Image className="w-3.5 h-3.5 text-surface-400" />
                  )}
                </div>
                <p className="text-xs text-surface-300 truncate flex-1">{file.name}</p>
                <p className="text-xs text-surface-500 flex-shrink-0">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </p>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-surface-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
