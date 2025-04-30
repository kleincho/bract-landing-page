import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StartScreen from './pages/StartScreen';
import ChatScreen from './pages/ChatScreen';
import { PersonaProvider } from './context/PersonaContext';
import { AuthProvider } from './context/AuthContext';
import AuthCallback from './components/auth/AuthCallback';
import { FieldProvider } from './context/FieldContext';
import WaitlistForm from './pages/WaitlistForm';
import ConfirmationPage from './pages/ConfirmationPage';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' or 'chat'
  const [chatData, setChatData] = useState({
    initialMessage: null,
    threadId: null
  });

  const handleStart = (initialMessage, threadId) => {
    // Save the chat data
    setChatData({
      initialMessage,
      threadId
    });
    // Switch to chat screen
    setCurrentScreen('chat');
  };

  const handleThreadSelect = (threadId) => {
    if (threadId === null) {
      // Return to start screen for new thread
      setCurrentScreen('start');
    } else {
      // Switch to chat screen with selected thread
      setChatData({
        initialMessage: null, // No initial message for existing threads
        threadId
      });
      setCurrentScreen('chat');
    }
  };

  const handleReset = () => {
    // Reset to start screen
    setCurrentScreen('start');
  };

  return (
    <Router>
      <FieldProvider>
        <AuthProvider>
          <PersonaProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/waitlist/:type" element={<WaitlistForm />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* <Route 
              <Route 
                path="/chat" 
                element={
                  currentScreen === 'start' ? (
                    <StartScreen onStart={handleStart} onThreadSelect={handleThreadSelect} />
                  ) : (
                    <ChatScreen
                      initialMessage={chatData.initialMessage}
                      threadId={chatData.threadId}
                      onThreadSelect={handleThreadSelect}
                      onReset={handleReset}
                    />
                  )
                } 
              />
              */}
              <Route path="/confirmation" element={<ConfirmationPage />} />
              
              {/* Redirect all other routes to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PersonaProvider>
        </AuthProvider>
      </FieldProvider>
    </Router>
  );
}

export default App;
