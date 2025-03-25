"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useWebhookStore } from "@/lib/store"
import { Upload, X, File, ImageIcon, FileText, FileAudio } from "lucide-react"
import { bytesToSize } from "@/lib/utils"
import { motion } from "framer-motion"

export function FileUploader() {
  const { files, setFiles } = useWebhookStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Check if adding these files would exceed the 10 file limit
      if (files.length + newFiles.length > 10) {
        alert("You can only upload up to 10 files")
        return
      }

      // Check if any file exceeds 25MB
      const hasLargeFile = newFiles.some((file) => file.size > 25 * 1024 * 1024)
      if (hasLargeFile) {
        alert("Files must be smaller than 25MB")
        return
      }

      setFiles([...files, ...newFiles])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)

      // Check if adding these files would exceed the 10 file limit
      if (files.length + newFiles.length > 10) {
        alert("You can only upload up to 10 files")
        return
      }

      // Check if any file exceeds 25MB
      const hasLargeFile = newFiles.some((file) => file.size > 25 * 1024 * 1024)
      if (hasLargeFile) {
        alert("Files must be smaller than 25MB")
        return
      }

      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0]

    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-gray-400" />
      case "audio":
        return <FileAudio className="h-4 w-4 text-gray-400" />
      case "video":
        return <FileText className="h-4 w-4 text-gray-400" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive ? "border-gray-500 bg-gray-500/10" : "border-[#1E1E2A] hover:border-gray-500/50"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#1E1E2A] flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-white">Drag and drop files here</p>
          <p className="text-xs text-gray-400">Up to 10 files, max 25MB each</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 border-[#1E1E2A] bg-[#12121A] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200"
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Uploaded Files ({files.length}/10)</h3>
            {files.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                className="h-8 text-xs text-gray-400 hover:text-white hover:bg-gray-700/20"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between bg-[#1E1E2A] rounded-md p-3 border border-[#1E1E2A]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-[#12121A] flex items-center justify-center flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm truncate max-w-[200px]">{file.name}</div>
                    <div className="text-xs text-gray-400">{bytesToSize(file.size)}</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

