import { type NextRequest, NextResponse } from "next/server"
import { validateWebhookUrl } from "@/lib/validators"
import { ERROR_MESSAGES } from "@/lib/constants"

// This is a fallback endpoint that directly forwards the request to Discord
// Useful for debugging or when the main endpoint isn't working

export async function POST(request: NextRequest) {
  console.log("==== DEBUG: DIRECT WEBHOOK API REQUEST STARTED ====")

  try {
    // Log full request for debugging
    console.log("Request URL:", request.url)
    console.log("Request method:", request.method)
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))

    // Get webhook URL from query params
    const searchParams = request.nextUrl.searchParams
    const webhookUrl = searchParams.get("url")
    console.log("Webhook URL from query:", webhookUrl)

    // Validate webhook URL
    const urlValidation = validateWebhookUrl(webhookUrl || "")
    if (!urlValidation.valid) {
      console.error("Webhook URL validation failed:", urlValidation.error)
      return NextResponse.json({ success: false, message: urlValidation.error }, { status: 400 })
    }

    // Get the request body
    const contentType = request.headers.get("content-type") || ""
    console.log("Content-Type:", contentType)

    let payload
    let rawBody

    if (contentType.includes("application/json")) {
      try {
        payload = await request.clone().json()
        rawBody = JSON.stringify(payload)
        console.log("JSON payload:", JSON.stringify(payload, null, 2))
      } catch (e) {
        console.error("Failed to parse JSON body:", e)
        return NextResponse.json(
          {
            success: false,
            message: "Invalid JSON body",
          },
          { status: 400 },
        )
      }
    } else if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.clone().formData()
        console.log("Form data fields:", [...formData.keys()])

        // We'll use the original request for forwarding
        payload = request
        rawBody = "FormData - see request logs"
      } catch (e) {
        console.error("Failed to parse form data:", e)
        return NextResponse.json(
          {
            success: false,
            message: "Invalid form data",
          },
          { status: 400 },
        )
      }
    } else {
      try {
        // For other content types, get the raw body
        const arrayBuffer = await request.clone().arrayBuffer()
        payload = new Uint8Array(arrayBuffer)
        rawBody = `Binary data of length ${payload.length}`
        console.log("Binary payload length:", payload.length)
      } catch (e) {
        console.error("Failed to read request body:", e)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to read request body",
          },
          { status: 400 },
        )
      }
    }

    console.log("DEBUG: Preparing to forward request to Discord")
    console.log("Target webhook URL:", webhookUrl)

    // Create headers to forward
    const forwardHeaders = new Headers()
    if (contentType) {
      forwardHeaders.set("Content-Type", contentType)
    }

    // Log the request we're about to make
    console.log("DEBUG: Forwarding request to Discord with:")
    console.log("- Method:", request.method)
    console.log("- Headers:", Object.fromEntries(forwardHeaders.entries()))
    console.log("- Body:", rawBody.length > 1000 ? rawBody.substring(0, 1000) + "... (truncated)" : rawBody)

    // Forward the request to Discord
    let response
    try {
      if (contentType.includes("multipart/form-data")) {
        // For multipart/form-data, clone and forward the original request
        const formData = await request.formData()
        response = await fetch(webhookUrl!, {
          method: "POST",
          body: formData,
        })
      } else {
        // For other content types, use the payload
        response = await fetch(webhookUrl!, {
          method: "POST",
          headers: forwardHeaders,
          body: contentType.includes("application/json") ? JSON.stringify(payload) : payload,
        })
      }

      console.log("DEBUG: Discord response status:", response.status)
      console.log("DEBUG: Discord response status text:", response.statusText)
      console.log("DEBUG: Discord response headers:", Object.fromEntries(response.headers.entries()))
    } catch (e) {
      console.error("Fetch request to Discord failed:", e)
      return NextResponse.json(
        {
          success: false,
          message: `Network error: ${e instanceof Error ? e.message : String(e)}`,
          error: e instanceof Error ? e.stack : undefined,
        },
        { status: 500 },
      )
    }

    // Get response as text for debugging
    let responseText
    try {
      responseText = await response.text()
      console.log("DEBUG: Discord response body:", responseText)
    } catch (e) {
      console.error("Failed to read response text:", e)
      responseText = "Could not read response body"
    }

    if (!response.ok) {
      console.error("Discord API error in direct webhook:", response.status, responseText)

      return NextResponse.json(
        {
          success: false,
          message: `Discord API error: ${response.status} ${response.statusText}`,
          error: responseText,
          debug: {
            requestUrl: webhookUrl,
            requestMethod: request.method,
            requestContentType: contentType,
            requestBodyType: typeof payload,
            responseStatus: response.status,
            responseStatusText: response.statusText,
            responseHeaders: Object.fromEntries(response.headers.entries()),
            responseBody: responseText,
          },
        },
        { status: response.status },
      )
    }

    console.log("DEBUG: Direct webhook forwarded successfully!")

    return NextResponse.json({
      success: true,
      message: "Webhook sent successfully via direct endpoint",
      responseStatus: response.status,
      responseBody: responseText,
    })
  } catch (error) {
    console.error("Unhandled error in direct-webhook API:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  } finally {
    console.log("==== DEBUG: DIRECT WEBHOOK API REQUEST COMPLETED ====")
  }
}

