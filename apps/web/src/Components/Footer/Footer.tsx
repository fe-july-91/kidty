import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex items-center justify-center gap-6 h-[48px] lg:h-[56px] bg-white border-t border-hairline text-sm">
      <Link to="/about" className="text-ink-2 hover:text-ink transition-colors">
        {t('nav.about')}
      </Link>
      <Link to="/" className="text-ink-2 hover:text-ink transition-colors">
        {t('nav.home')}
      </Link>
    </footer>
  );
};
