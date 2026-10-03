import { useTranslation } from 'react-i18next';
import { months as apiMonths, vaccinesSelect } from '../Utils/kit';

// Vaccine names and gender labels are stored by the API in Ukrainian;
// map them to translation keys for display.
const VACCINE_KEYS = ['tb', 'hepB', 'dt', 'pertussis', 'polio', 'hib', 'mmr'] as const;
const vaccineKeyByName: Record<string, (typeof VACCINE_KEYS)[number]> = Object.fromEntries(
  (vaccinesSelect as string[]).map((name, i) => [name, VACCINE_KEYS[i]])
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Locale-aware formatting helpers that re-render on language change. */
export function useFormat() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-GB' : 'uk-UA';
  const long = t('months.long', { returnObjects: true }) as string[];
  const short = t('months.short', { returnObjects: true }) as string[];

  const number = (value: number) =>
    (Math.round(value * 100) / 100).toLocaleString(locale, { maximumFractionDigits: 2 });

  return {
    locale,
    number,
    signed: (value: number) =>
      `${value > 0 ? '+' : value < 0 ? '−' : ''}${number(Math.abs(value))}`,
    monthName: (month: number) => capitalize(long[month - 1]),
    monthShort: (month: number) => short[month - 1],
    monthLabel: (p: { year: number; month: number }) => `${capitalize(long[p.month - 1])} ${p.year}`,
    /** "6 р. 4 міс." / "6 y 4 mo" */
    age: (totalMonths: number) => {
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      return [y ? t('age.years', { count: y }) : '', m || !y ? t('age.months', { count: m }) : '']
        .filter(Boolean)
        .join(' ');
    },
    /** Formats an API date "DD-MM-YYYY". */
    date: (value: string) => {
      const [d, m, y] = value.split('-').map(Number);
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: i18n.language === 'en' ? 'short' : '2-digit',
        year: 'numeric',
      }).format(new Date(y, m - 1, d));
    },
    vaccine: (apiName: string) => {
      const key = vaccineKeyByName[apiName];
      return key ? t(`vaccines.names.${key}`) : apiName;
    },
    gender: (apiLabel: string) => (apiLabel === 'Хлопчик' ? t('gender.boy') : t('gender.girl')),
    /** API month name ("Березень") → month number. */
    apiMonthIndex: (name: string) => (apiMonths as string[]).indexOf(name) + 1,
  };
}
