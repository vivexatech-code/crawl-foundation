import React from 'react';
import GalleryView from '@/components/GalleryView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'Photo Gallery' };
  return {
    title: `On-Ground Activity Gallery | ${siteData.ngo.name}`,
    description: `Photographic documentation of charitable programs and field drives conducted by ${siteData.ngo.name}.`,
  };
}

export default async function RootGalleryPage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, gallery } = siteData;

  return <GalleryView ngo={ngo} settings={settings} gallery={gallery} />;
}
