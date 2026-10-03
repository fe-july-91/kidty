// Conversions between database values and the formats the frontend uses.
import type { Gender } from '../generated/prisma/client.js';

export const MONTHS = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
] as const;

export type MonthName = (typeof MONTHS)[number];

export const monthToNumber = (name: MonthName) => MONTHS.indexOf(name) + 1;
export const numberToMonth = (month: number): MonthName => MONTHS[month - 1];

export const GENDER_LABELS = {
  GIRL: 'Дівчинка',
  BOY: 'Хлопчик',
} as const satisfies Record<Gender, string>;

export type GenderLabel = (typeof GENDER_LABELS)[Gender];

export const labelToGender = (label: GenderLabel): Gender =>
  label === GENDER_LABELS.GIRL ? 'GIRL' : 'BOY';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Parses a calendar date written as "D-M-YYYY" (leading zeros optional).
 * Returns null if the date does not exist.
 */
export function parseDate(value: string): Date | null {
  const parts = value.split('-');
  if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) return null;

  const [day, month, year] = parts.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isValid ? date : null;
}

/** Formats a date-only value as "DD-MM-YYYY". */
export const formatDate = (date: Date) =>
  [pad(date.getUTCDate()), pad(date.getUTCMonth() + 1), date.getUTCFullYear()].join('-');
