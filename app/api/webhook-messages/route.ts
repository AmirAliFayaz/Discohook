import { type NextRequest, NextResponse } from "next/server"
import { validateWebhookUrl, parseWebhookUrl } from "@/lib/validators"
import { ERROR_MESSAGES } from "@/lib/constants"
import { fetchDiscordApi } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { url, limit = 10 } = await request.json()

    // Validate webhook URL
    const urlValidation = validateWebhookUrl(url || "")
    if (!urlValidation.valid) {
      return NextResponse.json({ success: false, message: urlValidation.error }, { status: 400 })
    }

    // Parse webhook URL to get webhook ID and token
    const parsedUrl = parseWebhookUrl(url)
    if (!parsedUrl) {
      return NextResponse.json({ success: false, message: ERROR_MESSAGES.INVALID_WEBHOOK_URL }, { status: 400 })
    }

    const { webhookId, webhookToken } = parsedUrl

    // Fetch recent messages sent by this webhook
    const response = await fetchDiscordApi(`/webhooks/${webhookId}/${webhookToken}/messages?limit=${limit}`, {
      method: "GET",
    })

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.error || ERROR_MESSAGES.DISCORD_API_ERROR,
        },
        { status: response.status },
      )
    }

    // Return messages
    return NextResponse.json({
      success: true,
      data: response.data,
    })
  } catch (error) {
    console.error("Error fetching webhook messages:", error)
    return NextResponse.json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, { status: 500 })
  }
}

