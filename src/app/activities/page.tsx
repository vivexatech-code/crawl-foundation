import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OurWorkSection from '@/components/OurWorkSection';
import DonationCTA from '@/components/DonationCTA';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'Our Work' };
  return {
    title: `Our Work & Initiatives | ${siteData.ngo.name}`,
    description: siteData.ngo.short_description,
  };
}

export default async function RootActivitiesPage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, homepage, activities } = siteData;

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

      <main className="flex-1">
        {/* Page Hero */}
        <div className="bg-[#F5F2EA] py-16 text-left border-b border-[#E8E5DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-white px-3 py-1 rounded-md border border-[#E8E5DE] shadow-subtle">
              Grassroots Action
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading leading-tight">
              Our Charitable Initiatives & Field Work
            </h1>
            <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
              Explore the programs and community drives executed by {ngo.name}, focusing on education, child nutrition, and healthcare access.
            </p>
          </div>
        </div>

        {/* Dynamic Initiatives Grid */}
        <OurWorkSection ngo={ngo} activities={activities} />

        {/* Donation CTA */}
        <DonationCTA ngo={ngo} content={homepage} />
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
