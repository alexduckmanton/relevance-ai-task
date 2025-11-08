import { Bookmark, CreditCard, FileText, HelpCircle } from 'lucide-react';

const actions = [
  { icon: Bookmark, label: 'Save for later' },
  { icon: CreditCard, label: 'Make flashcards' },
  { icon: FileText, label: 'Study notes' },
  { icon: HelpCircle, label: 'Quiz me' },
];

export function ActionButtons() {
  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#F3F4F6] rounded-xl active:bg-[#E5E7EB] transition-colors min-h-[44px]"
          >
            <action.icon className="w-5 h-5 text-[#0F766E]" />
            <span className="text-[11px] text-[#1F2937] text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
