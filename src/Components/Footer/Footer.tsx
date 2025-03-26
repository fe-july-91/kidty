import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__navbar">
        <Link to="/about" className="footer__navbar--link">
          About Us
        </Link>
      </div>
    </footer>
  );
};
