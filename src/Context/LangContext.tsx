import React, { useState } from 'react';

interface LangContextType {
  currentLang: 'EN' | 'UA';
  setCurrentLang: (value: 'EN' | 'UA') => void;
}

export const LangContext = React.createContext<LangContextType>({
  currentLang: 'UA',
  setCurrentLang: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const LangProvider: React.FC<Props> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<'EN' | 'UA'>('UA');

  return (
    <LangContext.Provider
      value={{
        currentLang,
        setCurrentLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};
