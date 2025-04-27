import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import { sendMessage } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/config';

function ChatScreen({ initialMessage, threadId, onThreadSelect, onReset }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(threadId);
  const processingMessage = useRef(false);
  const { user } = useAuth();
  const previousUserRef = useRef(user); // Add this to track user changes

  // Debug messages whenever they change
  useEffect(() => {
    console.log('Current messages state:', messages);
  }, [messages]);

  // Modified useEffect to handle both initial message and thread selection
  useEffect(() => {
    if (threadId) {
      setCurrentThreadId(threadId);
      
      if (initialMessage) {
        // For new threads with initial message
        setMessages([{
          text: initialMessage,
          isAI: false
        }]);
        handleSendMessage(initialMessage, threadId);
      } else {
        // For existing threads, load their messages
        loadThread(threadId);
      }
    }
  }, [threadId, initialMessage]); // Add dependencies to react to changes

  // Modified auth state listener to only trigger on sign-out
  useEffect(() => {
    const previousUser = previousUserRef.current;
    previousUserRef.current = user;

    // Only reset if user was previously logged in and now isn't
    if (previousUser && !user) {
      setMessages([]);
      setCurrentThreadId(null);
      onReset();
    }
  }, [user, onReset]);

  // Handle loading an existing thread
  const loadThread = async (threadId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/threads/${threadId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to load thread messages');
      }
      const threadMessages = await response.json();
      
      // Just reverse the messages array
      setMessages(threadMessages.reverse());
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

  const handleSendMessage = async (messageText, threadId = currentThreadId) => {
    if (processingMessage.current) return;

    try {
      processingMessage.current = true;
      setIsLoading(true);

      // Only add user message to UI if it's not the initial message
      if (messageText !== initialMessage) {
        setMessages(prev => [...prev, { 
          text: messageText, 
          isAI: false 
        }]);
      }

      // Send message to get AI response
      const response = await sendMessage(messageText, threadId);
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        text: response.mainResponse,
        isAI: true,
        confidence: response.confidence,
        references: response.references,
        referencesCount: response.referencesCount,
        targetPersona: response.targetPersona,
        followupRecs: response.followupRecs
      }]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please try again.",
        isAI: true,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      processingMessage.current = false;
    }
  };

  const handleFollowupClick = (followupQuestion) => {
    handleSendMessage(followupQuestion);
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        onThreadSelect={onThreadSelect}
        onReset={onReset}
      />
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* <Header /> */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => {
            console.log('Rendering message:', message); // Debug log
            return (
              <ChatMessage
                key={`${index}-${message.isAI ? 'ai' : 'user'}-${message.text.substring(0, 10)}`}
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
            );
          })}
          {isLoading && (
            <ChatMessage
              message="..."
              isAI={true}
              isLoading={true}
            />
          )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>
    </div>
  );
}

export default ChatScreen;
