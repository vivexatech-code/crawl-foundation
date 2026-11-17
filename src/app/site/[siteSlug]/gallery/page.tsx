import React from 'react';
import GalleryView from '@/components/GalleryView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

interface PageProps {
  params: { siteSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(params.siteSlug);
  if (!siteData) return { title: 'Photo Gallery' };
  return {
    title: `On-Ground Activity Gallery | ${siteData.ngo.name}`,
    description: `Photographic documentation of charitable programs and field drives conducted by ${siteData.ngo.name}.`,
  };
}

export default async function NgoGalleryPage({ params }: PageProps) {
  const siteData = await getNgoFullSiteData(params.siteSlug);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, gallery } = siteData;

  return <GalleryView ngo={ngo} settings={settings} gallery={gallery} />;
}
