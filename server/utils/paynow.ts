export function getPaynowCredentials() {
  const config = useRuntimeConfig()

  const integrationId =
    config.paynowIntegrationId ||
    process.env.PAYNOW_INTEGRATION_ID ||
    process.env.NUXT_PAYNOW_INTEGRATION_ID ||
    ''

  const integrationKey =
    config.paynowIntegrationKey ||
    process.env.PAYNOW_INTEGRATION_KEY ||
    process.env.NUXT_PAYNOW_INTEGRATION_KEY ||
    ''

  const authEmail =
    config.paynowAuthEmail ||
    process.env.PAYNOW_AUTH_EMAIL ||
    process.env.NUXT_PAYNOW_AUTH_EMAIL ||
    ''

  return {
    integrationId: String(integrationId).trim(),
    integrationKey: String(integrationKey).trim(),
    authEmail: String(authEmail).trim(),
  }
}

export function requirePaynowCredentials() {
  const credentials = getPaynowCredentials()

  if (!credentials.integrationId || !credentials.integrationKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Paynow credentials are not configured in environment variables',
    })
  }

  return credentials
}

/**
 * Email Paynow associates with the transaction. Buyers may now check out without giving an email,
 * so fall back to the merchant address — Paynow rejects a payment with no email at all.
 */
export function getPaynowAuthEmail(customerEmail?: string | null) {
  const { authEmail } = getPaynowCredentials()

  return (
    authEmail ||
    customerEmail?.trim() ||
    process.env.SENDER_EMAIL ||
    'noreply@ufo-networks.org'
  )
}

/**
 * Public origin of this site, used to build Paynow return/result URLs.
 *
 * These URLs are consumed by Paynow's servers and by the buyer's browser, so they must be
 * publicly reachable. Deriving them from the request (getRequestURL) yields 127.0.0.1:3000
 * when the reverse proxy does not forward the original Host header, which sends buyers to a
 * dead address and points the IPN callback back at the app's own loopback.
 */
/** Live site. Used when NUXT_PUBLIC_SITE_URL is unset so payments never depend on the env alone. */
export const DEFAULT_SITE_URL = 'https://ufo-networks.org'

export function getSiteUrl(event: any) {
  const configured = String(useRuntimeConfig().public?.siteUrl || process.env.NUXT_PUBLIC_SITE_URL || '').trim()

  if (configured) {
    return configured.replace(/\/+$/, '')
  }

  // In production, fall back to the known public URL rather than the request Host header, which
  // the reverse proxy rewrites to 127.0.0.1:3000 — that is what sent paying customers to a dead
  // address. Never throw here: a misconfigured env must not block checkout.
  if (process.env.NODE_ENV === 'production') {
    console.warn(`NUXT_PUBLIC_SITE_URL is not set; falling back to ${DEFAULT_SITE_URL}`)
    return DEFAULT_SITE_URL
  }

  return getRequestURL(event).origin.replace(/\/+$/, '')
}
