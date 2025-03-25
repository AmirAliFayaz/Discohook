import { type NextRequest, NextResponse } from "next/server"
import { validateMessageUrl, parseMessageUrl } from "@/lib/validators"
import { ERROR_MESSAGES } from "@/lib/constants"
import { fetchDiscordApi } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { url, token } = await request.json()

    // Validate message URL
    const urlValidation = validateMessageUrl(url || "")
    if (!urlValidation.valid) {
      return NextResponse.json({ success: false, message: urlValidation.error }, { status: 400 })
    }

    // Parse message URL to get guild, channel, and message IDs
    const parsedUrl = parseMessageUrl(url)
    if (!parsedUrl) {
      return NextResponse.json({ success: false, message: ERROR_MESSAGES.INVALID_MESSAGE_URL }, { status: 400 })
    }

    const { channelId, messageId } = parsedUrl

    // Check if bot token is provided
    if (!token) {
      // If no token is provided, return a mock response for demo purposes
      return NextResponse.json({
        success: true,
        data: {
          content: "This is a sample message loaded from a Discord URL",
          embeds: [
            {
              title: "Sample Embed",
              description: "This is a sample embed loaded from a Discord message",
              color: "#4B5563",
            },
          ],
        },
      })
    }

    // Fetch the message from Discord API
    const response = await fetchDiscordApi(`/channels/${channelId}/messages/${messageId}`, { method: "GET" }, token)

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.error || ERROR_MESSAGES.DISCORD_API_ERROR,
        },
        { status: response.status },
      )
    }

    // Transform the message to match our webhook format
    const message = response.data

    return NextResponse.json({
      success: true,
      data: {
        content: message.content,
        embeds: message.embeds || [],
        username: message.author?.username,
        avatar_url: message.author?.avatar
          ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          : undefined,
      },
    })
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, { status: 500 })
  }
}

