"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface MessageEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MessageEditor({
  value,
  onChange,
  placeholder = "Type your message here...",
  className = "",
}: MessageEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = value
    let newCursorPosition = end

    switch (format) {
      case "bold":
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end)
        newCursorPosition = end + 4
        break
      case "italic":
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end)
        newCursorPosition = end + 2
        break
      case "underline":
        newText = value.substring(0, start) + `__${selectedText}__` + value.substring(end)
        newCursorPosition = end + 4
        break
      case "strikethrough":
        newText = value.substring(0, start) + `~~${selectedText}~~` + value.substring(end)
        newCursorPosition = end + 4
        break
      case "spoiler":
        newText = value.substring(0, start) + `||${selectedText}||` + value.substring(end)
        newCursorPosition = end + 4
        break
      case "inlineCode":
        newText = value.substring(0, start) + `\`${selectedText}\`` + value.substring(end)
        newCursorPosition = end + 2
        break
      case "codeBlock":
        newText = value.substring(0, start) + `\`\`\`\n${selectedText}\n\`\`\`` + value.substring(end)
        newCursorPosition = end + 7
        break
      case "blockquote":
        newText = value.substring(0, start) + `> ${selectedText}` + value.substring(end)
        newCursorPosition = end + 2
        break
      case "bulletList":
        newText = value.substring(0, start) + `- ${selectedText}` + value.substring(end)
        newCursorPosition = end + 2
        break
      case "numberedList":
        newText = value.substring(0, start) + `1. ${selectedText}` + value.substring(end)
        newCursorPosition = end + 3
        break
      case "link":
        newText = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end)
        newCursorPosition = end + 7
        break
    }

    onChange(newText)

    // Set focus back to textarea and set cursor position after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = selectedText ? start : newCursorPosition
        textareaRef.current.selectionEnd = selectedText ? newCursorPosition : newCursorPosition
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          applyFormat("bold")
          break
        case "i":
          e.preventDefault()
          applyFormat("italic")
          break
        case "u":
          e.preventDefault()
          applyFormat("underline")
          break
        case "e":
          e.preventDefault()
          applyFormat("inlineCode")
          break
        case "k":
          e.preventDefault()
          applyFormat("link")
          break
        case "s":
          e.preventDefault()
          applyFormat("spoiler")
          break
      }

      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "x":
            e.preventDefault()
            applyFormat("strikethrough")
            break
          case "c":
            e.preventDefault()
            applyFormat("codeBlock")
            break
          case "b":
            e.preventDefault()
            applyFormat("blockquote")
            break
          case "7":
            e.preventDefault()
            applyFormat("numberedList")
            break
          case "8":
            e.preventDefault()
            applyFormat("bulletList")
            break
          case "s":
            e.preventDefault()
            applyFormat("spoiler")
            break
        }
      }
    }
  }

  // Handle tab key to insert spaces instead of changing focus
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && document.activeElement === textarea) {
        e.preventDefault()
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const newText = value.substring(0, start) + "  " + value.substring(end)
        onChange(newText)

        // Set cursor position after the inserted tab
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }
    }

    textarea.addEventListener("keydown", handleTabKey)
    return () => textarea.removeEventListener("keydown", handleTabKey)
  }, [value, onChange])

  return (
    <div className={`${className}`}>
      <div className="relative bg-[#0F0F18] border border-[#1E1E2A] rounded-md">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] bg-[#0F0F18] border-0 focus-visible:ring-0 resize-y text-sm"
        />
      </div>
    </div>
  )
}

