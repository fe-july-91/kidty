import './Menu.scss';
import classNames from 'classnames';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useLockBodyScroll } from 'react-use';
import { LangContext } from '../../Context/LangContext';

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

  const { currentLang } = useContext(LangContext);

  return (
    <div
      className={classNames('menu', {
        'menu--visible': isMenuOpen,
      })}
    >
      {!authorized ? (
        <nav className="menu__nav">
          <NavLink to="/" className={getStylelink} onClick={toggleMenu}>
            {currentLang === 'UA' ? 'Головна сторінка' : 'Main Page'}
          </NavLink>
          <NavLink to="login" className={getStylelink} onClick={toggleMenu}>
            {currentLang === 'UA' ? 'Увійти в додаток' : 'Log In'}
          </NavLink>
          <NavLink to="signup" className={getStylelink} onClick={toggleMenu}>
            {currentLang === 'UA' ? 'Зареєструватися' : 'Sign Up'}
          </NavLink>
        </nav>
      ) : (
        <nav className="menu__nav">
          <NavLink to="#" className={getStylelink} onClick={toggleMenu}>
            {currentLang === 'UA' ? 'Головна сторінка' : 'Main Page'}
          </NavLink>

          <NavLink
            to="account/settings"
            className={getStylelink}
            onClick={toggleMenu}
          >
            {currentLang === 'UA' ? 'Налаштування' : 'Settings'}
          </NavLink>
          <NavLink
            to="/"
            className={getStylelink}
            onClick={() => {
              logOut();
              toggleMenu();
            }}
          >
            {currentLang === 'UA' ? 'Вийти з додатку' : 'Log Out'}
          </NavLink>
        </nav>
      )}
    </div>
  );
};
