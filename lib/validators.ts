import {
  DISCORD_WEBHOOK_URL_REGEX,
  DISCORD_MESSAGE_URL_REGEX,
  MAX_EMBEDS,
  MAX_EMBED_FIELDS,
  MAX_FILES,
  MAX_FILE_SIZE,
  ERROR_MESSAGES,
} from "@/lib/constants"
import type { Embed } from "@/lib/store"

export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: ERROR_MESSAGES.WEBHOOK_URL_REQUIRED }
  }

  if (!DISCORD_WEBHOOK_URL_REGEX.test(url)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_WEBHOOK_URL }
  }

  return { valid: true }
}

export function validateMessageUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: ERROR_MESSAGES.MESSAGE_URL_REQUIRED }
  }

  if (!DISCORD_MESSAGE_URL_REGEX.test(url)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_MESSAGE_URL }
  }

  return { valid: true }
}

export function validateEmbeds(embeds: Embed[]): { valid: boolean; error?: string } {
  if (embeds.length > MAX_EMBEDS) {
    return { valid: false, error: ERROR_MESSAGES.TOO_MANY_EMBEDS }
  }

  for (const embed of embeds) {
    if (embed.fields && embed.fields.length > MAX_EMBED_FIELDS) {
      return { valid: false, error: ERROR_MESSAGES.TOO_MANY_FIELDS }
    }
  }

  return { valid: true }
}

export function validateFiles(files: File[]): { valid: boolean; error?: string } {
  if (files.length > MAX_FILES) {
    return { valid: false, error: ERROR_MESSAGES.TOO_MANY_FILES }
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE }
    }
  }

  return { valid: true }
}

export function parseMessageUrl(url: string): { guildId: string; channelId: string; messageId: string } | null {
  const match = url.match(DISCORD_MESSAGE_URL_REGEX)

  if (!match) {
    return null
  }

  return {
    guildId: match[1],
    channelId: match[2],
    messageId: match[3],
  }
}

export function parseWebhookUrl(url: string): { webhookId: string; webhookToken: string } | null {
  const match = url.match(DISCORD_WEBHOOK_URL_REGEX)

  if (!match) {
    return null
  }

  return {
    webhookId: match[1],
    webhookToken: match[2],
  }
}

