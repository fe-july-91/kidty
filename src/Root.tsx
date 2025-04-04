import { RouterProvider, createHashRouter } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './Pages/HomePage';
import { AccountPage } from './Pages/AccountPage';
import { LogInPage } from './Pages/LogInPage';
import { SignUpPage } from './Pages/SignUpPage';
import { AuthProvider } from './Context/AuthContext';
import { RequireAuth } from './Components/RequireAuth/RequireAuth';
import { SettingsPage } from './Pages/SettingsPage/SettingsPage';
import { Recovery } from './Pages/PasswordRecovery/Recovery';
import { RightsPage } from './Pages/RightsPage';
import { LangProvider } from './Context/LangContext';
import {HeroUIProvider} from "@heroui/react";


const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LogInPage /> },
      { path: 'recovery', element: <Recovery /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'about', element: <RightsPage /> },
      {
        path: 'account',
        element: <RequireAuth />,
        children: [
          { index: true, element: <AccountPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

const Root = () => {
  return (
    <AuthProvider>
      <LangProvider>
        <HeroUIProvider>
          <RouterProvider router={router} />
        </HeroUIProvider>
      </LangProvider>
    </AuthProvider>
  );
};

export default Root;
