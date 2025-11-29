-- =====================================================
-- NW London Heritage & Planning Engine
-- Initial Database Schema with PostGIS
-- =====================================================
-- This migration creates the core database schema for the
-- Heritage & Planning Checker application, including:
-- - PostGIS extension for spatial queries
-- - Listed Buildings table with point geometry
-- - Conservation Areas table with polygon geometry
-- - Search logs for analytics
-- - Leads table for CRM integration
-- =====================================================

-- Enable PostGIS extension for spatial data support
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Listed Building grades as per Historic England
CREATE TYPE listed_building_grade AS ENUM ('I', 'II*', 'II');

-- Property status for search results
CREATE TYPE property_status AS ENUM ('RED', 'AMBER', 'GREEN');

-- Lead status for CRM tracking
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'archived');

-- =====================================================
-- LISTED BUILDINGS TABLE
-- =====================================================
-- Source: Historic England Listed Buildings API/Dataset
-- Contains all Grade I, II*, and II listed buildings

CREATE TABLE IF NOT EXISTS listed_buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Historic England reference
    list_entry_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    
    -- Grading
    grade listed_building_grade NOT NULL,
    
    -- Address information
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    town VARCHAR(100),
    postcode VARCHAR(20),
    borough VARCHAR(100),
    
    -- Spatial data (EPSG:4326 - WGS84)
    location GEOMETRY(Point, 4326) NOT NULL,
    
    -- Additional metadata
    list_date DATE,
    amended_date DATE,
    legacy_uid VARCHAR(50),
    documentation_url TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    data_source VARCHAR(100) DEFAULT 'historic_england',
    
    -- Indexing hints
    CONSTRAINT valid_location CHECK (ST_IsValid(location))
);

-- Create spatial index for efficient radius queries
CREATE INDEX IF NOT EXISTS idx_listed_buildings_location 
    ON listed_buildings USING GIST (location);

-- Create index for borough filtering
CREATE INDEX IF NOT EXISTS idx_listed_buildings_borough 
    ON listed_buildings (borough);

-- Create index for grade filtering
CREATE INDEX IF NOT EXISTS idx_listed_buildings_grade 
    ON listed_buildings (grade);

-- Create index for postcode prefix searches
CREATE INDEX IF NOT EXISTS idx_listed_buildings_postcode 
    ON listed_buildings (postcode);

-- =====================================================
-- CONSERVATION AREAS TABLE
-- =====================================================
-- Source: London Datastore / Individual Borough Datasets
-- Contains conservation area boundaries as polygons

CREATE TABLE IF NOT EXISTS conservation_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(100),
    
    -- Administrative
    borough VARCHAR(100) NOT NULL,
    designation_date DATE,
    
    -- Spatial data (EPSG:4326 - WGS84)
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    
    -- Area calculations (stored for performance)
    area_hectares DECIMAL(12, 4),
    
    -- Additional metadata
    description TEXT,
    character_appraisal_url TEXT,
    management_plan_url TEXT,
    
    -- Article 4 Direction information
    has_article_4 BOOLEAN DEFAULT FALSE,
    article_4_restrictions TEXT[],
    article_4_date DATE,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    data_source VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_boundary CHECK (ST_IsValid(boundary)),
    CONSTRAINT unique_borough_reference UNIQUE (borough, reference)
);

-- Create spatial index for efficient point-in-polygon queries
CREATE INDEX IF NOT EXISTS idx_conservation_areas_boundary 
    ON conservation_areas USING GIST (boundary);

-- Create index for borough filtering
CREATE INDEX IF NOT EXISTS idx_conservation_areas_borough 
    ON conservation_areas (borough);

-- Create index for Article 4 filtering
CREATE INDEX IF NOT EXISTS idx_conservation_areas_article4 
    ON conservation_areas (has_article_4) WHERE has_article_4 = TRUE;

-- =====================================================
-- ARTICLE 4 DIRECTIONS TABLE
-- =====================================================
-- Separate table for detailed Article 4 Direction information

CREATE TABLE IF NOT EXISTS article_4_directions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference to conservation area (can be NULL for standalone A4)
    conservation_area_id UUID REFERENCES conservation_areas(id),
    
    -- Identification
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(100),
    borough VARCHAR(100) NOT NULL,
    
    -- Direction details
    direction_date DATE NOT NULL,
    confirmation_date DATE,
    
    -- Spatial data - can be polygon or cover entire CA
    boundary GEOMETRY(MultiPolygon, 4326),
    
    -- Restrictions removed by this direction
    restrictions JSONB NOT NULL DEFAULT '[]',
    -- Example: [{"class": "A", "part": "1", "description": "Enlargement of dwelling"}]
    
    -- Documentation
    description TEXT,
    document_url TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_a4_boundary CHECK (boundary IS NULL OR ST_IsValid(boundary))
);

-- Create spatial index
CREATE INDEX IF NOT EXISTS idx_article_4_directions_boundary 
    ON article_4_directions USING GIST (boundary) WHERE boundary IS NOT NULL;

-- =====================================================
-- SEARCH LOGS TABLE
-- =====================================================
-- Analytics and audit trail for all property searches

CREATE TABLE IF NOT EXISTS search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Search parameters
    search_address TEXT NOT NULL,
    search_postcode VARCHAR(20),
    
    -- Geocoded location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOMETRY(Point, 4326),
    
    -- Results
    status property_status,
    is_listed BOOLEAN DEFAULT FALSE,
    listed_building_id UUID REFERENCES listed_buildings(id),
    in_conservation_area BOOLEAN DEFAULT FALSE,
    conservation_area_id UUID REFERENCES conservation_areas(id),
    has_article_4 BOOLEAN DEFAULT FALSE,
    
    -- Performance metrics
    response_time_ms INTEGER,
    
    -- Client information (anonymized)
    client_ip_hash VARCHAR(64),
    user_agent TEXT,
    referrer TEXT,
    
    -- Session tracking
    session_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint for location
    CONSTRAINT valid_search_location CHECK (location IS NULL OR ST_IsValid(location))
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at 
    ON search_logs (created_at DESC);

-- Create index for status analytics
CREATE INDEX IF NOT EXISTS idx_search_logs_status 
    ON search_logs (status);

-- Create spatial index for geographic analytics
CREATE INDEX IF NOT EXISTS idx_search_logs_location 
    ON search_logs USING GIST (location) WHERE location IS NOT NULL;

-- =====================================================
-- LEADS TABLE
-- =====================================================
-- CRM integration for lead capture

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact information
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    
    -- Property information
    property_address TEXT,
    property_postcode VARCHAR(20),
    property_status property_status,
    
    -- Search context
    search_log_id UUID REFERENCES search_logs(id),
    
    -- Lead management
    status lead_status DEFAULT 'new',
    notes TEXT,
    
    -- Marketing consent
    marketing_consent BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    consent_ip_hash VARCHAR(64),
    
    -- Source tracking
    source VARCHAR(100) DEFAULT 'website',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- CRM integration
    external_crm_id VARCHAR(100),
    synced_to_crm BOOLEAN DEFAULT FALSE,
    crm_sync_timestamp TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_leads_email 
    ON leads (email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_leads_status 
    ON leads (status);

-- Create index for new leads
CREATE INDEX IF NOT EXISTS idx_leads_new 
    ON leads (created_at DESC) WHERE status = 'new';

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to check if a point is within any conservation area
CREATE OR REPLACE FUNCTION check_conservation_area(
    lng DECIMAL,
    lat DECIMAL
) RETURNS TABLE (
    id UUID,
    name VARCHAR,
    borough VARCHAR,
    has_article_4 BOOLEAN,
    article_4_restrictions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ca.id,
        ca.name,
        ca.borough,
        ca.has_article_4,
        ca.article_4_restrictions
    FROM conservation_areas ca
    WHERE ST_Intersects(
        ca.boundary,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to find listed buildings within radius
CREATE OR REPLACE FUNCTION find_listed_buildings_nearby(
    lng DECIMAL,
    lat DECIMAL,
    radius_meters INTEGER DEFAULT 10
) RETURNS TABLE (
    id UUID,
    list_entry_number VARCHAR,
    name VARCHAR,
    grade listed_building_grade,
    address_line_1 VARCHAR,
    postcode VARCHAR,
    distance_meters DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lb.id,
        lb.list_entry_number,
        lb.name,
        lb.grade,
        lb.address_line_1,
        lb.postcode,
        ST_Distance(
            lb.location::geography,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) as distance_meters
    FROM listed_buildings lb
    WHERE ST_DWithin(
        lb.location::geography,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_meters
    )
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get full property status
CREATE OR REPLACE FUNCTION get_property_status(
    lng DECIMAL,
    lat DECIMAL
) RETURNS TABLE (
    status property_status,
    is_listed BOOLEAN,
    listed_building_name VARCHAR,
    listed_building_grade listed_building_grade,
    in_conservation_area BOOLEAN,
    conservation_area_name VARCHAR,
    has_article_4 BOOLEAN
) AS $$
DECLARE
    v_is_listed BOOLEAN := FALSE;
    v_listed_name VARCHAR;
    v_listed_grade listed_building_grade;
    v_in_ca BOOLEAN := FALSE;
    v_ca_name VARCHAR;
    v_has_a4 BOOLEAN := FALSE;
    v_status property_status;
BEGIN
    -- Check for listed building (exact match within 10m)
    SELECT 
        lb.name,
        lb.grade
    INTO v_listed_name, v_listed_grade
    FROM listed_buildings lb
    WHERE ST_DWithin(
        lb.location::geography,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        10
    )
    ORDER BY ST_Distance(
        lb.location::geography,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    )
    LIMIT 1;
    
    IF v_listed_name IS NOT NULL THEN
        v_is_listed := TRUE;
    END IF;
    
    -- Check for conservation area
    SELECT 
        ca.name,
        ca.has_article_4
    INTO v_ca_name, v_has_a4
    FROM conservation_areas ca
    WHERE ST_Intersects(
        ca.boundary,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)
    )
    LIMIT 1;
    
    IF v_ca_name IS NOT NULL THEN
        v_in_ca := TRUE;
    END IF;
    
    -- Determine status
    IF v_is_listed THEN
        v_status := 'RED';
    ELSIF v_in_ca THEN
        v_status := 'AMBER';
    ELSE
        v_status := 'GREEN';
    END IF;
    
    RETURN QUERY SELECT 
        v_status,
        v_is_listed,
        v_listed_name,
        v_listed_grade,
        v_in_ca,
        v_ca_name,
        v_has_a4;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to listed_buildings
CREATE TRIGGER trigger_listed_buildings_updated_at
    BEFORE UPDATE ON listed_buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply trigger to conservation_areas
CREATE TRIGGER trigger_conservation_areas_updated_at
    BEFORE UPDATE ON conservation_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply trigger to leads
CREATE TRIGGER trigger_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE listed_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conservation_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_4_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access for spatial data
CREATE POLICY "Public read access for listed buildings"
    ON listed_buildings FOR SELECT
    USING (true);

CREATE POLICY "Public read access for conservation areas"
    ON conservation_areas FOR SELECT
    USING (true);

CREATE POLICY "Public read access for article 4 directions"
    ON article_4_directions FOR SELECT
    USING (true);

-- Service role access for search logs (write only via API)
CREATE POLICY "Service role insert access for search logs"
    ON search_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role read access for search logs"
    ON search_logs FOR SELECT
    USING (true);

-- Service role access for leads
CREATE POLICY "Service role insert access for leads"
    ON leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role full access for leads"
    ON leads FOR ALL
    USING (true);

-- =====================================================
-- VIEWS
-- =====================================================

-- View for recent searches analytics
CREATE OR REPLACE VIEW recent_searches AS
SELECT 
    date_trunc('hour', created_at) as hour,
    status,
    COUNT(*) as search_count,
    AVG(response_time_ms) as avg_response_time
FROM search_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY date_trunc('hour', created_at), status
ORDER BY hour DESC;

-- View for borough statistics
CREATE OR REPLACE VIEW borough_statistics AS
SELECT 
    COALESCE(lb.borough, ca.borough) as borough,
    COUNT(DISTINCT lb.id) as listed_building_count,
    COUNT(DISTINCT ca.id) as conservation_area_count,
    COUNT(DISTINCT CASE WHEN ca.has_article_4 THEN ca.id END) as article_4_count
FROM listed_buildings lb
FULL OUTER JOIN conservation_areas ca ON lb.borough = ca.borough
GROUP BY COALESCE(lb.borough, ca.borough);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE listed_buildings IS 'Historic England Listed Buildings within NW/N London boroughs';
COMMENT ON TABLE conservation_areas IS 'Conservation Area boundaries from London boroughs';
COMMENT ON TABLE article_4_directions IS 'Article 4 Direction details removing permitted development rights';
COMMENT ON TABLE search_logs IS 'Audit log of all property status searches';
COMMENT ON TABLE leads IS 'Lead capture from PDF download requests';

COMMENT ON FUNCTION check_conservation_area IS 'Check if coordinates fall within any conservation area';
COMMENT ON FUNCTION find_listed_buildings_nearby IS 'Find listed buildings within specified radius of coordinates';
COMMENT ON FUNCTION get_property_status IS 'Get full property planning status (RED/AMBER/GREEN)';
