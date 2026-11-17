import React from 'react';
import ContactView from '@/components/ContactView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  params: { siteSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(params.siteSlug);
  if (!siteData) return { title: 'Contact Us' };
  return {
    title: `Contact Us | ${siteData.ngo.name}`,
    description: `Connect with ${siteData.ngo.name}. Volunteer, partner, or reach our secretariat.`,
  };
}

export default async function NgoContactPage({ params }: PageProps) {
  const siteData = await getNgoFullSiteData(params.siteSlug);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings } = siteData;

  return <ContactView ngo={ngo} settings={settings} />;
}
