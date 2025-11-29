/**
 * Planning Copilot Chat Component
 * 
 * Interactive AI assistant for heritage planning guidance.
 * Features:
 * - Real-time chat interface
 * - Property context awareness
 * - Suggested questions
 * - Typing indicators
 * - Message history
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import type { PropertyCheckResult } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url?: string;
  }>;
  actions?: Array<{
    label: string;
    action: string;
    data?: Record<string, unknown>;
  }>;
}

interface PlanningCopilotProps {
  propertyContext?: PropertyCheckResult | null;
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

interface SuggestedQuestion {
  question: string;
  topic: string;
}

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { question: "What work can I do without planning permission?", topic: "permitted_development" },
  { question: "How does being in a conservation area affect my plans?", topic: "conservation" },
  { question: "What is an Article 4 Direction?", topic: "article_4" },
  { question: "How long does planning permission take?", topic: "general" },
  { question: "What documents do I need for a planning application?", topic: "general" },
];

export function PlanningCopilot({ 
  propertyContext, 
  onAction,
  defaultOpen = false,
  position = 'bottom-right'
}: PlanningCopilotProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: propertyContext
          ? `Hello! I'm your Planning Copilot. I see you're looking at a property at ${propertyContext.address}. ${
              propertyContext.status === 'RED' 
                ? "This is a listed building, so I can help you understand the special requirements for any changes."
                : propertyContext.status === 'AMBER'
                ? "This property is in a conservation area, so there are some restrictions to consider."
                : "This property has standard planning rules. How can I help you today?"
            }`
          : "Hello! I'm your Planning Copilot. I can help you navigate planning permission, heritage requirements, and development guidelines. How can I assist you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, propertyContext]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          context: propertyContext ? {
            address: propertyContext.address,
            postcode: propertyContext.postcode,
            heritageStatus: propertyContext.status,
            conservationArea: propertyContext.conservationArea?.name,
            listedBuilding: propertyContext.listedBuilding ? {
              name: propertyContext.listedBuilding.name,
              grade: propertyContext.listedBuilding.grade,
            } : undefined,
            hasArticle4: propertyContext.hasArticle4,
            borough: propertyContext.borough,
          } : undefined,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
          sources: data.data.sources,
          actions: data.data.suggestedActions?.map((action: { label: string; action: string; data?: Record<string, unknown> }) => ({
            label: action.label,
            action: action.action,
            data: action.data,
          })),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, propertyContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage(question);
  };

  const handleActionClick = (action: string, data?: Record<string, unknown>) => {
    if (onAction) {
      onAction(action, data);
    }
  };

  const getStatusIcon = () => {
    if (!propertyContext) return null;
    switch (propertyContext.status) {
      case 'RED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'AMBER':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'GREEN':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4';

  return (
    <>
      {/* Chat Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow`}
            aria-label="Open Planning Copilot"
          >
            <MessageCircle className="h-6 w-6" />
            {propertyContext && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                {getStatusIcon()}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 500
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${positionClasses} z-50 w-96 flex flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden`}
            style={{ maxHeight: isMinimized ? 'auto' : 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">Planning Copilot</span>
                {propertyContext && (
                  <span className="ml-1 text-xs opacity-80">
                    ({propertyContext.status})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Property Context Banner */}
                {propertyContext && (
                  <div className={`px-4 py-2 text-sm border-b ${
                    propertyContext.status === 'RED' 
                      ? 'bg-red-50 text-red-800 border-red-100'
                      : propertyContext.status === 'AMBER'
                      ? 'bg-amber-50 text-amber-800 border-amber-100'
                      : 'bg-green-50 text-green-800 border-green-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon()}
                      <span className="font-medium truncate">{propertyContext.address}</span>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === 'user' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block rounded-2xl px-4 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                          {message.content}
                        </div>
                        
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {source.title}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(action.action, action.data)}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="mt-1 text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                        <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                      </div>
                      <div className="flex items-center">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="h-2 w-2 rounded-full bg-gray-300"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {showSuggestions && messages.length <= 1 && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Lightbulb className="h-3 w-3" />
                      <span>Suggested questions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.slice(0, 3).map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(sq.question)}
                          className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 hover:border-blue-300 transition-colors text-gray-700"
                        >
                          {sq.question}
                        </button>
                      ))}
                    </div>
                    {SUGGESTED_QUESTIONS.length > 3 && (
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <ChevronDown className="h-3 w-3" />
                        Show more
                      </button>
                    )}
                  </div>
                )}

                {/* Input */}
                <form 
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 border-t border-gray-100 p-3 bg-white"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about planning permission..."
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PlanningCopilot;
