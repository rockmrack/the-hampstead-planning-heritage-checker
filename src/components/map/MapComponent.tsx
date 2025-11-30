'use client';

/**
 * MapComponent - Wrapper/alias for HeritageMap
 * Used for dynamic imports in pages that need a map component
 */
import HeritageMap from './HeritageMap';

// Re-export HeritageMap as the default MapComponent
const MapComponent = HeritageMap;

export default MapComponent;
export { HeritageMap };
