import React, { createContext, useState, useContext, useEffect } from 'react';

const PersonaContext = createContext();

export function PersonaProvider({ children }) {
  // Initialize state from localStorage if it exists
  const [targetPersona, setTargetPersona] = useState(() => {
    const savedPersona = localStorage.getItem('targetPersona');
    return savedPersona || '';
  });
  
  // Save to localStorage whenever targetPersona changes
  useEffect(() => {
    localStorage.setItem('targetPersona', targetPersona);
  }, [targetPersona]);

  return (
    <PersonaContext.Provider value={{ targetPersona, setTargetPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
