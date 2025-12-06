import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { domToPng } from 'modern-screenshot';

interface SaveViewProps {
  targetId?: string;
  className?: string;
}

export function SaveView({ targetId = 'root', className }: SaveViewProps) {
  const [isExporting, setIsExporting] = useState(false);

  const captureView = async () => {
    setIsExporting(true);

    try {
      const rootElement = document.getElementById(targetId);
      if (!rootElement) {
        alert('Root element not found');
        return;
      }

      // Capture the map canvas
      const mapCanvas = document.querySelector('.maplibregl-canvas') as HTMLCanvasElement;
      const mapDataUrl = mapCanvas?.toDataURL('image/png');

      // Capture the entire dashboard
      const dataUrl = await domToPng(rootElement, {
        quality: 1,
        scale: 2,
        backgroundColor: '#0a0a0a',
        onCloneNode: async (clonedNode) => {
          // Inject the map image into cloned canvases
          if (clonedNode instanceof HTMLCanvasElement && mapDataUrl) {
            const ctx = clonedNode.getContext('2d');
            if (ctx) {
              const img = new Image();
              img.src = mapDataUrl;
              await new Promise((resolve) => {
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, clonedNode.width, clonedNode.height);
                  resolve(null);
                };
              });
            }
          }
        },
      });

      // Download
      const timestamp = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.download = `dashboard-${timestamp}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Error capturing view:', error);
      alert('Failed to capture dashboard.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={captureView}
      disabled={isExporting}
      className={`gap-2 ${className}`}
    >
      {isExporting ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Saving...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Save View
        </>
      )}
    </Button>
  );
}
