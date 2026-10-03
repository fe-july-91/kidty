import { z } from 'zod';
import { GENDER_LABELS, MONTHS, parseDate } from './format.js';
import { VACCINES } from './vaccines.js';

export const idParam = z.coerce.number().int().positive();

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Некоректний email'));

export const password = z
  .string()
  .min(8, 'Пароль має містити щонайменше 8 символів')
  .max(128, 'Пароль занадто довгий');

const passwordsMatch = <T extends { password: string; repeatPassword: string }>(
  data: T
) => data.password === data.repeatPassword;

export const newPasswordBody = z
  .object({ password, repeatPassword: z.string() })
  .refine(passwordsMatch, {
    message: 'Паролі не збігаються',
    path: ['repeatPassword'],
  });

export const name = z
  .string()
  .trim()
  .min(1, "Ім'я не може бути порожнім")
  .max(100, "Ім'я занадто довге");

/** A date in "D-M-YYYY" form that is not in the future. */
const birthDate = z.string().transform((value, ctx) => {
  const date = parseDate(value);
  if (!date || date > new Date()) {
    ctx.addIssue({ code: 'custom', message: 'Некоректна дата народження' });
    return z.NEVER;
  }
  return date;
});

export const childBody = z.object({
  name,
  surname: name,
  birth: birthDate,
  genderName: z.enum(
    [GENDER_LABELS.BOY, GENDER_LABELS.GIRL],
    'Оберіть стать дитини'
  ),
  image: z.coerce.number().int().min(0).max(100).default(0),
});

export const measurementTypes = {
  height: { type: 'HEIGHT', max: 250 },
  weight: { type: 'WEIGHT', max: 200 },
  foot: { type: 'FOOT', max: 50 },
} as const;

export type MeasurementPath = keyof typeof measurementTypes;

export const measurementBody = (max: number) =>
  z.object({
    year: z.coerce.number().int().min(1900).max(2100),
    month: z.enum(MONTHS, 'Некоректний місяць'),
    value: z.coerce
      .number()
      .positive('Значення має бути більшим за нуль')
      .max(max, `Значення не може перевищувати ${max}`),
  });

export const eyeBody = z.object({
  leftEye: z.coerce.number().min(-20).max(20),
  rightEye: z.coerce.number().min(-20).max(20),
});

export const vaccinationBody = z.object({
  type: z.enum(VACCINES, 'Невідома вакцина'),
  date: z.string().transform((value, ctx) => {
    const date = parseDate(value);
    if (!date) {
      ctx.addIssue({ code: 'custom', message: 'Некоректна дата щеплення' });
      return z.NEVER;
    }
    return date;
  }),
});
