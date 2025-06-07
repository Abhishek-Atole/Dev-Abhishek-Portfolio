
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Loader2,
  Code2,
  FileText,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatbot } from '@/hooks/useChatbot';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'inline';
  theme?: 'light' | 'dark' | 'auto';
}

const Chatbot = ({ position = 'bottom-right', theme = 'auto' }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Abhishek's AI assistant. I can help you learn about his technical skills, projects, blog posts, and professional background. What would you like to know?",
      role: 'assistant',
      timestamp: new Date(),
      suggestions: [
        "Tell me about Abhishek's C++ experience",
        "What are his latest blog posts?",
        "Show me his notable projects",
        "What's his educational background?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage, isLoading } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const aiResponse = await sendMessage(content);
    
    if (aiResponse) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'inline': 'relative w-full max-w-md mx-auto'
  };

  const chatbotVariants = {
    closed: { scale: 0, opacity: 0 },
    open: { scale: 1, opacity: 1 },
    minimized: { scale: 0.8, opacity: 0.9 }
  };

  if (position === 'inline') {
    return (
      <Card className="w-full max-w-md mx-auto h-96">
        <CardHeader className="border-b bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot size={20} className="text-primary" />
            Ask Abhishek's AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-80 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onSuggestionClick={handleSuggestionClick} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={positionClasses[position]}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="mb-4"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate={isMinimized ? "minimized" : "open"}
            exit="closed"
            variants={chatbotVariants}
            className="mb-4"
          >
            <Card className="w-80 h-96 shadow-xl border-border">
              <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-accent/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bot size={20} className="text-primary" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
                      <p className="text-xs text-muted-foreground">Ask about Abhishek</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-6 w-6 p-0"
                    >
                      {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 h-80 flex flex-col">
                  <ScrollArea className="flex-1 p-3">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} onSuggestionClick={handleSuggestionClick} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MessageBubble = ({ 
  message, 
  onSuggestionClick 
}: { 
  message: Message; 
  onSuggestionClick: (suggestion: string) => void;
}) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className="space-y-2">
          <div className={`rounded-lg p-3 text-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}>
            {message.content}
          </div>
          
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="space-y-1">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-xs h-7 justify-start w-full"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="flex gap-2 max-w-[85%]">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <Bot size={16} />
      </div>
      <div className="bg-muted rounded-lg p-3 text-sm">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  </div>
);

const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading 
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) => (
  <form onSubmit={onSubmit} className="border-t p-3">
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about projects, skills, or experience..."
        disabled={isLoading}
        className="flex-1 text-sm"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !value.trim()}
        size="sm"
        className="px-3"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      </Button>
    </div>
  </form>
);

export default Chatbot;
