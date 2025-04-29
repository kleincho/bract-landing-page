import React, { createContext, useContext, useState } from 'react';

const FieldContext = createContext();

export function FieldProvider({ children }) {
  const [selectedField, setSelectedField] = useState('finance');

  return (
    <FieldContext.Provider value={{ selectedField, setSelectedField }}>
      {children}
    </FieldContext.Provider>
  );
}

export function useField() {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('useField must be used within a FieldProvider');
  }
  return context;
}
