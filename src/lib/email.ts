import { Resend } from 'resend';
import { NGO, Donation, ContactSubmission } from '../types/database';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'donations@thecrawlfoundation.org';

export async function sendDonationConfirmationEmail(ngo: NGO, donation: Donation) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Supporting ${ngo.name}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, ${ngo.primary_color}, ${ngo.secondary_color}); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">${ngo.name}</h1>
          <p style="margin: 8px 0 0; opacity: 0.95; font-size: 14px;">Together, We Can Create a Better Tomorrow</p>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Thank You for Your Generous Contribution!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Dear <strong>${donation.is_anonymous ? 'Generous Supporter' : donation.donor_name}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            We gratefully acknowledge receipt of your donation to <strong>${ngo.name}</strong>. Your compassion enables us to sustain our educational and healthcare drives for children and families in need.
          </p>
          
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Receipt Number:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${donation.receipt_number}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Donation Amount:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right; color: ${ngo.primary_color}; font-size: 16px;">₹${donation.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Purpose:</td>
                <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">${donation.purpose_name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Transaction ID:</td>
                <td style="padding: 6px 0; font-family: monospace; text-align: right; color: #334155;">${donation.razorpay_payment_id || 'Captured Online'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Status:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #16a34a;">VERIFIED SUCCESSFUL</td>
              </tr>
            </table>
          </div>

          <div style="font-size: 12px; color: #64748b; border-left: 3px solid #cbd5e1; padding-left: 12px; margin-top: 24px;">
            <p style="margin: 0 0 6px;"><strong>Statutory Disclosure:</strong></p>
            <p style="margin: 0;">${ngo.name} is a registered Charitable Trust (Reg No. 878/2023, Dehradun). Provisional 12A URN: AAVFT8621RE20251 | Provisional 80G URN: AAVFT8621RF20251.</p>
          </div>

          <p style="font-size: 14px; color: #475569; margin-top: 32px;">
            With sincere gratitude,<br>
            <strong>Board of Trustees</strong><br>
            ${ngo.name}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: `${ngo.name} <${fromEmail}>`,
        to: [donation.donor_email],
        subject: `Donation Receipt #${donation.receipt_number} – ${ngo.name}`,
        html,
      });
      return true;
    } catch (err) {
      console.warn('Resend email error:', err);
      return false;
    }
  }

  console.log(`[SIMULATED EMAIL] Sent donation receipt ${donation.receipt_number} to ${donation.donor_email}`);
  return true;
}

export async function sendContactNotificationEmail(ngo: NGO, contact: ContactSubmission) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background: #f8fafc; padding: 20px;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: ${ngo.primary_color}; margin-top: 0;">New Contact Enquiry on ${ngo.name}</h2>
        <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
        <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
        <p style="font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${contact.message}</p>
      </div>
    </body>
    </html>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: `${ngo.name} Website <${fromEmail}>`,
        to: ['contact@thecrawlfoundation.org'],
        subject: `New Website Message: ${contact.subject}`,
        html,
      });
      return true;
    } catch (err) {
      console.warn('Resend email error:', err);
      return false;
    }
  }

  console.log(`[SIMULATED EMAIL] Admin notified of contact inquiry from ${contact.email}`);
  return true;
}
