import { type NextRequest, NextResponse } from "next/server"
import { validateWebhookUrl, parseWebhookUrl } from "@/lib/validators"
import { ERROR_MESSAGES } from "@/lib/constants"
import { fetchDiscordApi } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { url, messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json({ success: false, message: "Message ID is required" }, { status: 400 })
    }

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

    // Delete the message
    const response = await fetchDiscordApi(`/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`, {
      method: "DELETE",
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

    // Return success
    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting webhook message:", error)
    return NextResponse.json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, { status: 500 })
  }
}

