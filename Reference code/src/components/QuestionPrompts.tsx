import { useRef, useState } from 'react';

const prompts = [
  "What does that mean?",
  "Explain this concept",
  "Why is this important?",
  "Give me an example",
  "How does this work?",
  "What's the key takeaway?"
];

interface QuestionPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function QuestionPrompts({ onSelectPrompt }: QuestionPromptsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowFade(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="relative px-4">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="flex-shrink-0 px-3 py-2 bg-[#F3F4F6] rounded-full text-[14px] text-[#1F2937] active:bg-[#E5E7EB] transition-colors whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>
      {showFade && (
        <div className="absolute right-4 top-0 bottom-2 w-12 bg-gradient-to-l from-[#F9FAFB] to-transparent pointer-events-none" />
      )}
    </div>
  );
}
