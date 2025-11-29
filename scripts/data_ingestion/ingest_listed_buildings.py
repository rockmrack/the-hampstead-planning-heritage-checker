"""
Historic England Listed Buildings Data Ingestion Script

This script fetches listed building data from the Historic England API
and inserts it into the Supabase database with PostGIS point geometries.

Data Source: Historic England Listed Building API
https://historicengland.org.uk/listing/the-list/data-downloads/

Usage:
    python -m scripts.data_ingestion.ingest_listed_buildings
    
Or with specific borough:
    python -m scripts.data_ingestion.ingest_listed_buildings --borough Camden
"""

import argparse
import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

import httpx
from shapely.geometry import Point

from .utils import (
    get_supabase_client,
    is_target_borough,
    is_target_postcode,
    parse_date,
    ProgressTracker,
    TARGET_BOROUGHS
)

logger = logging.getLogger(__name__)

# Historic England API endpoints
HE_API_BASE = "https://historicengland.org.uk/listing/the-list"
HE_SEARCH_API = "https://historicengland.org.uk/listing/the-list/results"

# London bounding box for filtering
LONDON_BOUNDS = {
    'min_lng': -0.5103,
    'max_lng': 0.3340,
    'min_lat': 51.2867,
    'max_lat': 51.6919
}

# NW London specific bounds (tighter)
NW_LONDON_BOUNDS = {
    'min_lng': -0.30,
    'max_lng': 0.00,
    'min_lat': 51.50,
    'max_lat': 51.65
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


def fetch_listed_buildings_from_file(filepath: str) -> List[Dict[str, Any]]:
    """
    Load listed buildings from a local GeoJSON/JSON file.
    
    Args:
        filepath: Path to the data file
        
    Returns:
        List of listed building records
    """
    # Use safe file reader with path validation
    data = safe_read_json_file(filepath, ('.json', '.geojson'))
    
    if 'features' in data:
        # GeoJSON format
        return data['features']
    elif isinstance(data, list):
        return data
    else:
        raise ValueError(f"Unexpected data format in {filepath}")


def fetch_listed_buildings_from_api(
    borough: Optional[str] = None,
    grade: Optional[str] = None,
    limit: int = 10000
) -> List[Dict[str, Any]]:
    """
    Fetch listed buildings from Historic England API.
    
    Note: The official API has rate limits. For bulk download,
    use the CSV/GeoJSON exports from the website instead.
    
    Args:
        borough: Filter by borough name
        grade: Filter by listing grade (I, II*, II)
        limit: Maximum records to fetch
        
    Returns:
        List of listed building records
    """
    logger.info("Fetching listed buildings from Historic England API...")
    
    # Historic England doesn't have a public bulk API
    # This is a placeholder - in production, use the downloadable datasets
    logger.warning(
        "Historic England API doesn't support bulk downloads. "
        "Please download the dataset from: "
        "https://historicengland.org.uk/listing/the-list/data-downloads/"
    )
    
    return []


def transform_he_record(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Transform a Historic England record to our database schema.
    
    Args:
        record: Raw Historic England record
        
    Returns:
        Transformed record for database insertion
    """
    try:
        # Handle both GeoJSON features and raw records
        properties = record.get('properties', record)
        geometry = record.get('geometry')
        
        # Extract coordinates
        if geometry and geometry.get('type') == 'Point':
            lng, lat = geometry['coordinates']
        else:
            # Try to get from properties
            lng = properties.get('Longitude') or properties.get('longitude') or properties.get('Easting')
            lat = properties.get('Latitude') or properties.get('latitude') or properties.get('Northing')
            
            if lng is None or lat is None:
                logger.warning(f"No coordinates for {properties.get('Name', 'Unknown')}")
                return None
        
        # Validate coordinates are in London
        if not (NW_LONDON_BOUNDS['min_lng'] <= float(lng) <= NW_LONDON_BOUNDS['max_lng'] and
                NW_LONDON_BOUNDS['min_lat'] <= float(lat) <= NW_LONDON_BOUNDS['max_lat']):
            return None  # Outside target area
        
        # Extract and validate borough
        borough = (
            properties.get('LocalAuthority') or 
            properties.get('District') or 
            properties.get('Borough') or
            ''
        )
        
        if borough and not is_target_borough(borough):
            return None  # Not in target borough
        
        # Extract grade
        grade_raw = properties.get('Grade') or properties.get('grade') or 'II'
        grade_map = {
            'I': 'I',
            'II*': 'II*',
            'II': 'II',
            '2*': 'II*',
            '2': 'II',
            '1': 'I'
        }
        grade = grade_map.get(str(grade_raw).strip(), 'II')
        
        # Build the record
        return {
            'list_entry_number': str(properties.get('ListEntry') or properties.get('list_entry') or properties.get('ListEntryNumber')),
            'name': properties.get('Name') or properties.get('name') or 'Unknown',
            'grade': grade,
            'address_line_1': properties.get('Location') or properties.get('Address') or properties.get('address'),
            'address_line_2': properties.get('Address2') or None,
            'town': properties.get('Town') or properties.get('PostTown') or 'London',
            'postcode': properties.get('Postcode') or properties.get('postcode'),
            'borough': borough,
            'location': f"POINT({lng} {lat})",  # WKT for PostGIS
            'list_date': parse_date(properties.get('ListDate') or properties.get('DateListed')),
            'amended_date': parse_date(properties.get('AmendDate') or properties.get('DateAmended')),
            'legacy_uid': properties.get('LegacyUID') or properties.get('legacy_uid'),
            'documentation_url': properties.get('Hyperlink') or properties.get('URL'),
            'data_source': 'historic_england'
        }
        
    except Exception as e:
        logger.error(f"Error transforming record: {e}")
        return None


def ingest_listed_buildings(
    source: str = 'file',
    filepath: Optional[str] = None,
    borough: Optional[str] = None,
    dry_run: bool = False
) -> Dict[str, int]:
    """
    Main ingestion function for listed buildings.
    
    Args:
        source: Data source ('file' or 'api')
        filepath: Path to data file (if source='file')
        borough: Filter by borough
        dry_run: If True, don't insert data
        
    Returns:
        Statistics dictionary
    """
    logger.info("Starting Listed Buildings ingestion...")
    
    # Get data
    if source == 'file' and filepath:
        records = fetch_listed_buildings_from_file(filepath)
    else:
        records = fetch_listed_buildings_from_api(borough=borough)
    
    if not records:
        logger.warning("No records to process")
        return {'total': 0, 'inserted': 0, 'skipped': 0, 'failed': 0}
    
    logger.info(f"Processing {len(records)} records...")
    
    # Transform records
    tracker = ProgressTracker(len(records), "Listed Buildings")
    transformed = []
    
    for record in records:
        result = transform_he_record(record)
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
            'total': len(records),
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
            # Convert WKT to PostGIS geometry using SQL
            client.rpc('insert_listed_building', {
                'p_list_entry_number': record['list_entry_number'],
                'p_name': record['name'],
                'p_grade': record['grade'],
                'p_address_line_1': record['address_line_1'],
                'p_address_line_2': record['address_line_2'],
                'p_town': record['town'],
                'p_postcode': record['postcode'],
                'p_borough': record['borough'],
                'p_lng': float(record['location'].split()[0].replace('POINT(', '')),
                'p_lat': float(record['location'].split()[1].replace(')', '')),
                'p_list_date': record['list_date'],
                'p_amended_date': record['amended_date'],
                'p_legacy_uid': record['legacy_uid'],
                'p_documentation_url': record['documentation_url']
            }).execute()
            inserted += 1
        except Exception as e:
            logger.error(f"Insert failed for {record['list_entry_number']}: {e}")
            failed += 1
    
    tracker.summary()
    
    return {
        'total': len(records),
        'transformed': len(transformed),
        'inserted': inserted,
        'skipped': tracker.skipped,
        'failed': failed
    }


def create_insert_function():
    """
    SQL function to create in Supabase for inserting listed buildings.
    Run this in Supabase SQL editor first.
    """
    return """
    CREATE OR REPLACE FUNCTION insert_listed_building(
        p_list_entry_number VARCHAR,
        p_name VARCHAR,
        p_grade listed_building_grade,
        p_address_line_1 VARCHAR,
        p_address_line_2 VARCHAR,
        p_town VARCHAR,
        p_postcode VARCHAR,
        p_borough VARCHAR,
        p_lng DECIMAL,
        p_lat DECIMAL,
        p_list_date DATE,
        p_amended_date DATE,
        p_legacy_uid VARCHAR,
        p_documentation_url TEXT
    ) RETURNS UUID AS $$
    DECLARE
        v_id UUID;
    BEGIN
        INSERT INTO listed_buildings (
            list_entry_number, name, grade, address_line_1, address_line_2,
            town, postcode, borough, location, list_date, amended_date,
            legacy_uid, documentation_url
        ) VALUES (
            p_list_entry_number, p_name, p_grade, p_address_line_1, p_address_line_2,
            p_town, p_postcode, p_borough, 
            ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326),
            p_list_date, p_amended_date, p_legacy_uid, p_documentation_url
        )
        ON CONFLICT (list_entry_number) DO UPDATE SET
            name = EXCLUDED.name,
            grade = EXCLUDED.grade,
            address_line_1 = EXCLUDED.address_line_1,
            address_line_2 = EXCLUDED.address_line_2,
            town = EXCLUDED.town,
            postcode = EXCLUDED.postcode,
            borough = EXCLUDED.borough,
            location = EXCLUDED.location,
            amended_date = EXCLUDED.amended_date,
            documentation_url = EXCLUDED.documentation_url,
            updated_at = NOW()
        RETURNING id INTO v_id;
        
        RETURN v_id;
    END;
    $$ LANGUAGE plpgsql;
    """


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Ingest Historic England Listed Buildings')
    parser.add_argument('--source', choices=['file', 'api'], default='file',
                        help='Data source')
    parser.add_argument('--file', type=str, help='Path to GeoJSON/JSON file')
    parser.add_argument('--borough', type=str, help='Filter by borough')
    parser.add_argument('--dry-run', action='store_true', help='Don\'t insert data')
    
    args = parser.parse_args()
    
    if args.source == 'file' and not args.file:
        print("Error: --file required when source is 'file'")
        print("\nDownload data from:")
        print("https://historicengland.org.uk/listing/the-list/data-downloads/")
        exit(1)
    
    result = ingest_listed_buildings(
        source=args.source,
        filepath=args.file,
        borough=args.borough,
        dry_run=args.dry_run
    )
    
    print(f"\nIngestion complete: {result}")
