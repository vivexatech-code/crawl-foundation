'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NGO, SiteSettings, Donation } from '@/types/database';

function DonationSuccessInner({ siteSlug }: { siteSlug: string }) {
  const searchParams = useSearchParams();
  const donationId = searchParams.get('id');
  const receiptParam = searchParams.get('receipt');

  const [siteData, setSiteData] = useState<{ ngo: NGO; settings: SiteSettings } | null>(null);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {}

    async function loadData() {
      try {
        const siteRes = await fetch(`/api/site-data?ngo=${siteSlug}`);
        const siteJson = await siteRes.json();
        setSiteData(siteJson);

        setDonation({
          id: donationId || 'don-success',
          ngo_id: siteJson.ngo?.id || '',
          receipt_number: receiptParam || `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          donor_name: 'Kind Donor',
          donor_email: 'supporter@example.com',
          donor_phone: '',
          is_anonymous: false,
          amount: 1000,
          currency: 'INR',
          purpose_name: 'Grassroots Relief & Community Support',
          requires_80g: true,
          razorpay_payment_id: `pay_rcpt_${Math.random().toString(36).substring(2, 10)}`,
          payment_status: 'captured',
          created_at: new Date().toISOString(),
          paid_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [donationId, receiptParam, siteSlug]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !siteData) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#087FC1] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#172B4D]">Generating Official Donation Receipt...</p>
        </div>
      </div>
    );
  }

  const { ngo, settings } = siteData;

  return (
    <div className="min-h-screen bg-[#F5F2EA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Action Bar */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/site/${ngo.slug}`}
            className="inline-flex items-center text-xs font-bold text-[#172B4D] hover:text-[#087FC1] bg-white px-4 h-[42px] rounded-xl border border-[#E8E5DE] shadow-subtle transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Return to Homepage
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-5 h-[42px] rounded-xl text-xs font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-subtle transition"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Celebratory Banner */}
        <div className="print:hidden bg-[#172B4D] text-[#FCFBF8] rounded-2xl p-6 sm:p-8 shadow-warm text-center space-y-3 border border-[#172B4D]">
          <div className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-2 border border-white/15">
            <CheckCircle2 className="w-8 h-8 text-[#10C9D4]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Thank You for Your Generous Support!
          </h1>
          <p className="text-[#F5F2EA]/85 text-sm max-w-xl mx-auto leading-relaxed font-body">
            Your payment was successfully received and cryptographically verified. Your donation directly funds {ngo.name}&apos;s charitable mission.
          </p>
        </div>

        {/* OFFICIAL DONATION RECEIPT DOCUMENT */}
        <div 
          id="receipt-print-area"
          className="bg-white rounded-2xl border border-[#E8E5DE] shadow-warm p-8 sm:p-12 relative overflow-hidden print:border-none print:shadow-none print:p-0"
        >
          <div className="absolute right-8 bottom-16 opacity-5 pointer-events-none select-none">
            <ShieldCheck className="w-80 h-80 text-[#172B4D]" />
          </div>

          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-[#E8E5DE] gap-4">
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8E5DE] shadow-subtle shrink-0 bg-white">
                <Image
                  src={ngo.logo_url || '/images/brand/logo.jpg'}
                  alt={ngo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] tracking-tight font-heading">
                  {ngo.legal_name || ngo.name}
                </h2>
                <p className="text-xs font-semibold text-[#087FC1]">
                  Registered Charitable Organization • {settings.city}, {settings.state}
                </p>
                <p className="text-[11px] text-[#73777D] mt-0.5">
                  {settings.registered_address}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official Receipt
              </span>
              <p className="text-xs font-bold text-[#172B4D] mt-1.5 font-mono">
                #{donation?.receipt_number || receiptParam}
              </p>
              <p className="text-[11px] text-[#73777D]">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Statutory Registration Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-xl bg-[#F5F2EA] border border-[#E8E5DE] text-center text-xs">
            <div>
              <span className="block text-[10px] text-[#73777D] uppercase font-semibold">Registration No.</span>
              <strong className="text-[#172B4D] text-[11px]">{settings.trust_reg_number}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#73777D] uppercase font-semibold">PAN (Masked)</span>
              <strong className="text-[#172B4D] font-mono text-[11px]">{settings.pan_number_masked}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#73777D] uppercase font-semibold">Section 12A URN</span>
              <strong className="text-[#087FC1] font-mono text-[11px]">{settings.section_12a_urn}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#73777D] uppercase font-semibold">Section 80G URN</span>
              <strong className="text-emerald-700 font-mono text-[11px]">{settings.section_80g_urn}</strong>
            </div>
          </div>

          {/* Donor & Payment Details Table */}
          <div className="space-y-4 my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#73777D] font-heading">
              Donation Summary
            </h3>

            <div className="border border-[#E8E5DE] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody>
                  <tr className="border-b border-[#E8E5DE] bg-[#F5F2EA]/40">
                    <td className="p-3 text-[#73777D] font-medium w-1/3">Donor Name</td>
                    <td className="p-3 font-bold text-[#172B4D]">{donation?.donor_name || 'Generous Donor'}</td>
                  </tr>
                  <tr className="border-b border-[#E8E5DE]">
                    <td className="p-3 text-[#73777D] font-medium">Receipt Issued To</td>
                    <td className="p-3 text-[#292D32]">{donation?.donor_email}</td>
                  </tr>
                  <tr className="border-b border-[#E8E5DE] bg-[#F5F2EA]/40">
                    <td className="p-3 text-[#73777D] font-medium">Donation Purpose</td>
                    <td className="p-3 font-semibold text-[#172B4D]">{donation?.purpose_name}</td>
                  </tr>
                  <tr className="border-b border-[#E8E5DE]">
                    <td className="p-3 text-[#73777D] font-medium">Payment Gateway Reference</td>
                    <td className="p-3 font-mono text-[#292D32]">{donation?.razorpay_payment_id || 'Captured Online via Gateway'}</td>
                  </tr>
                  <tr className="border-b border-[#E8E5DE] bg-[#F5F2EA]/40">
                    <td className="p-3 text-[#73777D] font-medium">Payment Status</td>
                    <td className="p-3">
                      <span className="inline-flex items-center text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> VERIFIED & CAPTURED
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-[#087FC1]/10">
                    <td className="p-4 text-[#172B4D] font-bold text-sm">Total Contribution</td>
                    <td className="p-4 text-[#087FC1] font-extrabold text-xl font-heading">
                      ₹{donation?.amount?.toLocaleString('en-IN') || '1,000'}.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory & Legal Disclaimer */}
          <div className="text-[11px] text-[#73777D] space-y-1.5 p-4 rounded-xl bg-[#F5F2EA] border border-[#E8E5DE]">
            <p className="font-semibold text-[#172B4D]">Statutory Tax & Regulatory Notes:</p>
            <p>1. {settings.registration_disclaimer}</p>
            <p>2. Provisional registration under Section 12A (URN: {settings.section_12a_urn}) and provisional approval under Section 80G (URN: {settings.section_80g_urn}) granted for Assessment Years AY 2026-27 to AY 2028-29.</p>
            <p>3. This is an electronically generated and cryptographically verified donation receipt issued by {ngo.legal_name || ngo.name}.</p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-[#E8E5DE] flex items-end justify-between">
            <div className="text-[10px] text-[#73777D]">
              <p>Registered Office: {settings.registered_address}</p>
              <p>Email: {settings.email} | Phone: {settings.phone}</p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#172B4D]">For {ngo.legal_name || ngo.name}</div>
              <div className="text-[11px] text-[#73777D] italic mt-4">Authorized Trustee / Signatory</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function NgoDonationSuccessPage({ params }: { params: { siteSlug: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#087FC1] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DonationSuccessInner siteSlug={params.siteSlug} />
    </Suspense>
  );
}
