import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import { sendMessage } from '../services/chatService';
import { useField } from '../context/FieldContext';
import { API_URL } from '../services/config';

function ChatScreen({ initialMessage, threadId, onThreadSelect, onReset }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(threadId);
  const processingMessage = useRef(false);
  const { selectedField } = useField();

  // Handle initial message and thread loading
  useEffect(() => {
    if (threadId) {
      setCurrentThreadId(threadId);
      
      if (initialMessage) {
        // For new threads with initial message
        setMessages([{
          text: initialMessage,
          isAI: false
        }]);
        handleSendMessage(initialMessage);
      } else {
        // For existing threads, load their messages
        loadThread(threadId);
      }
    }
  }, [threadId, initialMessage]);

  // Load existing thread messages
  const loadThread = async (threadId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/threads/${threadId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to load thread messages');
      }
      const threadMessages = await response.json();
      setMessages(threadMessages);
    } catch (error) {
      console.error('Error loading thread:', error);
      setMessages([{
        text: "Error loading messages. Please try again.",
        isAI: true,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (processingMessage.current) return;

    try {
      processingMessage.current = true;
      setIsLoading(true);

      // Add user message immediately
      const userMessage = {
        text: messageText,
        isAI: false
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Get AI response
      const response = await sendMessage(messageText, currentThreadId, selectedField);
      
      // Add AI response
      const aiMessage = {
        text: response.mainResponse,
        isAI: true,
        confidence: response.confidence,
        references: response.references,
        referencesCount: response.referencesCount,
        targetPersona: response.targetPersona,
        followupRecs: response.followupRecs
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        isAI: true,
        isError: true
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      processingMessage.current = false;
    }
  };

  const handleFollowupClick = (followupQuestion) => {
    handleSendMessage(followupQuestion);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        onThreadSelect={onThreadSelect}
        onReset={onReset}
        className="border-r shadow-lg"
      />
      <main className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                Start a conversation by typing a message below.
              </div>
            )}
            
            {messages.map((message, index) => (
              <div 
                key={`${index}-${message.isAI ? 'ai' : 'user'}`}
                className="transform transition-all duration-300"
              >
                <ChatMessage
                  message={message.text}
                  isAI={message.isAI}
                  confidence={message.confidence}
                  references={message.references}
                  referencesCount={message.referencesCount}
                  targetPersona={message.targetPersona}
                  followupRecs={message.followupRecs}
                  onFollowupClick={handleFollowupClick}
                  isError={message.isError}
                />
              </div>
            ))}
            
            {isLoading && (
              <div className="transform transition-all duration-300">
                <ChatMessage
                  message="Thinking..."
                  isAI={true}
                  isLoading={true}
                />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 w-full">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
          />
        </div>
      </main>
    </div>
  );
}

export default ChatScreen;
