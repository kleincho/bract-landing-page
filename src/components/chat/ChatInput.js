import React, { useState } from 'react';
import { usePersona } from '../../context/PersonaContext';

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');
  const [showPersonaInput, setShowPersonaInput] = useState(false);
  const [tempPersona, setTempPersona] = useState('');
  const { targetPersona, setTargetPersona } = usePersona();

  console.log('ChatInput: Current targetPersona:', targetPersona);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput(''); // Clear input after sending
    }
  };

  const handleShowPersonaInput = () => {
    setTempPersona(targetPersona || '');
    setShowPersonaInput(!showPersonaInput);
  };

  const handlePersonaSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (tempPersona.trim()) {
      console.log('ChatInput: Setting persona to:', tempPersona);
      setTargetPersona(tempPersona);
      setShowPersonaInput(false);
      setTempPersona('');
    }
  };

  const displayPersona = targetPersona ? 
    `${targetPersona.slice(0, 20)}${targetPersona.length > 20 ? '...' : ''}` : 
    '';

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-3">
            <input
              type="text"
              placeholder="Ask anything"
              className="w-full focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
                type="submit"
                className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600"
              >
                <span className="w-5 h-5 block">➤</span>
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePersonaSubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handlePersonaSubmit}
                    className="px-3 py-1 bg-sky-100 text-sky-600 rounded text-sm hover:bg-sky-200"
                  >
                    Set
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
