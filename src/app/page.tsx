import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustTransparencyBanner from '@/components/TrustTransparencyBanner';
import MissionVisionSection from '@/components/MissionVisionSection';
import OurWorkSection from '@/components/OurWorkSection';
import ImpactSection from '@/components/ImpactSection';
import DonationCTA from '@/components/DonationCTA';
import GalleryPreview from '@/components/GalleryPreview';
import LeadershipSection from '@/components/LeadershipSection';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) {
    return { title: 'Organization Not Found' };
  }
  const { ngo } = siteData;
  return {
    title: `${ngo.name} | ${ngo.tagline}`,
    description: ngo.short_description,
    icons: {
      icon: ngo.favicon_url || ngo.logo_url || '/favicon.ico',
    },
    openGraph: {
      title: `${ngo.name} – Small Acts. Greater Impact.`,
      description: ngo.short_description,
    }
  };
}

export default async function RootHomePage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, homepage, activities, team, gallery } = siteData;

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32]"
      style={{
        // @ts-ignore
        '--ngo-primary': ngo.primary_color || '#087FC1',
        '--ngo-secondary': ngo.secondary_color || '#ea580c',
        '--ngo-accent': ngo.accent_color || '#10C9D4',
      }}
    >
      <Navbar ngo={ngo} />
      <main className="flex-1">
        <HeroSection ngo={ngo} content={homepage} />
        <TrustTransparencyBanner settings={settings} />
        <MissionVisionSection content={homepage} />
        <OurWorkSection ngo={ngo} activities={activities} />
        <ImpactSection content={homepage} />
        <DonationCTA ngo={ngo} content={homepage} />
        <GalleryPreview ngo={ngo} items={gallery} />
        <LeadershipSection ngo={ngo} team={team} />
      </main>
      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
