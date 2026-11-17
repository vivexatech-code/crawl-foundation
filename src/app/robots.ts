import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://thecrawlfoundation.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/donation-success'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
