import './App.scss';
import { Header } from './Components/Header';
import { Outlet } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { useEffect, useState } from 'react';
import LoadingScreen from './Components/LoadingScreen';
import PullToRefresh from 'react-pull-to-refresh';

export const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsInitialLoading(false), 2000);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsRefreshing(false);
        resolve();
      }, 1500); 
    });
  };

  if (isInitialLoading) {
    return (
      <div className="app">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
    >
      <div className="app -mb-6">
        {isRefreshing && <LoadingScreen />}
        <Header />
        <div className="app__container relative">
          <Outlet />
        </div>
        <Footer />
      </div>
    </PullToRefresh>
  );
};