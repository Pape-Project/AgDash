import { Card } from '../ui/Card';
import type { EnhancedCountyData } from '../../types/ag';
import { formatNumber, formatAcres } from '../../lib/format';
import { MapPin } from 'lucide-react';

interface CountyListProps {
  counties: EnhancedCountyData[];
  selectedCounty: EnhancedCountyData | null;
  onCountySelect: (county: EnhancedCountyData) => void;
}

export function CountyList({
  counties,
  selectedCounty,
  onCountySelect,
}: CountyListProps) {
  if (counties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No counties match your filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {counties.length} Counties
        </h3>
      </div>
      <div className="space-y-2 overflow-y-auto pr-2">
        {counties.slice(0, 50).map((county) => (
          <Card
            key={county.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedCounty?.id === county.id
                ? 'ring-2 ring-primary bg-accent'
                : 'hover:bg-accent/50'
            }`}
            onClick={() => onCountySelect(county)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">{county.countyName}</h4>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                {county.stateName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Farms</div>
                <div className="font-medium">{formatNumber(county.farms)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Cropland</div>
                <div className="font-medium">{formatAcres(county.croplandAcres)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}