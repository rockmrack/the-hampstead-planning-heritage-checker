/**
 * Application Constants
 * Central location for all application-wide constants
 */

import type { Borough, BoroughInfo, TargetPostcode } from '@/types';

// ===========================================
// Geographic Coverage
// ===========================================

export const TARGET_POSTCODES: readonly TargetPostcode[] = [
  'NW1', 'NW3', 'NW6', 'NW8', 'NW11',
  'N2', 'N6', 'N10',
] as const;

export const BOROUGHS: Record<Borough, BoroughInfo> = {
  Camden: {
    name: 'Camden',
    postcodes: ['NW1', 'NW3', 'NW6'],
    dataPortalUrl: 'https://opendata.camden.gov.uk/',
    planningUrl: 'https://www.camden.gov.uk/planning',
  },
  Barnet: {
    name: 'Barnet',
    postcodes: ['NW11', 'N2'],
    dataPortalUrl: 'https://open.barnet.gov.uk/',
    planningUrl: 'https://www.barnet.gov.uk/planning-and-building',
  },
  Westminster: {
    name: 'Westminster',
    postcodes: ['NW8'],
    dataPortalUrl: 'https://www.westminster.gov.uk/open-data',
    planningUrl: 'https://www.westminster.gov.uk/planning-building-and-environmental-regulations',
  },
  Haringey: {
    name: 'Haringey',
    postcodes: ['N6', 'N10'],
    dataPortalUrl: 'https://data.gov.uk/search?filters%5Bpublisher%5D=Haringey',
    planningUrl: 'https://www.haringey.gov.uk/planning-and-building-control',
  },
  Brent: {
    name: 'Brent',
    postcodes: ['NW6'],
    dataPortalUrl: 'https://data.brent.gov.uk/',
    planningUrl: 'https://www.brent.gov.uk/planning-and-building-control',
  },
};

// ===========================================
// Map Configuration
// ===========================================

export const MAP_CONFIG = {
  // Default center (approximate center of coverage area)
  defaultCenter: {
    longitude: -0.178,
    latitude: 51.556,
  },
  defaultZoom: 12,
  minZoom: 10,
  maxZoom: 18,
  
  // Map bounds (coverage area)
  bounds: {
    north: 51.62,
    south: 51.52,
    east: -0.08,
    west: -0.25,
  },
  
  // Mapbox style URLs
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  
  // Layer colors
  colors: {
    conservationArea: {
      fill: 'rgba(245, 158, 11, 0.3)',
      outline: '#F59E0B',
    },
    listedBuilding: {
      marker: '#DC2626',
      outline: '#991B1B',
    },
    searchResult: {
      marker: '#3B82F6',
    },
    article4Zone: {
      fill: 'rgba(220, 38, 38, 0.2)',
      outline: '#DC2626',
    },
  },
};

// ===========================================
// Search Configuration
// ===========================================

export const SEARCH_CONFIG = {
  // Listed building radius check (meters)
  listedBuildingRadius: 10,
  
  // Geocoding
  geocodingCountry: 'gb',
  geocodingBoundingBox: [-0.25, 51.52, -0.08, 51.62], // [minLng, minLat, maxLng, maxLat]
  
  // Autocomplete
  autocompleteDebounceMs: 300,
  autocompleteMinChars: 3,
  autocompleteMaxResults: 5,
  
  // Caching
  resultCacheTTL: 3600, // seconds
};

// ===========================================
// Status Configuration
// ===========================================

export const STATUS_CONFIG = {
  RED: {
    label: 'Statutory Listed Building',
    icon: '🏛️',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#DC2626',
    headline: 'Statutory Listed Building',
    warning: 'Strictly protected. Criminal offence to alter without consent.',
    cta: 'Book Heritage Consultation',
    ctaLink: '/consultation',
    severity: 3,
  },
  AMBER: {
    label: 'Conservation Area',
    icon: '🍂',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    borderColor: '#F59E0B',
    headline: 'Located in Conservation Area',
    warning: 'Permitted Development rights restricted. Demolition requires permission.',
    cta: 'Download Planning Fact Sheet',
    ctaLink: '/fact-sheet',
    severity: 2,
  },
  GREEN: {
    label: 'Standard Planning Zone',
    icon: '✅',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    borderColor: '#16A34A',
    headline: 'Standard Planning Zone',
    opportunity: 'High likelihood of Permitted Development for extensions.',
    cta: 'Get Instant Renovation Quote',
    ctaLink: '/quote',
    severity: 1,
  },
};

// ===========================================
// Listed Building Grades
// ===========================================

export const LISTED_GRADES = {
  'I': {
    label: 'Grade I',
    description: 'Exceptional interest (top 2.5%)',
    severity: 'highest',
  },
  'II*': {
    label: 'Grade II*',
    description: 'Particularly important (5.8%)',
    severity: 'high',
  },
  'II': {
    label: 'Grade II',
    description: 'Special interest (91.7%)',
    severity: 'standard',
  },
};

// ===========================================
// API Configuration
// ===========================================

export const API_CONFIG = {
  // Historic England
  historicEnglandApiUrl: 'https://historicengland.org.uk/api',
  nhleDataDownload: 'https://historicengland.org.uk/listing/the-list/data-download/',
  
  // Mapbox Geocoding
  mapboxGeocodingUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  
  // Rate limiting
  rateLimitRequests: 60,
  rateLimitWindowMs: 60000,
  
  // Timeout
  requestTimeout: 10000, // ms
  
  // Retry
  maxRetries: 3,
  retryDelay: 1000, // ms
};

// ===========================================
// Company Information
// ===========================================

export const COMPANY_INFO = {
  name: 'Hampstead Renovations',
  legalName: 'Hampstead Renovations Ltd.',
  tagline: 'The premier design, build, and maintenance specialists for North West London\'s finest homes.',
  subtitle: 'The Planning & Heritage Experts for North West London.',
  
  address: {
    line1: 'Unit 3, Palace Court',
    line2: '250 Finchley Road',
    city: 'Hampstead, London',
    postcode: 'NW3 6DN',
    country: 'United Kingdom',
    full: 'Unit 3, Palace Court, 250 Finchley Road, Hampstead, London, NW3 6DN',
    googleMapsUrl: 'https://maps.google.com/?q=250+Finchley+Road+NW3+6DN',
  },
  
  contact: {
    phone: '07459 345456',
    phoneLink: 'tel:07459345456',
    email: 'hello@hampsteadrenovations.co.uk',
    whatsapp: 'https://wa.me/447459345456',
  },
  
  social: {
    instagram: 'https://instagram.com/hampsteadrenovations',
    facebook: 'https://facebook.com/hampsteadrenovations',
    linkedin: 'https://linkedin.com/company/hampsteadrenovations',
  },
  
  legal: {
    companyNumber: '12345678',
    vatNumber: 'GB123456789',
    copyright: `© ${new Date().getFullYear()} Hampstead Renovations Ltd. All rights reserved.`,
  },
};

// ===========================================
// PDF Report Configuration
// ===========================================

export const PDF_CONFIG = {
  pageSize: 'A4',
  margins: {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  },
  fonts: {
    title: 'Helvetica-Bold',
    body: 'Helvetica',
  },
  colors: {
    primary: '#0F172A',
    accent: '#D4AF37',
    text: '#1F2937',
    muted: '#6B7280',
  },
  logo: {
    width: 150,
    height: 40,
  },
};

// ===========================================
// Expert Opinions (Pre-written content)
// ===========================================

export const EXPERT_OPINIONS = {
  listed: {
    'I': 'As a Grade I Listed Building, this property represents exceptional architectural or historic interest. Any alterations require Listed Building Consent from the local authority, and works must be carried out with extreme care to preserve the special character. Our heritage specialists have extensive experience navigating these complex requirements.',
    'II*': 'This Grade II* Listed Building is of particular importance, representing the top tier of protected properties. While alterations are possible, they require Listed Building Consent and careful heritage impact assessment. We recommend a detailed feasibility study before proceeding with any works.',
    'II': 'As a Grade II Listed Building, this property has special interest warranting preservation. While this is the most common listing grade, it still requires Listed Building Consent for any alterations. Many sympathetic improvements are achievable with the right approach and expertise.',
  },
  conservation: {
    default: 'This property is located within a designated Conservation Area, which means Permitted Development rights are restricted. Extensions, alterations to the roof, and changes to front elevations will likely require planning permission. Demolition also requires consent. We can help you navigate these requirements.',
    article4: 'This property is subject to Article 4 Directions, which remove additional Permitted Development rights. This means even minor alterations such as changes to windows, doors, or front boundary treatments may require planning permission. Early consultation with the planning authority is essential.',
  },
  standard: 'This property appears to fall within a standard planning zone with full Permitted Development rights. This means many improvements, including single-storey rear extensions up to certain limits, can be carried out without planning permission. However, Building Regulations approval is still required for most works.',
};

// ===========================================
// Known Test Addresses
// ===========================================

export const TEST_ADDRESSES = {
  listed: {
    address: '2 Willow Road, NW3',
    expected: 'RED',
    description: 'Grade II* Listed Building (Ernö Goldfinger house)',
  },
  conservation: {
    address: '42 Redington Road, NW3',
    expected: 'AMBER',
    description: 'Located in Hampstead Village Conservation Area',
  },
  standard: {
    address: '1 Bristol Avenue, Colindale, NW9',
    expected: 'GREEN',
    description: 'New build development outside conservation areas',
  },
};
