import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { logo, settings } from '../Utils/kit';
import { Menu } from './Menu/Menu';
import { AuthContext } from '../Context/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev: boolean) => !prev);
  };

  const { authorized } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between h-[48px] lg:h-[64px] g-4 bg-primary-800">
      {authorized ? (
        <Link
          to="account"
          className="flex items-center justify-between px-4 lg:px-6 h-full"
        >
          <img src={logo} className="w-20 lg:w-28" alt="logo" />
        </Link>
      ) : (
        <Link
          to="/"
          className="flex items-center justify-between px-4 lg:px-6 h-full"
        >
          <img src={logo} className="w-20 lg:w-28" alt="logo" />
        </Link>
      )}

      <div className="flex items-center justify-center g-2 px-6 text-lg">
        <div className="hidden md:flex flex-row items-center gap-8 text-base text-gray-100">
          {!authorized ? (
            <div className="flex flex-row justify-center gap-4 items-center">
              <div className="hover:border-b-1 transition-border duration-100">
                <Link to="login" className="text-gray-100 pb-1 ">
                  Log In
                </Link>
              </div>
              <div className="pb-1">or</div>
              <div className="hover:border-b-1 transition-border duration-100">
                <Link to="signup" className="text-gray-100 pb-1">
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="hover:border-b-1 transition-border duration-100">
                <Link
                  to="/"
                  className="text-gray-100 pb-1 hover:border-b-1 transition-border duration-100"
                  onClick={() => logOut()}
                >
                  Log out
                </Link>
              </div>
              <Link
                to="account/settings"
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                <img
                  src={settings}
                  className="w-6 h-6 object-contain"
                  alt="settings"
                />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-center px-2 md:hidden">
          <button
            type="button"
            className="flex items-center justify-center bg-transparent border-transparent cursor-pointer shadow-medium"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <div className="icons icons--close-wight"></div>
            ) : (
              <div className="icons icons--menu"></div>
            )}
          </button>
        </div>
      </div>

      <Menu
        toggleMenu={toggleMenu}
        authorized={authorized}
        isMenuOpen={isMenuOpen}
      />
    </header>
  );
};
