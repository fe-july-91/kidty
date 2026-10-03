import './Menu.scss';
import classNames from 'classnames';
import { useContext } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { useLockBodyScroll } from 'react-use';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';

const getStylelink = ({ isActive }: { isActive: boolean }) => {
  return classNames('menu__link', {
    menu__active: isActive,
  });
};

type Props = {
  toggleMenu: () => void;
  authorized: boolean;
  isMenuOpen: boolean;
};

export const Menu: React.FC<Props> = ({
  toggleMenu,
  authorized,
  isMenuOpen,
}) => {
  const { logOut } = useContext(AuthContext);
  useLockBodyScroll(isMenuOpen);

  const { t } = useTranslation();

  return (

    <div
      className={classNames('menu', {
        'menu--visible': isMenuOpen,
      })}
    >
      <div className='flex flex-col items-center justify-center -translate-y-12'>
        {!authorized ? (
          <nav className="menu__nav">
            <NavLink to="/" className={getStylelink} onClick={toggleMenu}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="login" className={getStylelink} onClick={toggleMenu}>
              {t('nav.login')}
            </NavLink>
            <NavLink to="signup" className={getStylelink} onClick={toggleMenu}>
              {t('nav.signup')}
            </NavLink>
          </nav>
        ) : (
          <nav className="menu__nav">
            <NavLink to="#" className={getStylelink} onClick={toggleMenu}>
              {t('nav.home')}
            </NavLink>

            <NavLink
              to="account/settings"
              className={getStylelink}
              onClick={toggleMenu}
            >
              {t('nav.settings')}
            </NavLink>
            <NavLink
              to="/"
              className={getStylelink}
              onClick={() => {
                logOut();
                toggleMenu();
              }}
            >
              {t('nav.logout')}
            </NavLink>
          </nav>
        )}
        <LanguageSwitcher className="mt-6" />
      </div>
    </div>
  );
};
