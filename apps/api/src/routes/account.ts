import argon2 from 'argon2';
import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';
import { HttpError } from '../lib/errors.js';
import { toUserDto } from '../lib/dto.js';
import { email, name, newPasswordBody } from '../lib/schemas.js';

export const accountRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', app.authenticate);

  app.get('/me', async (request) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.userId },
    });
    return toUserDto(user);
  });

  app.put(
    '/reset-data',
    { schema: { body: z.object({ name, email }) } },
    async (request) => {
      const { name, email } = request.body;

      const taken = await prisma.user.findFirst({
        where: { email, NOT: { id: request.userId } },
      });
      if (taken) {
        throw new HttpError(409, 'Користувач з таким email вже існує');
      }

      const user = await prisma.user.update({
        where: { id: request.userId },
        data: { name, email },
      });
      return toUserDto(user);
    }
  );

  app.put(
    '/reset-password',
    { schema: { body: newPasswordBody } },
    async (request) => {
      await prisma.user.update({
        where: { id: request.userId },
        data: { passwordHash: await argon2.hash(request.body.password) },
      });
      return { message: 'Пароль змінено' };
    }
  );

  app.delete('/delete', async (request, reply) => {
    // Children and their data are removed by cascading deletes.
    await prisma.user.delete({ where: { id: request.userId } });
    return reply.status(204).send();
  });
};
