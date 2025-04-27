import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import ChatScreen from './pages/ChatScreen';
import { PersonaProvider } from './context/PersonaContext';
import { AuthProvider } from './context/AuthContext';
import AuthCallback from './components/auth/AuthCallback';
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
    <AuthProvider>
      <BrowserRouter>
        <PersonaProvider>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <div className="App">
                {currentScreen === 'start' ? (
                  <StartScreen 
                    onStart={handleStart}
                    onThreadSelect={handleThreadSelect}
                    onReset={handleReset}
                  />
                ) : (
                  <ChatScreen 
                    initialMessage={chatData.initialMessage}
                    threadId={chatData.threadId}
                    onThreadSelect={handleThreadSelect}
                    onReset={handleReset}
                  />
                )}
              </div>
            } />
          </Routes>
        </PersonaProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
