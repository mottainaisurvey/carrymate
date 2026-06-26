/**
 * Paystack integration for NGN/GHS payments.
 * Uses the REST API directly via axios to avoid CJS/ESM issues with paystack-node.
 */
import axios from 'axios'
import crypto from 'crypto'

const PAYSTACK_BASE = 'https://api.paystack.co'

function paystackHeaders() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY ?? 'sk_test_placeholder'}`,
    'Content-Type': 'application/json',
  }
}

export interface PaystackInitResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

/**
 * Initialise a Paystack transaction (returns redirect URL for the sender).
 */
export async function initializePaystackTransaction({
  amountKobo,
  email,
  currency = 'NGN',
  parcelId,
  bookingId,
  senderId,
  travelerId,
  callbackUrl,
}: {
  amountKobo: number
  email: string
  currency?: 'NGN' | 'GHS'
  parcelId: string
  bookingId: string
  senderId: string
  travelerId: string
  callbackUrl: string
}): Promise<PaystackInitResponse> {
  const { data } = await axios.post<PaystackInitResponse>(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      amount: amountKobo,
      email,
      currency,
      metadata: { parcelId, bookingId, senderId, travelerId },
      callback_url: callbackUrl,
    },
    { headers: paystackHeaders() }
  )
  return data
}

/**
 * Verify a Paystack transaction by reference.
 */
export async function verifyPaystackTransaction(reference: string) {
  const { data } = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: paystackHeaders() }
  )
  return data
}

/**
 * Validate a Paystack webhook signature.
 */
export function validatePaystackSignature(rawBody: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY ?? '')
    .update(rawBody)
    .digest('hex')
  return hash === signature
}
