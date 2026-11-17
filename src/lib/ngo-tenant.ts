import { headers } from 'next/headers';
import { db } from './db';
import { NGO, SiteSettings, HomepageContent, Activity, TeamMember, GalleryItem, DonationPurpose } from '../types/database';

export interface NgoSiteData {
  ngo: NGO;
  settings: SiteSettings;
  homepage: HomepageContent;
  purposes: DonationPurpose[];
  activities: Activity[];
  team: TeamMember[];
  gallery: GalleryItem[];
}

export async function resolveCurrentNgo(querySlug?: string): Promise<NGO | null> {
  let host = '';
  try {
    const headersList = headers();
    host = headersList.get('host') || headersList.get('x-forwarded-host') || '';
  } catch (e) {
    // If called outside server request context
  }

  return await db.resolveDomainToNgo(host || 'localhost:3000', querySlug);
}

export async function getNgoFullSiteData(querySlug?: string): Promise<NgoSiteData | null> {
  const ngo = await resolveCurrentNgo(querySlug);
  if (!ngo) return null;

  const [settings, homepage, purposes, activities, team, gallery] = await Promise.all([
    db.getSiteSettings(ngo.id),
    db.getHomepageContent(ngo.id),
    db.getDonationPurposes(ngo.id),
    db.getActivities(ngo.id),
    db.getTeamMembers(ngo.id),
    db.getGalleryItems(ngo.id),
  ]);

  return {
    ngo,
    settings,
    homepage,
    purposes,
    activities,
    team,
    gallery
  };
}
