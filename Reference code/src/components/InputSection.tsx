import { Mic, Send } from 'lucide-react';
import { Input } from './ui/input';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
}

export function InputSection({ value, onChange, onSubmit, onFocus }: InputSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="pr-20 h-12 rounded-xl border-gray-300 bg-white text-[16px] placeholder:text-[#9CA3AF]"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors">
          <Mic className="w-5 h-5 text-[#6B7280]" />
        </button>
        {value.trim() && (
          <button 
            onClick={onSubmit}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0F766E] active:bg-[#0F766E]/90 transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
