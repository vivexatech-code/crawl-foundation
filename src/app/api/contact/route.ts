import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendContactNotificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ngoId, name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const contact = await db.createContactSubmission({
      ngo_id: ngoId,
      name,
      email,
      phone: phone || '',
      subject: subject || 'Website Enquiry',
      message,
    });

    const ngo = await db.getNgoById(ngoId);
    if (ngo) {
      try {
        await sendContactNotificationEmail(ngo, contact);
      } catch (e) {
        console.warn('Failed to send contact notification email:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      id: contact.id,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit contact enquiry' }, { status: 500 });
  }
}
