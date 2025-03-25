"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useWebhookStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SendHorizontal, Bug, XCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DebugPanel() {
  const { webhookUrl } = useWebhookStore()
  const [isOpen, setIsOpen] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [consoleOutput, setConsoleOutput] = useState("")
  const [directUrl, setDirectUrl] = useState("")
  const [directPayload, setDirectPayload] = useState(JSON.stringify({ content: "Debug test message" }, null, 2))
  const [networkLogs, setNetworkLogs] = useState<any[]>([])
  const { toast } = useToast()

  // Override console.log to capture logs
  useEffect(() => {
    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    // Create a function to capture console output
    const captureConsole = (type: string, ...args: any[]) => {
      const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
      const logMessage = `[${timestamp}] [${type}] ${args
        .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(" ")}`

      setDebugLogs((prev) => [...prev, logMessage].slice(-100)) // Keep last 100 logs
      return logMessage
    }

    // Override console methods
    console.log = (...args) => {
      const logMessage = captureConsole("LOG", ...args)
      originalConsoleLog.apply(console, args)
      setConsoleOutput((prev) => `${prev}${logMessage}\n`)
    }

    console.error = (...args) => {
      const logMessage = captureConsole("ERROR", ...args)
      originalConsoleError.apply(console, args)
      setConsoleOutput((prev) => `${prev}${logMessage}\n`)
    }

    console.warn = (...args) => {
      const logMessage = captureConsole("WARN", ...args)
      originalConsoleWarn.apply(console, args)
      setConsoleOutput((prev) => `${prev}${logMessage}\n`)
    }

    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }, [])

  // Monitor fetch requests
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (input, init) => {
      let url
      try {
        url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url
        // Validate URL before using it
        if (url && typeof url === "string" && !url.startsWith("http") && !url.startsWith("/")) {
          url = "/" + url
        }
      } catch (e) {
        url = String(input)
        console.error("Invalid URL in fetch:", input)
      }

      const startTime = Date.now()
      const method = init?.method || "GET"

      console.log(`[Network] Starting ${method} request to ${url}`)

      // Log request details safely
      const requestLog = {
        type: "request",
        url: url || "unknown",
        method,
        headers: init?.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {},
        body: init?.body,
        timestamp: new Date().toISOString(),
      }

      setNetworkLogs((prev) => [...prev, requestLog])

      try {
        const response = await originalFetch(input, init)
        const endTime = Date.now()

        // Clone the response to log it without consuming it
        const responseClone = response.clone()
        let responseBody
        try {
          responseBody = await responseClone.text()
        } catch (e) {
          responseBody = "[Could not read response body]"
        }

        // Log response details
        const responseLog = {
          type: "response",
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseBody,
          duration: endTime - startTime,
          timestamp: new Date().toISOString(),
        }

        setNetworkLogs((prev) => [...prev, responseLog])
        console.log(
          `[Network] ${method} request to ${url} completed in ${endTime - startTime}ms with status ${response.status}`,
        )

        return response
      } catch (error) {
        const endTime = Date.now()

        // Log error details
        const errorLog = {
          type: "error",
          url,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          duration: endTime - startTime,
          timestamp: new Date().toISOString(),
        }

        setNetworkLogs((prev) => [...prev, errorLog])
        console.error(`[Network] ${method} request to ${url} failed after ${endTime - startTime}ms:`, error)

        throw error
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  // Function to send a direct webhook for debugging
  const sendDirectWebhook = async () => {
    try {
      // Get the webhook URL from input or use the current one
      const targetUrl = directUrl || webhookUrl

      console.log("Debug panel: Starting direct webhook send")

      if (!targetUrl) {
        console.error("No webhook URL provided for direct debug webhook")
        toast({
          title: "Error",
          description: "Please enter a webhook URL",
          variant: "destructive",
        })
        return
      }

      console.log("Sending direct debug webhook to:", targetUrl)

      // Basic validation - check if it contains /api/webhooks/ instead of specific domain
      if (!targetUrl.includes("/api/webhooks/")) {
        console.error("URL doesn't appear to be a Discord webhook URL:", targetUrl)
        toast({
          title: "Error",
          description: "URL doesn't appear to be a Discord webhook URL",
          variant: "destructive",
        })
        return
      }

      // Parse the payload JSON
      let payload
      try {
        payload = JSON.parse(directPayload)
        console.log("Parsed payload:", payload)
      } catch (e) {
        console.error("Invalid JSON payload:", e)
        toast({
          title: "Error",
          description: "Invalid JSON payload",
          variant: "destructive",
        })
        return
      }

      // Show loading toast
      toast({
        title: "Sending",
        description: "Sending debug webhook...",
      })

      // Try through our API first (to avoid CORS issues)
      console.log("Trying through debug-webhook API...")
      try {
        const apiResponse = await fetch("/api/debug-webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: targetUrl,
            payload: payload,
          }),
        })

        const apiResponseData = await apiResponse.json()
        console.log("API response:", apiResponseData)

        if (!apiResponse.ok) {
          console.error("API error:", apiResponseData)
          toast({
            title: "Error",
            description: apiResponseData.message || "Failed to send webhook through API",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Success",
          description: "Debug webhook sent successfully through API!",
        })
        return
      } catch (apiError) {
        console.error("Error using debug-webhook API:", apiError)

        // If API fails, try direct fetch as fallback
        console.log("API failed, trying direct fetch to Discord...")
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        console.log("Direct webhook response status:", response.status)

        const responseText = await response.text()
        console.log("Direct webhook response:", responseText)

        if (!response.ok) {
          toast({
            title: "Error",
            description: `Status: ${response.status}, Response: ${responseText}`,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Success",
          description: "Debug webhook sent successfully!",
        })
      }
    } catch (error) {
      console.error("Debug webhook error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send debug webhook",
        variant: "destructive",
      })
    }
  }

  const clearLogs = () => {
    setDebugLogs([])
    setConsoleOutput("")
    setNetworkLogs([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Debug information copied to clipboard",
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 text-white shadow-lg"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4">
      <Card className="max-w-4xl mx-auto bg-[#12121A] border-[#1E1E2A]">
        <CardHeader className="flex flex-row items-center justify-between bg-[#0F0F18] border-b border-[#1E1E2A]">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-500" />
            Debug Panel
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="console">
            <TabsList className="bg-[#0F0F18] border-b border-[#1E1E2A] w-full justify-start rounded-none p-0">
              <TabsTrigger value="console" className="rounded-none py-3 px-4 data-[state=active]:bg-[#12121A]">
                Console
              </TabsTrigger>
              <TabsTrigger value="direct" className="rounded-none py-3 px-4 data-[state=active]:bg-[#12121A]">
                Direct Webhook
              </TabsTrigger>
              <TabsTrigger value="network" className="rounded-none py-3 px-4 data-[state=active]:bg-[#12121A]">
                Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="p-4 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Console Output</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(consoleOutput)}
                  className="h-7 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={consoleOutput}
                  readOnly
                  className="h-[400px] font-mono text-xs bg-[#0F0F18] border-[#1E1E2A] resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="direct" className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder={webhookUrl || "https://discord.com/api/webhooks/..."}
                    className="bg-[#0F0F18] border-[#1E1E2A]"
                  />
                  <p className="text-xs text-gray-400">Leave empty to use the current webhook URL</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Payload (JSON)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDirectPayload(JSON.stringify({ content: "Debug test message" }, null, 2))}
                      className="h-7 text-xs"
                    >
                      Reset
                    </Button>
                  </div>
                  <Textarea
                    value={directPayload}
                    onChange={(e) => setDirectPayload(e.target.value)}
                    className="h-64 font-mono text-xs bg-[#0F0F18] border-[#1E1E2A] resize-none"
                  />
                </div>

                <Button onClick={sendDirectWebhook} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send Direct Debug Webhook
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="network" className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Network Requests</h3>
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {networkLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No network requests logged yet</div>
                ) : (
                  networkLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border text-xs font-mono ${
                        log.type === "error"
                          ? "bg-red-900/20 border-red-900/30"
                          : log.type === "response"
                            ? (
                                log.status >= 200 && log.status < 300
                                  ? "bg-green-900/20 border-green-900/30"
                                  : "bg-yellow-900/20 border-yellow-900/30"
                              )
                            : "bg-[#0F0F18] border-[#1E1E2A]"
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {log.type === "request"
                            ? `${log.method} ${new URL(log.url).pathname}`
                            : log.type === "response"
                              ? `Response ${log.status} ${log.statusText}`
                              : "Error"}
                        </span>
                        <span className="text-gray-400">
                          {log.timestamp.split("T")[1].split(".")[0]}
                          {log.duration && ` (${log.duration}ms)`}
                        </span>
                      </div>

                      <div className="truncate hover:text-clip hover:whitespace-normal">
                        {log.type === "request" ? (
                          <>
                            <div>URL: {log.url}</div>
                            <div>Headers: {JSON.stringify(log.headers)}</div>
                            {log.body && (
                              <div>Body: {typeof log.body === "string" ? log.body : "[FormData or Binary]"}</div>
                            )}
                          </>
                        ) : log.type === "response" ? (
                          <>
                            <div>URL: {log.url}</div>
                            <div>
                              Status: {log.status} {log.statusText}
                            </div>
                            <div>Headers: {JSON.stringify(log.headers)}</div>
                            <div>
                              Body:{" "}
                              {typeof log.body === "string"
                                ? log.body.length > 200
                                  ? `${log.body.substring(0, 200)}...`
                                  : log.body
                                : "[Complex Body]"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>URL: {log.url}</div>
                            <div>Error: {log.error}</div>
                            {log.stack && <div>Stack: {log.stack}</div>}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

