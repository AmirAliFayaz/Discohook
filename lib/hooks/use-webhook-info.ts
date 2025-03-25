"use client"

import { useState, useEffect } from "react"
import { useWebhookStore } from "@/lib/store"

interface WebhookInfo {
  name: string
  avatar: string | null
  channelId: string
  guildId: string
}

interface WebhookInfoResult {
  loading: boolean
  info: WebhookInfo | null
  error: string | null
  fetchInfo: () => Promise<void>
}

export function useWebhookInfo(): WebhookInfoResult {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<WebhookInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { webhookUrl } = useWebhookStore()

  const fetchInfo = async () => {
    if (!webhookUrl) {
      setError("Webhook URL is required")
      setInfo(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/webhook-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: webhookUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch webhook info")
      }

      setInfo(data.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch webhook info")
      setInfo(null)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (webhookUrl) {
      fetchInfo()
    } else {
      setInfo(null)
      setError(null)
    }
  }, [webhookUrl])

  return {
    loading,
    info,
    error,
    fetchInfo,
  }
}

