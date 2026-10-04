import React, { useContext, useState } from 'react';
import { Link } from 'react-router';
import { logo } from '../Utils/kit';
import { Menu } from './Menu/Menu';
import { AuthContext } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="flex items-center justify-between h-[48px] lg:h-[64px] bg-white border-b border-hairline">
      <Link
        to={authorized ? 'account' : '/'}
        className="flex items-center px-4 lg:px-6 h-full"
      >
        <img src={logo} className="h-6 lg:h-7" alt="Kidty" />
      </Link>

      <div className="flex items-center gap-4 px-4 lg:px-6">
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {authorized ? (
            <>
              <Link to="account/settings" className={navLink}>
                {t('nav.settings')}
              </Link>
              <Link to="/" className={navLink} onClick={() => logOut()}>
                {t('nav.logout')}
              </Link>
            </>
          ) : (
            <>
              <Link to="login" className={navLink}>
                {t('nav.login')}
              </Link>
              <Link
                to="signup"
                className="rounded-full bg-primary px-4 py-1.5 text-white hover:bg-primary-600 transition-colors"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}
        </nav>
        <LanguageSwitcher className="hidden md:inline-flex" />

        <button
          type="button"
          className="md:hidden flex items-center justify-center text-ink"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
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
