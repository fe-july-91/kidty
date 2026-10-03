import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';
import { notFound } from '../lib/errors.js';
import {
  toChildDto,
  toEyeDto,
  toMeasurementDto,
  toVaccinationDto,
} from '../lib/dto.js';
import { labelToGender, monthToNumber } from '../lib/format.js';
import {
  childBody,
  eyeBody,
  idParam,
  measurementBody,
  measurementTypes,
  vaccinationBody,
} from '../lib/schemas.js';

const childParams = z.object({ childId: idParam });
const itemParams = z.object({ childId: idParam, itemId: idParam });

/** Throws 404 unless the child exists and belongs to the user. */
async function assertOwnChild(userId: number, childId: number) {
  const child = await prisma.child.findFirst({
    where: { id: childId, userId },
    select: { id: true },
  });
  if (!child) throw notFound('Дитину не знайдено');
}

const toChildData = (body: z.infer<typeof childBody>) => ({
  name: body.name,
  surname: body.surname,
  birthDate: body.birth,
  gender: labelToGender(body.genderName),
  avatar: body.image,
});

export const childrenRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', app.authenticate);

  // Children

  app.get('/', async (request) => {
    const children = await prisma.child.findMany({
      where: { userId: request.userId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    return children.map(toChildDto);
  });

  app.post('/', { schema: { body: childBody } }, async (request, reply) => {
    const child = await prisma.child.create({
      data: { ...toChildData(request.body), userId: request.userId },
      include: { user: true },
    });
    return reply.status(201).send(toChildDto(child));
  });

  app.get('/:childId', { schema: { params: childParams } }, async (request) => {
    const child = await prisma.child.findFirst({
      where: { id: request.params.childId, userId: request.userId },
      include: { user: true },
    });
    if (!child) throw notFound('Дитину не знайдено');
    return toChildDto(child);
  });

  app.put(
    '/:childId',
    { schema: { params: childParams, body: childBody } },
    async (request) => {
      await assertOwnChild(request.userId, request.params.childId);
      const child = await prisma.child.update({
        where: { id: request.params.childId },
        data: toChildData(request.body),
        include: { user: true },
      });
      return toChildDto(child);
    }
  );

  app.delete(
    '/:childId',
    { schema: { params: childParams } },
    async (request, reply) => {
      await assertOwnChild(request.userId, request.params.childId);
      await prisma.child.delete({ where: { id: request.params.childId } });
      return reply.status(204).send();
    }
  );

  // Height, weight and foot size: /children/:childId/{height|weight|foot}

  for (const [path, { type, max }] of Object.entries(measurementTypes)) {
    const body = measurementBody(max);

    app.get(
      `/:childId/${path}`,
      { schema: { params: childParams } },
      async (request) => {
        await assertOwnChild(request.userId, request.params.childId);
        const items = await prisma.measurement.findMany({
          where: { childId: request.params.childId, type },
          orderBy: [{ year: 'asc' }, { month: 'asc' }],
        });
        return items.map(toMeasurementDto);
      }
    );

    // Adding a value for a month that already has one replaces it.
    app.post(
      `/:childId/${path}`,
      { schema: { params: childParams, body } },
      async (request, reply) => {
        const { childId } = request.params;
        await assertOwnChild(request.userId, childId);

        const year = request.body.year;
        const month = monthToNumber(request.body.month);
        const value = request.body.value;

        const item = await prisma.measurement.upsert({
          where: { childId_type_year_month: { childId, type, year, month } },
          create: { childId, type, year, month, value },
          update: { value },
        });
        return reply.status(201).send(toMeasurementDto(item));
      }
    );

    app.put(
      `/:childId/${path}/:itemId`,
      { schema: { params: itemParams, body } },
      async (request) => {
        const { childId, itemId } = request.params;
        await assertOwnChild(request.userId, childId);

        const existing = await prisma.measurement.findFirst({
          where: { id: itemId, childId, type },
        });
        if (!existing) throw notFound();

        const item = await prisma.measurement.update({
          where: { id: itemId },
          data: {
            year: request.body.year,
            month: monthToNumber(request.body.month),
            value: request.body.value,
          },
        });
        return toMeasurementDto(item);
      }
    );

    app.delete(
      `/:childId/${path}/:itemId`,
      { schema: { params: itemParams } },
      async (request, reply) => {
        const { childId, itemId } = request.params;
        await assertOwnChild(request.userId, childId);

        const { count } = await prisma.measurement.deleteMany({
          where: { id: itemId, childId, type },
        });
        if (count === 0) throw notFound();
        return reply.status(204).send();
      }
    );
  }

  // Eyesight

  app.get(
    '/:childId/eye',
    { schema: { params: childParams } },
    async (request) => {
      const { childId } = request.params;
      await assertOwnChild(request.userId, childId);
      const eye = await prisma.eyeCheck.findUnique({ where: { childId } });
      return toEyeDto(childId, eye);
    }
  );

  app.put(
    '/:childId/eye',
    { schema: { params: childParams, body: eyeBody } },
    async (request) => {
      const { childId } = request.params;
      await assertOwnChild(request.userId, childId);
      const eye = await prisma.eyeCheck.upsert({
        where: { childId },
        create: { childId, ...request.body },
        update: request.body,
      });
      return toEyeDto(childId, eye);
    }
  );

  // Vaccinations

  app.get(
    '/:childId/vaccination',
    { schema: { params: childParams } },
    async (request) => {
      await assertOwnChild(request.userId, request.params.childId);
      const items = await prisma.vaccination.findMany({
        where: { childId: request.params.childId },
        orderBy: [{ date: 'asc' }, { id: 'asc' }],
      });
      return items.map(toVaccinationDto);
    }
  );

  app.post(
    '/:childId/vaccination',
    { schema: { params: childParams, body: vaccinationBody } },
    async (request, reply) => {
      const { childId } = request.params;
      await assertOwnChild(request.userId, childId);
      const item = await prisma.vaccination.create({
        data: { childId, ...request.body },
      });
      return reply.status(201).send(toVaccinationDto(item));
    }
  );

  app.put(
    '/:childId/vaccination/:itemId',
    { schema: { params: itemParams, body: vaccinationBody } },
    async (request) => {
      const { childId, itemId } = request.params;
      await assertOwnChild(request.userId, childId);

      const existing = await prisma.vaccination.findFirst({
        where: { id: itemId, childId },
      });
      if (!existing) throw notFound();

      const item = await prisma.vaccination.update({
        where: { id: itemId },
        data: request.body,
      });
      return toVaccinationDto(item);
    }
  );

  app.delete(
    '/:childId/vaccination/:itemId',
    { schema: { params: itemParams } },
    async (request, reply) => {
      const { childId, itemId } = request.params;
      await assertOwnChild(request.userId, childId);

      const { count } = await prisma.vaccination.deleteMany({
        where: { id: itemId, childId },
      });
      if (count === 0) throw notFound();
      return reply.status(204).send();
    }
  );
};
