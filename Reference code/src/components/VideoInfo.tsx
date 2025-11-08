import { useState } from 'react';

interface VideoInfoProps {
  title: string;
  description: string;
}

export function VideoInfo({ title, description }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="px-4 py-3 space-y-2">
      <h1 className="text-[#1F2937] line-clamp-2">
        {title}
      </h1>
      <div>
        <p className={`text-[14px] text-[#6B7280] ${showFullDescription ? '' : 'line-clamp-3'}`}>
          {description}
        </p>
        <button 
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-[14px] text-[#0F766E] mt-1 active:opacity-70"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
}
