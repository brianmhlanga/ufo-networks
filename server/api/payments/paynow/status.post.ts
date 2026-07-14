import { PrismaClient } from '@prisma/client'
import { applyPaynowStatus } from '~/server/utils/paymentFulfilment'

const prisma = new PrismaClient()

/**
 * Poll Paynow for the current status of a payment and apply it.
 *
 * This is the client-side counterpart to the IPN webhook. It matters for two flows:
 *  - mobile money, where the buyer never leaves the site and the UI polls until confirmation;
 *  - the card/web redirect, where the confirmation page polls once as a self-heal in case the
 *    IPN was lost or delayed.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { paymentReference } = body
    let { pollUrl } = body

    if (!paymentReference) {
      throw createError({
        statusCode: 400,
        statusMessage: 'paymentReference is required',
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

    // Never poll a URL supplied by the caller — use the one Paynow gave us at initiation.
    pollUrl = payment.paynowPollUrl || pollUrl

    if (!pollUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No poll URL recorded for this payment',
      })
    }

    // Already settled — no need to hit Paynow again.
    if (payment.status === 'PAID' || payment.status === 'FAILED') {
      return {
        success: true,
        status: payment.paynowStatusMsg || payment.status,
        settled: true,
        paymentId: payment.id,
        orderId: payment.orderId,
      }
    }

    try {
      const response = await $fetch(pollUrl)

      // Paynow answers with a URL-encoded query string.
      let status = 'Pending'

      if (typeof response === 'string') {
        status = new URLSearchParams(response).get('status') || 'Pending'
      } else if (response && typeof response === 'object') {
        status = (response as any).status || (response as any).Status || 'Pending'
      }

      const outcome = await applyPaynowStatus(prisma, payment.id, payment.orderId, status)

      return {
        success: true,
        status,
        settled: outcome !== 'PENDING',
        paymentId: payment.id,
        orderId: payment.orderId,
      }
    } catch (pollError) {
      console.error('Error polling Paynow:', pollError)

      // Report the last known state rather than guessing; the caller will poll again.
      return {
        success: true,
        status: payment.paynowStatusMsg || 'Pending',
        settled: false,
        paymentId: payment.id,
        orderId: payment.orderId,
      }
    }
  } catch (error: any) {
    console.error('Error checking payment status:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check payment status',
    })
  }
})
