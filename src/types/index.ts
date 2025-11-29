/**
 * Type Definitions for NW London Heritage & Planning Engine
 * These types define the core data structures used throughout the application
 */

// ===========================================
// Geographic Types
// ===========================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}

// ===========================================
// Listed Buildings Types
// ===========================================

export type ListedGrade = 'I' | 'II*' | 'II';

export interface ListedBuilding {
  id: number;
  listEntryNumber: string;
  name: string;
  grade: ListedGrade;
  location: GeoJSONPoint;
  hyperlink: string;
  description?: string;
  borough?: string;
  dateDesignated?: string;
  distanceMeters?: number; // Distance from search point
}

export interface ListedBuildingRecord {
  id: number;
  list_entry_number: string;
  name: string;
  grade: ListedGrade;
  location: string; // PostGIS geography as WKT or GeoJSON string
  hyperlink: string;
  description?: string;
  borough?: string;
  date_designated?: string;
  created_at?: string;
  updated_at?: string;
}

// ===========================================
// Conservation Areas Types
// ===========================================

export interface ConservationArea {
  id: number;
  name: string;
  borough: string;
  boundary?: GeoJSONMultiPolygon | GeoJSONPolygon;
  hasArticle4: boolean;
  article4Details?: string;
  designationDate?: string;
  characterAppraisal?: string;
  managementPlan?: string;
}

export interface ConservationAreaRecord {
  id: number;
  name: string;
  borough: string;
  boundary: string; // PostGIS geography as WKT or GeoJSON string
  has_article_4: boolean;
  article_4_details?: string;
  designation_date?: string;
  character_appraisal_url?: string;
  management_plan_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ===========================================
// Property Check Types
// ===========================================

export type PropertyStatus = 'RED' | 'AMBER' | 'GREEN';

export interface PropertyCheckResult {
  status: PropertyStatus;
  address: string;
  coordinates: Coordinates;
  postcode: string;
  borough?: string;
  listedBuilding?: ListedBuilding | null;
  conservationArea?: ConservationArea | null;
  hasArticle4: boolean;
  article4Details?: string;
  timestamp: string;
  searchId: string;
}

export interface PropertyCheckRequest {
  address: string;
  postcode?: string;
  coordinates?: Coordinates;
}

export interface PropertyCheckResponse {
  success: boolean;
  data?: PropertyCheckResult;
  error?: string;
  errorCode?: string;
}

// ===========================================
// Search Log Types
// ===========================================

export interface SearchLog {
  id: string;
  addressInput: string;
  postcode?: string;
  resultStatus: PropertyStatus;
  userEmail?: string;
  coordinates?: Coordinates;
  borough?: string;
  conservationAreaId?: number;
  listedBuildingId?: number;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SearchLogRecord {
  id: string;
  address_input: string;
  postcode?: string;
  result_status: PropertyStatus;
  user_email?: string;
  latitude?: number;
  longitude?: number;
  borough?: string;
  conservation_area_id?: number;
  listed_building_id?: number;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

// ===========================================
// Geocoding Types
// ===========================================

export interface GeocodingResult {
  placeName: string;
  coordinates: Coordinates;
  postcode?: string;
  borough?: string;
  address: string;
  relevance: number;
  placeType: string[];
}

export interface GeocodingResponse {
  success: boolean;
  results: GeocodingResult[];
  error?: string;
}

// ===========================================
// Map Types
// ===========================================

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  type: 'search' | 'listed' | 'conservation';
  label?: string;
  color?: string;
}

export interface MapLayer {
  id: string;
  type: 'fill' | 'line' | 'circle' | 'symbol';
  source: string;
  visible: boolean;
}

// ===========================================
// PDF Report Types
// ===========================================

export interface PDFReportData {
  propertyResult: PropertyCheckResult;
  userEmail: string;
  generatedAt: string;
  mapSnapshot?: string; // Base64 encoded image
  expertOpinion?: string;
}

export interface PDFGenerationOptions {
  includeMap: boolean;
  includeExpertOpinion: boolean;
  fileName?: string;
}

// ===========================================
// Lead Capture Types
// ===========================================

export interface LeadCaptureData {
  email: string;
  name?: string;
  phone?: string;
  searchId: string;
  source: 'pdf_download' | 'consultation_request' | 'quote_request';
  propertyAddress?: string;
  propertyStatus?: PropertyStatus;
  marketingConsent: boolean;
}

export interface LeadCaptureResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ===========================================
// API Response Types
// ===========================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===========================================
// Borough & Geographic Reference Types
// ===========================================

export type Borough = 
  | 'Camden'
  | 'Barnet'
  | 'Westminster'
  | 'Haringey'
  | 'Brent';

export type TargetPostcode = 
  | 'NW1'
  | 'NW3'
  | 'NW6'
  | 'NW8'
  | 'NW11'
  | 'N2'
  | 'N6'
  | 'N10';

export interface BoroughInfo {
  name: Borough;
  postcodes: TargetPostcode[];
  dataPortalUrl: string;
  planningUrl: string;
}

// ===========================================
// Error Types
// ===========================================

export class HeritageCheckError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = 'HeritageCheckError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export enum ErrorCode {
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  GEOCODING_FAILED = 'GEOCODING_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_IN_COVERAGE_AREA = 'NOT_IN_COVERAGE_AREA',
  SERVER_ERROR = 'SERVER_ERROR',
}

// ===========================================
// Analytics Types
// ===========================================

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface SearchAnalytics {
  totalSearches: number;
  searchesByStatus: {
    RED: number;
    AMBER: number;
    GREEN: number;
  };
  searchesByBorough: Record<string, number>;
  searchesByPostcode: Record<string, number>;
  conversionRate: number;
  averageSearchesPerDay: number;
}
