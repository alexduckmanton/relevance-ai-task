import { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoInfo } from './components/VideoInfo';
import { ActionButtons } from './components/ActionButtons';
import { ConversationDrawer } from './components/ConversationDrawer';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      text: 'Can you explain the concept of derivatives in calculus?',
      timestamp: '2:34 PM'
    },
    {
      id: '2',
      type: 'ai',
      text: 'A derivative represents the rate of change of a function at any given point. Think of it like measuring how fast something is changing at a specific moment - like the speedometer in a car showing your exact speed right now, rather than your average speed over a trip.',
      timestamp: '2:34 PM'
    },
    {
      id: '3',
      type: 'user',
      text: 'Why is this important?',
      timestamp: '2:35 PM'
    },
    {
      id: '4',
      type: 'ai',
      text: 'Derivatives are fundamental in calculus because they help us understand motion, optimize functions (find maximum/minimum values), and model real-world phenomena like population growth, economics, and physics. They\'re used in everything from designing roller coasters to training AI models!',
      timestamp: '2:35 PM'
    }
  ]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleInputFocus = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleSubmitQuestion = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'Great question! Let me help you understand that better. In the context of this video...',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage, aiResponse]);
    setInputValue('');
    setIsDrawerExpanded(true);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* App content */}
      <div className="h-screen pb-40 overflow-y-auto scrollbar-hide">
        {/* Video player - takes ~1/3 of screen */}
        <VideoPlayer
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          currentTime="3:24"
          totalTime="15:42"
          progress={21}
        />

        {/* Video info */}
        <VideoInfo
          title="Introduction to Calculus: Understanding Derivatives"
          description="Learn the fundamental concepts of derivatives in calculus. This comprehensive tutorial covers the basic principles, real-world applications, and step-by-step examples to help you master this essential mathematical concept. Perfect for high school and college students."
        />

        {/* Action buttons */}
        <ActionButtons />
      </div>

      {/* Conversation drawer - always visible at bottom */}
      <ConversationDrawer
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmitQuestion}
        onInputFocus={handleInputFocus}
        onSelectPrompt={handleSelectPrompt}
        isExpanded={isDrawerExpanded}
        onExpandChange={setIsDrawerExpanded}
      />
    </div>
  );
}
