import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, Film } from 'lucide-react';
import { getInitialMediaAssets, type MediaAsset } from '@/lib/mock-data';
import { formatDistanceToNow } from '@/lib/utils';

interface MediaItemProps {
  asset: MediaAsset;
}

function MediaItem({ asset }: MediaItemProps) {
  return (
    <div className="bg-gray-950 p-3 rounded-lg group cursor-pointer">
      <div className="relative pb-[56.25%] overflow-hidden rounded">
        <img 
          src={asset.thumbnailUrl} 
          alt={asset.title} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gray-950 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" className="bg-primary rounded-full text-white hover:bg-indigo-600">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white truncate">{asset.title}</h3>
        <p className="text-xs text-gray-400">Generated {formatDistanceToNow(asset.createdAt)}</p>
      </div>
    </div>
  );
}

export function MediaPreviewPanel() {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  
  // Initialize with mock data
  useEffect(() => {
    setMediaAssets(getInitialMediaAssets());
  }, []);
  
  const handleRefresh = () => {
    // Simulate refreshing the media assets
    setMediaAssets(getInitialMediaAssets());
  };
  
  return (
    <Card className="bg-gray-900 rounded-lg shadow border-gray-700">
      <CardHeader className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium leading-6 text-white">Recent Media</h2>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {mediaAssets.map(asset => (
            <MediaItem key={asset.id} asset={asset} />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 px-6 py-3">
        <Button className="w-full bg-primary hover:bg-indigo-700">
          <Film className="mr-2 h-4 w-4" />
          Media Library
        </Button>
      </CardFooter>
    </Card>
  );
}
