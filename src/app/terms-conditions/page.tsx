import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UnconfiguredDomainScreen from '@/components/UnconfiguredDomainScreen';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams: { ngo?: string };
}

export default async function TermsConditionsPage({ searchParams }: PageProps) {
  const ngoSlug = searchParams?.ngo;
  const siteData = await getNgoFullSiteData(ngoSlug);

  if (!siteData) {
    return <UnconfiguredDomainScreen />;
  }

  const { ngo, settings } = siteData;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white">
      <Navbar ngo={ngo} />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#E8E5DE] pb-8 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              Terms of Use
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172B4D] mt-3 font-heading">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Website & Platform Agreement • {ngo.legal_name}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
            <p>
              Welcome to the official web portal of <strong>{ngo.legal_name}</strong>. By accessing or using this website, you confirm your acceptance of these Terms and Conditions.
            </p>

            <h3 className="text-lg font-bold text-slate-900">1. Governance and Registration</h3>
            <p>
              The Crawl Foundation operates as a registered Charitable Trust under the Indian Trusts Act (Registration Deed No. 878 / 2023, Book 4, registered with Sub-Registrar IV, Dehradun, Uttarakhand). The Trust holds provisional registration under Section 12A and provisional approval under Section 80G for Assessment Years AY 2026-27 to AY 2028-29.
            </p>

            <h3 className="text-lg font-bold text-slate-900">2. Intellectual Property and Brand Integrity</h3>
            <p>
              The original circular embrace logo, photographic assets, project documentation, and text are protected assets of {ngo.legal_name}. Unauthorized duplication or commercial misrepresentation is strictly prohibited.
            </p>

            <h3 className="text-lg font-bold text-slate-900">3. Lawful and Charitable Usage</h3>
            <p>
              Visitors agree to utilize this website exclusively for lawful informational, voluntary engagement, and charitable donation purposes. Any malicious probing, penetration attempts, automated abuse, or fake transaction submissions will be subject to appropriate legal action.
            </p>

            <h3 className="text-lg font-bold text-slate-900">4. Jurisdiction</h3>
            <p>
              All disputes, legal matters, or interpretations arising under these terms shall fall under the exclusive jurisdiction of the competent courts in Dehradun, Uttarakhand, India.
            </p>
          </div>
        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
