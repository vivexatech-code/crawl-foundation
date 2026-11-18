import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'Privacy Policy' };
  return {
    title: `Privacy Policy | ${siteData.ngo.name}`,
    description: `Official privacy policy and donor data protection commitments of ${siteData.ngo.name}.`,
  };
}

export default async function RootPrivacyPolicyPage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

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
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172B4D] mt-3 font-heading">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Statutory Transparency • {ngo.legal_name || ngo.name}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
            <p>
              At <strong>{ngo.legal_name || ngo.name}</strong>, we hold the privacy and trust of our donors, beneficiaries, and website visitors with the utmost gravity. This policy describes our protocols regarding data collection, storage, and processing.
            </p>

            <h3 className="text-lg font-bold text-slate-900">1. Information We Collect</h3>
            <p>
              When you make an online contribution or submit an enquiry via our platform, we collect information strictly necessary to execute the request:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Donor identification: Name, email address, and mobile number.</li>
              <li>Tax compliance: Permanent Account Number (PAN) strictly when 80G tax deduction receipts are requested by the donor.</li>
              <li>Communication preferences and records of volunteer inquiries.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900">2. Payment Security</h3>
            <p>
              All online transactions are processed through certified, PCI-DSS compliant payment gateways utilizing 256-bit Secure Sockets Layer (SSL) encryption. <strong>{ngo.name} never accesses, processes, or stores your credit card numbers, debit card numbers, CVVs, or online banking passwords.</strong>
            </p>

            <h3 className="text-lg font-bold text-slate-900">3. Purpose and Use of Data</h3>
            <p>
              Data collected is applied solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Issuing digital and printable donation receipts.</li>
              <li>Complying with statutory filings with the Income Tax Department under Sections 12A and 80G.</li>
              <li>Responding to volunteer and community requests.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900">4. Non-Disclosure Guarantee</h3>
            <p>
              We do not sell, rent, trade, or share your personal donor information with any commercial third-party marketing companies. Data is disclosed only when required by legitimate court orders or statutory government regulations.
            </p>

            <h3 className="text-lg font-bold text-slate-900">5. Contact Information</h3>
            <p>
              If you have inquiries concerning this policy or wish to review your records, contact our secretariat at:
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p><strong>{ngo.legal_name || ngo.name}</strong></p>
              <p>{settings.registered_address}</p>
              <p>Email: {settings.email} | Phone: {settings.phone}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
