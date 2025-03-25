"use client"

import { useState, useEffect } from "react"

interface DiscordMarkdownPreviewProps {
  markdown: string
  className?: string
}

export function DiscordMarkdownPreview({ markdown, className = "" }: DiscordMarkdownPreviewProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    const formattedHtml = formatDiscordMarkdown(markdown)
    setHtml(formattedHtml)
  }, [markdown])

  return (
    <div
      className={`whitespace-pre-wrap break-words text-[#DCDDDE] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Update the formatDiscordMarkdown function to handle spoilers
function formatDiscordMarkdown(text: string): string {
  if (!text) return ""

  let formatted = text
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Spoilers
    .replace(
      /\|\|(.*?)\|\|/g,
      '<span class="bg-[#202225] text-[#202225] hover:bg-transparent hover:text-[#DCDDDE] cursor-default transition-colors duration-100 rounded px-0.5">$1</span>',
    )

    // Bold italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<span class="font-bold italic">$1</span>')

    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')

    // Italic
    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
    .replace(/_(.*?)_/g, '<span class="italic">$1</span>')

    // Underline
    .replace(/__(.*?)__/g, '<span class="underline">$1</span>')

    // Strikethrough
    .replace(/~~(.*?)~~/g, '<span class="line-through">$1</span>')

    // Code blocks with language
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<div class="bg-[#2B2D31] p-2 rounded font-mono text-xs overflow-x-auto my-1"><div class="text-gray-400 text-xs mb-1">${language || "Plain text"}</div><pre>${code}</pre></div>`
    })

    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-[#2B2D31] px-1 py-0.5 rounded font-mono text-xs">$1</code>')

    // Block quotes
    .replace(/^>\s(.+)$/gm, '<div class="border-l-4 border-[#4B5563] pl-2 py-0.5 my-1">$1</div>')
    .replace(/^>>>\s([\s\S]+)$/gm, '<div class="border-l-4 border-[#4B5563] pl-2 py-0.5 my-1">$1</div>')

    // Bullet lists
    .replace(/^-\s(.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/^\*\s(.+)$/gm, '<li class="ml-5 list-disc">$1</li>')

    // Numbered lists
    .replace(/^(\d+)\.\s(.+)$/gm, '<li class="ml-5 list-decimal">$2</li>')

    // Links (simplified, doesn't handle all Discord link formats)
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" class="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>',
    )

  // Fix lists to be wrapped in ul/ol tags (this is a simplified approach)
  const listItemRegex = /<li class="ml-5 list-disc">(.+?)<\/li>/g
  const numberedListItemRegex = /<li class="ml-5 list-decimal">(.+?)<\/li>/g

  let matches = [...formatted.matchAll(listItemRegex)]
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i]
    if (match.index !== undefined) {
      const endIndex = match.index + match[0].length
      if (
        i === 0 ||
        matches[i - 1].index === undefined ||
        matches[i - 1].index + matches[i - 1][0].length !== match.index
      ) {
        // Start of a list
        formatted = formatted.slice(0, match.index) + "<ul>" + formatted.slice(match.index)
      }
      if (i === matches.length - 1 || matches[i + 1].index === undefined || matches[i + 1].index !== endIndex) {
        // End of a list
        formatted = formatted.slice(0, endIndex) + "</ul>" + formatted.slice(endIndex)
      }
    }
  }

  matches = [...formatted.matchAll(numberedListItemRegex)]
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i]
    if (match.index !== undefined) {
      const endIndex = match.index + match[0].length
      if (
        i === 0 ||
        matches[i - 1].index === undefined ||
        matches[i - 1].index + matches[i - 1][0].length !== match.index
      ) {
        // Start of a list
        formatted = formatted.slice(0, match.index) + "<ol>" + formatted.slice(match.index)
      }
      if (i === matches.length - 1 || matches[i + 1].index === undefined || matches[i + 1].index !== endIndex) {
        // End of a list
        formatted = formatted.slice(0, endIndex) + "</ol>" + formatted.slice(endIndex)
      }
    }
  }

  // Convert newlines to <br> tags
  formatted = formatted.replace(/\n/g, "<br />")

  return formatted
}

