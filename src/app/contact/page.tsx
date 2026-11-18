import React from 'react';
import ContactView from '@/components/ContactView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'Contact Us' };
  return {
    title: `Contact Us | ${siteData.ngo.name}`,
    description: `Connect with ${siteData.ngo.name}. Volunteer, partner, or reach our secretariat.`,
  };
}

export default async function RootContactPage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings } = siteData;

  return <ContactView ngo={ngo} settings={settings} />;
}
