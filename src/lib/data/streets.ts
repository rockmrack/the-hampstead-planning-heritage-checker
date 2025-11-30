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
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  },
  {
    id: 'nw3-arkwright-road',
    name: 'Arkwright Road',
    slug: 'arkwright-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'A prestigious residential street featuring grand Victorian detached houses and arts and crafts architecture.',
    averageValue: 3500000
  },
  {
    id: 'nw3-redington-road',
    name: 'Redington Road',
    slug: 'redington-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'One of Hampstead\'s most desirable streets, known for its large red-brick family homes and leafy character.',
    averageValue: 4200000
  },
  {
    id: 'nw3-templewood-avenue',
    name: 'Templewood Avenue',
    slug: 'templewood-avenue-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'An exclusive avenue with substantial detached mansions set in generous plots near the Heath.',
    averageValue: 5500000
  },
  {
    id: 'nw3-west-heath-road',
    name: 'West Heath Road',
    slug: 'west-heath-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Running along the edge of the Heath, this road features some of the most expensive gated mansions in the area.',
    averageValue: 6000000
  },
  {
    id: 'nw3-east-heath-road',
    name: 'East Heath Road',
    slug: 'east-heath-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Offers direct views of Hampstead Heath and contains a mix of historic houses and luxury apartments.',
    averageValue: 2800000
  },
  {
    id: 'nw3-gayton-road',
    name: 'Gayton Road',
    slug: 'gayton-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'A charming residential street in the heart of the village with attractive period terraced housing.',
    averageValue: 2200000
  },
  {
    id: 'nw3-willow-road',
    name: 'Willow Road',
    slug: 'willow-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'Famous for Ernő Goldfinger\'s modernist home and facing the Heath, a highly sought-after location.',
    averageValue: 3100000
  },
  {
    id: 'nw3-parliament-hill',
    name: 'Parliament Hill',
    slug: 'parliament-hill-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'South Hill Park',
    description: 'Bordering the Heath, this street features tall Victorian townhouses with spectacular views over London.',
    averageValue: 2600000
  },
  {
    id: 'nw3-south-end-road',
    name: 'South End Road',
    slug: 'south-end-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Hampstead',
    description: 'A vibrant street connecting Hampstead Heath station to the village, lined with shops and cafes.',
    averageValue: 1800000
  },
  {
    id: 'nw3-haverstock-hill',
    name: 'Haverstock Hill',
    slug: 'haverstock-hill-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'The main thoroughfare connecting Belsize Park to Hampstead, lined with grand stucco-fronted buildings.',
    averageValue: 1500000
  },
  {
    id: 'nw3-belsize-avenue',
    name: 'Belsize Avenue',
    slug: 'belsize-avenue-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'A wide, tree-lined avenue featuring elegant white stucco architecture typical of Belsize Park.',
    averageValue: 2100000
  },
  {
    id: 'nw3-belsize-lane',
    name: 'Belsize Lane',
    slug: 'belsize-lane-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'A village-like street with boutique shops and restaurants, surrounded by premium residential properties.',
    averageValue: 1900000
  },
  {
    id: 'nw3-eton-avenue',
    name: 'Eton Avenue',
    slug: 'eton-avenue-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'Renowned for its expansive red-brick Dutch gable houses and proximity to Swiss Cottage.',
    averageValue: 3800000
  },
  {
    id: 'nw3-fellows-road',
    name: 'Fellows Road',
    slug: 'fellows-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Belsize Park',
    description: 'A long residential road featuring a mix of period conversions and modern developments.',
    averageValue: 1200000
  },
  {
    id: 'nw3-adelaide-road',
    name: 'Adelaide Road',
    slug: 'adelaide-road-nw3',
    postcode: 'NW3',
    borough: 'Camden',
    conservationArea: 'Primrose Hill',
    description: 'A major road connecting Swiss Cottage to Chalk Farm, featuring a variety of architectural styles.',
    averageValue: 1100000
  },
  {
    id: 'nw1-albert-street',
    name: 'Albert Street',
    slug: 'albert-street-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Camden Town',
    description: 'A quintessential Camden street with uniform rows of early Victorian terraced houses.',
    averageValue: 1900000
  },
  {
    id: 'nw1-arlington-road',
    name: 'Arlington Road',
    slug: 'arlington-road-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Camden Town',
    description: 'Running parallel to the high street, offering a quieter residential feel with period properties.',
    averageValue: 1400000
  },
  {
    id: 'nw1-parkway',
    name: 'Parkway',
    slug: 'parkway-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Camden Town',
    description: 'A busy commercial and residential street connecting Camden Town to Regents Park.',
    averageValue: 1100000
  },
  {
    id: 'nw1-prince-albert-road',
    name: 'Prince Albert Road',
    slug: 'prince-albert-road-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Primrose Hill',
    description: 'A prestigious road facing Regents Park, lined with luxury mansion blocks and grand terraces.',
    averageValue: 3500000
  },
  {
    id: 'nw1-albany-street',
    name: 'Albany Street',
    slug: 'albany-street-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Regents Park',
    description: 'An elegant street on the eastern edge of Regents Park featuring Nash terrace architecture.',
    averageValue: 2200000
  },
  {
    id: 'nw1-delancey-street',
    name: 'Delancey Street',
    slug: 'delancey-street-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Camden Town',
    description: 'A key connecting road in Camden Town with a mix of shops, restaurants, and apartments.',
    averageValue: 1000000
  },
  {
    id: 'nw1-mornington-crescent',
    name: 'Mornington Crescent',
    slug: 'mornington-crescent-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Camden Town',
    description: 'Famous for its curved terrace of Georgian houses and the nearby Art Deco station.',
    averageValue: 1300000
  },
  {
    id: 'nw1-park-village-east',
    name: 'Park Village East',
    slug: 'park-village-east-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Regents Park',
    description: 'A picturesque street featuring unique Italianate and Gothic revival villas near the park.',
    averageValue: 3800000
  },
  {
    id: 'nw1-park-village-west',
    name: 'Park Village West',
    slug: 'park-village-west-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Regents Park',
    description: 'A quiet, exclusive enclave of Nash villas, offering a country-village feel in central London.',
    averageValue: 4000000
  },
  {
    id: 'nw1-cumberland-market',
    name: 'Cumberland Market',
    slug: 'cumberland-market-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Regents Park',
    description: 'A historic square surrounded by neo-Georgian council blocks and period properties.',
    averageValue: 850000
  },
  {
    id: 'nw1-chester-road',
    name: 'Chester Road',
    slug: 'chester-road-nw1',
    postcode: 'NW1',
    borough: 'Camden',
    conservationArea: 'Regents Park',
    description: 'A short, grand avenue leading directly into the Inner Circle of Regents Park.',
    averageValue: 2500000
  },
  {
    id: 'nw1-outer-circle',
    name: 'Outer Circle',
    slug: 'outer-circle-nw1',
    postcode: 'NW1',
    borough: 'Westminster',
    conservationArea: 'Regents Park',
    description: 'The grand ring road of Regents Park, featuring some of London\'s most magnificent terraces.',
    averageValue: 8000000
  },
  {
    id: 'nw6-broadhurst-gardens',
    name: 'Broadhurst Gardens',
    slug: 'broadhurst-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'A prime South Hampstead street with imposing red-brick Victorian semi-detached houses.',
    averageValue: 2400000
  },
  {
    id: 'nw6-canfield-gardens',
    name: 'Canfield Gardens',
    slug: 'canfield-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'Known for its high-quality Victorian architecture and proximity to Finchley Road transport.',
    averageValue: 1800000
  },
  {
    id: 'nw6-compayne-gardens',
    name: 'Compayne Gardens',
    slug: 'compayne-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'A quiet, leafy residential street lined with substantial period family homes.',
    averageValue: 2600000
  },
  {
    id: 'nw6-greencroft-gardens',
    name: 'Greencroft Gardens',
    slug: 'greencroft-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'Features grand Victorian mansion blocks and converted flats in a highly desirable location.',
    averageValue: 1300000
  },
  {
    id: 'nw6-fairhazel-gardens',
    name: 'Fairhazel Gardens',
    slug: 'fairhazel-gardens-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'A sweeping crescent road characterized by distinctive red-brick Victorian architecture.',
    averageValue: 1600000
  },
  {
    id: 'nw6-goldhurst-terrace',
    name: 'Goldhurst Terrace',
    slug: 'goldhurst-terrace-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'A long, popular street connecting South Hampstead to Swiss Cottage with varied period housing.',
    averageValue: 1500000
  },
  {
    id: 'nw6-priory-road',
    name: 'Priory Road',
    slug: 'priory-road-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'South Hampstead',
    description: 'A residential road featuring large semi-detached houses, popular with families.',
    averageValue: 2100000
  },
  {
    id: 'nw6-quex-road',
    name: 'Quex Road',
    slug: 'quex-road-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'Kilburn',
    description: 'A mixed residential and commercial street with a vibrant local community feel.',
    averageValue: 850000
  },
  {
    id: 'nw6-salusbury-road',
    name: 'Salusbury Road',
    slug: 'salusbury-road-nw6',
    postcode: 'NW6',
    borough: 'Brent',
    conservationArea: 'Queen\'s Park',
    description: 'The trendy heart of Queen\'s Park, lined with cafes, boutiques, and period apartments.',
    averageValue: 1100000
  },
  {
    id: 'nw6-chevening-road',
    name: 'Chevening Road',
    slug: 'chevening-road-nw6',
    postcode: 'NW6',
    borough: 'Brent',
    conservationArea: 'Queen\'s Park',
    description: 'One of the premier streets in Queen\'s Park, overlooking the park itself with grand houses.',
    averageValue: 2800000
  },
  {
    id: 'nw6-brondesbury-road',
    name: 'Brondesbury Road',
    slug: 'brondesbury-road-nw6',
    postcode: 'NW6',
    borough: 'Brent',
    conservationArea: 'Kilburn',
    description: 'A long residential street with a mix of Victorian terraces and flat conversions.',
    averageValue: 950000
  },
  {
    id: 'nw6-willesden-lane',
    name: 'Willesden Lane',
    slug: 'willesden-lane-nw6',
    postcode: 'NW6',
    borough: 'Brent',
    conservationArea: 'Mapesbury',
    description: 'A major thoroughfare bordered by the large detached houses of the Mapesbury conservation area.',
    averageValue: 1400000
  },
  {
    id: 'nw6-mill-lane',
    name: 'Mill Lane',
    slug: 'mill-lane-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'West Hampstead',
    description: 'A bustling local street with a village feel, offering shops and period cottages.',
    averageValue: 900000
  },
  {
    id: 'nw6-fortune-green-road',
    name: 'Fortune Green Road',
    slug: 'fortune-green-road-nw6',
    postcode: 'NW6',
    borough: 'Camden',
    conservationArea: 'West Hampstead',
    description: 'Runs past Fortune Green open space, featuring mansion blocks and family houses.',
    averageValue: 1000000
  },
  {
    id: 'nw8-st-johns-wood-high-street',
    name: 'St John\'s Wood High Street',
    slug: 'st-johns-wood-high-street-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A chic high street known for its luxury boutiques and cafes, serving the affluent local area.',
    averageValue: 2500000
  },
  {
    id: 'nw8-hamilton-terrace',
    name: 'Hamilton Terrace',
    slug: 'hamilton-terrace-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A wide, tree-lined boulevard famous for its large detached villas and prestige.',
    averageValue: 8000000
  },
  {
    id: 'nw8-marlborough-place',
    name: 'Marlborough Place',
    slug: 'marlborough-place-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A quiet, exclusive street featuring low-built villas and substantial family homes.',
    averageValue: 4500000
  },
  {
    id: 'nw8-carlton-hill',
    name: 'Carlton Hill',
    slug: 'carlton-hill-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A charming residential street with a mix of architectural styles from Gothic to classical.',
    averageValue: 3200000
  },
  {
    id: 'nw8-clifton-hill',
    name: 'Clifton Hill',
    slug: 'clifton-hill-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'Known for its beautiful semi-detached stucco villas and leafy, tranquil atmosphere.',
    averageValue: 3800000
  },
  {
    id: 'nw8-loudoun-road',
    name: 'Loudoun Road',
    slug: 'loudoun-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A long residential road connecting South Hampstead to St John\'s Wood.',
    averageValue: 2100000
  },
  {
    id: 'nw8-grove-end-road',
    name: 'Grove End Road',
    slug: 'grove-end-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'Home to the famous Abbey Road Studios crossing and large mansion blocks.',
    averageValue: 1800000
  },
  {
    id: 'nw8-acacia-road',
    name: 'Acacia Road',
    slug: 'acacia-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A prestigious street with gated driveways and modern luxury houses.',
    averageValue: 5500000
  },
  {
    id: 'nw8-norfolk-road',
    name: 'Norfolk Road',
    slug: 'norfolk-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A highly desirable road close to the High Street with elegant period properties.',
    averageValue: 4200000
  },
  {
    id: 'nw8-woronzow-road',
    name: 'Woronzow Road',
    slug: 'woronzow-road-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A quiet residential street known for its white stucco villas and proximity to Primrose Hill.',
    averageValue: 3600000
  },
  {
    id: 'nw8-queens-grove',
    name: 'Queen\'s Grove',
    slug: 'queens-grove-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A wide, attractive street lined with Grade II listed semi-detached villas.',
    averageValue: 4000000
  },
  {
    id: 'nw8-st-johns-wood-park',
    name: 'St John\'s Wood Park',
    slug: 'st-johns-wood-park-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'Features some of the most substantial detached houses in the area with large gardens.',
    averageValue: 6500000
  },
  {
    id: 'nw8-cochrane-street',
    name: 'Cochrane Street',
    slug: 'cochrane-street-nw8',
    postcode: 'NW8',
    borough: 'Westminster',
    conservationArea: 'St John\'s Wood',
    description: 'A smaller, intimate street with charming period cottages and terraced houses.',
    averageValue: 2200000
  },
  {
    id: 'nw11-golders-green-road',
    name: 'Golders Green Road',
    slug: 'golders-green-road-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'The bustling commercial heart of the area, flanked by residential parades.',
    averageValue: 900000
  },
  {
    id: 'nw11-north-end-road',
    name: 'North End Road',
    slug: 'north-end-road-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A major road bordering the Heath, featuring large detached character properties.',
    averageValue: 2500000
  },
  {
    id: 'nw11-wildwood-road',
    name: 'Wildwood Road',
    slug: 'wildwood-road-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Overlooking the Heath Extension, this is one of the Suburb\'s most prestigious addresses.',
    averageValue: 3500000
  },
  {
    id: 'nw11-meadway',
    name: 'Meadway',
    slug: 'meadway-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A quintessential Garden Suburb road with arts and crafts architecture and grass verges.',
    averageValue: 2200000
  },
  {
    id: 'nw11-corringham-road',
    name: 'Corringham Road',
    slug: 'corringham-road-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A leafy residential street featuring distinctive red-brick architecture.',
    averageValue: 1800000
  },
  {
    id: 'nw11-rotherwick-road',
    name: 'Rotherwick Road',
    slug: 'rotherwick-road-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Located on the south side of the Suburb, known for spacious family homes.',
    averageValue: 2000000
  },
  {
    id: 'nw11-cranbourne-gardens',
    name: 'Cranbourne Gardens',
    slug: 'cranbourne-gardens-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'A quiet, tree-lined street near Temple Fortune with large semi-detached houses.',
    averageValue: 1600000
  },
  {
    id: 'nw11-bridge-lane',
    name: 'Bridge Lane',
    slug: 'bridge-lane-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'A popular residential road connecting Golders Green to Temple Fortune.',
    averageValue: 1400000
  },
  {
    id: 'nw11-hoop-lane',
    name: 'Hoop Lane',
    slug: 'hoop-lane-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'Historic lane featuring the crematorium and listed buildings, with a mix of housing.',
    averageValue: 1300000
  },
  {
    id: 'nw11-the-ridgeway',
    name: 'The Ridgeway',
    slug: 'the-ridgeway-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'An elevated road offering views towards the city, with substantial detached homes.',
    averageValue: 1900000
  },
  {
    id: 'nw11-woodstock-avenue',
    name: 'Woodstock Avenue',
    slug: 'woodstock-avenue-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'A long, straight avenue lined with consistent semi-detached period properties.',
    averageValue: 1200000
  },
  {
    id: 'nw11-leeside-crescent',
    name: 'Leeside Crescent',
    slug: 'leeside-crescent-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Golders Green',
    description: 'A quiet crescent near the amenities of Temple Fortune.',
    averageValue: 1100000
  },
  {
    id: 'nw11-middleway',
    name: 'Middleway',
    slug: 'middleway-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Centrally located in the Suburb, featuring classic Lutyens-style architecture.',
    averageValue: 1700000
  },
  {
    id: 'nw11-southway',
    name: 'Southway',
    slug: 'southway-nw11',
    postcode: 'NW11',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A prestigious road in the Suburb with large detached houses and manicured hedges.',
    averageValue: 2300000
  },
  {
    id: 'n6-archway-road',
    name: 'Archway Road',
    slug: 'archway-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A major historic route into London, lined with a mix of shops and Victorian housing.',
    averageValue: 800000
  },
  {
    id: 'n6-cromwell-avenue',
    name: 'Cromwell Avenue',
    slug: 'cromwell-avenue-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A highly sought-after residential street with attractive red-brick Victorian houses.',
    averageValue: 1600000
  },
  {
    id: 'n6-hornsey-lane',
    name: 'Hornsey Lane',
    slug: 'hornsey-lane-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'Runs along the ridge with views over London, featuring the famous Archway Bridge.',
    averageValue: 1200000
  },
  {
    id: 'n6-highgate-west-hill',
    name: 'Highgate West Hill',
    slug: 'highgate-west-hill-n6',
    postcode: 'N6',
    borough: 'Camden',
    conservationArea: 'Highgate Village',
    description: 'A steep, historic hill lined with Georgian cottages and pubs, leading up to the village.',
    averageValue: 2100000
  },
  {
    id: 'n6-swains-lane',
    name: 'Swains Lane',
    slug: 'swains-lane-n6',
    postcode: 'N6',
    borough: 'Camden',
    conservationArea: 'Highgate',
    description: 'Famous for bordering Highgate Cemetery and Waterlow Park, with a village atmosphere.',
    averageValue: 1500000
  },
  {
    id: 'n6-bisham-gardens',
    name: 'Bisham Gardens',
    slug: 'bisham-gardens-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A quiet cul-de-sac in the heart of the village with substantial period homes.',
    averageValue: 2400000
  },
  {
    id: 'n6-cholmeley-park',
    name: 'Cholmeley Park',
    slug: 'cholmeley-park-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A prestigious road near the village featuring large detached houses and flats.',
    averageValue: 1800000
  },
  {
    id: 'n6-southwood-lane',
    name: 'Southwood Lane',
    slug: 'southwood-lane-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A historic lane with a mix of Georgian terraces and modern infill, close to the High Street.',
    averageValue: 1700000
  },
  {
    id: 'n6-jacksons-lane',
    name: 'Jacksons Lane',
    slug: 'jacksons-lane-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'Known for its arts centre and mix of Victorian and Edwardian housing.',
    averageValue: 1400000
  },
  {
    id: 'n6-view-road',
    name: 'View Road',
    slug: 'view-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A private road with large detached 1920s houses and spacious gardens.',
    averageValue: 3500000
  },
  {
    id: 'n6-denewood-road',
    name: 'Denewood Road',
    slug: 'denewood-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'An exclusive, leafy road near the golf course with substantial detached properties.',
    averageValue: 4000000
  },
  {
    id: 'n6-stormont-road',
    name: 'Stormont Road',
    slug: 'stormont-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'Part of the Kenwood area, featuring large detached houses on the Bishops Avenue border.',
    averageValue: 5000000
  },
  {
    id: 'n6-broadlands-road',
    name: 'Broadlands Road',
    slug: 'broadlands-road-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A quiet residential street with a mix of period conversions and family houses.',
    averageValue: 1600000
  },
  {
    id: 'n6-courtenay-avenue',
    name: 'Courtenay Avenue',
    slug: 'courtenay-avenue-n6',
    postcode: 'N6',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A private, gated road known as one of the most expensive streets in the area.',
    averageValue: 8500000
  },
  {
    id: 'n2-east-end-road',
    name: 'East End Road',
    slug: 'east-end-road-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'East Finchley',
    description: 'A main route connecting Highgate to Finchley, lined with varied housing stock.',
    averageValue: 950000
  },
  {
    id: 'n2-fortis-green',
    name: 'Fortis Green',
    slug: 'fortis-green-n2',
    postcode: 'N2',
    borough: 'Haringey',
    conservationArea: 'Fortis Green',
    description: 'A leafy, affluent road connecting East Finchley to Muswell Hill with grand period homes.',
    averageValue: 1500000
  },
  {
    id: 'n2-the-great-north-road',
    name: 'The Great North Road',
    slug: 'the-great-north-road-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'East Finchley',
    description: 'A historic thoroughfare featuring a mix of commercial and residential properties.',
    averageValue: 800000
  },
  {
    id: 'n2-aylmer-road',
    name: 'Aylmer Road',
    slug: 'aylmer-road-n2',
    postcode: 'N2',
    borough: 'Haringey',
    conservationArea: 'Highgate',
    description: 'A wide road near the golf course featuring large detached mansions.',
    averageValue: 3000000
  },
  {
    id: 'n2-winnington-road',
    name: 'Winnington Road',
    slug: 'winnington-road-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'One of London\'s most exclusive streets, running parallel to The Bishops Avenue.',
    averageValue: 6000000
  },
  {
    id: 'n2-ingram-avenue',
    name: 'Ingram Avenue',
    slug: 'ingram-avenue-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A beautiful, tree-lined avenue with large arts and crafts style detached houses.',
    averageValue: 4500000
  },
  {
    id: 'n2-holne-chase',
    name: 'Holne Chase',
    slug: 'holne-chase-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A quiet, prestigious road in the Suburb with substantial family homes.',
    averageValue: 3200000
  },
  {
    id: 'n2-neville-drive',
    name: 'Neville Drive',
    slug: 'neville-drive-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Backing onto the golf course, this street features grand detached residences.',
    averageValue: 3800000
  },
  {
    id: 'n2-norrice-lea',
    name: 'Norrice Lea',
    slug: 'norrice-lea-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A popular family street in the Suburb with a strong community feel.',
    averageValue: 2500000
  },
  {
    id: 'n2-kingsley-way',
    name: 'Kingsley Way',
    slug: 'kingsley-way-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Features distinctive architecture and leads towards the Lyttelton Playing Fields.',
    averageValue: 2200000
  },
  {
    id: 'n2-vivian-way',
    name: 'Vivian Way',
    slug: 'vivian-way-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A charming cul-de-sac with well-maintained garden suburb properties.',
    averageValue: 1800000
  },
  {
    id: 'n2-deansway',
    name: 'Deansway',
    slug: 'deansway-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'A quiet residential road with a rural feel, typical of the Garden Suburb.',
    averageValue: 1900000
  },
  {
    id: 'n2-edmunds-walk',
    name: 'Edmunds Walk',
    slug: 'edmunds-walk-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'Ideally located near the station, featuring attractive cottage-style homes.',
    averageValue: 1400000
  },
  {
    id: 'n2-brim-hill',
    name: 'Brim Hill',
    slug: 'brim-hill-n2',
    postcode: 'N2',
    borough: 'Barnet',
    conservationArea: 'Hampstead Garden Suburb',
    description: 'An elevated road offering green views and distinctive architecture.',
    averageValue: 1600000
  },
  {
    id: 'n10-muswell-hill-road',
    name: 'Muswell Hill Road',
    slug: 'muswell-hill-road-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'The main approach to the Broadway, flanked by Highgate Woods and period homes.',
    averageValue: 1300000
  },
  {
    id: 'n10-fortis-green-road',
    name: 'Fortis Green Road',
    slug: 'fortis-green-road-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A vibrant street with shops and restaurants, leading into residential areas.',
    averageValue: 1100000
  },
  {
    id: 'n10-alexandra-park-road',
    name: 'Alexandra Park Road',
    slug: 'alexandra-park-road-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Alexandra Park',
    description: 'A long residential avenue offering views towards the Palace and park.',
    averageValue: 1000000
  },
  {
    id: 'n10-colney-hatch-lane',
    name: 'Colney Hatch Lane',
    slug: 'colney-hatch-lane-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A major road with large Edwardian semi-detached houses.',
    averageValue: 1200000
  },
  {
    id: 'n10-pages-lane',
    name: 'Pages Lane',
    slug: 'pages-lane-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A historic lane featuring Chester House and varied architectural styles.',
    averageValue: 1100000
  },
  {
    id: 'n10-creighton-avenue',
    name: 'Creighton Avenue',
    slug: 'creighton-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A wide, leafy avenue backing onto Coldfall Woods with large family homes.',
    averageValue: 1500000
  },
  {
    id: 'n10-tetherdown',
    name: 'Tetherdown',
    slug: 'tetherdown-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A charming, older street in Muswell Hill with a mix of cottages and terraces.',
    averageValue: 1250000
  },
  {
    id: 'n10-queens-avenue',
    name: 'Queens Avenue',
    slug: 'queens-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'Centrally located with fine examples of Edwardian red-brick architecture.',
    averageValue: 1400000
  },
  {
    id: 'n10-grand-avenue',
    name: 'Grand Avenue',
    slug: 'grand-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'True to its name, a broad avenue lined with imposing period properties.',
    averageValue: 1600000
  },
  {
    id: 'n10-woodland-gardens',
    name: 'Woodland Gardens',
    slug: 'woodland-gardens-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A highly desirable residential street known for its quiet, leafy character.',
    averageValue: 1350000
  },
  {
    id: 'n10-birchwood-avenue',
    name: 'Birchwood Avenue',
    slug: 'birchwood-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A popular family street with attractive Edwardian terraced housing.',
    averageValue: 1200000
  },
  {
    id: 'n10-curzon-road',
    name: 'Curzon Road',
    slug: 'curzon-road-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A quiet residential road featuring well-maintained period family homes.',
    averageValue: 1150000
  },
  {
    id: 'n10-cranley-gardens',
    name: 'Cranley Gardens',
    slug: 'cranley-gardens-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Muswell Hill',
    description: 'A long, winding road with a mix of flat conversions and houses.',
    averageValue: 950000
  },
  {
    id: 'n10-rookfield-avenue',
    name: 'Rookfield Avenue',
    slug: 'rookfield-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Rookfield',
    description: 'Part of the \'Rookfield Garden Village\', known for its arts and crafts cottages.',
    averageValue: 1450000
  },
  {
    id: 'n10-cascade-avenue',
    name: 'Cascade Avenue',
    slug: 'cascade-avenue-n10',
    postcode: 'N10',
    borough: 'Haringey',
    conservationArea: 'Rookfield',
    description: 'A picturesque street in the Rookfield Estate with a distinct garden suburb feel.',
    averageValue: 1500000
  },
  {
    id: 'n8-crouch-end-hill',
    name: 'Crouch End Hill',
    slug: 'crouch-end-hill-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'Connecting Crouch End to Hornsey, lined with shops and Victorian flats.',
    averageValue: 850000
  },
  {
    id: 'n8-crouch-hill',
    name: 'Crouch Hill',
    slug: 'crouch-hill-n8',
    postcode: 'N8',
    borough: 'Islington',
    conservationArea: 'Stroud Green',
    description: 'A vibrant street connecting Crouch End to Stroud Green, popular for its pubs and culture.',
    averageValue: 900000
  },
  {
    id: 'n8-tottenham-lane',
    name: 'Tottenham Lane',
    slug: 'tottenham-lane-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A busy thoroughfare with a mix of commercial amenities and residential developments.',
    averageValue: 750000
  },
  {
    id: 'n8-ferme-park-road',
    name: 'Ferme Park Road',
    slug: 'ferme-park-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Stroud Green',
    description: 'A long residential ridge road with views and substantial Victorian villas.',
    averageValue: 1100000
  },
  {
    id: 'n8-ridge-road',
    name: 'Ridge Road',
    slug: 'ridge-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Stroud Green',
    description: 'Runs along the top of the ridge, offering panoramic views and large period houses.',
    averageValue: 1200000
  },
  {
    id: 'n8-mount-view-road',
    name: 'Mount View Road',
    slug: 'mount-view-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Stroud Green',
    description: 'Famous for its skyline views of London and grand double-fronted houses.',
    averageValue: 1300000
  },
  {
    id: 'n8-haslemere-road',
    name: 'Haslemere Road',
    slug: 'haslemere-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A quiet, leafy street close to the Broadway with attractive family homes.',
    averageValue: 1250000
  },
  {
    id: 'n8-weston-park',
    name: 'Weston Park',
    slug: 'weston-park-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A popular residential street featuring a mix of Edwardian houses and school buildings.',
    averageValue: 1150000
  },
  {
    id: 'n8-bourne-road',
    name: 'Bourne Road',
    slug: 'bourne-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A sought-after road near Coolhurst Road with well-preserved period properties.',
    averageValue: 1100000
  },
  {
    id: 'n8-coolhurst-road',
    name: 'Coolhurst Road',
    slug: 'coolhurst-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'One of Crouch End\'s premier streets, known for its very large semi-detached houses.',
    averageValue: 1600000
  },
  {
    id: 'n8-womersley-road',
    name: 'Womersley Road',
    slug: 'womersley-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A quiet residential street with distinctive red-brick architecture.',
    averageValue: 1200000
  },
  {
    id: 'n8-bryanstone-road',
    name: 'Bryanstone Road',
    slug: 'bryanstone-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'A pleasant, tree-lined road popular with families for its proximity to schools.',
    averageValue: 1100000
  },
  {
    id: 'n8-glasslyn-road',
    name: 'Glasslyn Road',
    slug: 'glasslyn-road-n8',
    postcode: 'N8',
    borough: 'Haringey',
    conservationArea: 'Crouch End',
    description: 'Ideally located near the station and Broadway, featuring Victorian terraces.',
    averageValue: 1050000
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
