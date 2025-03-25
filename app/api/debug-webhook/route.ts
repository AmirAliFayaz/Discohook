import { type NextRequest, NextResponse } from "next/server"
import { ERROR_MESSAGES } from "@/lib/constants"

// A simplified webhook endpoint specifically for debugging
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    let requestBody
    try {
      requestBody = await request.json()
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 },
      )
    }

    // Extract URL and payload from request body
    const { url, payload } = requestBody

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "No webhook URL provided in request body",
        },
        { status: 400 },
      )
    }

    // Update the webhook URL validation in the debug-webhook API
    // Less strict URL validation for debugging purposes
    if (!url.includes("/api/webhooks/")) {
      return NextResponse.json(
        {
          success: false,
          message: "URL doesn't appear to be a Discord webhook URL",
        },
        { status: 400 },
      )
    }

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "No payload provided in request body",
        },
        { status: 400 },
      )
    }

    // Send the webhook to Discord
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    // Get response text
    const responseText = await response.text()

    // Try to parse response as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
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
      message: "Debug webhook sent successfully",
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

