/**
 * Default WPA passphrase printed on vouchers and voucher emails.
 *
 * Used whenever a Location has no `wifiPassword` of its own, so the connect instructions always
 * show a password. A location that sets its own password overrides this. Shared by both the
 * client (confirmation page, printed voucher) and the server (voucher email).
 */
export const DEFAULT_WIFI_PASSWORD = '12345678'

/** The password to display for a location: its own if set, otherwise the global default. */
export function resolveWifiPassword(locationPassword?: string | null): string {
  return (locationPassword && locationPassword.trim()) || DEFAULT_WIFI_PASSWORD
}
