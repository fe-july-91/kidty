import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-between h-[48px] lg:h-[64px] g-4 bg-primary-800">
      <div className="w-full flex flex-row gap-6 justify-center items-center">
        <Link to="/about" className="footer__navbar--link">
          About Us
        </Link>
        <Link to="/" className="footer__navbar--link">
          Home
        </Link>
      </div>
    </footer>
  );
};
