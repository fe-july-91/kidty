import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-between h-[48px] lg:h-[64px] g-4 bg-primary-800">
      <div className="w-full flex flex-row gap-6 justify-center items-center">
      <div className="hover:border-b-1 transition-all duration-100">
        <Link to="/about" className="text-gray-100">
          About Us
          </Link>
        </div>
        <div className="hover:border-b-1 transition-all duration-100">
          <Link to="/" className="text-gray-100">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
};
