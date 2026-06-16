export function getFetchErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const err = error as Record<string, unknown>
  const data = err.data as Record<string, unknown> | undefined
  const cause = err.cause as Record<string, unknown> | undefined

  const candidates = [
    data?.statusMessage,
    data?.message,
    err.statusMessage,
    cause?.statusMessage,
    cause?.message,
    err.message,
  ]

  for (const value of candidates) {
    if (typeof value !== 'string') continue

    const message = value.trim()
    if (!message) continue
    if (message === 'Bad Request' || message === 'Internal Server Error') continue

    return message
  }

  return fallback
}
