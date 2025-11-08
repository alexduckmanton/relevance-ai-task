import { Play, Pause, Maximize } from 'lucide-react';
import { AspectRatio } from './ui/aspect-ratio';

interface VideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: string;
  totalTime: string;
  progress: number;
}

export function VideoPlayer({ isPlaying, onPlayPause, currentTime, totalTime, progress }: VideoPlayerProps) {
  return (
    <div className="relative w-full bg-black">
      <AspectRatio ratio={16 / 9}>
        {/* Video thumbnail/content */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white/20 text-6xl">📚</div>
        </div>
        
        {/* Video controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
          {/* Center play/pause button */}
          <button 
            onClick={onPlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-gray-900" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            )}
          </button>

          {/* Bottom controls */}
          <div className="space-y-2">
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Time and fullscreen */}
            <div className="flex items-center justify-between text-white text-sm">
              <span>{currentTime} / {totalTime}</span>
              <button className="w-8 h-8 flex items-center justify-center active:scale-95 transition-transform">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
