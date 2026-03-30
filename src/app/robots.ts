import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/pipeline',
          '/contacts',
          '/estimates',
          '/invoices',
          '/schedule',
          '/settings',
          '/setup',
          '/activity',
          '/advisor',
          '/automations',
          '/messages',
          '/notifications',
          '/leads',
          '/templates',
          '/reports',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://growth-os-three-pied.vercel.app/sitemap.xml',
  };
}
