import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  params: { siteSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(params.siteSlug);
  if (!siteData) return { title: 'Refund Policy' };
  return {
    title: `Refund & Cancellation Policy | ${siteData.ngo.name}`,
    description: `Refund and donation policies for ${siteData.ngo.name}.`,
  };
}

export default async function NgoRefundPolicyPage({ params }: PageProps) {
  const siteData = await getNgoFullSiteData(params.siteSlug);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings } = siteData;

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white"
      style={{
        // @ts-ignore
        '--ngo-primary': ngo.primary_color || '#087FC1',
        '--ngo-secondary': ngo.secondary_color || '#ea580c',
        '--ngo-accent': ngo.accent_color || '#10C9D4',
      }}
    >
      <Navbar ngo={ngo} />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#E8E5DE] pb-8 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] bg-[#F28C28]/10 px-3 py-1 rounded-md">
              Contribution Terms
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172B4D] mt-3 font-heading">
              Refund & Donation Cancellation Policy
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Statutory Transparency • {ngo.legal_name || ngo.name}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
            <p>
              As a registered charitable organization, <strong>{ngo.legal_name || ngo.name}</strong> relies on voluntary gifts and donations to execute social welfare, education, and healthcare initiatives on the ground.
            </p>

            <h3 className="text-lg font-bold text-slate-900">1. Nature of Charitable Contributions</h3>
            <p>
              Charitable donations are treated as unconditional voluntary contributions towards our approved public charitable objects. Once funds have been deployed into supplies, aid distribution, or field drives, refunds cannot typically be granted.
            </p>

            <h3 className="text-lg font-bold text-slate-900">2. Duplicate Transactions & Input Errors</h3>
            <p>
              We recognize that technical issues or input errors may occasionally occur during online payment gateway sessions. In cases where:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A donor encounters an accidental duplicate charge due to gateway timeouts.</li>
              <li>An inadvertent extra zero is keyed into the amount field.</li>
            </ul>
            <p>
              The donor may submit a written refund request within <strong>7 calendar days</strong> from the transaction timestamp, accompanied by the payment ID, bank statement excerpt, and official receipt number.
            </p>

            <h3 className="text-lg font-bold text-slate-900">3. Resolution & Processing Time</h3>
            <p>
              Verified refund claims will be processed through the original payment mode (UPI, card, or netbanking) within <strong>7 to 10 banking business days</strong> in compliance with standard Reserve Bank of India and gateway guidelines.
            </p>

            <h3 className="text-lg font-bold text-slate-900">4. Support Desk</h3>
            <p>
              For any payment issues, contact support at <strong>{settings.support_email || settings.email}</strong> or call <strong>{settings.phone}</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
