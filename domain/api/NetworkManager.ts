import { getSession } from "next-auth/react"
import ApiStatusCodes from "./ApiStatusCodes"
import NetworkConfig from "./NetworkConfig"

type ErrorResponse = {
  success: false
  message: string
  statusCode: number
  errorTitle: string
}

// Token refresh lock to prevent concurrent refreshes
class TokenRefreshLock {
  private refreshPromise: Promise<void> | null = null
  private isRefreshing = false

  async acquireLock(refreshFn: () => Promise<void>): Promise<void> {
    // If already refreshing, wait for it
    if (this.isRefreshing && this.refreshPromise) {
      console.log("⏳ Token refresh already in progress, waiting...")
      await this.refreshPromise
      return
    }

    // Start new refresh
    console.log("🔄 Starting token refresh...")
    this.isRefreshing = true

    this.refreshPromise = refreshFn()
      .then(() => {
        console.log("✅ Token refresh successful")
      })
      .catch((error) => {
        console.log("❌ Token refresh failed:", error.message)
        throw error
      })
      .finally(() => {
        // Use setTimeout to ensure all waiting requests see the new token
        setTimeout(() => {
          this.isRefreshing = false
          this.refreshPromise = null
        }, 100)
      })

    await this.refreshPromise
  }
}

const tokenRefreshLock = new TokenRefreshLock()

// Helper functions
const getErrorTitle = (statusCode: number): string => {
  switch (statusCode) {
    case ApiStatusCodes.BAD_REQUEST:
      return "Bad Request"
    case ApiStatusCodes.UNAUTHORIZED:
      return "Unauthorized"
    case ApiStatusCodes.NOT_FOUND:
      return "Not Found"
    case ApiStatusCodes.TOO_MANY_REQUESTS:
      return "Too Many Requests"
    case ApiStatusCodes.INTERNAL_SERVER_ERROR:
      return "Server Error"
    case ApiStatusCodes.SERVICE_UNAVAILABLE:
      return "Service Unavailable"
    default:
      return "Error"
  }
}

const responseHandler = async <T>(response: Response): Promise<T> => {
  if (response.status === ApiStatusCodes.NO_CONTENT) {
    return null as unknown as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error: ErrorResponse = {
      success: false,
      message: data.message || "An error occurred",
      statusCode: response.status,
      errorTitle: getErrorTitle(response.status),
    }
    throw error
  }

  return data as T
}

const makeApiCall = async <T>(
  endpoint: string,
  options: RequestInit,
  retry = true
): Promise<T> => {
  const session = await getSession()

  console.log(`➡️ ${options.method || "GET"} ${endpoint}`)

  if (options.headers && !("Authorization" in options.headers)) {
    const token = session?.accessToken
    if (token) {
      ;(options.headers as any)["Authorization"] = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(`${NetworkConfig.shared.baseURL}${endpoint}`, options)
    const data = await responseHandler<T>(response)
    return data
  } catch (error: any) {
    if (error.statusCode === ApiStatusCodes.UNAUTHORIZED && retry) {
      try {
        const updatedSession = await fetch("/api/auth/session").then((res) => res.json())
        if (options.headers && updatedSession?.accessToken) {
          ;(options.headers as any)[
            "Authorization"
          ] = `Bearer ${updatedSession?.accessToken}`
        }

        // Retry original request only once
        return makeApiCall<T>(endpoint, options, false)
      } catch (refreshError: any) {
        throw new Error("Session expired")
      }
    }

    if (error.statusCode >= 500) {
      window.alert("Server Error")
    }

    throw error
  }
}

// Public API functions
export const getRequest = async <T>(endpoint: string): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

export const postRequest = async <T, B = unknown>(
  endpoint: string,
  body: B
): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const postFileRequest = async <T>(
  endpoint: string,
  formData: FormData
): Promise<T> => {
  return makeApiCall<T>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
}

export const patchRequest = async <T, B = unknown>(
  endpoint: string,
  body: B
): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const putRequest = async <T, B = unknown>(endpoint: string, body: B): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const deleteRequest = async <T>(endpoint: string): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
