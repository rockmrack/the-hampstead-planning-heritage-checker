/**
 * Street Database for NW London
 * Contains metadata for major streets in premium postcodes
 */

export interface StreetDefinition {
  id: string;
  name: string;
  slug: string;
  postcode: string;
  borough: string;
  conservationArea?: string;
  description?: string;
  averageValue?: number;
}

export const STREETS: StreetDefinition[] = [
  // NW3 - Hampstead
  {
    id: 'nw3-heath-street',
    name: 'Heath Street',
    slug: 'heath-street-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Historic high street running through the heart of Hampstead Village.',
    averageValue: 2500000
  },
  {
    id: 'nw3-high-street',
    name: 'Hampstead High Street',
    slug: 'hampstead-high-street-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'The main commercial hub of Hampstead with many listed buildings.',
    averageValue: 3000000
  },
  {
    id: 'nw3-church-row',
    name: 'Church Row',
    slug: 'church-row-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'One of the finest Georgian streets in London.',
    averageValue: 5000000
  },
  {
    id: 'nw3-flask-walk',
    name: 'Flask Walk',
    slug: 'flask-walk-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Charming pedestrian street with boutiques and historic cottages.',
    averageValue: 1800000
  },
  {
    id: 'nw3-well-walk',
    name: 'Well Walk',
    slug: 'well-walk-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Famous for the Chalybeate Well and historic residents like John Keats.',
    averageValue: 3500000
  },
  {
    id: 'nw3-downshire-hill',
    name: 'Downshire Hill',
    slug: 'downshire-hill-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Regency architecture connecting the village to the Heath.',
    averageValue: 4000000
  },
  {
    id: 'nw3-keats-grove',
    name: 'Keats Grove',
    slug: 'keats-grove-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Home to Keats House and elegant villas.',
    averageValue: 3800000
  },
  {
    id: 'nw3-frognal',
    name: 'Frognal',
    slug: 'frognal-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Winding road with grand Victorian and Edwardian houses.',
    averageValue: 4500000
  },
  {
    id: 'nw3-fitzjohns-avenue',
    name: 'Fitzjohns Avenue',
    slug: 'fitzjohns-avenue-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Fitzjohns/Netherhall',
    description: 'Grand tree-lined avenue with substantial Victorian villas.',
    averageValue: 6000000
  },
  {
    id: 'nw3-belsize-park-gardens',
    name: 'Belsize Park Gardens',
    slug: 'belsize-park-gardens-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'Wide avenue with white stucco-fronted architecture.',
    averageValue: 2200000
  },

  // N6 - Highgate
  {
    id: 'n6-highgate-high-street',
    name: 'Highgate High Street',
    slug: 'highgate-high-street-n6',
    postcode: 'N6',
    borough: 'Haringey', // Border with Camden
    conservationArea: 'Highgate',
    description: 'Historic hilltop village center.',
    averageValue: 1500000
  },
  {
    id: 'n6-the-grove',
    name: 'The Grove',
    slug: 'the-grove-n6',
    postcode: 'N6',
    borough: 'Camden',
    conservationArea: 'Highgate',
    description: 'One of the most exclusive streets in Highgate.',
    averageValue: 8000000
  },
  {
    id: 'n6-south-grove',
    name: 'South Grove',
    slug: 'south-grove-n6',
    postcode: 'N6',
    borough: 'Camden',
    conservationArea: 'Highgate',
    description: 'Overlooking Pond Square and the village.',
    averageValue: 3000000
  },
  {
    id: 'n6-north-road',
    name: 'North Road',
    slug: 'north-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'Leading to Highgate School and the golf course.',
    averageValue: 2800000
  },
  {
    id: 'n6-shepherds-hill',
    name: 'Shepherds Hill',
    slug: 'shepherds-hill-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'Residential street with views over London.',
    averageValue: 1800000
  },

  // NW8 - St John's Wood
  {
    id: 'nw8-abbey-road',
    name: 'Abbey Road',
    slug: 'abbey-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: "St John's Wood",
    description: 'World famous street known for the Beatles crossing and studios.',
    averageValue: 1500000
  },
  {
    id: 'nw8-wellington-road',
    name: 'Wellington Road',
    slug: 'wellington-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: "St John's Wood",
    description: 'Prestigious road near Lord\'s Cricket Ground.',
    averageValue: 2500000
  },
  {
    id: 'nw8-avenue-road',
    name: 'Avenue Road',
    slug: 'avenue-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: "St John's Wood",
    description: 'One of London\'s most expensive streets with large detached mansions.',
    averageValue: 15000000
  },
  {
    id: 'nw8-circus-road',
    name: 'Circus Road',
    slug: 'circus-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: "St John's Wood",
    description: 'Central St John\'s Wood location.',
    averageValue: 3000000
  },

  // NW1 - Primrose Hill / Regent's Park
  {
    id: 'nw1-regents-park-road',
    name: 'Regents Park Road',
    slug: 'regents-park-road-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Primrose Hill',
    description: 'The vibrant heart of Primrose Hill with cafes and shops.',
    averageValue: 2000000
  },
  {
    id: 'nw1-chalcot-square',
    name: 'Chalcot Square',
    slug: 'chalcot-square-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Primrose Hill',
    description: 'Iconic pastel-colored Italianate houses.',
    averageValue: 4000000
  },
  {
    id: 'nw1-gloucester-avenue',
    name: 'Gloucester Avenue',
    slug: 'gloucester-avenue-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Primrose Hill',
    description: 'Elegant Victorian terraces near the canal.',
    averageValue: 2500000
  },

  // N2 - East Finchley / Bishops Avenue
  {
    id: 'n2-the-bishops-avenue',
    name: 'The Bishops Avenue',
    slug: 'the-bishops-avenue-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Known as "Billionaires\' Row".',
    averageValue: 10000000
  },
  {
    id: 'n2-lyttelton-road',
    name: 'Lyttelton Road',
    slug: 'lyttelton-road-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Part of the market place area of the suburb.',
    averageValue: 1500000
  },

  // NW11 - Hampstead Garden Suburb
  {
    id: 'nw11-central-square',
    name: 'Central Square',
    slug: 'central-square-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'The architectural centerpiece of the suburb designed by Lutyens.',
    averageValue: 2500000
  },
  {
    id: 'nw11-hampstead-way',
    name: 'Hampstead Way',
    slug: 'hampstead-way-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Curving road defining the boundary of the suburb.',
    averageValue: 2000000
  },

  // N10 - Muswell Hill
  {
    id: 'n10-muswell-hill-broadway',
    name: 'Muswell Hill Broadway',
    slug: 'muswell-hill-broadway-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'Edwardian shopping parade.',
    averageValue: 800000
  },
  {
    id: 'n10-dukes-avenue',
    name: 'Dukes Avenue',
    slug: 'dukes-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'Wide avenue with substantial Edwardian houses.',
    averageValue: 1800000
  },

  // N8 - Crouch End
  {
    id: 'n8-the-broadway',
    name: 'The Broadway',
    slug: 'the-broadway-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'The clock tower and center of Crouch End.',
    averageValue: 700000
  },
  {
    id: 'n8-cecile-park',
    name: 'Cecile Park',
    slug: 'cecile-park-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'Tree-lined street with red-brick Edwardian houses.',
    averageValue: 1600000
  },

  // NW6 - West Hampstead
  {
    id: 'nw6-west-end-lane',
    name: 'West End Lane',
    slug: 'west-end-lane-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'West Hampstead',
    description: 'The bustling high street of West Hampstead.',
    averageValue: 900000
  },
  {
    id: 'nw6-aberdaire-gardens',
    name: 'Aberdare Gardens',
    slug: 'aberdare-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'Part of the "Greek Roads" with large red-brick Victorian houses.',
    averageValue: 2500000
  }
];

export function getStreetBySlug(slug: string): StreetDefinition | undefined {
  return STREETS.find(s => s.slug === slug);
}

export function getStreetsByPostcode(postcode: string): StreetDefinition[] {
  return STREETS.filter(s => s.postcode === postcode);
}

export function getAllStreetSlugs(): string[] {
  return STREETS.map(s => s.slug);
}
