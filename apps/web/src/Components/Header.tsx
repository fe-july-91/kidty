import React, { useContext, useState } from 'react';
import { Link } from 'react-router';
import { logoDark } from '../Utils/kit';
import { Menu } from './Menu/Menu';
import { AuthContext } from '../Context/AuthContext';

const navLink = 'text-ink-2 hover:text-ink transition-colors';

const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {open ? (
      <path d="M6 6l12 12M18 6L6 18" />
    ) : (
      <path d="M4 7h16M4 12h16M4 17h16" />
    )}
  </svg>
);

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authorized, logOut } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="flex items-center justify-between h-[48px] lg:h-[64px] bg-white border-b border-hairline">
      <Link
        to={authorized ? 'account' : '/'}
        className="flex items-center px-4 lg:px-6 h-full"
      >
        <img src={logoDark} className="w-20 lg:w-24" alt="Kidty" />
      </Link>

      <div className="flex items-center px-4 lg:px-6">
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {authorized ? (
            <>
              <Link to="account/settings" className={navLink}>
                Налаштування
              </Link>
              <Link to="/" className={navLink} onClick={() => logOut()}>
                Вийти
              </Link>
            </>
          ) : (
            <>
              <Link to="login" className={navLink}>
                Увійти
              </Link>
              <Link
                to="signup"
                className="rounded-full bg-primary px-4 py-1.5 text-white hover:bg-primary-600 transition-colors"
              >
                Зареєструватися
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden flex items-center justify-center text-ink"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={isMenuOpen}
        >
          <MenuIcon open={isMenuOpen} />
        </button>
      </div>

      <Menu
        toggleMenu={toggleMenu}
        authorized={authorized}
        isMenuOpen={isMenuOpen}
      />
    </header>
  );
};
