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

/**
 * Resolve NGO by its permanent, unique website slug.
 * Inactive or soft-deleted organizations return null.
 */
export async function resolveCurrentNgo(siteSlug?: string): Promise<NGO | null> {
  const slug = (siteSlug || '').trim().toLowerCase();
  if (!slug) return null;

  const ngo = await db.getNgoBySlug(slug);
  if (!ngo || ngo.deleted_at || ngo.status !== 'active') {
    return null;
  }

  return ngo;
}

/**
 * Fetch full published website content and settings for the given website slug.
 */
export async function getNgoFullSiteData(siteSlug?: string): Promise<NgoSiteData | null> {
  const ngo = await resolveCurrentNgo(siteSlug);
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
    gallery,
  };
}
