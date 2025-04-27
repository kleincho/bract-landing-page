import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { usePersona } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';
import { createNewThread } from '../services/chatService'; // We'll create this function

function StartScreen({ onStart, onThreadSelect }) {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { targetPersona, setTargetPersona } = usePersona();
  const [showPersonaInput, setShowPersonaInput] = useState(false);
  const [tempPersona, setTempPersona] = useState('');
  const { user } = useAuth();

  console.log('StartScreen: Current targetPersona:', targetPersona);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Create thread should work for both authenticated and unauthenticated users
        const { thread_id, title } = await createNewThread(question);
        console.log('StartScreen: Created thread with ID:', thread_id);
        
        // This should always trigger regardless of auth status
        onStart(question, thread_id);
      } catch (error) {
        console.error('Error creating new thread:', error);
        setIsSubmitting(false);
      }
    }
  };

  const handleShowPersonaInput = () => {
    setTempPersona(targetPersona || '');
    setShowPersonaInput(!showPersonaInput);
  };

  const handlePersonaSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (tempPersona.trim()) {
      console.log('StartScreen: Setting persona to:', tempPersona);
      setTargetPersona(tempPersona);
      setShowPersonaInput(false);
      setTempPersona('');
    }
  };

  const displayPersona = targetPersona ? 
    `${targetPersona.slice(0, 20)}${targetPersona.length > 20 ? '...' : ''}` : 
    '';

  return (
    <div className="flex h-screen">
      <Sidebar 
        onThreadSelect={onThreadSelect}
      />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-semibold mb-8">Hi, It's HUMINT. Human Intelligence.</h1>
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="w-full focus:outline-none"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="border-t p-2 flex flex-col">
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    className="flex items-center space-x-2 p-2 hover:bg-sky-50 rounded text-gray-600"
                    onClick={handleShowPersonaInput}
                  >
                    <span>🎯</span>
                    <span className="text-sm">Target Persona</span>
                    {displayPersona && (
                      <span className="text-sm text-sky-600 ml-2">
                        ({displayPersona})
                      </span>
                    )}
                  </button>
                  <div className="flex-1"></div>
                  <button 
                    onClick={handleSubmit}
                    className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 block">⌛</span>
                    ) : (
                      <span className="w-5 h-5 block">➤</span>
                    )}
                  </button>
                </div>
                
                {showPersonaInput && (
                  <div className="mt-2 px-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter target persona..."
                        className="flex-1 text-sm p-2 border rounded"
                        value={tempPersona}
                        onChange={(e) => setTempPersona(e.target.value)}
                      />
                      <button
                        onClick={handlePersonaSubmit}
                        type="button"
                        className="px-3 py-1 bg-sky-100 text-sky-600 rounded text-sm hover:bg-sky-200"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StartScreen;