import crypto from 'crypto';
import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export const isLiveKeysConfigured = Boolean(
  keyId && 
  keySecret && 
  !keyId.includes('xxxx') && 
  !keySecret.includes('xxxx') &&
  keyId !== 'rzp_test_placeholder'
);

let razorpayClient: Razorpay | null = null;
if (isLiveKeysConfigured) {
  try {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (e) {
    console.warn('Failed to initialize Razorpay client:', e);
  }
}

export interface CreateOrderParams {
  amount: number; // in INR
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes }: CreateOrderParams) {
  const amountInPaise = Math.round(amount * 100);

  if (razorpayClient) {
    try {
      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
      });
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        isSimulation: false,
      };
    } catch (err: any) {
      console.warn('Razorpay live order call failed, operating in test sandbox mode:', err.message || err);
    }
  }

  // Resilient Test Sandbox Simulation Mode
  const simulatedOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  return {
    orderId: simulatedOrderId,
    amount: amountInPaise,
    currency,
    keyId: isLiveKeysConfigured ? keyId : 'rzp_test_sandbox',
    isSimulation: true,
  };
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;

  // Sandbox simulation mode verification
  if (!isLiveKeysConfigured && signature.startsWith('sim_sig_')) {
    return true;
  }

  if (keySecret && !keySecret.includes('xxxx')) {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  }

  return false;
}

export function verifyWebhookSignature({
  payload,
  signature,
}: {
  payload: string;
  signature: string;
}): boolean {
  if (!signature || !webhookSecret || webhookSecret.includes('xxxx')) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}
