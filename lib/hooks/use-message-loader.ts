"use client"

import { useState } from "react"
import { useWebhookStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface MessageLoaderResult {
  loading: boolean
  error: string | null
  loadMessage: (url: string, token?: string) => Promise<boolean>
}

export function useMessageLoader(): MessageLoaderResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const { setContent, setUsername, setAvatarUrl, setEmbeds } = useWebhookStore()

  const loadMessage = async (url: string, token?: string): Promise<boolean> => {
    if (!url) {
      setError("Please enter a Discord message URL")
      toast({
        title: "Error",
        description: "Please enter a Discord message URL",
        variant: "destructive",
      })
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/fetch-message", {
        method: "POST",
        body: JSON.stringify({ url, token }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to load message")
      }

      const { content, embeds, username, avatar_url } = result.data

      // Update form with fetched data
      setContent(content || "")
      if (embeds && embeds.length > 0) {
        setEmbeds(embeds)
      }
      if (username) {
        setUsername(username)
      }
      if (avatar_url) {
        setAvatarUrl(avatar_url)
      }

      toast({
        title: "Success",
        description: "Message loaded successfully!",
      })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load message"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    loadMessage,
  }
}

