"""
Conservation Areas Data Ingestion Script

This script fetches conservation area boundary data from the London Datastore
and borough-specific sources, then inserts it into the Supabase database
with PostGIS MultiPolygon geometries.

Data Sources:
- London Datastore: https://data.london.gov.uk/dataset/conservation-areas
- Camden: https://opendata.camden.gov.uk/
- Barnet: https://open.barnet.gov.uk/
- Westminster: https://www.westminster.gov.uk/planning-building-and-environmental-regulations/city-plan-neighbourhood-planning-and-டmilestones/conservation-areas

Usage:
    python -m scripts.data_ingestion.ingest_conservation_areas
    
Or with specific file:
    python -m scripts.data_ingestion.ingest_conservation_areas --file data/conservation_areas.geojson
"""

import argparse
import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

from shapely.geometry import shape, mapping
from shapely.validation import make_valid
from shapely.ops import unary_union

from .utils import (
    get_supabase_client,
    validate_geometry,
    ensure_multipolygon,
    is_target_borough,
    parse_date,
    ProgressTracker,
    TARGET_BOROUGHS
)

logger = logging.getLogger(__name__)

# London Datastore API
LONDON_DATASTORE_CA_URL = "https://data.london.gov.uk/api/views/conservation-areas/rows.json"

# Borough-specific data URLs (GeoJSON endpoints)
BOROUGH_DATA_URLS = {
    'Camden': 'https://opendata.camden.gov.uk/api/geospatial/conservation-areas?method=export&format=GeoJSON',
    'Barnet': 'https://open.barnet.gov.uk/download/conservation-areas/geojson',
    # Add more borough URLs as they become available
}


def validate_and_resolve_filepath(filepath: str, allowed_extensions: tuple = ('.json', '.geojson')) -> Path:
    """
    Validate and resolve a file path to prevent path traversal attacks.
    
    This function implements multiple layers of security:
    1. Path resolution to absolute path
    2. File extension validation
    3. File existence check
    4. Sensitive directory blocking
    5. Base directory allowlisting (if DATA_DIR env var is set)
    
    Args:
        filepath: The file path to validate
        allowed_extensions: Tuple of allowed file extensions
        
    Returns:
        Resolved absolute Path object
        
    Raises:
        ValueError: If the path is invalid or outside allowed directories
    """
    import os
    from pathlib import Path
    
    # Resolve to absolute path
    resolved_path = Path(filepath).resolve()
    
    # Check file extension
    if resolved_path.suffix.lower() not in allowed_extensions:
        raise ValueError(f"Invalid file extension. Allowed: {allowed_extensions}")
    
    # Check that the file exists
    if not resolved_path.exists():
        raise ValueError(f"File does not exist: {resolved_path}")
    
    # Check it's a file, not a directory
    if not resolved_path.is_file():
        raise ValueError(f"Path is not a file: {resolved_path}")
    
    # Prevent access to sensitive directories (blocklist)
    sensitive_patterns = ['/etc/', '/var/', '/usr/', '/root/',
                         '\\windows\\', '\\system32\\', '\\program files\\']
    path_str = str(resolved_path).lower()
    for pattern in sensitive_patterns:
        if pattern in path_str:
            raise ValueError("Access to system directories is not allowed")
    
    # Optional: Enforce base directory allowlist via environment variable
    allowed_data_dir = os.environ.get('DATA_INGESTION_ALLOWED_DIR')
    if allowed_data_dir:
        allowed_base = Path(allowed_data_dir).resolve()
        try:
            resolved_path.relative_to(allowed_base)
        except ValueError:
            raise ValueError(
                f"File must be within allowed directory: {allowed_base}. "
                f"Set DATA_INGESTION_ALLOWED_DIR env var to change this."
            )
    
    logger.info(f"Validated safe file path: {resolved_path}")
    return resolved_path


def safe_read_json_file(filepath: str, allowed_extensions: tuple = ('.json', '.geojson')) -> Dict[str, Any]:
    """
    Safely read and parse a JSON file with path validation.
    
    Args:
        filepath: Path to the JSON file
        allowed_extensions: Tuple of allowed extensions
        
    Returns:
        Parsed JSON data
    """
    validated_path = validate_and_resolve_filepath(filepath, allowed_extensions)
    # nosec: Path is validated above
    with open(str(validated_path), 'r', encoding='utf-8') as f:  # nosec B602
        return json.load(f)


def fetch_conservation_areas_from_file(filepath: str) -> List[Dict[str, Any]]:
    """
    Load conservation areas from a local GeoJSON file.
    
    Args:
        filepath: Path to the GeoJSON file
        
    Returns:
        List of conservation area features
    """
    # Use safe file reader with path validation
    data = safe_read_json_file(filepath, ('.json', '.geojson'))
    
    if 'features' not in data:
        raise ValueError(f"Invalid GeoJSON: no 'features' array in file")
    
    return data['features']


def fetch_conservation_areas_from_url(url: str) -> List[Dict[str, Any]]:
    """
    Fetch conservation areas from a URL.
    
    Args:
        url: GeoJSON endpoint URL
        
    Returns:
        List of conservation area features
    """
    import httpx
    
    logger.info(f"Fetching conservation areas from {url}")
    
    try:
        with httpx.Client(timeout=60) as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if 'features' in data:
                return data['features']
            else:
                logger.warning(f"No features in response from {url}")
                return []
                
    except Exception as e:
        logger.error(f"Failed to fetch from {url}: {e}")
        return []


def transform_ca_record(feature: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Transform a conservation area GeoJSON feature to our database schema.
    
    Args:
        feature: GeoJSON feature
        
    Returns:
        Transformed record for database insertion
    """
    try:
        properties = feature.get('properties', {})
        geometry = feature.get('geometry')
        
        if not geometry:
            logger.warning(f"No geometry for {properties.get('name', 'Unknown')}")
            return None
        
        # Validate and fix geometry
        validated_geom = validate_geometry(geometry)
        if not validated_geom:
            return None
        
        # Ensure MultiPolygon
        if validated_geom['type'] == 'Polygon':
            validated_geom = ensure_multipolygon(validated_geom)
        elif validated_geom['type'] not in ['MultiPolygon', 'Polygon']:
            logger.warning(f"Unexpected geometry type: {validated_geom['type']}")
            return None
        
        # Extract borough
        borough = (
            properties.get('borough') or 
            properties.get('Borough') or 
            properties.get('LOCAL_AUTHORITY') or
            properties.get('LocalAuthority') or
            ''
        )
        
        # Normalize borough name
        borough_map = {
            'LB Camden': 'Camden',
            'LB Barnet': 'Barnet',
            'City of Westminster': 'Westminster',
            'LB Haringey': 'Haringey',
            'LB Brent': 'Brent',
            'LB Islington': 'Islington'
        }
        borough = borough_map.get(borough, borough)
        
        if not is_target_borough(borough):
            return None  # Not in target borough
        
        # Extract name
        name = (
            properties.get('CA_NAME') or
            properties.get('name') or
            properties.get('Name') or
            properties.get('NAME') or
            properties.get('conservation_area_name') or
            'Unknown Conservation Area'
        )
        
        # Extract reference
        reference = (
            properties.get('CA_REF') or
            properties.get('reference') or
            properties.get('REF') or
            properties.get('ca_id') or
            None
        )
        
        # Calculate area
        try:
            shapely_geom = shape(validated_geom)
            # Approximate area in hectares (degrees to hectares is very rough)
            # For accurate area, we should project to a local CRS
            area_hectares = shapely_geom.area * 111319.9 * 111319.9 / 10000  # Very rough approximation
        except:
            area_hectares = None
        
        # Check for Article 4
        has_article_4 = (
            properties.get('has_article_4', False) or
            properties.get('ARTICLE_4', False) or
            properties.get('article4', False) or
            'article 4' in str(properties).lower()
        )
        
        # Extract Article 4 restrictions
        article_4_restrictions = None
        if has_article_4:
            restrictions_raw = properties.get('article_4_restrictions') or properties.get('A4_RESTRICTIONS')
            if restrictions_raw:
                if isinstance(restrictions_raw, list):
                    article_4_restrictions = restrictions_raw
                elif isinstance(restrictions_raw, str):
                    article_4_restrictions = [r.strip() for r in restrictions_raw.split(',')]
        
        return {
            'name': name,
            'reference': reference,
            'borough': borough,
            'designation_date': parse_date(properties.get('designation_date') or properties.get('DATE_DESIGNATED')),
            'boundary_wkt': shape(validated_geom).wkt,  # WKT for PostGIS
            'area_hectares': area_hectares,
            'description': properties.get('description') or properties.get('DESCRIPTION'),
            'character_appraisal_url': properties.get('character_appraisal_url') or properties.get('CA_URL'),
            'management_plan_url': properties.get('management_plan_url'),
            'has_article_4': has_article_4,
            'article_4_restrictions': article_4_restrictions,
            'article_4_date': parse_date(properties.get('article_4_date') or properties.get('A4_DATE')),
            'data_source': properties.get('data_source', 'london_datastore')
        }
        
    except Exception as e:
        logger.error(f"Error transforming CA record: {e}")
        return None


def ingest_conservation_areas(
    filepath: Optional[str] = None,
    borough: Optional[str] = None,
    dry_run: bool = False
) -> Dict[str, int]:
    """
    Main ingestion function for conservation areas.
    
    Args:
        filepath: Path to GeoJSON file (if None, fetches from URLs)
        borough: Filter by specific borough
        dry_run: If True, don't insert data
        
    Returns:
        Statistics dictionary
    """
    logger.info("Starting Conservation Areas ingestion...")
    
    features = []
    
    if filepath:
        features = fetch_conservation_areas_from_file(filepath)
    else:
        # Fetch from all borough URLs
        for borough_name, url in BOROUGH_DATA_URLS.items():
            if borough and borough.lower() != borough_name.lower():
                continue
            features.extend(fetch_conservation_areas_from_url(url))
    
    if not features:
        logger.warning("No conservation areas to process")
        return {'total': 0, 'inserted': 0, 'skipped': 0, 'failed': 0}
    
    logger.info(f"Processing {len(features)} features...")
    
    # Transform records
    tracker = ProgressTracker(len(features), "Conservation Areas")
    transformed = []
    
    for feature in features:
        result = transform_ca_record(feature)
        if result:
            transformed.append(result)
            tracker.increment(success=True)
        else:
            tracker.increment(skipped=True)
    
    logger.info(f"Transformed {len(transformed)} valid records")
    
    if dry_run:
        logger.info("Dry run - not inserting data")
        tracker.summary()
        return {
            'total': len(features),
            'transformed': len(transformed),
            'inserted': 0,
            'skipped': tracker.skipped,
            'failed': 0
        }
    
    # Insert into database
    client = get_supabase_client()
    inserted = 0
    failed = 0
    
    for record in transformed:
        try:
            # Use RPC function to insert with geometry
            client.rpc('insert_conservation_area', {
                'p_name': record['name'],
                'p_reference': record['reference'],
                'p_borough': record['borough'],
                'p_designation_date': record['designation_date'],
                'p_boundary_wkt': record['boundary_wkt'],
                'p_area_hectares': record['area_hectares'],
                'p_description': record['description'],
                'p_character_appraisal_url': record['character_appraisal_url'],
                'p_management_plan_url': record['management_plan_url'],
                'p_has_article_4': record['has_article_4'],
                'p_article_4_restrictions': record['article_4_restrictions'],
                'p_article_4_date': record['article_4_date'],
                'p_data_source': record['data_source']
            }).execute()
            inserted += 1
        except Exception as e:
            logger.error(f"Insert failed for {record['name']}: {e}")
            failed += 1
    
    tracker.summary()
    
    return {
        'total': len(features),
        'transformed': len(transformed),
        'inserted': inserted,
        'skipped': tracker.skipped,
        'failed': failed
    }


def create_insert_function():
    """
    SQL function to create in Supabase for inserting conservation areas.
    Run this in Supabase SQL editor first.
    """
    return """
    CREATE OR REPLACE FUNCTION insert_conservation_area(
        p_name VARCHAR,
        p_reference VARCHAR,
        p_borough VARCHAR,
        p_designation_date DATE,
        p_boundary_wkt TEXT,
        p_area_hectares DECIMAL,
        p_description TEXT,
        p_character_appraisal_url TEXT,
        p_management_plan_url TEXT,
        p_has_article_4 BOOLEAN,
        p_article_4_restrictions TEXT[],
        p_article_4_date DATE,
        p_data_source VARCHAR
    ) RETURNS UUID AS $$
    DECLARE
        v_id UUID;
    BEGIN
        INSERT INTO conservation_areas (
            name, reference, borough, designation_date, boundary,
            area_hectares, description, character_appraisal_url, management_plan_url,
            has_article_4, article_4_restrictions, article_4_date, data_source
        ) VALUES (
            p_name, p_reference, p_borough, p_designation_date,
            ST_GeomFromText(p_boundary_wkt, 4326),
            p_area_hectares, p_description, p_character_appraisal_url, p_management_plan_url,
            p_has_article_4, p_article_4_restrictions, p_article_4_date, p_data_source
        )
        ON CONFLICT ON CONSTRAINT unique_borough_reference DO UPDATE SET
            name = EXCLUDED.name,
            designation_date = EXCLUDED.designation_date,
            boundary = EXCLUDED.boundary,
            area_hectares = EXCLUDED.area_hectares,
            description = EXCLUDED.description,
            character_appraisal_url = EXCLUDED.character_appraisal_url,
            management_plan_url = EXCLUDED.management_plan_url,
            has_article_4 = EXCLUDED.has_article_4,
            article_4_restrictions = EXCLUDED.article_4_restrictions,
            article_4_date = EXCLUDED.article_4_date,
            updated_at = NOW()
        RETURNING id INTO v_id;
        
        RETURN v_id;
    END;
    $$ LANGUAGE plpgsql;
    """


def create_sample_geojson():
    """
    Create a sample GeoJSON file with conservation area boundaries.
    This can be used for testing when real data is not available.
    """
    sample_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Hampstead Conservation Area",
                    "reference": "CA001",
                    "borough": "Camden",
                    "designation_date": "1967-01-01",
                    "has_article_4": True,
                    "article_4_restrictions": ["Front boundary walls", "Roof materials", "Windows"],
                    "description": "Historic Hampstead Village"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-0.1850, 51.5520],
                        [-0.1850, 51.5650],
                        [-0.1680, 51.5650],
                        [-0.1680, 51.5520],
                        [-0.1850, 51.5520]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Highgate Conservation Area",
                    "reference": "CA002",
                    "borough": "Camden",
                    "designation_date": "1968-05-01",
                    "has_article_4": True,
                    "description": "Historic Highgate Village"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-0.1520, 51.5640],
                        [-0.1520, 51.5720],
                        [-0.1380, 51.5720],
                        [-0.1380, 51.5640],
                        [-0.1520, 51.5640]
                    ]]
                }
            }
        ]
    }
    
    return json.dumps(sample_data, indent=2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Ingest Conservation Areas')
    parser.add_argument('--file', type=str, help='Path to GeoJSON file')
    parser.add_argument('--borough', type=str, help='Filter by borough')
    parser.add_argument('--dry-run', action='store_true', help='Don\'t insert data')
    parser.add_argument('--create-sample', action='store_true', help='Create sample GeoJSON')
    
    args = parser.parse_args()
    
    if args.create_sample:
        print(create_sample_geojson())
        exit(0)
    
    result = ingest_conservation_areas(
        filepath=args.file,
        borough=args.borough,
        dry_run=args.dry_run
    )
    
    print(f"\nIngestion complete: {result}")
