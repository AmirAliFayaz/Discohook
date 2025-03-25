import { type NextRequest, NextResponse } from "next/server"
import { validateWebhookUrl } from "@/lib/validators"
import { ERROR_MESSAGES } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    // Get webhook URL from headers
    const webhookUrl = request.headers.get("webhook-url")

    // Validate webhook URL
    if (!webhookUrl) {
      return NextResponse.json({ success: false, message: "No webhook URL provided" }, { status: 400 })
    }

    const urlValidation = validateWebhookUrl(webhookUrl)
    if (!urlValidation.valid) {
      return NextResponse.json({ success: false, message: urlValidation.error }, { status: 400 })
    }

    // Get the request body as JSON
    let payload
    try {
      payload = await request.json()
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON payload",
        },
        { status: 400 },
      )
    }

    // Send the webhook directly to Discord
    let response
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: `Network error: ${e instanceof Error ? e.message : String(e)}`,
        },
        { status: 500 },
      )
    }

    // Get response as text first for debugging
    let responseText
    try {
      responseText = await response.text()
    } catch (e) {
      responseText = "Could not read response body"
    }

    // Parse the response if it's JSON
    let responseData
    try {
      responseData = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      responseData = responseText
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Discord API error: ${response.status} ${response.statusText}`,
          error: responseData,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Webhook sent successfully",
      data: responseData,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
      { status: 500 },
    )
  }
}

