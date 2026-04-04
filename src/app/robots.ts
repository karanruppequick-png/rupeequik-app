import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/dsa/', '/api/', '/verify-otp/', '/success/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/dsa/', '/api/', '/verify-otp/', '/success/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
