import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DonationForm from '@/components/DonationForm';
import TrustTransparencyBanner from '@/components/TrustTransparencyBanner';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';
import { ShieldCheck, HeartHandshake, FileCheck, CheckCircle2 } from 'lucide-react';

interface PageProps {
  searchParams?: { amount?: string; ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'Donate' };
  return {
    title: `Make a Donation | ${siteData.ngo.name}`,
    description: `Support grassroots initiatives and humanitarian programs led by ${siteData.ngo.name}.`,
  };
}

export default async function RootDonatePage({ searchParams }: PageProps) {
  const initialAmount = searchParams?.amount ? Number(searchParams.amount) : undefined;
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, purposes, paymentSettings } = siteData;

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FCFBF8] selection:bg-[#087FC1] selection:text-white"
      style={{
        // @ts-ignore
        '--ngo-primary': ngo.primary_color || '#087FC1',
        '--ngo-secondary': ngo.secondary_color || '#ea580c',
        '--ngo-accent': ngo.accent_color || '#10C9D4',
      }}
    >
      <Navbar ngo={ngo} />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-left max-w-3xl mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#F5F2EA] text-[#087FC1] border border-[#E8E5DE]">
              <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-[#087FC1]" /> Direct Field Support
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
              Support Grassroots Change
            </h1>
            <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
              Every contribution directly fuels educational drives, pediatric healthcare assistance, and essential relief for underserved communities led by {ngo.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Donation Form (8 Cols) */}
            <div className="lg:col-span-8">
              <DonationForm 
                ngo={ngo} 
                settings={settings} 
                paymentSettings={paymentSettings}
                purposes={purposes} 
                initialAmount={initialAmount} 
              />
            </div>

            {/* Trust & Transparency Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Trust Box */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8E5DE] shadow-subtle space-y-4">
                <div className="flex items-center space-x-3 text-[#172B4D]">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EA] flex items-center justify-center shrink-0 border border-[#E8E5DE]">
                    <ShieldCheck className="w-5 h-5 text-[#087FC1]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172B4D] font-heading">100% Tax Transparency</h3>
                    <p className="text-[11px] text-[#73777D]">Registered Trust Compliance</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#73777D] border-t border-[#E8E5DE] pt-3 font-body">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span><strong>Trust Deed:</strong> {settings.trust_reg_number}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span><strong>Section 12A URN:</strong> <span className="font-mono text-[#172B4D]">{settings.section_12a_urn}</span></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span><strong>Section 80G URN:</strong> <span className="font-mono text-[#172B4D]">{settings.section_80g_urn}</span></span>
                  </li>
                </ul>

                <div className="bg-[#F5F2EA] rounded-xl p-3 border border-[#E8E5DE] text-[11px] text-[#73777D] leading-relaxed">
                  <strong>Statutory Disclosure:</strong> Deductions under Section 80G are subject to the applicable rules and limits prescribed by the Income Tax Act, 1961.
                </div>
              </div>

              {/* Verified Impact Summary */}
              <div className="bg-[#172B4D] text-[#FCFBF8] rounded-2xl p-6 shadow-subtle space-y-4">
                <div className="flex items-center space-x-2 text-[#10C9D4] text-xs font-bold uppercase tracking-wider font-heading">
                  <FileCheck className="w-4 h-4 text-[#F5C518]" />
                  <span>Deployment Breakdown</span>
                </div>
                <div className="space-y-3 text-xs text-[#F5F2EA]/85 font-body">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Child Education & Books:</span>
                    <strong className="text-white">45%</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Healthcare & Medicine Aid:</span>
                    <strong className="text-white">35%</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Nutritional Relief & Warmth:</span>
                    <strong className="text-white">15%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations & Verification:</span>
                    <strong className="text-white">5%</strong>
                  </div>
                </div>
              </div>

              {/* Need Assistance */}
              <div className="bg-[#F5F2EA] rounded-2xl p-5 border border-[#E8E5DE] text-xs text-[#292D32]">
                <h4 className="font-bold text-[#172B4D] mb-1 font-heading">Need Direct Assistance?</h4>
                <p className="text-[#73777D] text-[11px] leading-relaxed font-body">
                  For bank wire transfers (NEFT/RTGS), CSR partnerships, or contribution queries, reach out directly:
                </p>
                <div className="mt-3 font-semibold text-[11px] space-y-1 text-[#172B4D]">
                  <div>Phone: {settings.phone}</div>
                  <div>Email: {settings.email}</div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-16">
            <TrustTransparencyBanner settings={settings} />
          </div>

        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
