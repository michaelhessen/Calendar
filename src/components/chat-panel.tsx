"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { PlannerDiff } from '@/types';
import PlannerDiffModal from './planner-diff-modal';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plan, setPlan] = useState<PlannerDiff[] | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const parseRes = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });
      const { command } = await parseRes.json();
      
      const aiMessage: Message = { sender: 'ai', text: `Got it. Interpreted as: ${command.cmd}. Planning...` };
      setMessages(prev => [...prev, aiMessage]);

      const planRes = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentState: { events: [] }, intent: command }),
      });
      const { diff, summary } = await planRes.json();
      
      const planMessage: Message = { sender: 'ai', text: summary };
      setMessages(prev => [...prev, planMessage]);

      if (diff && diff.length > 0) {
        setPlan(diff);
        setIsModalOpen(true);
      }

    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplyPlan = async () => {
      if(!plan) return;
      setIsLoading(true);
      setIsModalOpen(false);
      
       try {
            await fetch('/api/calendar/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diff: plan }),
            });
            const successMessage: Message = { sender: 'ai', text: "Great, I've updated your calendar!" };
            setMessages(prev => [...prev, successMessage]);
       } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: 'Failed to apply the plan.' };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Apply plan error:", error);
       } finally {
           setIsLoading(false);
           setPlan(null);
       }
  }


  return (
    <>
      <PlannerDiffModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diff={plan || []}
        onApply={handleApplyPlan}
      />
      <div className="flex flex-col h-full p-4">
        <h2 className="text-lg font-semibold text-white mb-4 border-b border-border pb-2 flex-shrink-0">Chat</h2>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <Card key={index} className={`p-3 max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'}`}>
              <CardContent className="p-0 text-sm">{msg.text}</CardContent>
            </Card>
          ))}
           {isLoading && <div className="text-muted-foreground text-sm">AI is thinking...</div>}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 flex-shrink-0">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Plan my day..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default ChatPanel;
