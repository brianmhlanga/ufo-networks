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

export function getPaynowAuthEmail(customerEmail: string) {
  const { authEmail } = getPaynowCredentials()
  return authEmail || customerEmail
}
