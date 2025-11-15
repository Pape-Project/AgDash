import { useRef, useEffect } from 'react';
import Map from 'react-map-gl/maplibre';
import type { EnhancedCountyData } from '../../types/ag';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  selectedCounty: EnhancedCountyData | null;
  onCountyClick?: (county: EnhancedCountyData) => void;
}

export function MapView({ selectedCounty }: MapViewProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (selectedCounty && mapRef.current) {
      // Center map on selected county (would need geocoding in production)
      // For now, just show the map
    }
  }, [selectedCounty]);

  return (
    <div className="h-full w-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 43.5,
          longitude: -120.5,
          zoom: 5.5,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        {/* County polygons would go here with GeoJSON */}
        {/* For MVP, showing base map */}
      </Map>

      {selectedCounty && (
        <div className="absolute bottom-6 left-6 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm animate-fade-in">
          <h3 className="font-semibold text-lg mb-2">
            {selectedCounty.countyName}, {selectedCounty.stateName}
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Farms</div>
              <div className="font-medium">{selectedCounty.farms.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Cropland</div>
              <div className="font-medium">
                {(selectedCounty.croplandAcres / 1000).toFixed(1)}K ac
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}