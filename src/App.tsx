import './App.scss';
import { Header } from './Components/Header';
import { Outlet } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { useEffect, useState } from 'react';
import LoadingScreen from './Components/LoadingScreen';

export const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsInitialLoading(false), 2000);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="app">
        <LoadingScreen />
      </div>
    );
  }

  return (
      <div className="app -mb-6">
        <Header />
        <div className="app__container relative">
          <Outlet />
        </div>
        <Footer />
      </div>
  );
};