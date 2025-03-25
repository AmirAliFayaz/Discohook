export const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
export const DISCORD_WEBHOOK_URL_REGEX =
  /^https:\/\/(discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/(\d+)\/([a-zA-Z0-9_-]+)$/
export const DISCORD_MESSAGE_URL_REGEX = /^https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)$/

export const MAX_EMBEDS = 10
export const MAX_EMBED_FIELDS = 25
export const MAX_FILES = 10
export const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export const ERROR_MESSAGES = {
  INVALID_WEBHOOK_URL: "Invalid webhook URL format",
  WEBHOOK_URL_REQUIRED: "Webhook URL is required",
  DISCORD_API_ERROR: "Discord API error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  TOO_MANY_EMBEDS: `Maximum of ${MAX_EMBEDS} embeds allowed`,
  TOO_MANY_FIELDS: `Maximum of ${MAX_EMBED_FIELDS} fields per embed allowed`,
  TOO_MANY_FILES: `Maximum of ${MAX_FILES} files allowed`,
  FILE_TOO_LARGE: `Files must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_MESSAGE_URL: "Invalid Discord message URL",
  MESSAGE_URL_REQUIRED: "Discord message URL is required",
  UNAUTHORIZED: "Unauthorized. Bot token required for this operation",
  RATE_LIMITED: "You are being rate limited. Please try again later",
}

