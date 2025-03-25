import { DISCORD_API_BASE_URL, ERROR_MESSAGES } from "@/lib/constants"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status: number
}

export async function fetchWithErrorHandling<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    })

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || "5"
      return {
        success: false,
        error: `${ERROR_MESSAGES.RATE_LIMITED} (Retry after ${retryAfter}s)`,
        status: 429,
      }
    }

    // Try to parse JSON response
    let data
    try {
      data = await response.json()
    } catch (e) {
      // If response is not JSON, use text
      data = await response.text()
    }

    if (!response.ok) {
      return {
        success: false,
        error: typeof data === "object" && data.message ? data.message : ERROR_MESSAGES.DISCORD_API_ERROR,
        data,
        status: response.status,
      }
    }

    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error("API request error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      status: 500,
    }
  }
}

export async function fetchDiscordApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<ApiResponse<T>> {
  const url = `${DISCORD_API_BASE_URL}${endpoint}`

  const headers: HeadersInit = {
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bot ${token}`
  }

  return fetchWithErrorHandling<T>(url, {
    ...options,
    headers,
  })
}

