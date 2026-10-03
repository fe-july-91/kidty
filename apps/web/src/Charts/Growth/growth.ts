import { months } from '../../Utils/kit';
import { Data } from '../../Shared/types/types';

export type MetricType = 'height' | 'weight' | 'foot';

export const METRICS: Record<
  MetricType,
  { title: string; unit: string; step: number; min: number; max: number }
> = {
  height: { title: 'Зріст', unit: 'см', step: 0.5, min: 40, max: 180 },
  weight: { title: 'Вага', unit: 'кг', step: 0.1, min: 1, max: 80 },
  foot: { title: 'Стопа', unit: 'см', step: 0.5, min: 5, max: 35 },
};

export const MONTH_SHORT = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];

/** A measurement with numeric year and month (1–12). */
export type Point = { id: number; year: number; month: number; value: number };

export const toPoint = (d: Data): Point => ({
  id: d.id,
  year: +d.year,
  month: months.indexOf(d.month) + 1,
  value: d.value,
});

export const monthName = (month: number) => months[month - 1] as string;
export const monthLabel = (p: { year: number; month: number }) =>
  `${monthName(p.month)} ${p.year}`;

export const pointKey = (p: { year: number; month: number }) => (p.year * 12) + p.month;
export const byDate = (a: Point, b: Point) => pointKey(a) - pointKey(b);

export const formatValue = (value: number) =>
  (Math.round(value * 100) / 100).toLocaleString('uk-UA', { maximumFractionDigits: 2 });

export const formatSigned = (value: number) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatValue(Math.abs(value))}`;

/** Parses "DD-MM-YYYY". */
export function parseBirth(birth: string) {
  const [day, month, year] = birth.split('-').map(Number);
  return { day, month, year };
}

/**
 * Whole months between the birth date and the given day (the middle of the
 * month by default, since measurements are stored per month).
 */
export function ageInMonths(birth: string, year: number, month: number, day = 15) {
  const b = parseBirth(birth);
  return ((year - b.year) * 12) + (month - b.month) - (b.day > day ? 1 : 0);
}

export function formatAge(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} р.` : '', m || !y ? `${m} міс.` : ''].filter(Boolean).join(' ');
}

/** Latest value and change over roughly the previous six months. */
export function summarize(points: Point[]) {
  const sorted = [...points].sort(byDate);
  const last = sorted.at(-1);
  if (!last) return null;
  const prev = sorted.filter((p) => pointKey(p) <= pointKey(last) - 6).at(-1);
  return {
    last,
    delta: prev ? last.value - prev.value : null,
    months: prev ? pointKey(last) - pointKey(prev) : null,
  };
}
