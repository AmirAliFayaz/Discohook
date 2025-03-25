"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface JsonEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialJson: string
  onSave: (json: any) => void
}

export function JsonEditorDialog({ open, onOpenChange, initialJson, onSave }: JsonEditorDialogProps) {
  const [jsonText, setJsonText] = useState(initialJson)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Update jsonText when initialJson changes
  useEffect(() => {
    if (open) {
      setJsonText(initialJson)
    }
  }, [initialJson, open])

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonText)
      setError(null)
      onSave(parsedJson)
      onOpenChange(false)
      toast({
        title: "JSON updated",
        description: "Your embed JSON has been updated successfully.",
      })
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.")
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonText)
    toast({
      title: "Copied to clipboard",
      description: "JSON data has been copied to your clipboard.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-[#1E1F22] border-[#1E1E2A] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#2D2D3A]">
          <h2 className="text-lg font-bold text-white">JSON Data Editor</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="relative h-[500px] overflow-auto bg-[#18191C]">
          <pre className="p-4 text-sm font-mono">
            <code
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              className="outline-none focus:outline-none block whitespace-pre text-gray-300"
              style={{ caretColor: "white" }}
              onInput={(e) => setJsonText(e.currentTarget.textContent || "")}
              dangerouslySetInnerHTML={{ __html: formatJsonWithSyntaxHighlighting(jsonText) }}
            />
          </pre>
        </div>

        {error && (
          <div className="p-2 bg-red-900/30 border-t border-red-800">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 bg-[#1E1F22] border-t border-[#2D2D3A]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyToClipboard}
            className="border-[#4E4E5A] bg-[#2D2D3A] hover:bg-[#3D3D4A] text-gray-300 hover:text-white transition-all duration-200"
          >
            Copy to Clipboard
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#4E4E5A] bg-[#2D2D3A] hover:bg-[#3D3D4A] text-gray-300 hover:text-white transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-200"
          >
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatJsonWithSyntaxHighlighting(json: string): string {
  try {
    // Parse and re-stringify to ensure proper formatting
    const parsed = JSON.parse(json)
    const formatted = JSON.stringify(parsed, null, 2)

    // Apply syntax highlighting
    return formatted
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
          let cls = "text-[#89DDFF]" // string
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "text-[#F07178]" // key
              match = match.replace(/"/g, "").replace(/:$/, "")
              return `<span class="${cls}">"${match}"</span><span class="text-white">:</span>`
            } else {
              cls = "text-[#C3E88D]" // string value
            }
          } else if (/true|false/.test(match)) {
            cls = "text-[#FF9CAC]" // boolean
          } else if (/null/.test(match)) {
            cls = "text-[#B084EB]" // null
          } else {
            cls = "text-[#F78C6C]" // number
          }
          return `<span class="${cls}">${match}</span>`
        },
      )
      .replace(/\[/g, '<span class="text-white">[</span>')
      .replace(/\]/g, '<span class="text-white">]</span>')
      .replace(/\{/g, '<span class="text-white">{</span>')
      .replace(/\}/g, '<span class="text-white">}</span>')
      .replace(/,/g, '<span class="text-white">,</span>')
  } catch (e) {
    // If there's an error in the JSON, return it without highlighting
    return json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }
}

