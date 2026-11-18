'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck,
  Phone,
  Mail,
  HeartHandshake
} from 'lucide-react';
import { NGO, SiteSettings } from '@/types/database';

function DonationSuccessInner() {
  const searchParams = useSearchParams();
  const receiptParam = searchParams.get('receipt') || searchParams.get('id');

  const [siteData, setSiteData] = useState<{ ngo: NGO; settings: SiteSettings } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/site-data');
        if (res.ok) {
          const json = await res.json();
          setSiteData(json);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const ngoName = siteData?.ngo?.name || 'The Crawl Foundation';
  const settings = siteData?.settings;

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E8E5DE] shadow-warm p-8 sm:p-10 space-y-6 text-center">
        
        {/* Badge */}
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-[#087FC1] flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172B4D] tracking-tight font-heading">
            Thank You for Your Support
          </h1>
          <p className="text-sm text-[#73777D] mt-2 leading-relaxed font-body">
            Your generous direct contribution empowers vital healthcare, child education, and relief drives led by <strong>{ngoName}</strong>.
          </p>
        </div>

        {receiptParam && (
          <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E8E5DE] text-left text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#73777D] font-semibold uppercase tracking-wider text-[10px]">Reference / Submission ID:</span>
              <span className="font-mono font-bold text-[#172B4D]">{receiptParam}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#73777D] font-semibold uppercase tracking-wider text-[10px]">Status:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Direct Transfer Logged (Reconciliation Pending)
              </span>
            </div>
          </div>
        )}

        {/* Informational Transparency Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#172B4D]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Section 80G Receipt Issuance Policy</span>
          </div>
          <p className="text-xs text-[#73777D] leading-relaxed font-body">
            Direct donations made through Bank Transfer (NEFT/RTGS/IMPS) or UPI are reconciled manually by our trust accounting team against official bank statements. Official Section 80G tax certificates will be emailed directly to your registered address upon ledger reconciliation.
          </p>
        </div>

        {/* Trust Contacts */}
        {settings && (
          <div className="pt-4 border-t border-[#E8E5DE] text-xs text-[#73777D] space-y-2">
            <div className="font-bold text-[#172B4D]">Questions regarding your contribution?</div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#172B4D]">
              {settings.email && (
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#087FC1]" />
                  <span>{settings.email}</span>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#087FC1]" />
                  <span>{settings.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Return Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center space-x-2 h-[48px] rounded-xl text-xs font-bold bg-[#087FC1] hover:bg-[#076ea7] text-white shadow-subtle transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-[#087FC1] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DonationSuccessInner />
    </Suspense>
  );
}
