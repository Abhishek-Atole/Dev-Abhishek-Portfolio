
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string): Promise<ChatMessage | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://kjphoudvjejgzhzohzwu.supabase.co/functions/v1/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcGhvdWR2amVqZ3poem9oend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTYwNTgsImV4cCI6MjA2Mzc3MjA1OH0.bIBVdLoCiIA7IwE6d_LtAtFI02Re5njRK3nQvdjM24c`
        },
        body: JSON.stringify({
          message,
          context: 'portfolio_assistant'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      return {
        role: 'assistant',
        content: data.response,
        suggestions: data.suggestions
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: "Connection Error",
        description: "Sorry, I'm having trouble connecting right now. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
