import './App.scss';
import { Header } from './Components/Header';
import { Outlet } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { useEffect, useState } from 'react';
import { back } from './Utils/kit';
import LoadingScreen from './Components/LoadingScreen';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="app">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="relative app">
      <div className="absolute inset-0 -z-10">
        <img className="w-full h-full object-cover" src={back} alt="bg" />
      </div>
      <Header />
      <div className="app__container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
