"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const PRESET_COLORS = [
  "#4B5563", // Gray
  "#6B7280", // Light Gray
  "#374151", // Dark Gray
  "#1F2937", // Slate
  "#111827", // Dark Slate
  "#1E293B", // Dark Blue
  "#0F172A", // Navy
  "#18181B", // Dark
  "#000000", // Black
  "#FFFFFF", // White
]

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color || "#4B5563")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(color || "#4B5563")
  }, [color])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleInputBlur = () => {
    // Validate hex color
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(inputValue)
    if (isValidHex) {
      onChange(inputValue)
    } else {
      setInputValue(color || "#4B5563")
    }
  }

  const handlePresetClick = (presetColor: string) => {
    setInputValue(presetColor)
    onChange(presetColor)
  }

  return (
    <div className="flex gap-2">
      <div
        className="w-10 h-10 rounded-md border border-[#1E1E2A] flex-shrink-0 cursor-pointer shadow-inner transition-transform hover:scale-105 duration-200"
        style={{ backgroundColor: inputValue }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="color"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange(e.target.value)
          }}
          className="opacity-0 w-0 h-0"
        />
      </div>

      <div className="flex-1">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-2 border-[#1E1E2A] bg-[#12121A] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 bg-[#12121A]/95 backdrop-blur-md border-[#1E1E2A] rounded-lg shadow-xl">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className="w-10 h-10 rounded-md relative flex items-center justify-center hover:ring-2 hover:ring-gray-500 hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: presetColor }}
                onClick={() => handlePresetClick(presetColor)}
              >
                {inputValue.toLowerCase() === presetColor.toLowerCase() && (
                  <Check className={`h-4 w-4 ${presetColor === "#FFFFFF" ? "text-black" : "text-white"}`} />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

