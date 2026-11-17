import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { sendDonationConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ngoId, paymentMethod } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing mandatory payment verification fields' }, { status: 400 });
    }

    // Verify cryptographic signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error(`Invalid signature for order ${razorpay_order_id}`);
      await db.updateDonationPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, 'failed');
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Mark successful in database
    const donation = await db.updateDonationPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      'captured',
      paymentMethod || 'Online'
    );

    if (!donation) {
      return NextResponse.json({ error: 'Donation record not found for this order ID' }, { status: 404 });
    }

    // Trigger confirmation email
    const ngo = await db.getNgoById(ngoId || donation.ngo_id);
    if (ngo) {
      try {
        await sendDonationConfirmationEmail(ngo, donation);
      } catch (e) {
        console.warn('Failed to send email:', e);
      }
    }

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      receiptNumber: donation.receipt_number,
      amount: donation.amount,
      paidAt: donation.paid_at,
    });
  } catch (error: any) {
    console.error('Error verifying donation:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
