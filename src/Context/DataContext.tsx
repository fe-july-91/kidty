import React, { useState, useMemo } from 'react';

interface DataContextType {
  height: string;
  setHeight: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  foot: string;
  setFoot: (value: string) => void;
  eyes: string;
  setEyes: (value: string) => void;
  vaccine: string;
  setVaccine: (value: string) => void;
}

export const DataContext = React.createContext<DataContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const DataProvider: React.FC<Props> = ({ children }) => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [foot, setFoot] = useState<string>('');
  const [eyes, setEyes] = useState<string>('');
  const [vaccine, setVaccine] = useState<string>('');

  const contextValue = useMemo(() => ({
    height, setHeight,
    weight, setWeight,
    foot, setFoot,
    eyes, setEyes,
    vaccine, setVaccine
  }), [height, weight, foot, eyes, vaccine]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
