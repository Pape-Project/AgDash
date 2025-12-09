import { Map as MapIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';

export function RegionControl() {
    const { regionMode, setRegionMode } = useStore();

    return (
        <Card className={`p-4 relative overflow-hidden transition-all duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-yellow-500 before:transition-all before:duration-300 ${regionMode ? 'before:opacity-100' : 'before:opacity-0'}`}>
            <div className="space-y-4 relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapIcon className={`h-5 w-5 ${regionMode ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                        <span className="font-semibold">Regions</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Toggle */}
                        <button
                            onClick={() => setRegionMode(!regionMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${regionMode ? 'bg-yellow-500' : 'bg-input'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${regionMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
