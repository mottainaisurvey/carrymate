import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2026-06-24.dahlia' as any,
})

/**
 * Create a PaymentIntent with manual capture (holds funds without charging).
 * Returns the PaymentIntent so the client can confirm it with the card details.
 */
export async function createEscrowPaymentIntent({
  amountPence,
  currency = 'gbp',
  parcelId,
  bookingId,
  senderId,
  travelerId,
}: {
  amountPence: number
  currency?: string
  parcelId: string
  bookingId: string
  senderId: string
  travelerId: string
}) {
  return stripe.paymentIntents.create({
    amount: amountPence,
    currency,
    capture_method: 'manual',
    metadata: { parcelId, bookingId, senderId, travelerId },
  })
}

/**
 * Capture a previously authorised PaymentIntent (release funds from hold).
 */
export async function capturePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId)
}

/**
 * Transfer traveler payout to their connected Stripe account.
 */
export async function transferToTraveler({
  amountPence,
  currency = 'gbp',
  destination,
  parcelId,
}: {
  amountPence: number
  currency?: string
  destination: string
  parcelId: string
}) {
  return stripe.transfers.create({
    amount: amountPence,
    currency,
    destination,
    transfer_group: parcelId,
  })
}

/**
 * Refund a PaymentIntent (full or partial).
 */
export async function refundPaymentIntent(paymentIntentId: string, amountPence?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountPence ? { amount: amountPence } : {}),
  })
}

/**
 * Verify and parse a Stripe webhook event from raw body + signature header.
 */
export function constructStripeEvent(rawBody: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_placeholder'
  )
}
