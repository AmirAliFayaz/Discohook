"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileUploader } from "@/components/file-uploader"
import { EmbedBuilder } from "@/components/embed-builder"
import { useWebhookStore } from "@/lib/store"
import { Send, LinkIcon, Trash2, Plus, Loader2, Download, Upload, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useWebhookSender } from "@/lib/hooks/use-webhook-sender"
import { useMessageLoader } from "@/lib/hooks/use-message-loader"
import { MessageEditor } from "@/components/message-editor"
import { WebhookFormSkeleton } from "@/components/webhook-form-skeleton"
import { useToast } from "@/hooks/use-toast"

export function WebhookForm() {
  const [urlInput, setUrlInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const {
    webhookUrl,
    content,
    username,
    avatarUrl,
    threadName,
    suppressEmbeds,
    suppressNotifications,
    embeds,
    setWebhookUrl,
    setContent,
    setUsername,
    setAvatarUrl,
    setThreadName,
    setSuppressEmbeds,
    setSuppressNotifications,
    addEmbed,
    removeEmbed,
    setEmbeds,
    setFullPayload,
    getFullPayload,
    resetForm,
    files,
  } = useWebhookStore()

  const { loading, sendWebhook } = useWebhookSender()
  const { loading: loadingMessage, loadMessage } = useMessageLoader()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      })
      return
    }

    // Validate webhook URL format - updated to support PTB and Canary Discord domains
    if (
      !webhookUrl.match(/^https:\/\/(discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/\d+\/[\w-]+$/)
    ) {
      toast({
        title: "Error",
        description:
          "Invalid webhook URL format. It should look like: https://discord.com/api/webhooks/123456789/abcdef-ghijkl",
        variant: "destructive",
      })
      return
    }

    // Check if there's any content to send
    if (!content && embeds.length === 0 && files.length === 0) {
      toast({
        title: "Error",
        description: "Please add some content, embeds, or files to send",
        variant: "destructive",
      })
      return
    }

    await sendWebhook()
  }

  const handleLoadFromUrl = async () => {
    if (urlInput) {
      await loadMessage(urlInput)
    }
  }

  // Function to send webhook directly to Discord (bypass our API)
  const handleSendDirect = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a simple payload for testing
      const testPayload = {
        content: "Test message sent directly to Discord webhook",
        username: username || "Direct Test",
      }

      // Use our debug-webhook API endpoint with the URL in the request body
      const response = await fetch("/api/debug-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: webhookUrl,
          payload: testPayload,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        toast({
          title: "Direct webhook failed",
          description: `Status: ${response.status}, Error: ${responseData.message || "Unknown error"}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Direct webhook test successful!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send direct webhook",
        variant: "destructive",
      })
    }
  }

  // Export configuration as JSON file
  const handleExport = () => {
    try {
      const payload = getFullPayload()
      const dataStr = JSON.stringify(payload, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `discohook-config-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Configuration exported",
        description: "Your webhook configuration has been saved as a JSON file.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your configuration.",
        variant: "destructive",
      })
    }
  }

  // Import configuration from JSON file
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        setFullPayload(json)

        toast({
          title: "Configuration imported",
          description: "Your webhook configuration has been loaded successfully.",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The selected file contains invalid JSON data.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (isLoading) {
    return <WebhookFormSkeleton />
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-[#12121A]/80 border-[#1E1E2A] shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold font-heading text-white">Webhook Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure and send your Discord webhook message
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleExport}
                className="border-[#1E1E2A] bg-[#0F0F18] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200"
                title="Export configuration"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleImport}
                className="border-[#1E1E2A] bg-[#0F0F18] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200"
                title="Import configuration"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-gray-300 font-medium">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-[#0F0F18] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
              />
              <Button
                type="button"
                onClick={handleSendDirect}
                className="bg-[#0F0F18] hover:bg-[#1E1E2A] text-white border border-[#1E1E2A] transition-all duration-200"
                title="Test webhook directly"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Test Direct</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Discord webhook URL. Format: https://discord.com/api/webhooks/ID/TOKEN
            </p>
          </div>

          <Tabs defaultValue="message" className="mt-6">
            <TabsList className="bg-[#0F0F18] border border-[#1E1E2A] p-1 rounded-lg">
              <TabsTrigger
                value="message"
                className="data-[state=active]:bg-[#1E1E2A] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Message
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#1E1E2A] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="embeds"
                className="data-[state=active]:bg-[#1E1E2A] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Embeds
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="data-[state=active]:bg-[#1E1E2A] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Files
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-4 pt-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-300 font-medium">
                  Message Content
                </Label>
                <MessageEditor value={content} onChange={setContent} placeholder="Enter your message content here..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thread-name" className="text-gray-300 font-medium">
                  Thread Name (optional)
                </Label>
                <Input
                  id="thread-name"
                  placeholder="Thread name for forum channels"
                  value={threadName}
                  onChange={(e) => setThreadName(e.target.value)}
                  className="bg-[#0F0F18] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row mt-4">
                <div className="flex items-center space-x-2 bg-[#0F0F18] px-3 py-2 rounded-lg border border-[#1E1E2A]">
                  <Switch
                    id="suppress-embeds"
                    checked={suppressEmbeds}
                    onCheckedChange={setSuppressEmbeds}
                    className="data-[state=checked]:bg-gray-600"
                  />
                  <Label htmlFor="suppress-embeds" className="text-sm text-gray-300">
                    Suppress Embeds
                  </Label>
                </div>

                <div className="flex items-center space-x-2 bg-[#0F0F18] px-3 py-2 rounded-lg border border-[#1E1E2A]">
                  <Switch
                    id="suppress-notifications"
                    checked={suppressNotifications}
                    onCheckedChange={setSuppressNotifications}
                    className="data-[state=checked]:bg-gray-600"
                  />
                  <Label htmlFor="suppress-notifications" className="text-sm text-gray-300">
                    Suppress Notifications
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4 pt-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 font-medium">
                  Username (optional)
                </Label>
                <Input
                  id="username"
                  placeholder="Custom username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#0F0F18] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar-url" className="text-gray-300 font-medium">
                  Avatar URL (optional)
                </Label>
                <Input
                  id="avatar-url"
                  placeholder="https://example.com/avatar.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="bg-[#0F0F18] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a direct URL to an image (PNG, JPG, GIF)</p>
              </div>
            </TabsContent>

            <TabsContent value="embeds" className="space-y-4 pt-4 mt-2">
              {embeds.length === 0 ? (
                <div className="text-center py-12 px-6 bg-[#0F0F18] rounded-lg border border-[#1E1E2A]">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1E1E2A] flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-4">No embeds added yet</p>
                  <Button
                    type="button"
                    onClick={() => addEmbed()}
                    className="bg-[#2D2D3A] hover:bg-[#3D3D4A] text-white transition-all duration-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Embed
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {embeds.map((embed, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EmbedBuilder index={index} />
                    </motion.div>
                  ))}

                  {embeds.length < 10 && (
                    <Button
                      type="button"
                      onClick={() => addEmbed()}
                      className="w-full bg-[#0F0F18] hover:bg-[#1E1E2A] text-white border border-[#1E1E2A] transition-all duration-200"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Embed
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="space-y-4 pt-4 mt-2">
              <FileUploader />
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t border-[#1E1E2A] space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-url" className="text-gray-300 font-medium">
                Load from Discord Message URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="message-url"
                  placeholder="https://discord.com/channels/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-[#0F0F18] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                />
                <Button
                  type="button"
                  onClick={handleLoadFromUrl}
                  disabled={loadingMessage}
                  className="bg-[#0F0F18] hover:bg-[#1E1E2A] text-white border border-[#1E1E2A] transition-all duration-200"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span className="sr-only">Load</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Paste a Discord message link to load its content</p>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-[#1E1E2A] bg-[#0F0F18] hover:bg-[#2A2A3A] hover:text-white transition-all duration-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#2D2D3A] hover:bg-[#3D3D4A] text-white transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Webhook
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.form>
  )
}

