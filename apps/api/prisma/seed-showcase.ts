// Creates an English-named showcase account with several years of data,
// used for screenshots on the home page. Re-runnable; leaves other
// accounts untouched. Run with `npm run db:seed:showcase`.
import argon2 from 'argon2';
import { Prisma } from '../src/generated/prisma/client.js';
import { prisma } from '../src/db.js';

const email = process.env.SEED_SHOWCASE_EMAIL ?? 'showcase@kidty.local';
const password = process.env.SEED_USER_PASSWORD;

if (!password) {
  throw new Error('Set SEED_USER_PASSWORD in apps/api/.env before seeding');
}

// Typical growth by age in months (roughly the WHO median for girls).
const AGES = [12, 24, 36, 48, 60, 72, 84];
const HEIGHT = [74.0, 85.7, 95.1, 102.7, 109.4, 115.1, 120.8];
const WEIGHT = [8.9, 11.5, 13.9, 16.1, 18.2, 20.2, 22.4];
const FOOT = [12.5, 13.8, 15.0, 16.2, 17.3, 18.3, 19.2];

function interpolate(values: number[], age: number) {
  if (age <= AGES[0]) return values[0];
  for (let i = 1; i < AGES.length; i++) {
    if (age <= AGES[i]) {
      const t = (age - AGES[i - 1]) / (AGES[i] - AGES[i - 1]);
      return values[i - 1] + (t * (values[i] - values[i - 1]));
    }
  }
  return values.at(-1)!;
}

/** Deterministic pseudo-random noise so the data looks the same each run. */
function noise(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x) - 0.5;
}

const round = (value: number, step: number) => Math.round(value / step) * step;

type Birth = { year: number; month: number };

function growthHistory(birth: Birth, until: Birth, everyMonths: number, offset: number) {
  const rows: { type: 'HEIGHT' | 'WEIGHT' | 'FOOT'; year: number; month: number; value: Prisma.Decimal }[] = [];
  let height = 0;
  let foot = 0;
  for (let age = 12; ; age += everyMonths) {
    const total = (birth.year * 12) + (birth.month - 1) + age;
    const year = Math.floor(total / 12);
    const month = (total % 12) + 1;
    if ((year * 12) + month > (until.year * 12) + until.month) break;

    height = Math.max(height, round(interpolate(HEIGHT, age) + offset + (noise(age) * 0.6), 0.5));
    foot = Math.max(foot, round(interpolate(FOOT, age) + (noise(age + 1) * 0.4), 0.5));
    const weight = round(interpolate(WEIGHT, age) + (offset / 4) + (noise(age + 2) * 0.5), 0.1);

    for (const [type, value] of [['HEIGHT', height], ['WEIGHT', weight], ['FOOT', foot]] as const) {
      rows.push({ type, year, month, value: new Prisma.Decimal(value.toFixed(1)) });
    }
  }
  return rows;
}

const date = (value: string) => new Date(`${value}T00:00:00Z`);

async function main() {
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: { name: 'Anna Johnson', email, passwordHash: await argon2.hash(password!) },
  });

  const emma = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Emma',
      surname: 'Johnson',
      birthDate: date('2020-05-14'),
      gender: 'GIRL',
      avatar: 3,
    },
  });
  const leo = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Leo',
      surname: 'Johnson',
      birthDate: date('2023-03-02'),
      gender: 'BOY',
      avatar: 6,
    },
  });

  const until = { year: 2026, month: 9 };
  await prisma.measurement.createMany({
    data: [
      ...growthHistory({ year: 2020, month: 5 }, until, 2, 1.4).map((m) => ({ ...m, childId: emma.id })),
      ...growthHistory({ year: 2023, month: 3 }, until, 3, 0.6).map((m) => ({ ...m, childId: leo.id })),
    ],
  });

  await prisma.eyeCheck.create({ data: { childId: emma.id, leftEye: -0.5, rightEye: -0.25 } });

  // Vaccine names are the Ukrainian keys the API stores.
  const emmaVaccines: [string, string][] = [
    ['Туберкульоз', '2020-05-17'],
    ['Гепатит Б', '2020-05-15'],
    ['Гепатит Б', '2020-07-14'],
    ['Гепатит Б', '2020-11-16'],
    ...['2020-07-14', '2020-09-15', '2020-11-16', '2021-11-18'].flatMap((d) => [
      ['Дифтерія-Правець', d] as [string, string],
      ['Кашлюк', d] as [string, string],
      ['Поліомієліт', d] as [string, string],
    ]),
    ['Хіб-інфекція', '2020-07-14'],
    ['Хіб-інфекція', '2020-09-15'],
    ['Хіб-інфекція', '2021-05-20'],
    ['Кір-Краснуха-Паротит', '2021-05-20'],
    ['Кір-Краснуха-Паротит', '2026-05-19'],
  ];
  const leoVaccines: [string, string][] = [
    ['Туберкульоз', '2023-03-06'],
    ['Гепатит Б', '2023-03-03'],
    ['Гепатит Б', '2023-05-04'],
    ['Кір-Краснуха-Паротит', '2024-03-05'],
  ];
  await prisma.vaccination.createMany({
    data: [
      ...emmaVaccines.map(([type, d]) => ({ childId: emma.id, type, date: date(d) })),
      ...leoVaccines.map(([type, d]) => ({ childId: leo.id, type, date: date(d) })),
    ],
  });

  const count = await prisma.measurement.count({ where: { child: { userId: user.id } } });
  console.log(`Seeded showcase account ${email}: Emma and Leo, ${count} measurements.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
