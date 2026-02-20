/**
 * Encode a voucher/sale into ESC/POS bytes for thermal receipt printers.
 * Paper width: columns 32 (57mm) or 42 (80mm).
 */

const ESC = '\x1B'
const GS = '\x1D'

// ESC/POS commands as strings (we'll encode to bytes)
const cmds = {
  init: ESC + '@',
  alignLeft: ESC + 'a\x00',
  alignCenter: ESC + 'a\x01',
  alignRight: ESC + 'a\x02',
  boldOn: ESC + 'E\x01',
  boldOff: ESC + 'E\x00',
  doubleHeightWidth: ESC + '!\x30',
  doubleWidth: ESC + '!\x20',
  normalSize: ESC + '!\x00',
  feed: '\n',
  feedLines: (n: number) => ESC + 'd' + String.fromCharCode(n),
  cut: GS + 'V\x00', // full cut
}

function center(text: string, columns: number): string {
  const len = text.length
  if (len >= columns) return text
  const pad = Math.floor((columns - len) / 2)
  return ' '.repeat(Math.max(0, pad)) + text
}

function lineOfChar(ch: string, columns: number): string {
  return ch.repeat(columns) + '\n'
}

/** Format date for receipt */
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export interface SaleForPrint {
  voucher: {
    voucherNumber: string
    pin: string
    hours: number
    numberOfUsers: number
    retailPrice?: number
    endDate: string
    location: { name: string }
  }
  buyerNote?: string | null
  buyerPhone?: string | null
  soldPrice: number
  createdAt: string
}

/**
 * Build ESC/POS command bytes for a voucher receipt. PIN is printed large (double height + width).
 */
export function encodeVoucherReceipt(sale: SaleForPrint, columns: number = 32): Uint8Array {
  const v = sale.voucher
  const chunks: Uint8Array[] = []

  // Header
  const part1 = new TextEncoder().encode(
    cmds.init +
    cmds.alignCenter +
    cmds.doubleHeightWidth +
    'UFO NETWORKS\n' +
    cmds.normalSize +
    'WiFi Voucher\n' +
    cmds.alignCenter +
    v.location.name + '\n' +
    cmds.feed +
    cmds.alignLeft +
    lineOfChar('-', columns) +
    `Voucher: ${v.voucherNumber}\n` +
    `PIN:     ${v.pin}\n`
  )
  chunks.push(part1)

  // Rest of receipt
  const part2 = new TextEncoder().encode(
    cmds.alignLeft +
    lineOfChar('-', columns) +
    `Type:    ${v.hours}H, ${v.numberOfUsers} user(s)\n` +
    `Expiry: ${formatDate(v.endDate)}\n` +
    (sale.buyerNote ? `Customer: ${sale.buyerNote}\n` : '') +
    (sale.buyerPhone ? `Phone:   ${sale.buyerPhone}\n` : '') +
    `Price:   $${Number(sale.soldPrice).toFixed(2)}\n` +
    lineOfChar('-', columns) +
    cmds.alignCenter +
    center('Thank you!', columns) + '\n' +
    center(formatDate(sale.createdAt), columns) + '\n' +
    '\n\n\n' +
    cmds.cut
  )
  chunks.push(part2)

  const totalLen = chunks.reduce((s, c) => s + c.length, 0)
  const out = new Uint8Array(totalLen)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.length
  }
  return out
}
