import { TrendingUp, MapPin, Sprout, Droplets } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatNumber, formatAcres } from '../../lib/format';

interface KPICardsProps {
  totalCounties: number;
  totalFarms: number;
  totalCropland: number;
  totalIrrigated: number;
}

export function KPICards({
  totalCounties,
  totalFarms,
  totalCropland,
  totalIrrigated,
}: KPICardsProps) {
  const kpis = [
    {
      label: 'Counties',
      value: formatNumber(totalCounties),
      icon: MapPin,
      color: 'text-blue-400',
    },
    {
      label: 'Total Farms',
      value: formatNumber(totalFarms),
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Cropland',
      value: formatAcres(totalCropland),
      icon: Sprout,
      color: 'text-emerald-400',
    },
    {
      label: 'Irrigated',
      value: formatAcres(totalIrrigated),
      icon: Droplets,
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.label}
            className="p-6 hover:shadow-lg transition-shadow cursor-default"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-secondary ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}