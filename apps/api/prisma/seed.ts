import argon2 from 'argon2';
import { Prisma } from '../src/generated/prisma/client.js';
import { prisma } from '../src/db.js';

const email = process.env.SEED_USER_EMAIL ?? 'demo@kidty.local';
const password = process.env.SEED_USER_PASSWORD;

if (!password) {
  throw new Error('Set SEED_USER_PASSWORD in apps/api/.env before seeding');
}

const monthlyValues = (
  year: number,
  values: number[]
): { year: number; month: number; value: Prisma.Decimal }[] =>
  values.map((value, i) => ({
    year,
    month: i + 1,
    value: new Prisma.Decimal(value),
  }));

async function main() {
  // Re-runnable: start from a clean demo account each time.
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: 'Demo',
      email,
      passwordHash: await argon2.hash(password!),
    },
  });

  const child = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Софія',
      surname: 'Демо',
      birthDate: new Date('2020-05-14'),
      gender: 'GIRL',
      avatar: 3,
    },
  });

  await prisma.measurement.createMany({
    data: [
      ...monthlyValues(2025, [108, 109, 110, 110, 111, 112]).map((m) => ({
        ...m,
        type: 'HEIGHT' as const,
      })),
      ...monthlyValues(2025, [17.5, 17.8, 18, 18.1, 18.4, 18.6]).map((m) => ({
        ...m,
        type: 'WEIGHT' as const,
      })),
      ...monthlyValues(2025, [17, 17, 17.5, 17.5, 18, 18]).map((m) => ({
        ...m,
        type: 'FOOT' as const,
      })),
    ].map((m) => ({ ...m, childId: child.id })),
  });

  await prisma.eyeCheck.create({
    data: {
      childId: child.id,
      leftEye: new Prisma.Decimal(-0.5),
      rightEye: new Prisma.Decimal(-0.25),
    },
  });

  await prisma.vaccination.createMany({
    data: [
      { type: 'Гепатит Б', date: new Date('2020-05-15') },
      { type: 'Туберкульоз', date: new Date('2020-05-17') },
      { type: 'Гепатит Б', date: new Date('2020-07-14') },
      { type: 'Кір-Краснуха-Паротит', date: new Date('2021-05-20') },
    ].map((v) => ({ ...v, childId: child.id })),
  });

  console.log(`Seeded demo account ${email} with child "${child.name}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
