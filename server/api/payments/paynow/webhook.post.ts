import { PrismaClient } from '@prisma/client'
import { getAuditActor, serializeForAudit, writeAuditLog } from '~/server/utils/auditLog'
import { applyPaynowStatus } from '~/server/utils/paymentFulfilment'
import { requirePaynowCredentials } from '~/server/utils/paynow'

const prisma = new PrismaClient()

/**
 * Paynow IPN (result URL) handler.
 *
 * Paynow POSTs this as application/x-www-form-urlencoded with the fields:
 *   reference, paynowreference, amount, status, pollurl, hash
 * Note it is `reference`, NOT `paymentReference` — reading the wrong name here caused every
 * genuine callback to be rejected, so orders paid by card were never marked PAID.
 *
 * The status is NOT taken from the request body. This endpoint is public and unauthenticated, so
 * we re-poll Paynow on the poll URL we stored at initiation and use that as the authoritative
 * answer. That makes a forged callback useless (it cannot fake Paynow's own response) without
 * making delivery depend on getting hash reconstruction byte-perfect — a mismatch there would
 * silently reject every real payment, which is the failure we are fixing.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    console.log('Paynow webhook received:', body)

    const paymentReference = body?.reference

    if (!paymentReference) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required webhook field: reference',
      })
    }

    const payment = await prisma.payment.findUnique({
      where: { paynowReference: paymentReference },
      include: { order: true },
    })

    if (!payment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment not found',
      })
    }

    // Hash check is advisory for the status (the poll below is what we trust), but it is what
    // authorises using a poll URL out of the request body.
    let hashVerified = false
    try {
      const { Paynow } = await import('paynow')
      const { integrationId, integrationKey } = requirePaynowCredentials()
      const paynow = new Paynow(integrationId, integrationKey)

      hashVerified = paynow.verifyHash(body)
      if (!hashVerified) {
        console.warn(`Paynow webhook: hash mismatch for reference ${paymentReference}`)
      }
    } catch (hashError) {
      console.warn('Paynow webhook: could not verify hash', hashError)
    }

    // Prefer the poll URL we stored at initiation. Paynow can call back before that write lands
    // (a buyer cancelling on their phone triggers the IPN within a second), so fall back to the
    // one in the payload — but only when the hash proves Paynow sent it, and only when it points
    // at Paynow, so this cannot be turned into a request-forgery primitive.
    let pollUrl = payment.paynowPollUrl

    if (!pollUrl && hashVerified && body?.pollurl) {
      const candidate = String(body.pollurl)
      let host = ''
      try {
        host = new URL(candidate).hostname.toLowerCase()
      } catch {
        host = ''
      }

      if (host === 'paynow.co.zw' || host.endsWith('.paynow.co.zw')) {
        pollUrl = candidate
        await prisma.payment.update({
          where: { id: payment.id },
          data: { paynowPollUrl: candidate },
        })
      } else {
        console.warn(`Paynow webhook: refusing non-Paynow poll URL host "${host}"`)
      }
    }

    if (!pollUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No poll URL recorded for this payment',
      })
    }

    // Ask Paynow directly what the status is.
    const pollResponse = await $fetch(pollUrl)

    let status = 'Pending'
    if (typeof pollResponse === 'string') {
      status = new URLSearchParams(pollResponse).get('status') || 'Pending'
    } else if (pollResponse && typeof pollResponse === 'object') {
      status = (pollResponse as any).status || (pollResponse as any).Status || 'Pending'
    }

    const outcome = await applyPaynowStatus(prisma, payment.id, payment.orderId, status)

    if (outcome !== 'PENDING') {
      const audit = await getAuditActor(event)
      const paymentSnapshot = await prisma.payment.findUnique({
        where: { id: payment.id },
        include: { order: { include: { items: true } } },
      })

      await writeAuditLog(prisma, {
        ...audit,
        action: outcome === 'PAID' ? 'PAYMENT_COMPLETED' : 'PAYMENT_FAILED',
        entity: 'Payment',
        entityId: payment.id,
        details: {
          source: 'paynow_webhook',
          paynowStatus: status,
          amount: body?.amount,
          paymentReference,
          snapshot: serializeForAudit(paymentSnapshot),
        },
      })
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
    }
  } catch (error: any) {
    console.error('Error processing Paynow webhook:', error)

    if (error.statusCode) {
      throw error
    }

    // A 5xx tells Paynow to retry, which is what we want for a transient failure.
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process webhook',
    })
  }
})
