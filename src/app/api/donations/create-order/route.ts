import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ngoId, amount, donorName, donorEmail, donorPhone, donorPan, isAnonymous, purposeId, purposeName, requires80g } = body;

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Please enter a valid donation amount (minimum ₹10)' }, { status: 400 });
    }

    if (!donorEmail || !donorEmail.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required for donation receipt' }, { status: 400 });
    }

    const receiptNum = `TCF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create Razorpay Order
    const order = await createRazorpayOrder({
      amount: Number(amount),
      currency: 'INR',
      receipt: receiptNum,
      notes: {
        ngoId: ngoId || '',
        donorEmail: donorEmail || '',
        purpose: purposeName || 'General Donation'
      }
    });

    // Save initial record in database
    await db.createDonation({
      ngo_id: ngoId,
      receipt_number: receiptNum,
      donor_name: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Supporter'),
      donor_email: donorEmail,
      donor_phone: donorPhone || '',
      donor_pan_masked: donorPan ? donorPan.slice(0, 5) + '****' + donorPan.slice(-1) : undefined,
      is_anonymous: Boolean(isAnonymous),
      amount: Number(amount),
      currency: 'INR',
      purpose_id: purposeId,
      purpose_name: purposeName || 'General Support',
      requires_80g: Boolean(requires80g),
      razorpay_order_id: order.orderId,
      payment_status: 'created',
      notes: 'Order initiated online',
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      receiptNumber: receiptNum,
      isSimulation: order.isSimulation || false,
    });
  } catch (error: any) {
    console.error('Error creating donation order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}
