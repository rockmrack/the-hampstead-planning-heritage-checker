/**
 * Sitemap Generator
 * Dynamic sitemap for SEO
 */

import { MetadataRoute } from 'next';
import { getAllStreetSlugs } from '@/lib/data/streets';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hampsteadplanning.co.uk';

// All conservation areas in NW London
const CONSERVATION_AREAS = [
  'hampstead-village', 'hampstead-garden-suburb', 'highgate', 'muswell-hill',
  'holly-lodge', 'south-hill-park', 'crouch-end', 'belsize-park', 'primrose-hill',
  'parliament-hill', 'fitzjohns-redington', 'west-heath-road', 'church-row',
  'frognal', 'kenwood', 'the-bishops-avenue', 'dartmouth-park', 'tufnell-park',
  'archway', 'hornsey-lane', 'queen-annes-grove', 'st-johns-wood', 'wellington-road',
  'swiss-cottage', 'finchley-garden-village', 'mill-hill', 'totteridge', 'whetstone',
  'woodside-park', 'east-finchley', 'fortis-green', 'alexandra-palace',
  'hornsey-high-street', 'stroud-green', 'bowes-park', 'palmers-green',
  'southgate-circus', 'winchmore-hill',
];

// All NW London areas
const AREAS = [
  'hampstead', 'highgate', 'muswell-hill', 'crouch-end', 'hampstead-garden-suburb',
  'belsize-park', 'primrose-hill', 'golders-green', 'swiss-cottage', 'finchley',
  'mill-hill', 'totteridge', 'barnet', 'east-finchley', 'fortis-green', 'hornsey',
  'archway', 'tufnell-park', 'kentish-town', 'gospel-oak', 'parliament-hill',
  'st-johns-wood', 'maida-vale', 'kilburn', 'west-hampstead', 'cricklewood',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ask`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/can-i`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/builders`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/views`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/neighbors`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/officers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/street-history`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/conservation-areas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Conservation area pages
  const conservationPages: MetadataRoute.Sitemap = CONSERVATION_AREAS.map((area) => ({
    url: `${BASE_URL}/conservation-areas/${area}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Area intelligence pages
  const areaPages: MetadataRoute.Sitemap = AREAS.map((area) => ({
    url: `${BASE_URL}/areas/${area}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Street pages
  const streetPages: MetadataRoute.Sitemap = getAllStreetSlugs().map((slug) => ({
    url: `${BASE_URL}/street/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...mainPages, ...conservationPages, ...areaPages, ...streetPages];
}
