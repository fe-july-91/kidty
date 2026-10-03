import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className={`inline-flex rounded-full bg-soft p-[3px] text-xs ${className}`}
      role="group"
      aria-label={t('language.label')}
    >
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          lang={lng}
          aria-pressed={i18n.language === lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={`rounded-full px-2.5 py-1 ${
            i18n.language === lng ? 'bg-white font-semibold text-ink shadow-sm' : 'text-ink-2'
          }`}
        >
          {t(`language.${lng}`)}
        </button>
      ))}
    </div>
  );
};
