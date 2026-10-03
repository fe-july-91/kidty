import { Link } from 'react-router';

export const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-center gap-6 h-[48px] lg:h-[56px] bg-white border-t border-hairline text-sm">
      <Link to="/about" className="text-ink-2 hover:text-ink transition-colors">
        Про нас
      </Link>
      <Link to="/" className="text-ink-2 hover:text-ink transition-colors">
        Головна
      </Link>
    </footer>
  );
};
