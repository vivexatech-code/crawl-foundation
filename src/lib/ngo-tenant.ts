import { headers } from 'next/headers';
import { db } from './db';
import { NGO, SiteSettings, HomepageContent, Activity, TeamMember, GalleryItem, DonationPurpose, DonationPaymentSettings } from '../types/database';

export interface NgoSiteData {
  ngo: NGO;
  settings: SiteSettings;
  paymentSettings: DonationPaymentSettings;
  homepage: HomepageContent;
  purposes: DonationPurpose[];
  activities: Activity[];
  team: TeamMember[];
  gallery: GalleryItem[];
}

/**
 * Extract and normalize incoming host from Next.js request headers.
 */
export function getIncomingHost(): string {
  try {
    const headersList = headers();
    const hostHeader = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    return hostHeader.split(':')[0].toLowerCase().trim().replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

/**
 * Resolve NGO by incoming domain or fallback identifier.
 * Inactive or soft-deleted organizations return null.
 */
export async function resolveCurrentNgo(explicitDomainOrSlug?: string): Promise<NGO | null> {
  const host = (explicitDomainOrSlug || getIncomingHost() || '').trim().toLowerCase();

  if (host) {
    // 1. Match by domain mapping
    const ngoByDomain = await db.getNgoByDomain(host);
    if (ngoByDomain) return ngoByDomain;

    // 2. Match by slug as internal fallback
    const ngoBySlug = await db.getNgoBySlug(host);
    if (ngoBySlug && !ngoBySlug.deleted_at && ngoBySlug.status === 'active') {
      return ngoBySlug;
    }
  }

  // 3. Fallback for localhost in local development
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_NGO_SLUG || 'the-crawl-foundation';
    return await db.getNgoBySlug(defaultSlug);
  }

  return null;
}

/**
 * Fetch full published website content and settings for the resolved NGO.
 */
export async function getNgoFullSiteData(explicitDomainOrSlug?: string): Promise<NgoSiteData | null> {
  const ngo = await resolveCurrentNgo(explicitDomainOrSlug);
  if (!ngo) return null;

  const [settings, paymentSettings, homepage, purposes, activities, team, gallery] = await Promise.all([
    db.getSiteSettings(ngo.id),
    db.getPaymentSettings(ngo.id),
    db.getHomepageContent(ngo.id),
    db.getDonationPurposes(ngo.id),
    db.getActivities(ngo.id),
    db.getTeamMembers(ngo.id),
    db.getGalleryItems(ngo.id, { publishedOnly: true }),
  ]);

  return {
    ngo,
    settings,
    paymentSettings,
    homepage,
    purposes,
    activities,
    team,
    gallery,
  };
}
