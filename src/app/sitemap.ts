import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://thecrawlfoundation.org';
  const lastModified = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/activities',
    '/gallery',
    '/donate',
    '/contact',
    '/privacy-policy',
    '/refund-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/donate' ? 0.9 : 0.8,
  }));

  // Add dynamic published activities
  try {
    const ngos = await db.getAllNgos();
    const primaryNgo = ngos[0];
    if (primaryNgo) {
      const activities = await db.getActivities(primaryNgo.id);
      const activityRoutes = activities
        .filter((a) => a.is_published)
        .map((a) => ({
          url: `${baseUrl}/activities?id=${a.id}`,
          lastModified: new Date(a.activity_date || lastModified),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      return [...staticRoutes, ...activityRoutes];
    }
  } catch (e) {
    // Return base routes if DB unavailable during build
  }

  return staticRoutes;
}
