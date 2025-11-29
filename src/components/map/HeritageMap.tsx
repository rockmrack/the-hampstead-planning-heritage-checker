/**
 * Interactive Map Component
 * Displays conservation areas, listed buildings, and search results using Mapbox GL JS
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAP_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Coordinates, ConservationArea, ListedBuilding, PropertyCheckResult } from '@/types';

// Set Mapbox access token
const MAPBOX_TOKEN = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];

interface HeritageMapProps {
  className?: string;
  searchResult?: PropertyCheckResult | null;
  conservationAreas?: ConservationArea[];
  listedBuildings?: ListedBuilding[];
  onMapLoad?: (map: mapboxgl.Map) => void;
  onMarkerClick?: (type: 'listed' | 'conservation', id: number) => void;
  showLegend?: boolean;
  interactive?: boolean;
}

export default function HeritageMap({
  className,
  searchResult,
  conservationAreas = [],
  listedBuildings = [],
  onMapLoad,
  onMarkerClick,
  showLegend = true,
  interactive = true,
}: HeritageMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const searchMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) {
      setError('Map configuration error. Please check your Mapbox token.');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_CONFIG.styles.light,
        center: [MAP_CONFIG.defaultCenter.longitude, MAP_CONFIG.defaultCenter.latitude],
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        interactive,
        attributionControl: true,
        preserveDrawingBuffer: true, // Needed for map snapshots
      });

      // Add navigation controls
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.addControl(
          new mapboxgl.FullscreenControl(),
          'top-right'
        );

        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: false,
          }),
          'top-right'
        );
      }

      // Handle map load
      map.current.on('load', () => {
        setMapLoaded(true);
        onMapLoad?.(map.current!);
      });

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Map failed to load. Please refresh the page.');
      });
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map.');
    }

    return () => {
      map.current?.remove();
    };
  }, [interactive, onMapLoad]);

  // Add conservation areas layer
  useEffect(() => {
    if (!map.current || !mapLoaded || conservationAreas.length === 0) {
      return;
    }

    // Create GeoJSON from conservation areas
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: conservationAreas
        .filter((area) => area.boundary)
        .map((area) => ({
          type: 'Feature' as const,
          properties: {
            id: area.id,
            name: area.name,
            borough: area.borough,
            hasArticle4: area.hasArticle4,
          },
          geometry: area.boundary as GeoJSON.Geometry,
        })),
    };

    // Add source if it doesn't exist
    if (!map.current.getSource('conservation-areas')) {
      map.current.addSource('conservation-areas', {
        type: 'geojson',
        data: geojsonData,
      });

      // Add fill layer
      map.current.addLayer({
        id: 'conservation-areas-fill',
        type: 'fill',
        source: 'conservation-areas',
        paint: {
          'fill-color': MAP_CONFIG.colors.conservationArea.fill,
          'fill-opacity': 0.5,
        },
      });

      // Add outline layer
      map.current.addLayer({
        id: 'conservation-areas-outline',
        type: 'line',
        source: 'conservation-areas',
        paint: {
          'line-color': MAP_CONFIG.colors.conservationArea.outline,
          'line-width': 2,
        },
      });

      // Add click handler
      if (interactive) {
        map.current.on('click', 'conservation-areas-fill', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            onMarkerClick?.('conservation', props?.id);

            // Show popup
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold text-sm">${props?.name}</h3>
                  <p class="text-xs text-gray-600">${props?.borough}</p>
                  ${props?.hasArticle4 ? '<p class="text-xs text-red-600 mt-1">Article 4 Direction applies</p>' : ''}
                </div>
              `)
              .addTo(map.current!);
          }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'conservation-areas-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });
        map.current.on('mouseleave', 'conservation-areas-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
          }
        });
      }
    } else {
      // Update existing source
      (map.current.getSource('conservation-areas') as mapboxgl.GeoJSONSource).setData(geojsonData);
    }
  }, [mapLoaded, conservationAreas, interactive, onMarkerClick]);

  // Add listed buildings markers
  useEffect(() => {
    if (!map.current || !mapLoaded || listedBuildings.length === 0) {
      return;
    }

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.listed-building-marker');
    existingMarkers.forEach((marker) => marker.remove());

    // Add markers for each listed building
    listedBuildings.forEach((building) => {
      if (!building.location) {
        return;
      }

      const el = document.createElement('div');
      el.className = 'listed-building-marker';
      el.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: ${MAP_CONFIG.colors.listedBuilding.marker};
        border: 2px solid ${MAP_CONFIG.colors.listedBuilding.outline};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${building.name}</h3>
          <p class="text-xs text-gray-600">Grade ${building.grade}</p>
          <p class="text-xs text-gray-500">Entry: ${building.listEntryNumber}</p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([building.location.coordinates[0], building.location.coordinates[1]])
        .setPopup(popup)
        .addTo(map.current!);

      if (interactive) {
        el.addEventListener('click', () => {
          onMarkerClick?.('listed', building.id);
        });
      }
    });
  }, [mapLoaded, listedBuildings, interactive, onMarkerClick]);

  // Update search result marker
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }

    // Remove existing search marker
    if (searchMarker.current) {
      searchMarker.current.remove();
      searchMarker.current = null;
    }

    if (searchResult) {
      const { coordinates, status } = searchResult;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'search-result-marker';
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${MAP_CONFIG.colors.searchResult.marker};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;

      // Add pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-sm mb-1">${searchResult.address}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-1 rounded text-xs font-medium ${
              status === 'RED'
                ? 'bg-red-100 text-red-800'
                : status === 'AMBER'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-green-100 text-green-800'
            }">
              ${status === 'RED' ? 'Listed Building' : status === 'AMBER' ? 'Conservation Area' : 'Standard Zone'}
            </span>
          </div>
          ${searchResult.conservationArea ? `<p class="text-xs text-gray-600">${searchResult.conservationArea.name}</p>` : ''}
        </div>
      `;

      searchMarker.current = new mapboxgl.Marker(el)
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current);

      // Fly to the location
      map.current.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 16,
        duration: 1500,
        essential: true,
      });

      // Open popup after animation
      setTimeout(() => {
        searchMarker.current?.togglePopup();
      }, 1600);
    }
  }, [mapLoaded, searchResult]);

  // Get map canvas for snapshot
  const getMapSnapshot = useCallback((): string | null => {
    if (!map.current) {
      return null;
    }
    return map.current.getCanvas().toDataURL('image/png');
  }, []);

  // Expose snapshot function via ref or callback
  useEffect(() => {
    if (mapLoaded && map.current) {
      (map.current as unknown as { getSnapshot: () => string | null }).getSnapshot = getMapSnapshot;
    }
  }, [mapLoaded, getMapSnapshot]);

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)}>
        <div className="text-center p-8">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">
            Please check your internet connection and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">Loading map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      {showLegend && mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
          <h4 className="font-semibold mb-2">Map Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: MAP_CONFIG.colors.conservationArea.fill }}
              />
              <span>Conservation Area</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: MAP_CONFIG.colors.listedBuilding.marker,
                  border: `2px solid ${MAP_CONFIG.colors.listedBuilding.outline}`,
                }}
              />
              <span>Listed Building</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: MAP_CONFIG.colors.searchResult.marker,
                  border: '2px solid white',
                }}
              />
              <span>Search Result</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
