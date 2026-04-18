import { createContext, useContext, useMemo, useState } from 'react';

const ColourHistoryContext = createContext(null);
const LIMIT = 50;

/**
 * Provides in-session colour history for recently picked colours.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export function ColourHistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  /**
   * Adds a colour object to the in-memory history list.
   * @param {Record<string, any>} colour
   * @returns {void}
   */
  const addToHistory = (colour) => {
    setHistory((prev) => {
      const entry = {
        ...colour,
        pickedAt: new Date().toISOString()
      };
      return [entry, ...prev].slice(0, LIMIT);
    });
  };

  /**
   * Clears all in-memory colour history entries.
   * @returns {void}
   */
  const clearHistory = () => setHistory([]);

  const value = useMemo(() => ({ history, addToHistory, clearHistory }), [history]);
  return <ColourHistoryContext.Provider value={value}>{children}</ColourHistoryContext.Provider>;
}

/**
 * Returns colour history context.
 * @returns {{ history: any[], addToHistory: (colour: Record<string, any>) => void, clearHistory: () => void }}
 */
export function useColourHistory() {
  const context = useContext(ColourHistoryContext);
  if (!context) {
    throw new Error('useColourHistory must be used inside ColourHistoryProvider');
  }
  return context;
}
