import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { QuestionPrompts } from './QuestionPrompts';
import { InputSection } from './InputSection';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ConversationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onInputFocus: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export function ConversationSheet({ 
  isOpen, 
  onClose, 
  messages, 
  inputValue,
  onInputChange,
  onSubmit,
  onInputFocus,
  onSelectPrompt
}: ConversationSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] rounded-t-2xl border-0 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 bg-white z-10 px-4 pt-3 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[#1F2937]">Conversation</SheetTitle>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] space-y-1`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-[#0F766E] text-white rounded-br-md'
                        : 'bg-[#F3F4F6] text-[#1F2937] rounded-bl-md'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-[12px] text-[#9CA3AF] px-2 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Question prompts - just above input */}
        <div className="flex-shrink-0 bg-white pt-3 pb-2">
          <QuestionPrompts onSelectPrompt={onSelectPrompt} />
        </div>

        {/* Input section - at bottom */}
        <div className="flex-shrink-0 bg-white">
          <div className="px-4 pb-6 pt-2">
            <InputSection
              value={inputValue}
              onChange={onInputChange}
              onSubmit={onSubmit}
              onFocus={onInputFocus}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
