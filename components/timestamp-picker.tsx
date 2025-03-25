"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

interface TimestampPickerProps {
  value?: string
  onChange: (value?: string) => void
  className?: string
}

export function TimestampPicker({ value, onChange, className }: TimestampPickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)
  const [open, setOpen] = useState(false)

  // Update the date state when the value prop changes
  useEffect(() => {
    setDate(value ? new Date(value) : undefined)
  }, [value])

  // Format the time as HH:MM
  const formatTime = (date?: Date) => {
    if (!date) return ""
    return format(date, "HH:mm")
  }

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) {
      const newDate = new Date()
      const [hours, minutes] = e.target.value.split(":").map(Number)
      newDate.setHours(hours || 0, minutes || 0)
      setDate(newDate)
      onChange(newDate.toISOString())
    } else {
      const newDate = new Date(date)
      const [hours, minutes] = e.target.value.split(":").map(Number)
      newDate.setHours(hours || 0, minutes || 0)
      setDate(newDate)
      onChange(newDate.toISOString())
    }
  }

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return

    // Preserve the time from the existing date if available
    if (date) {
      newDate.setHours(date.getHours(), date.getMinutes())
    }

    setDate(newDate)
    onChange(newDate.toISOString())
  }

  // Handle preset selection
  const handlePresetSelect = (preset: string) => {
    const now = new Date()
    let newDate: Date

    switch (preset) {
      case "now":
        newDate = now
        break
      case "today":
        newDate = new Date(now.setHours(12, 0, 0, 0))
        break
      case "tomorrow":
        newDate = new Date(now)
        newDate.setDate(newDate.getDate() + 1)
        newDate.setHours(12, 0, 0, 0)
        break
      case "nextWeek":
        newDate = new Date(now)
        newDate.setDate(newDate.getDate() + 7)
        newDate.setHours(12, 0, 0, 0)
        break
      default:
        return
    }

    setDate(newDate)
    onChange(newDate.toISOString())
    setOpen(false)
  }

  // Clear the date
  const handleClear = () => {
    setDate(undefined)
    onChange(undefined)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-[#0F0F18] border-[#1E1E2A] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200",
              !date && "text-gray-400",
            )}
          >
            {date ? (
              <span className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                {format(date, "MMM d, yyyy")}
                <span className="text-gray-400 mx-1">•</span>
                <Clock className="h-3.5 w-3.5 opacity-70" />
                {format(date, "p")}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                <span>Set timestamp</span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#1E1F22] border-[#2D2D3A]">
          <div className="flex items-center justify-between p-2 border-b border-[#2D2D3A]">
            <h3 className="font-medium text-white text-sm">Set timestamp</h3>
            {date && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>

          <div className="p-2 border-b border-[#2D2D3A] grid grid-cols-4 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetSelect("now")}
              className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
            >
              Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetSelect("today")}
              className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetSelect("tomorrow")}
              className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
            >
              Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetSelect("nextWeek")}
              className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
            >
              Next Week
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 p-2">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="bg-[#1E1F22] text-white border-none p-0"
                classNames={{
                  day_selected:
                    "bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white focus:bg-[#4752C4] focus:text-white",
                  day_today: "bg-[#3D3D4A] text-white",
                  day: "text-gray-300 hover:bg-[#3D3D4A] hover:text-white focus:bg-[#3D3D4A] focus:text-white h-7 w-7 p-0 text-xs",
                  day_outside: "text-gray-500 opacity-50",
                  nav_button: "text-gray-300 hover:bg-[#3D3D4A] hover:text-white h-6 w-6",
                  table: "border-collapse border-spacing-0 w-full",
                  head_cell: "text-gray-400 font-normal text-[0.7rem] py-1",
                  cell: "p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-xs font-medium text-white",
                  nav: "flex items-center gap-1",
                  months: "flex flex-col space-y-2",
                  month: "space-y-2",
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="time" className="text-gray-300 font-medium text-xs">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formatTime(date)}
                  onChange={handleTimeChange}
                  className="bg-[#2D2D3A] border-[#3D3D4A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200 h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Quick times</Label>
                <div className="grid grid-cols-2 gap-1">
                  {["00:00", "08:00", "12:00", "17:00"].map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!date) {
                          const newDate = new Date()
                          const [hours, minutes] = time.split(":").map(Number)
                          newDate.setHours(hours, minutes, 0, 0)
                          setDate(newDate)
                          onChange(newDate.toISOString())
                        } else {
                          const newDate = new Date(date)
                          const [hours, minutes] = time.split(":").map(Number)
                          newDate.setHours(hours, minutes, 0, 0)
                          setDate(newDate)
                          onChange(newDate.toISOString())
                        }
                      }}
                      className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Special</Label>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date()
                      if (!date) {
                        setDate(now)
                        onChange(now.toISOString())
                      } else {
                        const newDate = new Date(date)
                        newDate.setHours(now.getHours(), now.getMinutes(), 0, 0)
                        setDate(newDate)
                        onChange(newDate.toISOString())
                      }
                    }}
                    className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
                  >
                    Current time
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!date) {
                        const newDate = new Date()
                        newDate.setHours(23, 59, 59, 0)
                        setDate(newDate)
                        onChange(newDate.toISOString())
                      } else {
                        const newDate = new Date(date)
                        newDate.setHours(23, 59, 59, 0)
                        setDate(newDate)
                        onChange(newDate.toISOString())
                      }
                    }}
                    className="text-xs h-7 bg-[#2D2D3A] border-[#3D3D4A] hover:bg-[#3D3D4A] text-gray-300"
                  >
                    End of day
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-2 border-t border-[#2D2D3A]">
            <Button
              onClick={() => setOpen(false)}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-200 h-8 text-xs"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

