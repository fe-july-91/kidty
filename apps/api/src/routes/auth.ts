import argon2 from 'argon2';
import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';
import { env } from '../env.js';
import { HttpError } from '../lib/errors.js';
import { email, name, newPasswordBody } from '../lib/schemas.js';
import { createResetToken, hashToken } from '../lib/tokens.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

// Hash used to keep login timing similar whether or not the email exists.
const dummyHash = await argon2.hash('timing-equalizer');

const strictLimit = { rateLimit: { max: 10, timeWindow: '1 minute' } };

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/registration',
    {
      config: strictLimit,
      schema: {
        body: newPasswordBody.and(z.object({ name, email })),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new HttpError(409, 'Користувач з таким email вже існує');
      }

      await prisma.user.create({
        data: { name, email, passwordHash: await argon2.hash(password) },
      });

      return reply.status(201).send({ message: 'Реєстрація успішна' });
    }
  );

  app.post(
    '/login',
    {
      config: strictLimit,
      schema: {
        body: z.object({
          email,
          password: z.string().min(1, 'Введіть пароль'),
        }),
      },
    },
    async (request) => {
      const { email, password } = request.body;
      const user = await prisma.user.findUnique({ where: { email } });

      const isValid = await argon2.verify(
        user?.passwordHash ?? dummyHash,
        password
      );
      if (!user || !isValid) {
        throw new HttpError(401, 'Невірний email або пароль');
      }

      return { token: app.jwt.sign({ sub: user.id }) };
    }
  );

  // Always answers the same way so the endpoint can't be used to check
  // which emails are registered.
  app.post(
    '/forgot-password',
    {
      config: strictLimit,
      schema: { body: z.object({ email }) },
    },
    async (request) => {
      const user = await prisma.user.findUnique({
        where: { email: request.body.email },
      });

      if (user) {
        const { token, tokenHash } = createResetToken();
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
          },
        });

        // TODO: send by email. Until then the link is only logged locally.
        if (env.NODE_ENV === 'development') {
          request.log.info(
            `Password reset link: ${env.APP_URL}/#/reset-password?token=${token}`
          );
        }
      }

      return {
        message: 'Якщо такий email зареєстровано, ми надіслали посилання',
      };
    }
  );

  app.post(
    '/reset-password',
    {
      config: strictLimit,
      schema: {
        body: newPasswordBody.and(z.object({ token: z.string().min(1) })),
      },
    },
    async (request) => {
      const { token, password } = request.body;

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { tokenHash: hashToken(token) },
      });
      if (
        !resetToken ||
        resetToken.usedAt ||
        resetToken.expiresAt < new Date()
      ) {
        throw new HttpError(400, 'Посилання недійсне або застаріле');
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: { passwordHash: await argon2.hash(password) },
        }),
        prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { usedAt: new Date() },
        }),
      ]);

      return { message: 'Пароль змінено' };
    }
  );
};
