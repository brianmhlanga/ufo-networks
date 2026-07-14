/**
 * Zimbabwean mobile number handling.
 *
 * Voucher codes are delivered to this number, so only Zimbabwean mobile numbers are accepted —
 * a foreign number cannot receive a local SMS and the buyer would never get their PIN.
 *
 * Mobile prefixes: 071 (NetOne), 073 (Telecel), 077 / 078 (Econet).
 * Numbers are normalised to local form (0771234567) regardless of whether the buyer typed the
 * local, +263 or 263 variant, so a number is stored one way only.
 */

const ZW_MOBILE_LOCAL = /^07[1378]\d{7}$/

/** Strip formatting and convert any Zimbabwean form to local 07XXXXXXXX. Returns '' if not one. */
export function normalizeZimbabwePhone(input: string | null | undefined): string {
  if (!input) return ''

  // Keep a leading + so we can tell "+263…" from a bare local number.
  const cleaned = String(input).trim().replace(/[\s\-().]/g, '')
  const digits = cleaned.replace(/^\+/, '')

  // +263771234567 / 263771234567 → 0771234567
  if (digits.startsWith('263')) {
    const local = `0${digits.slice(3)}`
    return ZW_MOBILE_LOCAL.test(local) ? local : ''
  }

  // A leading + that is not +263 is a foreign number.
  if (cleaned.startsWith('+')) return ''

  return ZW_MOBILE_LOCAL.test(digits) ? digits : ''
}

export function isValidZimbabwePhone(input: string | null | undefined): boolean {
  return normalizeZimbabwePhone(input) !== ''
}
