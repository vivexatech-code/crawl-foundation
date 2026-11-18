import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resolveCurrentNgo } from '@/lib/ngo-tenant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ngo = await resolveCurrentNgo();
    const targetNgoId = ngo?.id || body.ngo_id || 'c1a23b45-6789-4abc-def0-123456789abc';

    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      donor_pan,
      purpose_id,
      purpose_name,
      payment_method,
      transaction_ref,
      requires_80g,
      is_anonymous,
      notes
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid contribution amount is required' }, { status: 400 });
    }

    if (!is_anonymous && !donor_name?.trim()) {
      return NextResponse.json({ error: 'Donor name is required unless donating anonymously' }, { status: 400 });
    }

    if (requires_80g && !donor_pan?.trim()) {
      return NextResponse.json({ error: 'PAN is required for claiming Section 80G tax deductions' }, { status: 400 });
    }

    // Generate unique internal receipt reference
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const receiptNum = `TCF-DIR-${currentYear}-${randomSuffix}`;

    const newDonation = await db.createDonation({
      ngo_id: targetNgoId,
      receipt_number: receiptNum,
      donor_name: is_anonymous ? 'Anonymous Supporter' : (donor_name?.trim() || 'Anonymous Supporter'),
      donor_email: donor_email?.trim() || '',
      donor_phone: donor_phone?.trim() || '',
      donor_pan_masked: donor_pan?.trim() ? `${donor_pan.slice(0, 2)}XXXX${donor_pan.slice(-2)}`.toUpperCase() : '',
      is_anonymous: Boolean(is_anonymous),
      amount: Number(amount),
      currency: 'INR',
      purpose_id: purpose_id || undefined,
      purpose_name: purpose_name || 'General Support',
      requires_80g: Boolean(requires_80g),
      transaction_ref: transaction_ref?.trim() || 'Direct Transfer Reported',
      payment_status: 'unverified', // Strictly unverified until accountant manually checks bank records
      payment_method: payment_method || 'Direct Bank/UPI',
      notes: notes?.trim() || 'Direct donor declaration via website donation form.',
    });

    return NextResponse.json({
      success: true,
      donationId: newDonation.id,
      receiptNumber: newDonation.receipt_number,
      message: 'Donation transfer details received. Our accounts team will reconcile with bank records and issue your official Section 80G receipt.'
    });
  } catch (err: any) {
    console.error('Error in /api/donations/record:', err);
    return NextResponse.json({ error: 'Failed to record donation details', details: err.message }, { status: 500 });
  }
}
