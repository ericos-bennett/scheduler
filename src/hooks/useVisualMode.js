import { useState } from 'react';

const useVisualMode = initial => {

  const [history, setHistory] = useState([initial]);

  const mode = history[history.length - 1];

  const transition = (newMode, replace) => {
    if (replace) {
      setHistory((history) => {   
        const newHistory = [...history];
        newHistory[newHistory.length - 1] = newMode;
        return newHistory
      });
    } else {
      setHistory(current => [...current, newMode]);
    }
  };

  const back = () => {
    if (history.length > 1) setHistory(history => history.slice(0, -1));
  };

  return { mode, transition, back };
};

export default useVisualMode;
