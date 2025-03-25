"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWebhookStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimestamp } from "@/lib/utils"
import { Paperclip } from "lucide-react"
import { motion } from "framer-motion"
import { DiscordMarkdownPreview } from "@/components/discord-markdown-preview"
import { Skeleton } from "@/components/ui/skeleton"

export function WebhookPreview() {
  const [isLoading, setIsLoading] = useState(true)
  const { content, username, avatarUrl, embeds, files, suppressEmbeds } = useWebhookStore()

  const displayName = username || "Webhook"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  const timestamp = formatTimestamp(new Date())

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to get placeholder image with dimensions
  const getPlaceholder = (width = 300, height = 150) => {
    return `/placeholder.svg?height=${height}&width=${width}`
  }

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-[#12121A]/80 border-[#1E1E2A] shadow-xl">
        <CardHeader className="pb-4">
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden bg-[#313338] border border-[#1E1F22] shadow-xl max-w-[600px] mx-auto">
            {/* Discord-like header */}
            <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-black/20">
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  <Skeleton className="h-16 w-full" />

                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>

            {/* Discord-like message input */}
            <div className="px-4 py-3 bg-[#383A40] mt-2">
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="backdrop-blur-sm bg-[#12121A]/80 border-[#1E1E2A] shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold font-heading text-white">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden bg-[#313338] border border-[#1E1F22] shadow-xl max-w-[600px] mx-auto">
            {/* Discord-like header */}
            <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-black/20">
              <div className="text-gray-300 text-sm font-medium flex items-center gap-1">
                <span className="text-white">#</span>
                <span>webhook-channel</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 rounded-full ring-1 ring-black/10">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                  <AvatarFallback className="bg-[#5865F2]">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{displayName}</span>
                    <span className="text-xs text-gray-400">{timestamp}</span>
                  </div>

                  {content && (
                    <div className="mt-1 text-sm">
                      <DiscordMarkdownPreview markdown={content} />
                    </div>
                  )}

                  {!suppressEmbeds && embeds.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {embeds.map((embed, index) => (
                        <motion.div
                          key={index}
                          className="rounded-md overflow-hidden"
                          style={{
                            borderLeft: `4px solid ${embed.color ? `#${embed.color.replace("#", "")}` : "#4B5563"}`,
                          }}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="bg-[#2B2D31] p-3 relative">
                            {/* Thumbnail - positioned absolutely to the right */}
                            {embed.thumbnail && embed.thumbnail.url && (
                              <div className="absolute top-3 right-3">
                                <img
                                  src={embed.thumbnail.url || "/placeholder.svg"}
                                  alt=""
                                  onError={(e) => {
                                    e.currentTarget.src = getPlaceholder(80, 80)
                                  }}
                                  className="w-16 h-16 rounded object-cover"
                                />
                              </div>
                            )}

                            {/* Author section */}
                            {embed.author && (
                              <div className="flex items-center gap-2 mb-2">
                                {embed.author.icon_url && (
                                  <img
                                    src={embed.author.icon_url || "/placeholder.svg"}
                                    alt=""
                                    onError={(e) => {
                                      e.currentTarget.src = getPlaceholder(24, 24)
                                    }}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                {embed.author.name && (
                                  <span className="text-sm font-medium text-[#DCDDDE]">{embed.author.name}</span>
                                )}
                              </div>
                            )}

                            {/* Title with optional URL */}
                            {embed.title && (
                              <div className="font-semibold text-white mb-1">
                                {embed.url ? (
                                  <a
                                    href={embed.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    {embed.title}
                                  </a>
                                ) : (
                                  embed.title
                                )}
                              </div>
                            )}

                            {/* Description with proper padding if thumbnail exists */}
                            {embed.description && (
                              <div
                                className="text-sm whitespace-pre-wrap mb-2 text-[#DCDDDE]"
                                style={{
                                  paddingRight: embed.thumbnail?.url ? "5rem" : "0",
                                }}
                              >
                                {embed.description}
                              </div>
                            )}

                            {/* Fields */}
                            {embed.fields && embed.fields.length > 0 && (
                              <div
                                className="grid gap-2 mb-2"
                                style={{
                                  paddingRight: embed.thumbnail?.url ? "5rem" : "0",
                                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                }}
                              >
                                {embed.fields.map((field, fieldIndex) => (
                                  <div key={fieldIndex} className={field.inline ? "col-span-1" : "col-span-full"}>
                                    {field.name && (
                                      <div className="font-semibold text-xs text-[#DCDDDE]">{field.name}</div>
                                    )}
                                    {field.value && <div className="text-xs text-[#DCDDDE]">{field.value}</div>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Main image */}
                            {embed.image && embed.image.url && (
                              <div className="mt-2">
                                <img
                                  src={embed.image.url || "/placeholder.svg"}
                                  alt=""
                                  onError={(e) => {
                                    e.currentTarget.src = getPlaceholder(400, 200)
                                  }}
                                  className="max-w-full rounded object-cover"
                                  style={{ maxHeight: "300px" }}
                                />
                              </div>
                            )}

                            {/* Footer */}
                            {embed.footer && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                {embed.footer.icon_url && (
                                  <img
                                    src={embed.footer.icon_url || "/placeholder.svg"}
                                    alt=""
                                    onError={(e) => {
                                      e.currentTarget.src = getPlaceholder(16, 16)
                                    }}
                                    className="w-4 h-4 rounded-full"
                                  />
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {embed.footer.text && <span>{embed.footer.text}</span>}
                                  {embed.footer.timestamp && (
                                    <>
                                      {embed.footer.text && <span className="text-gray-500">•</span>}
                                      <span>
                                        {new Date(embed.footer.timestamp).toLocaleString(undefined, {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Files */}
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div key={index} className="bg-[#2B2D31] rounded p-2 flex items-center gap-2 text-xs">
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Discord-like message input */}
            <div className="px-4 py-3 bg-[#383A40] mt-2">
              <div className="bg-[#2B2D31] rounded-lg px-4 py-2 text-sm text-gray-400">
                Message will be sent to webhook...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

