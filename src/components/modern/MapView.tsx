import { useRef, useEffect, useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import type { EnhancedCountyData } from '../../types/ag';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  selectedCounty: EnhancedCountyData | null;
  onCountyClick?: (county: EnhancedCountyData) => void;
  counties?: EnhancedCountyData[];
  filteredCounties?: EnhancedCountyData[];
}

interface HoverInfo {
  countyName: string;
  stateName: string;
  x: number;
  y: number;
  countyData?: EnhancedCountyData;
}

// FIPS code to state name mapping
const FIPS_TO_STATE: Record<string, string> = {
  '06': 'CALIFORNIA',
  '32': 'NEVADA',
  '41': 'OREGON',
  '53': 'WASHINGTON',
};

// County color mapping by region - using "CountyName|StateFIPS" format to handle duplicate county names
const COUNTY_COLORS: Record<string, { color: string; opacity: number }> = {
  // Purple - Washington (53)
  'Whatcom|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Skagit|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'San Juan|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Clallam|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Island|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Jefferson|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Snohomish|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Kitsap|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Skamania|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Lewis|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Pacific|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Grays Harbor|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Mason|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'King|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Thurston|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },
  'Pierce|53': { color: 'hsl(270, 70%, 50%)', opacity: 0.4 },

  // Blue - Washington (53)
  'Okanogan|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Chelan|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Douglas|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Grant|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Kittitas|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Yakima|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Ferry|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Stevens|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Lincoln|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Spokane|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Pend Oreille|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Whitman|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Garfield|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Asotin|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Columbia|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Walla Walla|53': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },
  'Umatilla|41': { color: 'hsl(217, 91%, 60%)', opacity: 0.4 },

  // Yellow - Oregon (41) and Washington (53)
  'Clatsop|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Tillamook|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Multnomah|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Wahkiakum|53': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Cowlitz|53': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Clark|53': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Yamhill|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Washington|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Hood River|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Clackamas|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Marion|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },
  'Polk|41': { color: 'hsl(48, 96%, 53%)', opacity: 0.4 },

  // Green - Oregon (41) and California (06)
  'Lane|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Klamath|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Wasco|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Wheeler|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Crook|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Linn|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Deschutes|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Benton|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Lake|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Harney|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Jackson|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Josephine|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Curry|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Coos|41': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Siskiyou|06': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },
  'Modoc|06': { color: 'hsl(142, 76%, 36%)', opacity: 0.4 },

  // Orange - California (06)
  'Del Norte|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Humboldt|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Trinity|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Shasta|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Lassen|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Tehama|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Plumas|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Glenn|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Colusa|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Butte|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Sierra|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Nevada|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },
  'Yuba|06': { color: 'hsl(25, 95%, 53%)', opacity: 0.4 },

  // Light Blue - Nevada (32) and California (06)
  'Washoe|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Pershing|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Churchill|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Lander|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Eureka|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Storey|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Lyon|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Carson City|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Douglas|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Humboldt|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Nye|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Mineral|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Esmeralda|32': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Mono|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Alpine|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Tuolumne|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'El Dorado|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Placer|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Sutter|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Yolo|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Sacramento|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Solano|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
  'Contra Costa|06': { color: 'hsl(195, 70%, 60%)', opacity: 0.4 },
};

// Build MapLibre expression for fill-color
function buildColorExpression() {
  const cases: any[] = [];
  Object.entries(COUNTY_COLORS).forEach(([key, { color }]) => {
    const [county, stateFips] = key.split('|');
    // Check both county name AND state FIPS
    cases.push(
      ['all', ['==', ['get', 'NAME'], county], ['==', ['get', 'STATEFP'], stateFips]],
      color
    );
  });
  cases.push('rgba(0, 0, 0, 0)'); // Default transparent
  return ['case', ...cases];
}

// Build MapLibre expression for fill-opacity
function buildOpacityExpression() {
  const cases: any[] = [];
  Object.entries(COUNTY_COLORS).forEach(([key, { opacity }]) => {
    const [county, stateFips] = key.split('|');
    // Check both county name AND state FIPS
    cases.push(
      ['all', ['==', ['get', 'NAME'], county], ['==', ['get', 'STATEFP'], stateFips]],
      opacity
    );
  });
  cases.push(0); // Default transparent
  return ['case', ...cases];
}

// Build expression that checks if a county is in the filtered set
function buildFilteredColorExpression(
  filteredSet: Set<string> | null,
  fipsToState: Record<string, string>
) {
  if (!filteredSet) {
    // No filter active - show all counties with their original colors
    return buildColorExpression();
  }

  // Filter is active - highlight only filtered counties
  const cases: any[] = [];

  // Build a comprehensive condition for each county/state combination
  Object.entries(COUNTY_COLORS).forEach(([key, { color }]) => {
    const [county, stateFips] = key.split('|');
    const stateName = fipsToState[stateFips];

    if (stateName) {
      const filterKey = `${county.toUpperCase()}|${stateName.toUpperCase()}`;
      if (filteredSet.has(filterKey)) {
        // Add condition: county name matches AND state FIPS matches
        cases.push(
          ['all', ['==', ['get', 'NAME'], county], ['==', ['get', 'STATEFP'], stateFips]],
          color
        );
      }
    }
  });

  // Default: transparent for non-filtered counties
  cases.push('rgba(0, 0, 0, 0)');
  return ['case', ...cases];
}

// Build expression for opacity based on filter
function buildFilteredOpacityExpression(
  filteredSet: Set<string> | null,
  fipsToState: Record<string, string>
) {
  if (!filteredSet) {
    // No filter active - show all counties with their original opacity
    return buildOpacityExpression();
  }

  // Filter is active - show only filtered counties
  const cases: any[] = [];

  Object.entries(COUNTY_COLORS).forEach(([key, { opacity }]) => {
    const [county, stateFips] = key.split('|');
    const stateName = fipsToState[stateFips];

    if (stateName) {
      const filterKey = `${county.toUpperCase()}|${stateName.toUpperCase()}`;
      if (filteredSet.has(filterKey)) {
        cases.push(
          ['all', ['==', ['get', 'NAME'], county], ['==', ['get', 'STATEFP'], stateFips]],
          opacity * 1.5 // Make filtered counties more prominent
        );
      }
    }
  });

  // Default: transparent for non-filtered counties
  cases.push(0);
  return ['case', ...cases];
}

export function MapView({ selectedCounty, counties = [], filteredCounties }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [hoveredCountyId, setHoveredCountyId] = useState<string | number | null>(null);
  const [countiesData, setCountiesData] = useState<any>(null);

  // Create a Set of filtered county names+states for quick lookup
  const filteredCountySet = useMemo(() => {
    if (!filteredCounties || filteredCounties.length === 0) {
      return null; // Show all counties with their original colors if no filter
    }
    const set = new Set<string>();
    filteredCounties.forEach((county) => {
      // Create unique key: "COUNTYNAME|STATENAME" (both uppercase)
      const key = `${county.countyName.toUpperCase()}|${county.stateName.toUpperCase()}`;
      set.add(key);
    });
    return set;
  }, [filteredCounties]);

  // Load GeoJSON data
  useEffect(() => {
    fetch('/data/tl_2023_us_county.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Counties GeoJSON loaded:', data);
        setCountiesData(data);
      })
      .catch((err) => {
        console.error('Error loading county boundaries:', err);
      });

  }, []);

  // Handle hover
  const onMouseMove = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties) {
      const map = mapRef.current?.getMap();

      // Update hover state
      if (hoveredCountyId !== null) {
        map?.setFeatureState(
          { source: 'counties', id: hoveredCountyId },
          { hover: false }
        );
      }

      const newHoveredId = feature.id as number;
      setHoveredCountyId(newHoveredId);

      map?.setFeatureState(
        { source: 'counties', id: newHoveredId },
        { hover: true }
      );

      const countyName = feature.properties.NAME || feature.properties.name;
      const stateFips = feature.properties.STATEFP;
      const stateName = FIPS_TO_STATE[stateFips] || '';

      // Look up county data from the counties array
      // Convert to uppercase to match CSV data format
      const countyData = counties.find(
        (c) => c.countyName.toUpperCase() === countyName.toUpperCase() &&
               c.stateName.toUpperCase() === stateName.toUpperCase()
      );

      setHoverInfo({
        countyName,
        stateName: stateName ? stateName.charAt(0) + stateName.slice(1).toLowerCase() : '',
        x: event.point.x,
        y: event.point.y,
        countyData,
      });

      // Change cursor
      if (map) {
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  };

  const onMouseLeave = () => {
    const map = mapRef.current?.getMap();

    if (hoveredCountyId !== null) {
      map?.setFeatureState(
        { source: 'counties', id: hoveredCountyId },
        { hover: false }
      );
    }
    setHoveredCountyId(null);
    setHoverInfo(null);

    if (map) {
      map.getCanvas().style.cursor = '';
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties) {
      const countyName = feature.properties.NAME || feature.properties.name;
      const stateName = feature.properties.STATE_NAME || feature.properties.state;
      console.log('Clicked county:', countyName, stateName);
    }
  };

  // Layer styles - memoized to update when filter changes
  const countyFillLayer = useMemo(() => ({
    id: 'counties-fill',
    type: 'fill' as const,
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        'hsl(48, 100%, 50%)', // Yellow on hover
        buildFilteredColorExpression(filteredCountySet, FIPS_TO_STATE),
      ] as any,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.7, // More opaque on hover
        buildFilteredOpacityExpression(filteredCountySet, FIPS_TO_STATE),
      ] as any,
    },
  }), [filteredCountySet]);

  const countyOutlineLayer = {
    id: 'counties-outline',
    type: 'line' as const,
    paint: {
      'line-color': '#6b7280', // Gray color
      'line-width': 1,
      'line-dasharray': [3, 2],
      'line-opacity': 0.6,
    },
  };


  useEffect(() => {
    if (selectedCounty && mapRef.current) {
      // Center map on selected county (would need geocoding in production)
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
        interactiveLayerIds={['counties-fill', 'counties-outline']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {/* Counties source and layers */}
        {countiesData && (
          <Source id="counties" type="geojson" data={countiesData} generateId={true}>
            <Layer {...countyFillLayer} />
            <Layer {...countyOutlineLayer} />
          </Source>
        )}


      </Map>

      {/* Hover tooltip */}
      {hoverInfo && (
        <div
          className="absolute bg-card border border-border rounded-md px-3 py-2 shadow-lg pointer-events-none z-10 min-w-[220px]"
          style={{
            left: hoverInfo.x + 10,
            top: hoverInfo.y + 10,
          }}
        >
          <div className="font-semibold text-sm mb-1">
            {hoverInfo.countyName}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {hoverInfo.stateName}
          </div>

          {hoverInfo.countyData ? (
            <div className="space-y-1 border-t border-border pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Farms:</span>
                <span className="font-medium">{hoverInfo.countyData.farms.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cropland:</span>
                <span className="font-medium">
                  {(hoverInfo.countyData.croplandAcres / 1000).toFixed(1)}K ac
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Irrigated:</span>
                <span className="font-medium">
                  {(hoverInfo.countyData.irrigatedAcres / 1000).toFixed(1)}K ac
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Land in Farms:</span>
                <span className="font-medium">
                  {(hoverInfo.countyData.landInFarmsAcres / 1000).toFixed(1)}K ac
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Selected county info */}
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
