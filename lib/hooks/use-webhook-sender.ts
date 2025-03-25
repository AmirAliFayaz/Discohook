"use client"

import { useState } from "react"
import { useWebhookStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface WebhookSenderResult {
  loading: boolean
  success: boolean | null
  error: string | null
  sendWebhook: () => Promise<boolean>
  resetStatus: () => void
}

export function useWebhookSender(): WebhookSenderResult {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const { webhookUrl, content, username, avatarUrl, threadName, suppressEmbeds, suppressNotifications, files, embeds } =
    useWebhookStore()

  const resetStatus = () => {
    setSuccess(null)
    setError(null)
  }

  const sendWebhook = async (): Promise<boolean> => {
    resetStatus()
    console.log("Starting webhook send process")
    console.log("Webhook URL:", webhookUrl)

    if (!webhookUrl) {
      const errorMsg = "Please enter a webhook URL"
      setError(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      return false
    }

    if (
      !webhookUrl.match(/^https:\/\/(discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/\d+\/[\w-]+$/)
    ) {
      const errorMsg = "Invalid webhook URL format"
      setError(errorMsg)
      toast({
        title: "Error",
        description:
          "Invalid webhook URL format. It should look like: https://discord.com/api/webhooks/123456789/abcdef-ghijkl",
        variant: "destructive",
      })
      return false
    }

    setLoading(true)

    try {
      const payload: any = {}

      if (content && content.trim() !== "") {
        payload.content = content
      } else {
        payload.content = ""
      }

      if (username) payload.username = username
      if (avatarUrl) payload.avatar_url = avatarUrl
      if (threadName) payload.thread_name = threadName

      const flags = (suppressEmbeds ? 4 : 0) | (suppressNotifications ? 4096 : 0)
      if (flags > 0) payload.flags = flags

      if (embeds.length > 0) {
        payload.embeds = embeds.map((embed) => {
          const processedEmbed = { ...embed }

          if (
            processedEmbed.color &&
            typeof processedEmbed.color === "string" &&
            processedEmbed.color.startsWith("#")
          ) {
            processedEmbed.color = Number.parseInt(processedEmbed.color.replace("#", ""), 16).toString()
          }

          return processedEmbed
        })
      }

      if (files.length > 0) {
        return await sendWebhookWithFiles(payload)
      } else {
        const response = await fetch("/api/send-webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "webhook-url": webhookUrl,
          },
          body: JSON.stringify(payload),
        })

        const responseText = await response.text()

        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          data = { success: false, message: responseText }
        }

        if (!response.ok) {
          throw new Error(data.message || `Failed to send webhook: ${response.status} ${response.statusText}`)
        }

        setSuccess(true)
        toast({
          title: "Success",
          description: "Webhook sent successfully!",
        })
        return true
      }
    } catch (error) {
      console.error("Webhook error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to send webhook"
      setError(errorMessage)
      setSuccess(false)
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

  const sendWebhookWithFiles = async (payload: any): Promise<boolean> => {
    console.log("==== DEBUG: SENDING WEBHOOK WITH FILES ====")
    try {
      const formData = new FormData()

      console.log("Adding payload_json to FormData:", JSON.stringify(payload, null, 2))
      formData.append("payload_json", JSON.stringify(payload))

      console.log("Adding files to FormData:")
      files.forEach((file, index) => {
        console.log(`- file${index}: ${file.name} (${file.type}, ${file.size} bytes)`)
        formData.append(`file${index}`, file)
      })

      console.log(
        "FormData entries:",
        [...formData.entries()].map(([key, value]) => {
          if (value instanceof File) {
            return [key, `File: ${value.name} (${value.type}, ${value.size} bytes)`]
          }
          return [key, value]
        }),
      )

      console.log("Sending FormData directly to Discord webhook:", webhookUrl)

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      })

      console.log("Discord response status:", response.status)
      console.log("Discord response status text:", response.statusText)

      let responseText
      try {
        responseText = await response.text()
        console.log("Response text:", responseText)
      } catch (e) {
        console.error("Failed to read response text:", e)
        responseText = "Error reading response"
      }

      if (!response.ok) {
        console.error("Discord API error:", response.status, responseText)
        throw new Error(`Discord API error: ${response.status} ${response.statusText}\n${responseText}`)
      }

      console.log("Webhook with files sent successfully!")

      setSuccess(true)
      toast({
        title: "Success",
        description: "Webhook with files sent successfully!",
      })
      return true
    } catch (error) {
      console.error("Webhook with files error:", error)
      throw error
    } finally {
      console.log("==== DEBUG: WEBHOOK WITH FILES COMPLETED ====")
    }
  }

  return {
    loading,
    success,
    error,
    sendWebhook,
    resetStatus,
  }
}
