import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { QuestionPrompts } from './QuestionPrompts';
import { InputSection } from './InputSection';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ConversationDrawerProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onInputFocus: () => void;
  onSelectPrompt: (prompt: string) => void;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export function ConversationDrawer({ 
  messages, 
  inputValue,
  onInputChange,
  onSubmit,
  onInputFocus,
  onSelectPrompt,
  isExpanded,
  onExpandChange
}: ConversationDrawerProps) {
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 50 && isExpanded) {
      onExpandChange(false);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 z-50 flex flex-col"
      initial={false}
      animate={{
        height: isExpanded ? '80vh' : 'auto'
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300
      }}
    >
      {/* Draggable handle */}
      <div 
        className="flex-shrink-0 pt-3 pb-2 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Expanded content - conversation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 pb-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-[#1F2937]">Conversation</h2>
              <button 
                onClick={() => onExpandChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible - prompts and input */}
      <div className="flex-shrink-0 bg-white">
        {/* Question prompts */}
        <div className="pt-2 pb-2">
          <QuestionPrompts onSelectPrompt={onSelectPrompt} />
        </div>

        {/* Input section */}
        <div className="px-4 pb-6 pt-2">
          <InputSection
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onFocus={onInputFocus}
          />
        </div>
      </div>
    </motion.div>
  );
}
