import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(date: Date): string {
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`
}

export function bytesToSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, "")

  // Parse the hex value
  const bigint = Number.parseInt(hex, 16)

  // No valid hex value
  if (isNaN(bigint)) {
    return null
  }

  // Extract the RGB components
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)

  if (!rgb) {
    return "#FFFFFF" // Default to white if invalid hex
  }

  // Calculate luminance - standard formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255

  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

