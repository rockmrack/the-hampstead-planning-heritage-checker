"""
Utility functions for data ingestion scripts.
Provides database connections, geometry validation, and common helpers.
"""

import os
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

import httpx
from dotenv import load_dotenv
from supabase import create_client, Client
from shapely.geometry import shape, mapping
from shapely.validation import make_valid
from shapely import wkt

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client using environment variables.
    
    Returns:
        Supabase Client instance
        
    Raises:
        ValueError: If required environment variables are missing
    """
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError(
            "Missing required environment variables: "
            "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
        )
    
    return create_client(supabase_url, supabase_key)


def validate_geometry(geom: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Validate and fix a GeoJSON geometry.
    
    Args:
        geom: GeoJSON geometry dictionary
        
    Returns:
        Valid GeoJSON geometry or None if invalid
    """
    try:
        shapely_geom = shape(geom)
        
        if not shapely_geom.is_valid:
            logger.warning("Fixing invalid geometry")
            shapely_geom = make_valid(shapely_geom)
        
        if shapely_geom.is_empty:
            logger.warning("Empty geometry after validation")
            return None
            
        return mapping(shapely_geom)
        
    except Exception as e:
        logger.error(f"Geometry validation failed: {e}")
        return None


def geometry_to_wkt(geom: Dict[str, Any]) -> Optional[str]:
    """
    Convert GeoJSON geometry to WKT string for PostGIS.
    
    Args:
        geom: GeoJSON geometry dictionary
        
    Returns:
        WKT string or None if conversion fails
    """
    try:
        validated = validate_geometry(geom)
        if validated:
            return shape(validated).wkt
        return None
    except Exception as e:
        logger.error(f"WKT conversion failed: {e}")
        return None


def ensure_multipolygon(geom: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure geometry is a MultiPolygon (required by our schema).
    
    Args:
        geom: GeoJSON geometry dictionary
        
    Returns:
        MultiPolygon GeoJSON geometry
    """
    if geom['type'] == 'Polygon':
        return {
            'type': 'MultiPolygon',
            'coordinates': [geom['coordinates']]
        }
    return geom


# Target boroughs for NW London
TARGET_BOROUGHS = [
    'Camden',
    'Barnet', 
    'Westminster',
    'Haringey',
    'Brent',
    'Islington'
]

# Target postcodes
TARGET_POSTCODES = [
    'NW1', 'NW2', 'NW3', 'NW4', 'NW5', 'NW6', 'NW8', 'NW9', 'NW10', 'NW11',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N10', 'N11', 'N12',
    'W1', 'W2', 'W9', 'W10', 'W11'
]


def is_target_borough(borough: str) -> bool:
    """Check if borough is in our target list."""
    if not borough:
        return False
    borough_clean = borough.strip().title()
    return any(target.lower() in borough_clean.lower() for target in TARGET_BOROUGHS)


def is_target_postcode(postcode: str) -> bool:
    """Check if postcode is in our target area."""
    if not postcode:
        return False
    postcode_prefix = postcode.strip().upper().split()[0][:3]
    return any(postcode_prefix.startswith(p) for p in TARGET_POSTCODES)


def batch_insert(
    client: Client,
    table: str,
    records: List[Dict[str, Any]],
    batch_size: int = 100
) -> int:
    """
    Insert records in batches to avoid timeout issues.
    
    Args:
        client: Supabase client
        table: Table name
        records: List of records to insert
        batch_size: Number of records per batch
        
    Returns:
        Total number of records inserted
    """
    total = 0
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        try:
            client.table(table).upsert(batch, on_conflict='list_entry_number').execute()
            total += len(batch)
            logger.info(f"Inserted batch {i // batch_size + 1}: {len(batch)} records")
        except Exception as e:
            logger.error(f"Batch insert failed: {e}")
            # Try individual inserts for failed batch
            for record in batch:
                try:
                    client.table(table).upsert(record, on_conflict='list_entry_number').execute()
                    total += 1
                except Exception as e2:
                    logger.error(f"Individual insert failed: {e2}")
    
    return total


def fetch_json(url: str, timeout: int = 30) -> Optional[Dict[str, Any]]:
    """
    Fetch JSON from a URL with error handling.
    
    Args:
        url: URL to fetch
        timeout: Request timeout in seconds
        
    Returns:
        Parsed JSON or None on error
    """
    try:
        with httpx.Client(timeout=timeout) as client:
            response = client.get(url)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Failed to fetch {url}: {e}")
        return None


def parse_date(date_str: str) -> Optional[str]:
    """
    Parse various date formats to ISO format.
    
    Args:
        date_str: Date string in various formats
        
    Returns:
        ISO format date string or None
    """
    if not date_str:
        return None
        
    formats = [
        '%Y-%m-%d',
        '%d/%m/%Y',
        '%d-%m-%Y',
        '%Y/%m/%d',
        '%d %B %Y',
        '%B %d, %Y'
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    
    logger.warning(f"Could not parse date: {date_str}")
    return None


class ProgressTracker:
    """Track and log progress during data ingestion."""
    
    def __init__(self, total: int, name: str = "Records"):
        self.total = total
        self.name = name
        self.processed = 0
        self.success = 0
        self.failed = 0
        self.skipped = 0
        self.start_time = datetime.now()
    
    def increment(self, success: bool = True, skipped: bool = False):
        self.processed += 1
        if skipped:
            self.skipped += 1
        elif success:
            self.success += 1
        else:
            self.failed += 1
        
        if self.processed % 100 == 0:
            self._log_progress()
    
    def _log_progress(self):
        elapsed = (datetime.now() - self.start_time).total_seconds()
        rate = self.processed / elapsed if elapsed > 0 else 0
        remaining = (self.total - self.processed) / rate if rate > 0 else 0
        
        logger.info(
            f"{self.name}: {self.processed}/{self.total} "
            f"({self.success} success, {self.failed} failed, {self.skipped} skipped) "
            f"- {rate:.1f}/s, ~{remaining:.0f}s remaining"
        )
    
    def summary(self):
        elapsed = (datetime.now() - self.start_time).total_seconds()
        logger.info(
            f"\n{'='*50}\n"
            f"{self.name} Ingestion Complete\n"
            f"{'='*50}\n"
            f"Total Processed: {self.processed}\n"
            f"Successful: {self.success}\n"
            f"Failed: {self.failed}\n"
            f"Skipped: {self.skipped}\n"
            f"Time: {elapsed:.1f} seconds\n"
            f"{'='*50}"
        )
